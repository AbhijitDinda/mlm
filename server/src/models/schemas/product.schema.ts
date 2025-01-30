import { modelOptions, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export const statusArr = ["active", "inactive", "deleted"] as const;
export type StatusType = typeof statusArr[number];

@modelOptions({ schemaOptions: { timestamps: true } })
export class ProductModelSchema {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  thumbnail: string;

  @prop({ required: true })
  unitPrice: number;

  @prop({ required: true })
  purchasePrice: number;

  @prop({ required: true, type: [String] })
  images: string[];

  @prop({ required: true })
  file: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: StatusType;

  @prop({ required: true })
  categoryId: Types.ObjectId;

  @prop()
  subCategoryId?: Types.ObjectId;

  @prop()
  subSubCategoryId?: Types.ObjectId;
}
