import { Details } from "express-useragent";
import mongoose from "mongoose";
import { ClientError } from "../../middleware/errors";
import { getUserInstance } from "../../models/user.model";
import {
  deleteOtp,
  getNewOtp,
  isOtpValid,
  sendLoginVerificationMail,
} from "../../services/email.service";
import { UserServices } from "../../services/user.service";
import { sendResponse, signJwt } from "../../utils/fns";
import { LoginAdminSchemaType } from "../schemas/auth.schema";

export const loginHandler = async (
  input: LoginAdminSchemaType,
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

    const isAdmin = user.isAdmin();
    if (!isAdmin)
      throw ClientError(
        "No admin account is registered with this userId or userName"
      );

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
