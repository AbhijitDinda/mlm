import { modelOptions, pre, prop, Ref, Severity } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import { UserTree } from "../userTree.model";
import { Schema } from "mongoose";

export const StatusArr = ["active", "blocked"] as const;
export const RolesArr = ["user", "admin"] as const;
export const KycArr = [
  "unverified",
  "pending",
  "approved",
  "rejected",
] as const;
export type Status = typeof StatusArr[number];
export type Roles = typeof RolesArr[number];
export type KycStatus = typeof KycArr[number];

@modelOptions({ schemaOptions: { _id: false } })
class Contact {
  @prop({ required: true })
  address: string;

  @prop({ required: true })
  country: string;

  @prop({ required: true })
  city: string;

  @prop({ required: true })
  state: string;

  @prop({ required: true })
  pinCode: number;
}

@pre<UserModelSchema>("save", async function () {
  if (!this.isModified("password")) return;
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
})
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
})
export class UserModelSchema {
  @prop({ unique: true, index: true })
  userId!: number;

  @prop({ required: true, lowercase: true })
  email: string;

  @prop({ unique: true, required: true, index: true, lowercase: true })
  userName: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, select: false })
  password: string;

  @prop({ required: true })
  mobileNumber: string;

  @prop({ enum: RolesArr, default: "user", type: String })
  role: Roles;

  @prop({ default: false })
  twoFA: boolean;

  @prop({ enum: StatusArr, default: "active", type: String })
  status: Status;

  @prop()
  avatar?: string;

  @prop()
  contact?: Contact;

  @prop({ enum: KycArr, default: KycArr[0], type: String })
  kyc: KycStatus;

  @prop({ type: Schema.Types.Mixed })
  kycDetails?: { [x: string]: string };

  @prop({ required: true, unique: true })
  ePin: string;

  @prop({ type: Boolean, default: true })
  isPremium: boolean;

  @prop({ type: Number, default: 0 })
  reactivationLevel: 0 | 1 | 2 | 3;

  @prop({ ref: UserTree })
  tree: Ref<UserTree>;

  createdAt: string;
  updatedAt: string;
}
