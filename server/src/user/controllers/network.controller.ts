import crypto from "crypto";
import { UserContext } from "../../context";
import { PlacementSide } from "../../models/schemas/userTree.schema";
import UserModel from "../../models/user.model";
import UserTreeModel from "../../models/userTree.model";
import { formatApiUrl } from "../../utils/fns";
interface User {
  _id: string;
  userId: number;
  referralId: number;
  placementId: number;
  placementSide: PlacementSide;
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
  isPremium: boolean;
  isValid: boolean;
}

export const getGenealogyHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}): Promise<User[]> => {
  const { user } = ctx;
  const { lft, rgt } = await user.populateTree();
  const { userId } = user;

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
        leftId: 1,
        rightId: 1,
        isValid: 1,
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
  rows.forEach((row) => {
    const { leftId, rightId, userId } = row;
    if (!leftId) {
      rows.push({
        id: crypto.randomUUID(),
        parentId: userId,
        userName: "Join Member",
        userId: "Click Here",
        avatar: formatApiUrl("/public/images/add-button.png"),
        placementSide: "left",
        isValid: false,
      });
    }
    if (!rightId) {
      rows.push({
        id: crypto.randomUUID(),
        parentId: userId,
        userName: "Join Member",
        userId: "Click Here",
        avatar: formatApiUrl("/public/images/add-button.png"),
        placementSide: "right",
        isValid: false,
      });
    }
  });

  rows.sort((a, b) => {
    if (a.placementSide < b.placementSide) {
      return -1;
    }
    if (a.placementSide > b.placementSide) {
      return 1;
    }
    if (a.placementSide === "left" && b.placementSide === "left") {
      return a.left - b.left;
    }
    return 0;
  });

  return rows;
};

export const getTreeHandler = async ({ ctx }: { ctx: UserContext }) => {
  const { user } = ctx;
  const { userId } = user;

  async function getUserTree(userId: number) {
    const user = await UserModel.findOne({ userId }).lean();
    if (!user) {
      return null;
    }

    const children = await UserTreeModel.find({ placementId: user.userId })
      .sort({ lft: 1 })
      .lean();

    const result = {
      userId: user.userId,
      userName: user.userName,
      children: [] as { userId: number; userName: string }[],
    };

    for (const child of children) {
      const subtree = await getUserTree(child.userId);
      if (subtree) {
        result.children.push(subtree);
      }
    }

    return result;
  }

  const rows = await getUserTree(userId);
  return rows;
};
