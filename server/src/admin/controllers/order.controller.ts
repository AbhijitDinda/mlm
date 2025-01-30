import OrderModel from "../../models/order.model";
import ProductModel from "../../models/product.model";
import UserModel from "../../models/user.model";
import { OrderService } from "../../services/order.service";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { DataTableSchemaType } from "../schemas/table.schema";

export const getOrdersListHandler = async ({
  input,
}: {
  input: DataTableSchemaType;
}) => {
  const table = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await OrderModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    {
      $lookup: {
        from: ProductModel.collection.name,
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: [
            { $arrayElemAt: ["$user.firstName", 0] },
            " ",
            { $arrayElemAt: ["$user.lastName", 0] },
          ],
        },
        product: {
          name: { $arrayElemAt: ["$product.name", 0] },
          _id: { $arrayElemAt: ["$product._id", 0] },
          thumbnail: { $arrayElemAt: ["$product.thumbnail", 0] },
        },
      },
    },
    {
      $match: {
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$unitPrice", searchKeyword),
            searchNonStr("$purchasePrice", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
            searchStr("product.name", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        unitPrice: 1,
        purchasePrice: 1,
        transactionId: 1,
        userId: 1,
        email: { $arrayElemAt: ["$user.email", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        displayName: 1,
        createdAt: 1,
        product: { $arrayElemAt: ["$product", 0] },
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

export const getOrderCardsHandler = async () => {
  const totalSold = await OrderService.totalSold();
  const premiumSold = await OrderService.premiumSold();
  const freeSold = await OrderService.freeSold();
  const earning = await OrderService.earning();

  return {
    totalSold,
    premiumSold,
    freeSold,
    earning,
  };
};
