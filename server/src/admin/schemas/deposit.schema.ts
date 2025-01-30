import { object, string, TypeOf } from "zod";

export const depositRejectSchema = object({
  message: string({ required_error: "Message is required" }),
  id: string({ required_error: "Transaction id is required" }),
});

export const depositApproveSchema = object({
  message: string().optional(),
  id: string({ required_error: "Transaction id is required" }),
});

export type DepositRejectSchemaType = TypeOf<typeof depositRejectSchema>;
export type DepositApproveSchemaType = TypeOf<typeof depositApproveSchema>;
