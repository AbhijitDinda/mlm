import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId, Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { TransactionModelSchema } from "./schemas/transaction.schema";

class Transaction extends TransactionModelSchema {}
export type TransactionInsert = ModelInsert<
  Transaction,
  never,
  "createdAt" | "updatedAt"
>;
export type TransactionRow = TransactionInsert & {
  _id: string | Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

const TransactionModel = getModelForClass(Transaction);
export default TransactionModel;

export const getTransactionInstance = async (id: string, error?: string) => {
  const _id = toObjectId(id);
  const transaction = await TransactionModel.findById(_id);
  if (!transaction) throw ClientError(error || `No transaction with id ${_id}`);
  return transaction;
};
