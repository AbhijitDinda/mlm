import { Details } from "express-useragent";
import mongoose from "mongoose";
import { AdminContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import KycFormModel, { KycFormRow } from "../../models/kycForm.model";
import { TransactionInsert } from "../../models/transaction.model";
import UserModel, { getUserInstance } from "../../models/user.model";
import UserDepositModel, {
  UserDepositInsert,
} from "../../models/userDeposit.model";
import UserTreeModel from "../../models/userTree.model";
import UserWithdrawModel, {
  UserWithdrawInsert,
} from "../../models/userWithdraw.model";
import { createTransactionDocument } from "../../services/transaction.service";
import { UserServices } from "../../services/user.service";
import { fCurrency, sendResponse, signJwt } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { NumberSchemaType } from "../schemas/index.schema";
import { UserTableSchemaType } from "../schemas/table.schema";
import {
  ChangeStatusUserSchemaType,
  DepositSchemaType,
  UpdateProfileSchemaType,
  WithdrawSchemaType,
} from "../schemas/user.schema";

export const getUserListHandler = async ({
  input,
}: {
  input: UserTableSchemaType;
}) => {
  const { status, table } = input;
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
        placementId: { $arrayElemAt: ["$tree.placementId", 0] },
        referralId: { $arrayElemAt: ["$tree.referralId", 0] },
        placement: { $arrayElemAt: ["$tree.placementSide", 0] },
      },
    },
    {
      $match: {
        ...(status !== "all" && {
          status: status,
        }),
        ...(searchKeyword && {
          $or: [
            searchStr("email", searchKeyword),
            searchStr("kyc", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("userName", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchStr("placement", searchKeyword),
            searchNonStr("$level", searchKeyword),
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$referralId", searchKeyword),
            searchNonStr("$placementId", searchKeyword),
            searchStr("tree.placementSide", searchKeyword),
            searchDate("$createdAt", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        kyc: 1,
        isPremium: 1,
        email: 1,
        userName: 1,
        userId: 1,
        avatar: 1,
        level: { $arrayElemAt: ["$tree.level", 0] },
        referralId: 1,
        placementId: 1,
        placement: 1,
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

export const getUserProfileHandler = async ({
  input,
}: {
  input: NumberSchemaType;
}) => {
  const userId = input;
  const user = await UserServices.getUserProfileDetails(userId);
  return user;
};

export const updateUserProfileHandler = async ({
  input,
}: {
  input: UpdateProfileSchemaType;
}) => {
  const { userId, firstName, lastName, kyc } = input;
  const user = await getUserInstance(userId);
  const kycData = <KycFormRow[]>await KycFormModel.find();

  kycData.forEach((list) => {
    const { _id, label } = list;
    if (!kyc[_id.toString()])
      throw ClientError(`Missing ${label} from kyc details`);
  });

  user.firstName = firstName;
  user.lastName = lastName;
  user.kycDetails = kyc;
  await user.save();
  return sendResponse("Profile details has been updated");
};

export const updateUserStatusHandler = async ({
  input,
}: {
  input: ChangeStatusUserSchemaType;
}) => {
  const { userId, status } = input;
  const user = await getUserInstance(userId);
  if (user.isAdmin()) throw ClientError("You can't block an administrator");
  const userStatus = user.status;

  let message: string;
  if (status === "active") message = "User has been blocked";
  else message = "User has been unlocked";
  const updateStatus = status === "active" ? "blocked" : "active";
  if (status === userStatus) {
    user.status = updateStatus;
    await user.save();
  }
  return sendResponse(message);
};

export const addBalanceHandler = async ({
  ctx,
  input,
}: {
  ctx: AdminContext;
  input: DepositSchemaType;
}) => {
  const { admin } = ctx;
  const { avatar: logo = "" } = admin;
  const name = admin.getDisplayName();

  const { message, userId, amount } = input;
  const user = await getUserInstance(userId);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create transaction
    const transactionDoc: TransactionInsert = {
      userId,
      amount,
      charge: 0,
      netAmount: amount,
      category: "deposit",
      description: "deposit",
      status: "credit",
    };
    const transaction = await createTransactionDocument(
      transactionDoc,
      session
    );

    const gateway: UserDepositInsert["gateway"] = {
      name,
      logo,
      charge: 0,
      chargeType: "fixed",
    };

    // create deposit
    const depositDoc: UserDepositInsert = {
      transactionId: transaction._id,
      userId,
      user: user._id,
      amount,
      charge: 0,
      netAmount: amount,
      actionBy: "admin",
      currency: "$",
      gateway,
      status: "credit",
      type: "manual",
      message,
    };
    const deposit = new UserDepositModel(depositDoc);
    await deposit.save({ session });

    // check for reactivation
    await user.checkReactivationPlan(session);

    await session.commitTransaction();

    const amountText = await fCurrency(amount);
    return sendResponse(`${amountText} has been deposit to ${userId}`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const withdrawBalanceHandler = async ({
  ctx,
  input,
}: {
  ctx: AdminContext;
  input: WithdrawSchemaType;
}) => {
  const { admin } = ctx;
  const { avatar: logo = "" } = admin;
  const name = admin.getDisplayName();

  const { message, userId, amount } = input;
  const user = await getUserInstance(userId);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create transaction
    const transactionDoc: TransactionInsert = {
      userId,
      amount,
      charge: 0,
      netAmount: amount,
      category: "withdraw",
      description: "withdraw",
      status: "debit",
    };
    const transaction = await createTransactionDocument(
      transactionDoc,
      session
    );

    const gateway: UserDepositInsert["gateway"] = {
      name,
      logo,
      charge: 0,
      chargeType: "fixed",
    };

    // create deposit
    const withdrawDoc: UserWithdrawInsert = {
      transactionId: transaction._id,
      userId,
      user: user._id,
      amount,
      charge: 0,
      netAmount: amount,
      actionBy: "admin",
      gateway,
      status: "success",
      message,
    };
    const withdraw = new UserWithdrawModel(withdrawDoc);
    await withdraw.save({ session });
    await session.commitTransaction();

    const amountText = await fCurrency(amount);
    return sendResponse(`${amountText} has been withdraw from ${userId}`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getUserLoginTokenHandler = async ({
  input,
  ip,
  userAgent,
}: {
  input: NumberSchemaType;
  ip: string;
  userAgent?: Details;
}) => {
  const userId = input;
  const token = signJwt(userId, false);
  await UserServices.createUserLoginSession({
    userId,
    token,
    ip,
    remember: false,
    userAgent,
    agent: "admin",
  });

  return sendResponse("Login successful", {
    accessToken: token,
  });
};
