import { prop } from "@typegoose/typegoose";

export const PlacementSideArr = ["left", "right"] as const;
export type PlacementSide = typeof PlacementSideArr[number];

export class UserTreeModelSchema {
  @prop({ required: true, unique: true, index: true })
  userId: number;

  @prop({ required: true })
  referralId: number;

  @prop({ required: true })
  placementId: number;

  @prop({ required: true, enum: PlacementSideArr, type: String })
  placementSide: PlacementSide;

  @prop({ required: true })
  lft: number;

  @prop({ required: true })
  rgt: number;

  @prop({ required: true })
  leftCount: number;

  @prop({ required: true })
  rightCount: number;

  @prop({ required: true })
  pairCount: number;

  @prop()
  leftId?: number;

  @prop()
  rightId?: number;

  @prop({ required: true })
  level: number;
}
