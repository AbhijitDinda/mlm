import { array, number, object, string, TypeOf, z } from "zod";
import { dataTableSchema } from "./table.schema";
import { statusArr } from "../../models/schemas/product.schema";

export const categoryTblSchema = object({
  level: number().min(1).max(3),
  query: dataTableSchema,
});

export const createCategorySchema = object({
  name: string({ required_error: "Name is required" }),
  image: string({ required_error: "Image is required" }),
  level: number({ required_error: "Level is required" }).max(3).min(1),
  status: z.enum(["active", "inactive"] as const),
  categoryId: string().optional(),
  subCategoryId: string().optional(),
  _id: string().optional(),
});

export const createProductSchema = object({
  _id: string().optional(),
  name: string({ required_error: "Name is required" }),
  description: string({ required_error: "Description is required" }),
  thumbnail: string({ required_error: "Thumbnail is required" }),
  unitPrice: number({ required_error: "Unit price is required" }),
  purchasePrice: number({ required_error: "Purchase Price is required" }),
  images: array(string({ required_error: "Images is required" })),
  file: string({ required_error: "File is required" }),
  status: z.enum(statusArr),
  categoryId: string({ required_error: "Category is required" }),
  subCategoryId: string().optional(),
  subSubCategoryId: string().optional(),
});

export type CreateProductSchemaType = TypeOf<typeof createProductSchema>;
export type CreateCategorySchemaType = TypeOf<typeof createCategorySchema>;
export type CategoryTblSchemaType = TypeOf<typeof categoryTblSchema>;
