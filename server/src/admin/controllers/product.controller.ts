import dayjs from "dayjs";
import { existsSync, unlinkSync } from "fs";
import path from "path";
import { ClientError, NOtFoundError } from "../../middleware/errors";
import CategoryModel, {
  getCategoryInstance,
} from "../../models/category.model";
import ProductModel, {
  ProductInsert,
  ProductRow,
  getProductInstance,
} from "../../models/product.model";
import { sendResponse, toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { ModelSelect } from "../../utils/types";
import { StringSchemaType } from "../schemas/index.schema";
import { CreateProductSchemaType } from "../schemas/product.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

export const getProductHandler = async ({
  input,
}: {
  input: StringSchemaType;
}): Promise<ProductRow & { status: "active" | "inactive" }> => {
  const _id = input;
  const product = await getProductInstance(_id);
  if (product.isDeleted()) throw NOtFoundError("Product not found");
  //@ts-ignore //todo
  return product;
};

export const createProductHandler = async ({
  input,
}: {
  input: CreateProductSchemaType;
}) => {
  const {
    _id,
    name,
    description,
    thumbnail,
    unitPrice,
    purchasePrice,
    images,
    categoryId,
    subCategoryId,
    subSubCategoryId,
    file,
    status,
  } = input;

  if (subCategoryId) {
    const SubCategory = await getCategoryInstance(subCategoryId);
    if (SubCategory.categoryId?.toString() !== categoryId)
      throw ClientError("Sub Category mismatched");
  }

  if (subSubCategoryId) {
    if (!subCategoryId)
      throw ClientError(
        "Sub Category is required when sub sub Category provided"
      );
    const SubCategory = await getCategoryInstance(subSubCategoryId);
    if (
      SubCategory.categoryId?.toString() !== categoryId ||
      SubCategory.subCategoryId?.toString() !== subCategoryId
    )
      throw ClientError("Sub Sub Category mismatched");
  }

  const doc: ProductInsert = {
    name,
    description,
    thumbnail,
    unitPrice,
    purchasePrice,
    images,
    file,
    status,
    categoryId: toObjectId(categoryId),
    subCategoryId: subCategoryId ? toObjectId(subCategoryId) : undefined,
    subSubCategoryId: subSubCategoryId
      ? toObjectId(subSubCategoryId)
      : undefined,
  };

  const unset: ModelSelect<ProductInsert> = {
    ...(!subCategoryId && {
      subCategoryId: 1,
    }),
    ...(!subSubCategoryId && {
      subSubCategoryId: 1,
    }),
  };

  if (unitPrice < purchasePrice)
    throw ClientError("Unit price must be greater than purchase price");

  let message: string;
  if (_id) {
    const product = await getProductInstance(_id);
    if (product.isDeleted()) throw NOtFoundError("Product not found");

    await ProductModel.findByIdAndUpdate(_id, { $set: doc, $unset: unset });
    message = `Product ${name} has been updated.`;
  } else {
    await ProductModel.create(doc);
    message = `Product ${name} has been create.`;
  }

  return sendResponse(message);
};

export const removeProductHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const product = await getProductInstance(input);
  if (product.isDeleted()) throw NOtFoundError("Product not found");

  const { file } = product;
  const filePath = path.join(__dirname, `../../../private/files/${file}`);
  const isFileExist = existsSync(filePath);
  if (isFileExist) {
    unlinkSync(filePath);
  }
  product.status = "deleted";
  await product.save();
  return sendResponse(`Product has been removed.`);
};

export const getProductListHandler = async ({
  input,
}: {
  input: DataTableSchemaType;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};
  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;
  const dt = dayjs(searchKeyword);

  const data = await ProductModel.aggregate([
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "categoryId",
        foreignField: "_id",
        as: "_category",
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "subCategoryId",
        foreignField: "_id",
        as: "_subCategory",
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "subSubCategoryId",
        foreignField: "_id",
        as: "_subSubCategory",
      },
    },
    {
      $addFields: {
        category: {
          name: { $arrayElemAt: ["$_category.name", 0] },
        },
        subCategory: {
          name: { $arrayElemAt: ["$_subCategory.name", 0] },
        },
        subSubCategory: {
          name: { $arrayElemAt: ["$_subSubCategory.name", 0] },
        },
      },
    },
    {
      $match: {
        status: { $ne: "deleted" },
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("category.name", searchKeyword),
            searchStr("name", searchKeyword),
            searchNonStr("$purchasePrice", searchKeyword),
            searchNonStr("$unitPrice", searchKeyword),
            searchNonStr("$_id", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        createdAt: 1,
        name: 1,
        thumbnail: 1,
        purchasePrice: 1,
        unitPrice: 1,
        category: 1,
        subCategory: 1,
        subSubCategory: 1,
      },
    },
    {
      $facet: {
        rows: [
          ...(field
            ? [
                {
                  $sort: {
                    [field]: sortOrder,
                  },
                },
              ]
            : []),
          {
            $skip: skip,
          },
          {
            $limit: pageSize,
          },
        ],
        count: [
          {
            $count: "rowCount",
          },
        ],
      },
    },
  ]);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};
