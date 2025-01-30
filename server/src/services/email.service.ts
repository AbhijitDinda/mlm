import dayjs from "dayjs";
import { ClientSession, ObjectId, Types } from "mongoose";
import ChangePasswordMail from "../email/ChangePasswordMail";
import ChangePasswordSuccessMail from "../email/ChangePasswordSuccessMail";
import DepositMail from "../email/DepositMail";
import LoginVerificationMail from "../email/LoginVerificationMail";
import PasswordResetSuccessMail from "../email/PasswordResetSuccessMail";
import RegistrationSuccessfulMail from "../email/RegistrationSuccessfulMail";
import RegistrationVerificationMail from "../email/RegistrationVerificationMail";
import ResetPasswordMail from "../email/ResetPasswordMail";
import TransferPaymentMail from "../email/TransferPaymentMail";
import FAMail from "../email/TwoFAMail";
import WithdrawMail from "../email/WithdrawMail";
import OtpModel, { OtpInsert } from "../models/otp.model";
import { getPaymentTransferInstance } from "../models/paymentTransfer.model";
import { EmailPurpose } from "../models/schemas/otp.schema";
import { getSettingInstance } from "../models/setting.model";
import { getUserInstance } from "../models/user.model";
import { getDepositInstance } from "../models/userDeposit.model";
import { getWithdrawInstance } from "../models/userWithdraw.model";
import { generateRandomNumber, toObjectId } from "../utils/fns";
import sendMail from "../utils/sendMail";
import { getDateTime } from "../utils/time";

type OtpParam = Omit<OtpInsert, "validTill">;

const getOtp = () => generateRandomNumber(100000, 999999);

/**
 * check if otp
 */
export const isOtp = async (input: OtpParam) => {
  const row = await OtpModel.findOne(input);
  return row !== null;
};

/**
 * check if otp is valid with time
 */
export const isOtpValid = async (input: OtpParam) => {
  const row = await OtpModel.findOne(input);
  if (!row) return false;
  const validTill = row.validTill;
  const isValid = dayjs(validTill).isAfter(new Date());
  return isValid;
};

/**
 * generate otp
 */
export const getNewOtp = async (email: string, purpose: EmailPurpose) => {
  const row = await OtpModel.findOne({ email, purpose });

  let newOtp: number;
  let isNew = true;

  if (row) {
    const otp = row.otp;
    const isValid = await isOtpValid({ email, otp, purpose });
    if (isValid) {
      await updateOtp({ email, otp, purpose });
      newOtp = otp;
      isNew = false;
    } else {
      newOtp = getOtp();
    }
  } else {
    newOtp = getOtp();
  }

  const input: OtpParam = {
    email,
    purpose,
    otp: newOtp,
  };
  if (isNew) await insertOtp(input);
  return newOtp;
};

/**
 * insert otp to the database
 */
const insertOtp = async (input: OtpParam): Promise<void> => {
  const validTill = getDateTime("add", 15, "minutes");
  const otpDocument: OtpInsert = { ...input, validTill };
  await OtpModel.create(otpDocument);
};

/**
 * update otp valid till date
 */
const updateOtp = async (input: OtpParam): Promise<void> => {
  const validTill = getDateTime("add", 15, "minutes");
  await OtpModel.updateOne(input, { $set: { validTill } });
};

/**
 * delete otp
 */
export const deleteOtp = async (
  input: OtpParam,
  session: ClientSession
): Promise<void> => {
  await OtpModel.deleteOne(input, { session });
};

/**
 * send registration verification email
 */
export const sendRegisterVerificationMail = async (
  email: string,
  otp: number
) => {
  const subject = "Registration Verification";
  const document = await RegistrationVerificationMail(otp);
  return sendMail({ email, subject, document });
};

/**
 * send login verification email
 */
export const sendLoginVerificationMail = async (email: string, otp: number) => {
  const subject = "Login Verification";
  const document = LoginVerificationMail(otp);
  return sendMail({ email, subject, document });
};

/**
 * send two factor authentication verification email
 */
export const sendTwoFAMail = async (
  email: string,
  otp: number,
  twoFA: boolean
): Promise<void> => {
  const document = FAMail(otp, twoFA);
  const subject = "Two Factor Authentication";
  await sendMail({ email, subject, document });
};

export namespace EmailService {
  /**
   * send registration successful email
   */
  export const sendRegistrationSuccessEmail = async (
    email: string,
    userId: number
  ) => {
    const { emailPreferences } = await getSettingInstance();
    const registration = emailPreferences.registrationSuccess;
    if (!registration) return;

    const document = await RegistrationSuccessfulMail(userId);
    const subject = "Registration Successful";
    await sendMail({ email, subject, document });
  };

  /**
   * send reset password email
   */
  export const sendResetPasswordEmail = async (email: string, otp: number) => {
    const subject = "Reset Password";
    const document = ResetPasswordMail(otp);
    return sendMail({ email, subject, document });
  };

  /**
   * send reset password successful email
   */
  export const sendResetPasswordSuccessEmail = async (
    email: string,
    userId: number
  ) => {
    const document = await PasswordResetSuccessMail(userId);
    const subject = "Password Reset Successful";
    await sendMail({ email, subject, document });
  };

  /**
   * send change password email verification
   */
  export const sendChangePasswordVerificationMail = async ({
    userId,
    email,
    otp,
  }: {
    userId: number;
    email: string;
    otp: number;
  }) => {
    const subject = "Change Password";
    const document = await ChangePasswordMail(userId, otp);
    return sendMail({ email, subject, document });
  };

  /**
   * send reset password successful email
   */
  export const sendChangePasswordSuccessEmail = async (
    email: string,
    userId: number
  ) => {
    const document = await ChangePasswordSuccessMail(userId);
    const subject = "Password Changed";
    await sendMail({ email, subject, document });
  };

  /**
   * send withdraw email
   */
  export const sendWithdrawEmail = async (transactionId: string | Types.ObjectId) => {
    const { emailPreferences } = await getSettingInstance();
    const withdraw = emailPreferences.paymentWithdraw;
    if (!withdraw) return;

    const transaction = await getWithdrawInstance(transactionId);
    const userId = transaction.userId;
    const { email } = await getUserInstance(userId);

    const _id = toObjectId(transactionId);
    const document = await WithdrawMail(_id);
    if (!document) return;
    const subject = "Payment Withdraw";
    await sendMail({ email, subject, document });
  };

  /**
   * send deposit email
   */
  export const sendDepositEmail = async (transactionId: string) => {
    const { emailPreferences } = await getSettingInstance();
    const deposit = emailPreferences.paymentDeposit;
    if (!deposit) return;

    const transaction = await getDepositInstance(transactionId);
    const userId = transaction.userId;
    const { email } = await getUserInstance(userId);

    const _id = toObjectId(transactionId);
    const document = await DepositMail(_id);
    if (!document) return;
    const subject = "Payment Deposit";
    await sendMail({ email, subject, document });
  };

  /**
   * send transfer payment email
   */
  export const sendTransferPaymentEmail = async ({
    email,
    subject,
    transactionId,
  }: {
    email: string;
    subject: string;
    transactionId: Types.ObjectId;
  }) => {
    const { emailPreferences } = await getSettingInstance();
    const { paymentTransfer } = emailPreferences;
    if (paymentTransfer !== true) return;

    const transaction = await getPaymentTransferInstance(transactionId);
    const { userId, agentId, amount, status, netAmount } = transaction;

    const document = await TransferPaymentMail({
      userId,
      agentId,
      amount,
      status,
      netAmount,
    });
    await sendMail({ email, subject, document });
  };
}
