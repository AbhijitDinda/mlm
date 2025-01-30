import { prop } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";

export const statusArr = ["active", "inactive"] as const;
export type StatusType = typeof statusArr[number];
export class CategorySchema {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  image: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: StatusType;

  @prop({ required: true })
  level: number;

  @prop({ type: Schema.Types.ObjectId })
  categoryId?: Types.ObjectId;

  @prop({ type: Schema.Types.ObjectId })
  subCategoryId?: Types.ObjectId;
}
