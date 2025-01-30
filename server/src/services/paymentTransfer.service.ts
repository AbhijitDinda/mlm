import { ClientSession } from "mongoose";
import PaymentTransferModel, {
  PaymentTransferInsert,
} from "../models/paymentTransfer.model";

export const createPaymentTransferDocument = async (
  input: PaymentTransferInsert,
  session: ClientSession
) => {
  const doc = new PaymentTransferModel(input);
  await doc.save({ session });
  return doc;
};
