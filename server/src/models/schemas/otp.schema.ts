import { prop } from "@typegoose/typegoose";

const purposeArr = [
  "register",
  "resetPassword",
  "twoFA",
  "login",
  "changePassword",
] as const;

export type EmailPurpose = typeof purposeArr[number];

export class OtpModelSchema {
  @prop({ required: true, unique: true, index: true })
  otp: number;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  validTill: Date;

  @prop({ required: true, enum: purposeArr, type: String })
  purpose: EmailPurpose;
}
