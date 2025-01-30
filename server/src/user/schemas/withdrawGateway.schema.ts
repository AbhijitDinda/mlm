import { number, object, record, string, TypeOf } from "zod";

export const createUserWithdrawGatewaySchema = object({
  _id: string({ required_error: "Id is required" }),
  details: record(string(), string()),
});

export const withdrawPaymentSchema = object({
  _id: string({ required_error: "Id is required" }),
  amount: number({ required_error: "Amount is required" }).min(1),
});

export type CreateUserWithdrawGatewaySchemaType = TypeOf<
  typeof createUserWithdrawGatewaySchema
>;
export type WithdrawPaymentSchemaType = TypeOf<
  typeof withdrawPaymentSchema
>;
