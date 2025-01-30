import { UserContext } from "../../context";
import UserTreeModel from "../../models/userTree.model";
import { DataTableSchemaType } from "../schemas/table.schema";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";

export const getMyReferralListHandler = async ({
  input,
  ctx,
}: {
  input: DataTableSchemaType;
  ctx: UserContext;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;

  const { user } = ctx;
  const { userId } = user;
  const { level } = await user.populateTree();
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
        level: { $subtract: ["$level", level] },
        displayName: {
          $concat: [
            { $arrayElemAt: ["$user.firstName", 0] },
            " ",
            { $arrayElemAt: ["$user.lastName", 0] },
          ],
        },
        createdAt: { $arrayElemAt: ["$user.createdAt", 0] },
      },
    },
    {
      $match: {
        referralId: userId,
        ...(searchKeyword && {
          $or: [
            searchStr("user.createdAt", searchKeyword),
            searchStr("user.avatar", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.kyc", searchKeyword),
            searchStr("user.status", searchKeyword),
            searchStr("user.userName", searchKeyword),
            searchNonStr("$level", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchDate("$createdAt", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        myLevel: 1,
        referralId: 1,
        userId: 1,
        level: 1,
        displayName: 1,
        createdAt: { $arrayElemAt: ["$user.createdAt", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        kyc: { $arrayElemAt: ["$user.kyc", 0] },
        status: { $arrayElemAt: ["$user.status", 0] },
        isPremium: { $arrayElemAt: ["$user.isPremium", 0] },
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

  const data = await UserTreeModel.aggregate(pipeline);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};
