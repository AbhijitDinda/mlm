import mongoose from "mongoose";
import { ClientError } from "../../middleware/errors";
import CategoryModel, {
  CategoryInsert,
  CategoryUpdate,
  getCategoryInstance,
} from "../../models/category.model";
import ProductModel, { ProductRow } from "../../models/product.model";
import { sendResponse, toObjectId } from "../../utils/fns";
import { searchNonStr, searchStr } from "../../utils/mongo";
import { ModelFind } from "../../utils/types";
import { ChooseCategorySchemaType } from "../schemas/category.schema";
import { StringSchemaType } from "../schemas/index.schema";
import {
  CategoryTblSchemaType,
  CreateCategorySchemaType,
} from "../schemas/product.schema";

export const getCategoriesList = async ({
  input,
}: {
  input: CategoryTblSchemaType;
}) => {
  const { query: table, level } = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;

  const { field, sort } = sortModel?.[0] ?? {};
  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const filter = {
    level,
    ...(searchKeyword && {
      $or: [
        searchStr("name", searchKeyword),
        searchStr("status", searchKeyword),
        searchStr("parent.name", searchKeyword),
        searchStr("subParent.name", searchKeyword),
        searchNonStr("$subcategories", searchKeyword),
      ],
    }),
  };

  const data = await CategoryModel.aggregate([
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "_id",
        foreignField: "categoryId",
        as: "children",
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "_id",
        foreignField: "subCategoryId",
        as: "subChildren",
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "categoryId",
        foreignField: "_id",
        as: "_parent",
      },
    },
    {
      $lookup: {
        from: CategoryModel.collection.name,
        localField: "subCategoryId",
        foreignField: "_id",
        as: "_subParent",
      },
    },
    {
      $addFields: {
        subCategories: {
          $size: {
            $filter: {
              input: "$children",
              as: "child",
              cond: { $not: { $ifNull: ["$$child.subCategoryId", false] } },
            },
          },
        },
        subSubCategories: { $size: "$subChildren" },
        parent: {
          name: { $arrayElemAt: ["$_parent.name", 0] },
        },
        subParent: {
          name: { $arrayElemAt: ["$_subParent.name", 0] },
        },
      },
    },
    {
      $match: filter,
    },
    {
      $project: {
        name: 1,
        image: 1,
        status: 1,
        level: 1,
        children: 1,
        subCategories: 1,
        subSubCategories: 1,
        parent: 1,
        subParent: 1,
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

export const createCategoryHandler = async ({
  input,
}: {
  input: CreateCategorySchemaType;
}) => {
  const { categoryId, subCategoryId, _id, name, status, image, level } = input;

  let message: string;
  let installDoc: CategoryInsert;

  if (level === 1) {
    installDoc = {
      name,
      status,
      image,
      level,
    };
  } else if (level === 2) {
    if (!categoryId) throw ClientError("Category is required");
    await getCategoryInstance(categoryId);
    installDoc = {
      categoryId: toObjectId(categoryId),
      name,
      status,
      image,
      level,
    };
  } else if (level === 3) {
    if (!categoryId) throw ClientError("Category is required");
    if (!subCategoryId) throw ClientError("Sub Category is required");
    await getCategoryInstance(categoryId);
    const subCategory = await getCategoryInstance(subCategoryId);

    if (subCategory.categoryId?.toString() !== categoryId)
      throw ClientError("Category is mismatch");

    installDoc = {
      categoryId: toObjectId(categoryId),
      subCategoryId: toObjectId(subCategoryId),
      name,
      status,
      image,
      level,
    };
  } else {
    throw ClientError("Maximum level must be 3");
  }

  if (_id) {
    await getCategoryInstance(_id);
    await CategoryModel.findByIdAndUpdate(_id, {
      $set: {
        name,
        status,
        image,
      },
    });
    message = "Category has been updated";
  } else {
    await CategoryModel.create(installDoc);
    message = "Category has been created";
  }

  return sendResponse(message);
};

export const getCategoryDataHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  const category = await getCategoryInstance(id);
  return category;
};

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

export const deleteCategoryHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = input;
    await CategoryModel.deleteMany(
      {
        $or: [{ _id: id }, { categoryId: id }, { subCategoryId: id }],
      },
      {
        session,
      }
    );

    const productSet: ModelFind<ProductRow> = {
      status: "deleted",
    };
    await ProductModel.updateMany(
      {
        $or: [
          { categoryId: id },
          { subCategoryId: id },
          { subSubCategoryId: id },
        ],
      },
      {
        $set: productSet,
      },
      { session }
    );

    await session.commitTransaction();
    return sendResponse("Category has been deleted");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
