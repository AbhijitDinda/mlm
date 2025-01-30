import { coerce, number, object, TypeOf } from "zod";

export const transferPaymentSchema = object({
  receiverId: number({ required_error: "Receiver Id is required" }),
  amount: coerce
    .number({ required_error: "Amount is required" })
    .min(1)
    .transform(Number),
});

export type TransferPaymentSchemaType = TypeOf<typeof transferPaymentSchema>;
