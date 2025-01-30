import mongoose from "mongoose";
import { ClientError, HttpError } from "../../middleware/errors";
import { getTransactionInstance } from "../../models/transaction.model";
import UserModel from "../../models/user.model";
import UserWithdrawModel, {
  getWithdrawInstance,
  UserWithdrawRow
} from "../../models/userWithdraw.model";
import { EmailService } from "../../services/email.service";
import { sendResponse } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { WithdrawTableSchemaType } from "../schemas/table.schema";
import {
  WithdrawApproveSchemaType,
  WithdrawRejectSchemaType
} from "../schemas/withdraw.schema";

export const getWithdrawListHandler = async ({
  input,
}: {
  input: WithdrawTableSchemaType;
}) => {
  const { status, table } = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await UserWithdrawModel.aggregate([
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

export const getWithdrawDetailHandler = async ({
  input,
}: {
  input: StringSchemaType;
}): Promise<UserWithdrawRow> => {
  const withdraw = await UserWithdrawModel.findOne({ transactionId: input });
  if (!withdraw)
    throw HttpError(`No withdraw found with id ${input}`, "NOT_FOUND");
  return withdraw;
};

export const approveWithdrawHandler = async ({
  input,
}: {
  input: WithdrawApproveSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { message, id } = input;
    const withdraw = await getWithdrawInstance(id);
    const status = withdraw.status;
    if (status !== "pending")
      throw ClientError("This withdraw has processed already");

    withdraw.status = "success";
    withdraw.message = message;
    await withdraw.save({ session });

    const transaction = await getTransactionInstance(id);
    transaction.status = "debit";
    await transaction.save({ session });

    await session.commitTransaction();

    await EmailService.sendWithdrawEmail(id);
    return sendResponse("Withdraw has been approved");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const rejectWithdrawHandler = async ({
  input,
}: {
  input: WithdrawRejectSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { message, id } = input;
    const withdraw = await getWithdrawInstance(id);
    const status = withdraw.status;
    if (status !== "pending")
      throw ClientError("This withdraw has processed already");

    withdraw.status = "rejected";
    withdraw.message = message;
    await withdraw.save({ session });

    const transaction = await getTransactionInstance(id);
    transaction.status = "failed";
    await transaction.save({ session });

    await session.commitTransaction();
    await EmailService.sendWithdrawEmail(id);
    return sendResponse("Withdraw has been rejected");
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};
