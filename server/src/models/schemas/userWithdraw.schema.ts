import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";
import { User } from "../user.model";
import { Roles, RolesArr, UserModelSchema } from "./user.schema";
import {
  ChargeType,
  chargeTypeArr,
  inputTypeArr,
  InputTypeType,
} from "./withdrawGateway.schema";

const statusArr = ["pending", "rejected", "success"] as const;
type Status = typeof statusArr[number];

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

class Detail {
  @prop({ required: true })
  value: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  label: string;

  @prop({
    required: true,
    enum: inputTypeArr,
    type: String,
  })
  inputType: InputTypeType;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class UserWithdrawModelSchema {
  @prop({
    required: true,
    type: Schema.Types.ObjectId,
    unique: true,
    index: true,
  })
  transactionId: Types.ObjectId;

  @prop({ required: true })
  userId: number;

  @prop({ required: true, type: () => Gateway })
  gateway: Gateway;

  @prop({ required: true })
  amount: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true })
  netAmount: number;

  @prop({  type: () => [Detail] })
  details?: Detail[];

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop()
  message?: string;

  @prop({ required: true, enum: RolesArr, type: String })
  actionBy: Roles;

  @prop({ ref: () => UserModelSchema })
  user: Ref<UserModelSchema>;

  createdAt: string;
  updatedAt: string;
}
