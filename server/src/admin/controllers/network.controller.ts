import { AdminContext } from "../../context";
import UserTreeModel from "../../models/userTree.model";

interface User {
  _id: string;
  userId: number;
  referralId: number;
  placementId: number;
  placementSide: string;
  leftCount: number;
  rightCount: number;
  leftId: number;
  rightId: number;
  id: number;
  parentId: number;
  firstName: string;
  displayName: string;
  lastName: string;
  email: string;
  avatar?: string;
  userName: string;
  createdAt: string;
  status: string;
  kyc: string;
  canAddMember: boolean;
  isPremium: boolean;
  isValid: boolean;
}

export const getGenealogyHandler = async ({
  ctx,
}: {
  ctx: AdminContext;
}): Promise<User[]> => {
  const { admin } = ctx;
  const { lft, rgt } = await admin.populateTree();
  const { userId } = admin;

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
        isValid: true,
        canAddMember: {
          $cond: {
            if: {
              $and: [{ $gt: ["$leftId", 0] }, { $gt: ["$rightId", 0] }],
            },
            then: false,
            else: true,
          },
        },
      },
    },
    {
      $match: {
        lft: { $gte: lft },
        rgt: { $lte: rgt },
      },
    },
    {
      $project: {
        userId: 1,
        id: "$userId",
        placementSide: 1,
        leftCount: 1,
        rightCount: 1,
        placementId: 1,
        referralId: 1,
        canAddMember: 1,
        leftId: 1,
        rightId: 1,
        isValid: true,
        parentId: {
          $cond: {
            if: { $eq: ["$userId", userId] },
            then: null,
            else: "$placementId",
          },
        },
        firstName: { $arrayElemAt: ["$user.firstName", 0] },
        displayName: {
          $concat: [
            { $arrayElemAt: ["$user.firstName", 0] },
            " ",
            { $arrayElemAt: ["$user.lastName", 0] },
          ],
        },
        lastName: { $arrayElemAt: ["$user.lastName", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        createdAt: { $arrayElemAt: ["$user.createdAt", 0] },
        status: { $arrayElemAt: ["$user.status", 0] },
        kyc: { $arrayElemAt: ["$user.kyc", 0] },
        isPremium: { $arrayElemAt: ["$user.isPremium", 0] },
      },
    },
  ];

  const rows = await UserTreeModel.aggregate(pipeline);
  return rows;
};
