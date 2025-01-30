import { modelOptions, prop } from "@typegoose/typegoose";
import { Roles, RolesArr } from "./user.schema";

const statusArr = ["active", "expired"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: { timestamps: { createdAt: true, updatedAt: false } },
})
export class LoginSessionModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true, unique: true, index: true })
  token: string;

  @prop()
  validTill: Date;

  @prop()
  ip: string;

  @prop()
  country: string;

  @prop()
  region: string;

  @prop()
  city: string;

  @prop({ required: true, type: String, enum: statusArr })
  status: Status;

  @prop({ required: true, enum: RolesArr, type: String })
  agent: Roles;

  @prop()
  browser: string;

  @prop()
  os: string;

  @prop()
  device: string;
}
