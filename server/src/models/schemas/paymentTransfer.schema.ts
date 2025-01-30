import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserModelSchema } from "./user.schema";

const statusArr = ["transferred", "received"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
})
export class PaymentTransferModelSchema {
  @prop({ required: true, unique: true, index: true })
  transactionId: Types.ObjectId;

  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  agentId: number;

  @prop({ required: true })
  amount: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true })
  netAmount: number;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ ref: () => UserModelSchema })
  user: Ref<UserModelSchema>;
}
