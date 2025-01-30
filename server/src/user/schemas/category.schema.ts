import { TypeOf, number, object, string } from "zod";

export const chooseCategorySchema = object({
  level: number().max(3).min(1),
  categoryId: string().optional(),
  subCategoryId: string().optional(),
});

export type ChooseCategorySchemaType = TypeOf<typeof chooseCategorySchema>;
