import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { UserWithdrawGatewayModelSchema } from "./schemas/userWithdrawGateway.schema";

class UserWithdrawGateway extends UserWithdrawGatewayModelSchema {}
export type UserWithdrawGatewayInsert = ModelInsert<UserWithdrawGateway>;
export type UserWithdrawGatewayRow = UserWithdrawGatewayInsert & {
  _id: string;
};

const UserWithdrawGatewayModel = getModelForClass(UserWithdrawGateway);
export default UserWithdrawGatewayModel;
