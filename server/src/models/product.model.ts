import { getModelForClass } from "@typegoose/typegoose";
import { HttpError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { ProductModelSchema } from "./schemas/product.schema";

class Product extends ProductModelSchema {
  isDeleted() {
    const status = this.status;
    return status === "deleted";
  }
}

export type ProductInsert = ModelInsert<Product>;
export type ProductRow = ProductInsert & { _id: string };
const ProductModel = getModelForClass(Product);
export default ProductModel;

export const getProductInstance = async (id: string) => {
  const _id = toObjectId(id);
  const product = await ProductModel.findById(_id);
  if (!product)
    throw HttpError(`Product not found with id ${_id}`, "NOT_FOUND");
  return product;
};
