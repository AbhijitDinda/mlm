import { ClientSession } from "mongoose";
import TransactionModel, {
  TransactionInsert
} from "../models/transaction.model";

/**
 * create transaction document
 */
export const createTransactionDocument = async (
  input: TransactionInsert,
  session: ClientSession
) => {
  const transaction = new TransactionModel(input);
  await transaction.save({ session });
  return transaction;
};
