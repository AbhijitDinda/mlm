import mongoose from "mongoose";
import { ClientError, HttpError } from "../../middleware/errors";
import { getTransactionInstance } from "../../models/transaction.model";
import UserModel, { getUserInstance } from "../../models/user.model";
import UserDepositModel, {
  UserDepositRow,
  getDepositInstance,
} from "../../models/userDeposit.model";
import { EmailService } from "../../services/email.service";
import { sendResponse } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import {
  DepositApproveSchemaType,
  DepositRejectSchemaType,
} from "../schemas/deposit.schema";
import { StringSchemaType } from "../schemas/index.schema";
import { DepositTableSchemaType } from "../schemas/table.schema";

export const getDepositHistoryListHandler = async ({
  input,
}: {
  input: DepositTableSchemaType;
}) => {
  const { status, table } = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await UserDepositModel.aggregate([
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
        gateway: "$gateway.name",
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
            searchStr("gateway", searchKeyword),
            searchNonStr("$transactionId", searchKeyword),
            searchNonStr("$amount", searchKeyword),
            searchNonStr("$charge", searchKeyword),
            searchNonStr("$netAmount", searchKeyword),
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
        transactionId: 1,
        amount: 1,
        charge: 1,
        gateway: 1,
        netAmount: 1,
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

export const getDepositDetailHandler = async ({
  input,
}: {
  input: StringSchemaType;
}): Promise<UserDepositRow> => {
  const deposit = await UserDepositModel.findOne({ transactionId: input });
  if (!deposit)
    throw HttpError(`No deposit found with id ${input}`, "NOT_FOUND");
  return deposit;
};

export const approveDepositHandler = async ({
  input,
}: {
  input: DepositApproveSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { message, id } = input;
    const deposit = await getDepositInstance(id);
    const status = deposit.status;
    if (status !== "review")
      throw ClientError("This deposit has processed already");

    deposit.status = "approved";
    deposit.message = message;
    await deposit.save({ session });

    const transaction = await getTransactionInstance(id);
    transaction.status = "credit";
    await transaction.save({ session });

    const { userId } = deposit;
    const User = await getUserInstance(userId);
    await User.checkReactivationPlan(session);

    await session.commitTransaction();

    await EmailService.sendDepositEmail(id);
    return sendResponse("Deposit has been approved");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const rejectDepositHandler = async ({
  input,
}: {
  input: DepositRejectSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { message, id } = input;
    const deposit = await getDepositInstance(id);
    const status = deposit.status;
    if (status !== "review")
      throw ClientError("This deposit has processed already");

    deposit.status = "rejected";
    deposit.message = message;
    await deposit.save({ session });

    const transaction = await getTransactionInstance(id);
    transaction.status = "failed";
    await transaction.save({ session });

    await session.commitTransaction();
    await EmailService.sendDepositEmail(id);
    return sendResponse("Deposit has been rejected");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};
