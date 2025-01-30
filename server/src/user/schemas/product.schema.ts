import { TypeOf, number, object, string, z } from "zod";

export const getProductListSchema = object({
  pageIndex: number({ required_error: "Page Index is required" }),
  pageSize: number({ required_error: "Page Size is required" }),
  sort: z.enum([
    "featured",
    "newest",
    "priceDesc",
    "priceAsc",
    "free",
  ] as const),
  search: string().optional(),
  category: string().optional(),
  subCategory: string().optional(),
  subSubCategory: string().optional(),
});

export type GetProductListSchemaType = TypeOf<typeof getProductListSchema>;
