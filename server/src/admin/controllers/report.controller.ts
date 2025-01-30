import dayjs from "dayjs";
import { TransactionType } from "../../models/schemas/transaction.schema";
import TransactionModel, {
  TransactionRow,
  getTransactionInstance,
} from "../../models/transaction.model";
import UserModel from "../../models/user.model";
import UserDepositModel, {
  UserDepositInsert,
  UserDepositRow,
} from "../../models/userDeposit.model";
import UserIndirectRewardModel from "../../models/userIndirectReward.model";
import UserPairIncomeModel from "../../models/userPairIncome.model";
import UserReferralIncomeModel from "../../models/userReferralIncome.model";
import UserTreeModel from "../../models/userTree.model";
import UserWithdrawModel, {
  UserWithdrawInsert,
  UserWithdrawRow,
} from "../../models/userWithdraw.model";
import { DataTableSchemaType } from "../../user/schemas/table.schema";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { ModelMatch, _ModelColumn } from "../../utils/types";
import { AnalyticSchemaType } from "../schemas/analytics.schema";
import { StringSchemaType } from "../schemas/index.schema";

/**
 * --
 */
export const joiningHandler = async ({
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

  const data = await UserModel.aggregate([
    {
      $lookup: {
        from: UserTreeModel.collection.name,
        localField: "userId",
        foreignField: "userId",
        as: "tree",
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: ["$firstName", " ", "$lastName"],
        },
      },
    },
    {
      $match: {
        ...(searchKeyword && {
          $or: [
            searchStr("email", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("userName", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchStr("tree.placement", searchKeyword),
            searchStr("tree.placementSide", searchKeyword),
            searchDate("$createdAt", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        email: 1,
        userName: 1,
        userId: 1,
        avatar: 1,
        referralId: { $arrayElemAt: ["$tree.referralId", 0] },
        placementId: { $arrayElemAt: ["$tree.placementId", 0] },
        placement: { $arrayElemAt: ["$tree.placementSide", 0] },
        displayName: 1,
        createdAt: 1,
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

/**
 * --
 */
export const transactionListHandler = async ({
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

  const data = await TransactionModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: ["$firstName", " ", "$lastName"],
        },
      },
    },
    {
      $match: {
        ...(searchKeyword && {
          $or: [
            searchDate("$updatedAt", searchKeyword),
            searchDate("$createdAt", searchKeyword),
            searchStr("description", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$_id", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        amount: 1,
        charge: 1,
        netAmount: 1,
        status: 1,
        userId: 1,
        category: 1,
        description: 1,
        email: { $arrayElemAt: ["$user.email", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        displayName: 1,
        createdAt: 1,
        updatedAt: 1,
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

/**
 * --
 */
export const transactionHandler = async ({
  input,
}: {
  input: StringSchemaType;
}): Promise<TransactionRow> => {
  const transactionId = input;
  const transaction = await getTransactionInstance(transactionId);
  return transaction;
};

/**
 * --
 */
export const referralIncomeHandler = async ({
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

  const data = await UserReferralIncomeModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "referralId",
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
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$referralId", searchKeyword),
            searchNonStr("$referralIncome", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        userId: 1,
        referralId: 1,
        referralIncome: 1,
        email: { $arrayElemAt: ["$user.email", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        displayName: 1,
        createdAt: 1,
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

/**
 * --
 */
export const topSponsorHandler = async ({
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

  const data = await UserModel.aggregate([
    {
      $lookup: {
        from: UserReferralIncomeModel.collection.name,
        localField: "userId",
        foreignField: "referralId",
        as: "referral",
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: ["$firstName", " ", "$lastName"],
        },
        referrals: { $size: "$referral" },
      },
    },
    {
      $match: {
        referrals: { $gt: 0 },
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$referrals", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("email", searchKeyword),
            searchStr("userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        avatar: 1,
        createdAt: 1,
        email: 1,
        userId: 1,
        userName: 1,
        displayName: 1,
        referrals: 1,
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

/**
 * --
 */
export const topEarnerHandler = async ({
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

  const earning: TransactionType[] = [
    "referral_income",
    "pair_income",
    "indirect_reward",
  ];
  const data = await UserModel.aggregate([
    {
      $lookup: {
        from: TransactionModel.collection.name,
        localField: "userId",
        foreignField: "userId",
        as: "transactions",
      },
    },
    {
      $unwind: {
        path: "$transactions",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: ["$firstName", " ", "$lastName"],
        },
        earning: { $sum: "$transactions.netAmount" },
      },
    },
    {
      $match: {
        "transactions.category": { $in: earning },
        earning: { $gt: 0 },
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$earning", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("email", searchKeyword),
            searchStr("userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $group: {
        _id: "$userId",
        userId: { $first: "$userId" },
        avatar: { $first: "$avatar" },
        createdAt: { $first: "$createdAt" },
        email: { $first: "$email" },
        userName: { $first: "$userName" },
        displayName: { $first: "$displayName" },
        earning: {
          $sum: "$earning",
        },
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

/**
 * --
 */
export const pairIncomeHandler = async ({
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

  const data = await UserPairIncomeModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
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
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$pairIncome", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        userId: 1,
        pairIncome: 1,
        transactionId: 1,
        email: { $arrayElemAt: ["$user.email", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        displayName: 1,
        createdAt: 1,
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

/**
 * --
 */
export const indirectRewardHandler = async ({
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

  const data = await UserIndirectRewardModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
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
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$indirectReward", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchNonStr("$agentId", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        userId: 1,
        agentId: 1,
        indirectReward: 1,
        transactionId: 1,
        email: { $arrayElemAt: ["$user.email", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        displayName: 1,
        createdAt: 1,
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

export namespace analyticsHandler {
  const getJoiningCount = async (startDate: Date, endDate: Date) => {
    const users = await UserModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return users;
  };
  const getDepositCount = async (startDate: Date, endDate: Date) => {
    const status: UserDepositInsert["status"][] = ["approved", "credit"];

    const sumColumn: _ModelColumn<UserDepositInsert> = "$amount";
    const match: ModelMatch<UserDepositRow> = {
      status: { $in: status },
      createdAt: { $gte: startDate, $lte: endDate },
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };
  const getWithdrawCount = async (startDate: Date, endDate: Date) => {
    const status: UserWithdrawInsert["status"] = "success";

    const sumColumn: _ModelColumn<UserWithdrawRow> = "$netAmount";
    const match: ModelMatch<UserWithdrawRow> = {
      status,
      createdAt: { $gte: startDate, $lte: endDate },
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const getAnalyticData = async ({
    fn,
    input,
  }: {
    fn: (sDate: Date, eDate: Date) => Promise<number>;
    input: AnalyticSchemaType;
  }) => {
    const { startDate: _startDate, endDate: _endDate, offset } = input;

    const startDate = dayjs(_startDate)
      .add(-offset * 60, "seconds")
      .utc()
      .startOf("day")
      .add(offset * 60, "seconds");
    const endDate = dayjs(_endDate)
      .add(-offset * 60, "seconds")
      .utc()
      .startOf("day")
      .add(offset * 60, "seconds");

    const values: number[] = [];
    const categories: string[] = [];

    let fromDate = startDate;
    const toDate = endDate.add(1, "day");

    do {
      const sDate = fromDate.toDate();
      const eDate = dayjs(fromDate)
        .add(1, "day")
        .subtract(1, "second")
        .toDate();
      const value = await fn(sDate, eDate);

      values.push(value);

      categories.push(fromDate.toISOString());
      fromDate = fromDate.add(1, "day");
    } while (fromDate.isBefore(toDate, "day"));

    return { values, categories };
  };

  export const registration = async ({
    input,
  }: {
    input: AnalyticSchemaType;
  }) => {
    const { values, categories } = await getAnalyticData({
      input,
      fn: getJoiningCount,
    });
    return { values, categories };
  };

  export const withdraw = async ({ input }: { input: AnalyticSchemaType }) => {
    const { values, categories } = await getAnalyticData({
      input,
      fn: getWithdrawCount,
    });
    return { values, categories };
  };

  export const deposit = async ({ input }: { input: AnalyticSchemaType }) => {
    const { values, categories } = await getAnalyticData({
      input,
      fn: getDepositCount,
    });
    return { values, categories };
  };
}
