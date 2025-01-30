import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import { trpc } from "../trpc";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { CategorySchema } from "./schemas/category.schema";

export class Category extends CategorySchema {}

export type CategoryInsert = ModelInsert<Category>;
export type CategoryUpdate = CategoryInsert & { _id: string | Types.ObjectId };

const CategoryModel = getModelForClass(Category);
export default CategoryModel;

export const getCategoryInstance = async (id: string) => {
  const _id = toObjectId(id);
  const category = await CategoryModel.findById(_id);
  if (category === null) throw ClientError(`No category found with id ${_id}`);
  return category;
};
