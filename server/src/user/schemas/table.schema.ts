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

export type DataTableSchemaType = TypeOf<typeof dataTableSchema>;
