import { modelOptions, prop } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";

const statusArr = ["credit"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
})
export class UserReferralIncomeModelSchema {
  @prop({ required: true, unique: true, index: true })
  userId: number;

  @prop({ required: true })
  referralId: number;

  @prop({ required: true })
  referralIncome: number;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ required: true, type: Schema.Types.ObjectId })
  transactionId: Types.ObjectId;
}
