import { modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: { timestamps: { createdAt: true, updatedAt: false } },
})
export class OrderModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  productId: Types.ObjectId;

  @prop({ required: true })
  transactionId: Types.ObjectId;

  @prop({ required: true })
  unitPrice: number;

  @prop({ required: true })
  purchasePrice: number;
}
