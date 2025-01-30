import { number, object, string, TypeOf } from "zod";

export const createDepositPaymentSchema = object({
  _id: string(),
  amount: number({ required_error: "Amount is required" }),
  transactionId: string({ required_error: "Transaction Id is required" }),
  paymentImage: string({ required_error: "Payment Image is required" }),
  transactionDate: string({
    required_error: "Transaction Date is required",
  }),
});

export type CreateDepositPaymentSchemaType = TypeOf<
  typeof createDepositPaymentSchema
>;
