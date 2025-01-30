import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { HttpError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelFind, ModelInsert } from "../utils/types";
import { PaymentTransferModelSchema } from "./schemas/paymentTransfer.schema";

class PaymentTransfer extends PaymentTransferModelSchema {}
export type PaymentTransferInsert = ModelInsert<PaymentTransfer>;
const PaymentTransferModel = getModelForClass(PaymentTransfer);
export default PaymentTransferModel;

export const getPaymentTransferInstance = async (
  id: string | Types.ObjectId
) => {
  const transactionId = toObjectId(id);
  const find: ModelFind<PaymentTransferInsert> = {
    transactionId,
  };
  const transaction = await PaymentTransferModel.findOne(find);
  if (!transaction)
    throw HttpError(
      `No Payment Transfer found with id ${transactionId}`,
      "NOT_FOUND"
    );
  return transaction;
};
