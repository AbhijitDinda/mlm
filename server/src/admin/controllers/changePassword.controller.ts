import mongoose from "mongoose";
import { AdminContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import LoginSessionModel from "../../models/loginSession.model";
import {
  deleteOtp,
  EmailService,
  getNewOtp,
  isOtpValid
} from "../../services/email.service";
import { sendResponse } from "../../utils/fns";
import { ChangePasswordSchemaType } from "../schemas/changePassword.schema";

export const updateAdminPasswordHandler = async ({
  ctx,
  input,
}: {
  ctx: AdminContext;
  input: ChangePasswordSchemaType;
}) => {
  const { admin } = ctx;
  const { oldPassword, password, step, verificationCode } = input;
  const { userId, loginSessionId } = admin;

  const isPasswordValid = await admin.validatePassword(oldPassword);
  if (!isPasswordValid) throw ClientError("Password is incorrect");
  const email = admin.email;

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
    admin.password = password;
    await admin.save({ session });

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
