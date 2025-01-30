import { array, number, object, string, TypeOf, z } from "zod";

export const dataTableSchema = object({
  pageIndex: number({ required_error: "Page Index is required" }),
  pageSize: number({ required_error: "Page Size is required" }),
  sortModel: array(
    object({
      field: string({ required_error: " Field is required" }).optional(),
      sort: z.enum(["asc", "desc"] as const).nullish(),
    })
  ).max(1),
  searchFilter: string({}).optional(),
});

export const userTableSchema = object({
  status: z.enum(["active", "blocked", "all"] as const),
  table: dataTableSchema,
});

export const userKycTableSchema = object({
  status: z.enum(["pending", "rejected", "all", "approved"] as const),
  table: dataTableSchema,
});

export const supportTableSchema = object({
  status: z.enum(["pending", "active", "all", "closed"] as const),
  table: dataTableSchema,
});

export const withdrawTableSchema = object({
  status: z.enum(["pending", "success", "all", "rejected"] as const),
  table: dataTableSchema,
});

export const depositTableSchema = object({
  status: z.enum([
    "review",
    "pending",
    "approved",
    "all",
    "rejected",
    "instant",
  ] as const),
  table: dataTableSchema,
});

export type DataTableSchemaType = TypeOf<typeof dataTableSchema>;
export type UserTableSchemaType = TypeOf<typeof userTableSchema>;
export type UserKycTableSchemaType = TypeOf<typeof userKycTableSchema>;
export type SupportTableSchemaType = TypeOf<typeof supportTableSchema>;
export type WithdrawTableSchemaType = TypeOf<typeof withdrawTableSchema>;
export type DepositTableSchemaType = TypeOf<typeof depositTableSchema>;
