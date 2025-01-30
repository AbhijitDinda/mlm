import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId, Types } from "mongoose";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { UserWithdrawModelSchema } from "./schemas/userWithdraw.schema";

class UserWithdraw extends UserWithdrawModelSchema {}
export type UserWithdrawInsert = ModelInsert<
  UserWithdraw,
  never,
  "createdAt" | "updatedAt"
>;
export type UserWithdrawRow = UserWithdrawInsert & {
  _id: string | Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};
const UserWithdrawModel = getModelForClass(UserWithdraw);
export default UserWithdrawModel;

/**
 * get withdraw model instance
 */
export const getWithdrawInstance = async (id: Types.ObjectId | string) => {
  const transactionId = toObjectId(id);
  const withdraw = await UserWithdrawModel.findOne({ transactionId });
  if (!withdraw)
    throw new Error(`No withdraw found for transaction ${transactionId}`);

  return withdraw;
};
