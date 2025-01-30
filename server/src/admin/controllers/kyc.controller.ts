import mongoose from "mongoose";
import { ClientError } from "../../middleware/errors";
import UserModel, {
  getUserInstance
} from "../../models/user.model";
import UserKycModel, {
  getUserKycInstance, UserKycRow
} from "../../models/userKyc.model";
import { UserServices } from "../../services/user.service";
import { sendResponse } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { RejectKycSchemaType } from "../schemas/kyc.schema";
import { UserKycTableSchemaType } from "../schemas/table.schema";

/**
 * get kyc list table
 */
export const getKycListHandler = async ({
  input,
}: {
  input: UserKycTableSchemaType;
}) => {
  const { status, table } = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await UserKycModel.aggregate([
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
        ...(status !== "all" && {
          status: status,
        }),
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchDate("$updatedAt", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        userId: 1,
        userName: { $arrayElemAt: ["$user.userName", 0] },
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        displayName: 1,
        updatedAt: 1,
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

export const getKycDetailHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  // type Output = UserKycRow & { user: UserRow };

  const id = input;
  const kyc = <UserKycRow>await getUserKycInstance(id);
  const userId = kyc.userId;
  const user = await UserServices.getUserProfileDetails(userId);
  return { kyc, user };
};

export const approveKycHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id = input;
    const kyc = await getUserKycInstance(id);
    const status = kyc.status;
    if (status !== "pending")
      throw ClientError("The kyc has processed already");
    kyc.status = "approved";
    await kyc.save({ session });

    const userId = kyc.userId;
    const user = await getUserInstance(userId);
    user.kyc = "approved";
    await user.save({ session });

    await session.commitTransaction();
    return sendResponse("Kyc has been approved");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const rejectKycHandler = async ({
  input,
}: {
  input: RejectKycSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { message, id } = input;
    const kyc = await getUserKycInstance(id);
    const status = kyc.status;
    if (status !== "pending")
      throw ClientError("The kyc has processed already");
    kyc.status = "rejected";
    kyc.message = message;
    await kyc.save({ session });

    const userId = kyc.userId;
    const user = await getUserInstance(userId);
    user.kyc = "rejected";
    await user.save({ session });

    await session.commitTransaction();
    return sendResponse("Kyc has been rejected");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};
