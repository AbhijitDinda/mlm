import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { UserContext } from "../../context";
import { ClientError, NOtFoundError } from "../../middleware/errors";
import CategoryModel from "../../models/category.model";
import OrderModel, {
  OrderInsert,
  getOrderInstance,
} from "../../models/order.model";
import ProductModel, {
  ProductRow,
  getProductInstance,
} from "../../models/product.model";
import { TransactionInsert } from "../../models/transaction.model";
import { OrderService } from "../../services/order.service";
import { createTransactionDocument } from "../../services/transaction.service";
import { fCurrency, sendResponse, toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { GetProductListSchemaType } from "../schemas/product.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

type Product = {
  _id: string;
  name: string;
  purchasePrice: number;
  unitPrice: number;
  thumbnail: string;
};

export const getProductsListHandler = async ({
  input,
}: {
  input: GetProductListSchemaType;
}): Promise<{ rowCount: number; rows: Product[] }> => {
  const {
    pageIndex,
    sort,
    search,
    pageSize: _pageSize,
    category,
    subCategory,
    subSubCategory,
  } = input;

  const pageSize = Math.min(_pageSize, 100);
  const skip = pageIndex * pageSize;
  const searchKeyword = search;

  let sortField;
  let sortOrder: 1 | -1 = 1 as const;
  switch (sort) {
    case "priceAsc":
      sortField = "purchasePrice";
      sortOrder = 1;
      break;
    case "priceDesc":
      sortField = "purchasePrice";
      sortOrder = -1;
      break;
    case "newest":
      sortField = "createdAt";
      sortOrder = -1;
      break;
    case "featured":
      sortField = "createdAt";
      sortOrder = 1;
      break;
    case "free":
      break;
  }

  const data = await ProductModel.aggregate([
    {
      $match: {
        ...(category && searchNonStr("$categoryId", category)),
        ...(subCategory && searchNonStr("$subCategoryId", subCategory)),
        ...(subSubCategory &&
          searchNonStr("$subSubCategoryId", subSubCategory)),
        ...(sort === "free" && {
          purchasePrice: 0,
        }),
        status: "active",
        ...(searchKeyword && {
          $or: [
            searchStr("name", searchKeyword),
            searchNonStr("$unitPrice", searchKeyword),
            searchNonStr("$purchasePrice", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        unitPrice: 1,
        purchasePrice: 1,
        name: 1,
        thumbnail: 1,
        createdAt: 1,
      },
    },
    {
      $facet: {
        rows: [
          ...(sortField
            ? [
                {
                  $sort: {
                    [sortField]: sortOrder,
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

type ProductOutputRow = ProductRow & {
  categoryId: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subCategoryId?: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  subSubCategory?: {
    _id: string;
    name: string;
  };
  subSubCategoryId?: {
    _id: string;
    name: string;
  };
  download: {
    status: boolean;
    id?: string;
  };
};

export const getProductHandler = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}): Promise<ProductOutputRow> => {
  const {
    user: { userId },
  } = ctx;

  const _id = toObjectId(input);
  const product = await ProductModel.findById(_id)
    .populate({
      path: "categoryId",
      model: CategoryModel,
      select: "name",
    })
    .populate({
      path: "subCategoryId",
      model: CategoryModel,
      select: "name",
    })
    .populate({
      path: "subSubCategoryId",
      model: CategoryModel,
      select: "name",
    });

  if (!product || product.isDeleted())
    throw NOtFoundError(`Product not found with id ${_id}`);

  const download = await OrderService.hasUserPurchased({
    userId,
    productId: _id,
  });

  const productJson = <ProductOutputRow>product.toObject();

  productJson.category = productJson.categoryId;
  productJson.subCategory = productJson.subCategoryId;
  productJson.subSubCategory = productJson.subSubCategoryId;

  return { ...productJson, download };
};

export const purchaseProductHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;

  const download = await OrderService.hasUserPurchased({
    userId,
    productId: toObjectId(input),
  });
  if (download.status) return sendResponse(`Product has been purchased`);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await getProductInstance(input);
    if (product.isDeleted())
      throw NOtFoundError(`Product not found with id ${input}`);

    const { name, unitPrice, purchasePrice, _id: productId } = product;

    const wallet = await user.wallet();
    const walletText = await fCurrency(wallet);

    if (purchasePrice > wallet)
      throw ClientError(
        `Insufficient Balance. You have only ${walletText} in your wallet`
      );

    // create transaction
    const transactionDoc: TransactionInsert = {
      userId,
      amount: purchasePrice,
      charge: 0,
      netAmount: purchasePrice,
      category: "product",
      status: "debit",
      description: "purchased e-book",
    };
    const transaction = await createTransactionDocument(
      transactionDoc,
      session
    );
    const transactionId = transaction._id;

    // insert order
    const orderDoc: OrderInsert = {
      userId,
      productId,
      transactionId,
      purchasePrice,
      unitPrice,
    };
    const order = new OrderModel(orderDoc);
    await order.save({ session });

    await session.commitTransaction();
    return sendResponse(`${name} has been purchased`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOrdersHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await OrderModel.aggregate([
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "productId",
        foreignField: "_id",
        as: "_product",
      },
    },
    {
      $addFields: {
        product: {
          name: { $arrayElemAt: ["$_product.name", 0] },
          _id: { $arrayElemAt: ["$_product._id", 0] },
          thumbnail: { $arrayElemAt: ["$_product.thumbnail", 0] },
          file: { $arrayElemAt: ["$_product.file", 0] },
          status: { $arrayElemAt: ["$_product.status", 0] },
        },
      },
    },
    {
      $match: {
        userId,
        ...(searchKeyword && {
          $or: [
            searchStr("_product.name", searchKeyword),
            searchDate("$createdAt", searchKeyword),
            searchNonStr("$unitPrice", searchKeyword),
            searchNonStr("$purchasePrice", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        unitPrice: 1,
        purchasePrice: 1,
        transactionId: 1,
        createdAt: 1,
        product: 1,
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

export const downloadProductHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}) => {
  const {
    user: { userId },
  } = ctx;

  const id = input;
  const order = await getOrderInstance(id);
  const { userId: downloadUserId, productId } = order;
  if (userId !== downloadUserId) throw NOtFoundError("Transaction not found");
  const product = await getProductInstance(productId.toString());
  const { file } = product;

  const filePath = path.join(__dirname, `../../../${file}`);
  const ifFileExists = fs.existsSync(filePath);
  if (ifFileExists) {
    return ctx.res.download(filePath);
  } else {
  }

  // // Set the response headers to indicate that we're sending a PDF file
  // ctx.res.setHeader("Content-Type", "application/pdf");
  // ctx.res.setHeader(
  //   "Content-Disposition",
  //   `attachment; filename=${productId}.pdf`
  // );

  // // Stream the PDF data to the response object
  // ctx.res.write(file);
  // ctx.res.end();
};
