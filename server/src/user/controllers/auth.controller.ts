import { Details } from "express-useragent";
import mongoose from "mongoose";
import { ClientError } from "../../middleware/errors";
import { getEPinInstance } from "../../models/epin.model";
import LoginSessionModel, {
  LoginSessionInsert,
} from "../../models/loginSession.model";
import { getUserInstance, UserInsert } from "../../models/user.model";
import UserTreeModel, {
  getUserTreeInstance,
  UserTreeInsert,
} from "../../models/userTree.model";
import {
  deleteOtp,
  EmailService,
  getNewOtp,
  isOtpValid,
  sendLoginVerificationMail,
  sendRegisterVerificationMail,
} from "../../services/email.service";
import { checkRegistrationPermission } from "../../services/setting.service";
import { UserServices } from "../../services/user.service";
import { sendResponse, signJwt } from "../../utils/fns";
import { ModelFind } from "../../utils/types";
import {
  CreateUserSchemaType,
  LoginUserSchemaType,
  NewUserSchemaType,
  ResetPasswordSchemaType,
} from "../schemas/auth.schema";
import { StringSchemaType } from "../schemas/index.schema";

export const registerHandler = async (input: CreateUserSchemaType) => {
  await checkRegistrationPermission();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      referralId,
      placementId,
      placementSide,
      userName,
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      ePin,
      step,
      verificationCode,
    } = input;
    const userId = await UserServices.generateUserId();

    const ReferralUser = await getUserInstance(referralId, {
      error: "Referral Id doesn't exist",
    });

    const _isUserName = await UserServices.isUserName(userName);
    if (_isUserName) throw ClientError("Username already exists");

    /**
     * validate user registration limit per email
     */
    await UserServices.validateRegisterEmailLimit(email);

    let validPlacementId: number;
    if (placementId) {
      const isPlacementId = await UserServices.isUserId(placementId);
      if (!isPlacementId) throw ClientError("Placement Id doesn't exist");

      if (referralId !== placementId) {
        const isPlacementIdChild = await ReferralUser.isChildId(placementId);
        if (!isPlacementIdChild)
          throw ClientError("Invalid combination of Referral and Placement");
      }

      validPlacementId = placementId;
    } else {
      validPlacementId = await UserServices.getPlacementIdForRegistration(
        referralId,
        placementSide
      );
    }

    // check for placement side
    const placementUser = await getUserInstance(validPlacementId);
    const placementUserTree = await placementUser.populateTree();
    if (placementUserTree.leftId && placementUserTree.rightId) {
      throw ClientError(
        `${validPlacementId} can't be used for placement id. Both left and right side is not available`
      );
    }
    if (placementUserTree.leftId && placementSide === "left") {
      throw ClientError(`${validPlacementId} can't be used for left side`);
    }
    if (placementUserTree.rightId && placementSide === "right") {
      throw ClientError(`${validPlacementId} can't be used for right side`);
    }

    // validate ePin
    const _ePin = await getEPinInstance(ePin);
    _ePin.validateStatus();

    if (step === 1) {
      const otp = await getNewOtp(email, "register");
      await sendRegisterVerificationMail(email, otp);
      await session.commitTransaction();
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
        purpose: "register",
      });
      if (!_isOtpValid) return ClientError("Otp is not valid");
    }

    // create user tree row
    const PlacementUser = await getUserInstance(validPlacementId);
    const { rgt: placementRgt, level: placementLevel } =
      await PlacementUser.populateTree();

    const lft = placementRgt;
    const rgt = placementRgt + 1;
    const level = placementLevel + 1;

    // update lft and rgt by 2 after new user ids
    await UserTreeModel.updateMany(
      { lft: { $gte: lft } },
      { $inc: { lft: 2 } },
      { session }
    );
    await UserTreeModel.updateMany(
      { rgt: { $gte: lft } },
      { $inc: { rgt: 2 } },
      { session }
    );

    const newUserTreeDoc: UserTreeInsert = {
      userId,
      leftCount: 0,
      rightCount: 0,
      lft,
      rgt,
      level,
      pairCount: 0,
      placementId: validPlacementId,
      referralId,
      placementSide,
    };
    const userTree = await UserServices.createUserTreeDocument(
      newUserTreeDoc,
      session
    );

    // create user row
    const newUserDoc: UserInsert = {
      ...input,
      ePin,
      userId,
      tree: userTree._id,
    };

    const user = await UserServices.createUserDocument(newUserDoc, session);
    // Add referral income
    await ReferralUser.addReferralIncome(userId, session);

    // update left and right id of placement user
    await PlacementUser.updatePlacementLeftRightId(
      userId,
      placementSide,
      session
    );

    // update left and right count and check for pair and pair income
    await user.updateLeftRightCountAddPairIncome(session);

    // check for indirect reward
    await ReferralUser.checkParentIndirectReward(session);

    // expire ePin
    await _ePin.expireStatus(userId, session);

    // delete otp
    await deleteOtp(
      {
        otp: verificationCode,
        email,
        purpose: "register",
      },
      session
    );

    // commit transaction
    await session.commitTransaction();

    await EmailService.sendRegistrationSuccessEmail(email, userId);

    return sendResponse("Registration Successful", { userId });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginHandler = async (
  input: LoginUserSchemaType,
  ip: string,
  userAgent?: Details
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId: _userId,
      password,
      remember,
      step,
      verificationCode: code,
    } = input;
    const verificationCode = Number(code);

    let userId: number;
    const isUserNameType = isNaN(_userId as any as number);
    if (isUserNameType) {
      const isUserName = await UserServices.isUserName(_userId);
      if (!isUserName)
        throw ClientError(
          "No account is registered with this userId or userName"
        );
      userId = await UserServices.getUserIdByName(_userId);
    } else {
      userId = Number(_userId);
    }
    const user = await getUserInstance(userId, {
      error: "No account is registered with this userId or userName",
    });

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw ClientError("Password is incorrect");

    const isBlocked = user.isBlocked();
    if (isBlocked) {
      throw ClientError(
        "Your account has blocked. Contact support for further processing"
      );
    }

    const twoFA = user.twoFA;

    if (twoFA) {
      const email = user.email;
      if (step === 1) {
        const otp = await getNewOtp(email, "login");
        await sendLoginVerificationMail(email, otp);
        return sendResponse("Verify the code to login", { twoFA, email });
      } else {
        if (!verificationCode) {
          throw ClientError("Verification code is required");
        }

        const _isOtpValid = await isOtpValid({
          otp: verificationCode,
          email,
          purpose: "login",
        });
        if (!_isOtpValid) throw ClientError("Otp is not valid");

        await deleteOtp(
          { otp: verificationCode, email, purpose: "login" },
          session
        );
      }
    }

    // clear session max than limit
    await UserServices.checkUserLoginSessionLimit(userId);

    // create login session

    const originalUserId = user.userId;
    const token = signJwt(originalUserId, remember);
    const { _id: tokenId } = await UserServices.createUserLoginSession({
      userId,
      token,
      ip,
      remember,
      userAgent,
      session,
    });

    const details = await UserServices.getUserProfileDetails(userId);

    // commit transaction
    await session.commitTransaction();
    return sendResponse("Login successful", {
      accessToken: token,
      user: {
        ...details,
        loginSessionId: tokenId.toString(),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const forgotPasswordHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  let userId: number;
  const isUserNameType = isNaN(input as any as number);
  if (isUserNameType) {
    const isUserName = await UserServices.isUserName(input);
    if (!isUserName) throw ClientError(`No user exist with ${input}`);
    userId = await UserServices.getUserIdByName(input);
  } else {
    userId = Number(input);
  }
  const user = await getUserInstance(userId, {
    error: `No user exist with ${input}`,
  });
  const email = user.email;
  const otp = await getNewOtp(email, "resetPassword");
  await EmailService.sendResetPasswordEmail(email, otp);

  const _userId = userId.toString();
  return sendResponse("Otp has been sent", {
    email,
    userId: _userId,
  });
};

export const resetPasswordHandler = async ({
  input,
}: {
  input: ResetPasswordSchemaType;
}) => {
  const { userId, otp, password, confirmPassword } = input;

  let _userId: number;
  const isUserNameType = isNaN(userId as any as number);
  if (isUserNameType) {
    const isUserName = await UserServices.isUserName(userId);
    if (!isUserName) throw ClientError(`No user exist with ${userId}`);
    _userId = await UserServices.getUserIdByName(userId);
  } else {
    _userId = Number(userId);
  }

  const user = await getUserInstance(_userId, {
    error: `No user exist with ${input}`,
  });
  const email = user.email;

  const _isOtpValid = await isOtpValid({
    otp: Number(otp),
    email,
    purpose: "resetPassword",
  });
  if (!_isOtpValid) return ClientError("Otp is not valid");

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    user.password = password;
    await user.save({ session });

    // delete otp
    await deleteOtp(
      {
        otp: Number(otp),
        email,
        purpose: "resetPassword",
      },
      session
    );

    const status: ModelFind<LoginSessionInsert> = {
      status: "expired",
    };
    await LoginSessionModel.updateMany({ userId }, { $set: status });
    await session.commitTransaction();
    await EmailService.sendResetPasswordSuccessEmail(email, _userId);
    return sendResponse("Password has been reset successful");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getNewUserHandler = async (input: NewUserSchemaType) => {
  const { userId } = input;

  const user = await getUserInstance(userId);
  const userTree = await user.populateTree();
  const { referralId, placementId, placementSide } = userTree;
  const { userName, email, createdAt } = user;

  return { userName, email, createdAt, referralId, placementId, placementSide };
};

export const checkReferralIdHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  try {
    const userId = Number(input);
    const user = await getUserInstance(userId, {
      error: "Referral Id does not exist",
    });
    return { success: true, userName: user.userName };
  } catch (error) {
    return { success: false, userName: "" };
  }
};

export const checkPlacementIdHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  try {
    const userId = Number(input);
    const user = await getUserInstance(userId, {
      error: "Placement Id does not exist",
    });
    return { success: true, userName: user.userName };
  } catch (error) {
    return { success: false, userName: "" };
  }
};

export const checkUserNameHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const userName = await UserServices.isUserName(input);
  return !userName;
};

export const checkPlacementSideHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  try {
    const userId = Number(input);
    const user = await getUserTreeInstance(userId);
    const { leftId, rightId } = user;
    return { leftId, rightId, success: true };
  } catch (error) {
    const leftId = undefined;
    const rightId = undefined;
    return { leftId, rightId, success: false };
  }
};
