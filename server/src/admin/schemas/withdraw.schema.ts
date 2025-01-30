import { object, string, TypeOf } from "zod";

export const withdrawRejectSchema = object({
  message: string({ required_error: "Message is required" }),
  id: string({ required_error: "Transaction id is required" }),
});

export const withdrawApproveSchema = object({
  message: string().optional(),
  id: string({ required_error: "Transaction id is required" }),
});

export type WithdrawRejectSchemaType = TypeOf<typeof withdrawRejectSchema>;
export type WithdrawApproveSchemaType = TypeOf<typeof withdrawApproveSchema>;
