import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { UserDepositModelSchema } from "./schemas/userDeposit.schema";

class UserDeposit extends UserDepositModelSchema {}
export type UserDepositInsert = ModelInsert<
  UserDeposit,
  never,
  "createdAt" | "updatedAt"
>;
export type UserDepositRow = UserDepositInsert & {
  _id: string | Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

const UserDepositModel = getModelForClass(UserDeposit);
export default UserDepositModel;

/**
 * create deposit instance
 */
export const getDepositInstance = async (id: Types.ObjectId | string) => {
  const transactionId = toObjectId(id);
  const deposit = await UserDepositModel.findOne({ transactionId });
  if (!deposit) {
    return ClientError(
      `No transaction record found for transaction ${transactionId}`
    );
  }

  return deposit;
};
