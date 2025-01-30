import { modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import { UserModelSchema } from "./user.schema";
import { WithdrawGatewayModelSchema } from "./withdrawGateway.schema";

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    timestamps: true,
  },
})
export class UserWithdrawGatewayModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true, ref: () => WithdrawGatewayModelSchema })
  gateway: Ref<WithdrawGatewayModelSchema>;

  @prop({ required: true, type: Schema.Types.Mixed })
  details: { [key: string]: string };

  @prop({ ref: () => UserModelSchema })
  user: Ref<UserModelSchema>;
}
