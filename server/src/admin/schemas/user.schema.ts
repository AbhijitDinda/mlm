import { number, object, record, string, TypeOf, z } from "zod";
import { StatusArr } from "../../models/schemas/user.schema";

export const depositSchema = object({
  userId: number({ required_error: "User Id is required" }),
  amount: number({ required_error: "Amount is required" }).min(1),
  message: string({ required_error: "Message is required" }),
});

export const withdrawSchema = object({
  userId: number({ required_error: "User Id is required" }),
  amount: number({ required_error: "Amount is required" }).min(1),
  message: string({ required_error: "Message is required" }),
});

export const changeStatusUserSchema = object({
  userId: number({ required_error: "User Id is required" }),
  status: z.enum(StatusArr),
});

export const updateProfileSchema = object({
  userId: number({ required_error: "User Id is required" }),
  firstName: string({ required_error: "First Name is required" }),
  lastName: string({ required_error: "Last Name is required" }),
  kyc: record(string(), string()),
});

export type DepositSchemaType = TypeOf<typeof depositSchema>;
export type WithdrawSchemaType = TypeOf<typeof withdrawSchema>;
export type ChangeStatusUserSchemaType = TypeOf<typeof changeStatusUserSchema>;
export type UpdateProfileSchemaType = TypeOf<typeof updateProfileSchema>;
