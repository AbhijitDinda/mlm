import CategoryModel, {
  CategoryInsert,
  CategoryUpdate,
} from "../../models/category.model";
import { toObjectId } from "../../utils/fns";
import { ModelFind } from "../../utils/types";
import { ChooseCategorySchemaType } from "../schemas/category.schema";

export const getCategoryListHandler = async ({
  input,
}: {
  input: ChooseCategorySchemaType;
}): Promise<CategoryUpdate[]> => {
  const { level, categoryId, subCategoryId } = input;

  const find: ModelFind<CategoryInsert> = {
    status: "active",
    level,
    categoryId: categoryId ? toObjectId(categoryId) : undefined,
    subCategoryId: subCategoryId ? toObjectId(subCategoryId) : undefined,
  };
  const categories = await CategoryModel.find(find).sort({ name: 1 });
  return categories;
};
