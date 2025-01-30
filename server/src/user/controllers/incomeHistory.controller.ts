import { UserContext } from "../../context";
import UserIndirectRewardModel from "../../models/userIndirectReward.model";
import UserPairIncomeModel from "../../models/userPairIncome.model";
import UserReferralIncomeModel from "../../models/userReferralIncome.model";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { DataTableSchemaType } from "../schemas/table.schema";

/**
 * -
 */
export const getReferralIncomeListHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;

  const { user } = ctx;
  const { userId } = user;
  const searchKeyword = searchFilter;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "userId",
        as: "user",
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
      },
    },
    {
      $match: {
        referralId: userId,
        ...(searchKeyword && {
          $or: [
            searchStr("user.userName", searchKeyword),
            searchDate("$createdAt", searchKeyword),
            searchStr("status", searchKeyword),
            searchNonStr("$referralIncome", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchStr("displayName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        userId: 1,
        status: 1,
        displayName: 1,
        referralIncome: 1,
        createdAt: 1,
        transactionId: 1,
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
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
  ];

  const data = await UserReferralIncomeModel.aggregate(pipeline);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};

/**
 * -
 */
export const getPairIncomeListHandler = async ({
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

  const filter = {
    userId,
    ...(searchKeyword && {
      $or: [
        searchStr("status", searchKeyword),
        searchDate("$createdAt", searchKeyword),
        searchNonStr("$transactionId", searchKeyword),
        searchNonStr("$amount", searchKeyword),
      ],
    }),
  };
  const query = UserPairIncomeModel.find(filter);
  const rowCount = await UserPairIncomeModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

/**
 * -
 */
export const getIndirectRewardListHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;

  const { user } = ctx;
  const { userId } = user;
  const searchKeyword = searchFilter;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "agentId",
        foreignField: "userId",
        as: "user",
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
      },
    },
    {
      $match: {
         userId,
        ...(searchKeyword && {
          $or: [
            searchStr("user.userName", searchKeyword),
            searchDate("$createdAt", searchKeyword),
            searchStr("status", searchKeyword),
            searchNonStr("$referralIncome", searchKeyword),
            searchNonStr("$agentId", searchKeyword),
            searchNonStr("$indirectReward", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchStr("displayName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        userId: 1,
        status: 1,
        displayName: 1,
        agentId: 1,
        indirectReward: 1,
        referralIncome: 1,
        createdAt: 1,
        transactionId: 1,
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
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
  ];

  const data = await UserIndirectRewardModel.aggregate(pipeline);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};
