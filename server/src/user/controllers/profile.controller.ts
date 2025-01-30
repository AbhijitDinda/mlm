import mongoose, { startSession } from "mongoose";
import { UserContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import KycFormModel, { KycFormRow } from "../../models/kycForm.model";
import LoginSessionModel, {
  getSessionInstance,
} from "../../models/loginSession.model";
import UserKycModel, { UserKycInsert } from "../../models/userKyc.model";
import {
  deleteOtp,
  EmailService,
  getNewOtp,
  isOtpValid,
  sendTwoFAMail,
} from "../../services/email.service";
import { UserServices } from "../../services/user.service";
import { sendResponse, toObjectId } from "../../utils/fns";
import { searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import {
  ChangePasswordSchemaType,
  ContactDetailsSchemaType,
  TwoFaSchemaType,
  UpdateProfileSchemaType,
} from "../schemas/profile.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

/**
 * get user profile details
 */
export const getProfileHandler = async ({ ctx }: { ctx: UserContext }) => {
  try {
    const {
      user: { userId, loginSessionId },
    } = ctx;

    const details = await UserServices.getUserProfileDetails(userId);
    return { ...details, loginSessionId };
  } catch (error) {
    throw error;
  }
};

/**
 * update user profile details
 */
export const updateProfileHandler = async ({
  input,
  ctx,
}: {
  input: UpdateProfileSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const userKyc = user.kyc;
  const { firstName, lastName, kyc } = input;
  const kycData = <KycFormRow[]>await KycFormModel.find();

  kycData.forEach((list) => {
    const { _id, label, required } = list;
    if (typeof kyc[_id.toString()] === "undefined")
      throw ClientError(`Missing ${label} from kyc details`);

    if (userKyc === "approved") {
      if (required === "required") {
        delete kyc[_id.toString()];
      }
    }
  });

  user.firstName = firstName;
  user.lastName = lastName;
  user.kycDetails = { ...user.kycDetails, ...kyc };
  await user.save();
  const details = await getProfileHandler({ ctx });
  return sendResponse("Profile details has been updated", { data: details });
};

/**
 * get user wallet details
 */
export const getWalletDetailsHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}) => {};

/**
 * update user avatar
 */
export const updateAvatarHandler = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  user.avatar = input;
  await user.save();
  return sendResponse("Avatar has been updated");
};

/**
 * verify user kyc
 */
export const verifyKycHandler = async ({ ctx }: { ctx: UserContext }) => {
  const { user } = ctx;
  const { userId, kyc } = user;

  const isReadyForKyc = await user.isReadyForKyc();
  if (!isReadyForKyc)
    throw ClientError("Please fill all the required information in my profile");

  if (kyc === "approved") throw ClientError("Kyc has been already approved");
  if (kyc !== "pending") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      user.kyc = "pending";
      await user.save({ session });

      const kycDoc: UserKycInsert = {
        user: user._id,
        userId,
        status: "pending",
      };
      const doc = new UserKycModel(kycDoc);
      await doc.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }

  return sendResponse("Kyc has been sent for verification", { data: user.kyc });
};

/**
 * login session data table
 */
export const getLoginSessionHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;

  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};
  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const filter = {
    userId,
    ...(searchKeyword && {
      $or: [
        searchStr("ip", searchKeyword),
        searchStr("country", searchKeyword),
        searchStr("region", searchKeyword),
        searchStr("city", searchKeyword),
        searchStr("status", searchKeyword),
        searchStr("agent", searchKeyword),
        searchStr("browser", searchKeyword),
        searchStr("os", searchKeyword),
        searchStr("device", searchKeyword),
        searchStr("loginBy", searchKeyword),
      ],
    }),
  };
  const query = LoginSessionModel.find(filter).select("-token");
  const rowCount = await LoginSessionModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

/**
 * expire login session token
 */
export const expireTokenHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  const _id = toObjectId(id);
  const loginSession = await getSessionInstance(_id);
  loginSession.status = "expired";
  await loginSession.save();
  return sendResponse("Login Session Expired");
};

/**
 * user logout all from all devices
 */
export const logoutAllHandler = async ({ ctx }: { ctx: UserContext }) => {
  const {
    user: { userId, loginSessionId },
  } = ctx;
  await LoginSessionModel.updateMany(
    { userId, _id: { $nin: [loginSessionId] } },
    { $set: { status: "expired" } }
  );
  return sendResponse("You have Logged Out from all devices");
};

/**
 * enable two factor authentication
 */
export const twoFaHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: TwoFaSchemaType;
}) => {
  const { user } = ctx;
  const { step, status, verificationCode } = input;

  const twoFA = user.twoFA;
  const message = twoFA
    ? "Two Authentication has been disabled."
    : "Two Authentication has been enabled.";
  if (twoFA !== status) return sendResponse(message);

  const session = await startSession();
  session.startTransaction();

  try {
    const email = user.email;
    if (step === 1) {
      const otp = await getNewOtp(email, "twoFA");
      await sendTwoFAMail(email, otp, twoFA);
      return;
    }

    if (!verificationCode) return;
    const _isOtpValid = await isOtpValid({
      otp: verificationCode,
      email,
      purpose: "twoFA",
    });
    if (!_isOtpValid) throw ClientError("Otp is not valid");

    user.twoFA = !user.twoFA;
    await user.save();

    await deleteOtp(
      { otp: verificationCode, email, purpose: "twoFA" },
      session
    );

    return sendResponse(message, { twoFA: user.twoFA });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * get user contact details
 */
export const getContactDetailsHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { contact, mobileNumber } = user;
  const {
    address = "",
    country = "",
    state = "",
    city = "",
    pinCode = "" as any as number,
  } = contact ?? {};
  return { address, country, state, city, pinCode, mobileNumber };
};

/**
 * update user contact details
 */
export const updateContactDetailsHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: ContactDetailsSchemaType;
}) => {
  const { user } = ctx;
  const { mobileNumber, ...contact } = input;

  user.mobileNumber = mobileNumber;
  user.contact = contact;
  await user.save();
  return sendResponse("Contact details has been updated");
};

/**
 * change user password
 */
export const changePasswordHandler = async ({
  input,
  ctx,
}: {
  input: ChangePasswordSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { oldPassword, password, step, verificationCode } = input;
  const { userId, loginSessionId } = user;

  const isPasswordValid = await user.validatePassword(oldPassword);
  if (!isPasswordValid) throw ClientError("Password is incorrect");
  const email = user.email;

  if (step === 1) {
    const otp = await getNewOtp(email, "changePassword");
    await EmailService.sendChangePasswordVerificationMail({
      userId,
      email,
      otp,
    });
    return sendResponse("Otp has been sent", {
      email,
    });
  } else {
    if (!verificationCode) {
      return ClientError("Verification code is required");
    }
    const _isOtpValid = await isOtpValid({
      otp: verificationCode,
      email,
      purpose: "changePassword",
    });
    if (!_isOtpValid) return ClientError("Otp is not valid");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete otp
    await deleteOtp(
      {
        otp: verificationCode,
        email,
        purpose: "changePassword",
      },
      session
    );

    // update password
    user.password = password;
    await user.save({ session });

    // logout all user except current
    await LoginSessionModel.updateMany(
      { userId, _id: { $nin: [loginSessionId] } },
      { $set: { status: "expired" } }
    ).session(session);

    await session.commitTransaction();

    await EmailService.sendChangePasswordSuccessEmail(email, userId);
    return sendResponse("Your Password has been updated");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};
