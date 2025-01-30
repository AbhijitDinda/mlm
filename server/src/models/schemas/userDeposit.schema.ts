import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";
import {
  ChargeType,
  chargeTypeArr,
  Detail,
} from "./manualDepositGateway.schema";
import { Roles, RolesArr, UserModelSchema } from "./user.schema";

const statusArr = [
  "pending",
  "credit",
  "approved",
  "cancelled",
  "failed",
  "review",
  "rejected",
] as const;
type Status = typeof statusArr[number];

class UserDetailDeposit {
  @prop({ required: true })
  amount: number;

  @prop({ required: true })
  transactionId: string;

  @prop({ required: true })
  transactionDate: string;

  @prop({ required: true })
  paymentImage: string;
}

class Details {
  @prop({ required: true, type: () => [Detail] })
  gateway: Detail[];

  @prop({ required: true })
  user: UserDetailDeposit;
}

@modelOptions({ schemaOptions: { _id: false } })
class Gateway {
  @prop({ required: true })
  name: string;

  @prop()
  logo?: string;

  @prop({ required: true })
  charge: number;

  @prop({ required: true, enum: chargeTypeArr, type: String })
  chargeType: ChargeType;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class UserDepositModelSchema {
  @prop({
    required: true,
    type: Schema.Types.ObjectId,
    unique: true,
    index: true,
  })
  transactionId: Types.ObjectId;

  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  amount: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true })
  netAmount: number;

  @prop({ required: true })
  currency: string;

  @prop({ required: true, type: () => Gateway })
  gateway: Gateway;

  @prop({ type: () => Details })
  details?: Details;

  @prop()
  message?: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ required: true, type: String, enum: ["manual", "auto"] as const })
  type: "manual" | "auto";

  @prop({ required: true, enum: RolesArr, type: String })
  actionBy: Roles;

  @prop({ ref: () => UserModelSchema })
  user: Ref<UserModelSchema>;

  createdAt: string;
  updatedAt: string;
}
