import { modelOptions, prop } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";

const statusArr = ["credit", "capping"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
    },
  },
})
export class UserPairIncomeModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true, type: Schema.Types.ObjectId })
  transactionId: Types.ObjectId;

  @prop({ required: true })
  pairIncome: number;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;
}
