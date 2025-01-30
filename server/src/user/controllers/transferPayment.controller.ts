import mongoose, { Types } from "mongoose";
import { UserContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import PaymentTransferModel, {
  PaymentTransferInsert,
} from "../../models/paymentTransfer.model";
import { getSettingInstance } from "../../models/setting.model";
import { TransactionInsert } from "../../models/transaction.model";
import UserModel, { getUserInstance } from "../../models/user.model";
import { EmailService } from "../../services/email.service";
import { createPaymentTransferDocument } from "../../services/paymentTransfer.service";
import { createTransactionDocument } from "../../services/transaction.service";
import { fCurrency, sendResponse } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { ModelFind } from "../../utils/types";
import { StringSchemaType } from "../schemas/index.schema";
import { DataTableSchemaType } from "../schemas/table.schema";
import { TransferPaymentSchemaType } from "../schemas/transferPayment.schema";

/**
 * transfer payment
 */
export const transferPaymentHandler = async ({
  input,
  ctx,
}: {
  input: TransferPaymentSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { amount, receiverId } = input;
  const { userId } = user;
  if (userId === receiverId)
    return ClientError("You can't transfer to you own account");

  const ReceiverUser = await getUserInstance(receiverId, {
    error: `${receiverId} is not a user id`,
  });

  const wallet = await user.wallet();
  const text = await fCurrency(wallet);

  const setting = await getSettingInstance();
  const charge = setting.getCharge(amount);
  const totalAmount = amount + charge;
  const totalAmountText = await fCurrency(totalAmount);

  if (totalAmount > wallet)
    throw ClientError(
      `You have only ${text} in your wallet. ${totalAmountText} required`
    );

  const session = await mongoose.startSession();
  session.startTransaction();

  let senderTransactionId: Types.ObjectId;
  let receiverTransactionId: Types.ObjectId;

  try {
    {
      //! transfer payment by user id

      // create transaction
      const description = `Transfer - ${receiverId}`;
      const transactionData: TransactionInsert = {
        amount,
        category: "transfer",
        charge,
        description,
        netAmount: totalAmount,
        status: "debit",
        userId,
      };
      const transaction = await createTransactionDocument(
        transactionData,
        session
      );
      senderTransactionId = transaction._id;

      const doc: PaymentTransferInsert = {
        amount,
        charge,
        netAmount: totalAmount,
        user: user._id,
        userId,
        agentId: receiverId,
        status: "transferred",
        transactionId: senderTransactionId,
      };
      await createPaymentTransferDocument(doc, session);
    }

    {
      //! receive payment
      // create transaction
      const description = `Received - ${userId}`;
      const transactionData: TransactionInsert = {
        amount: totalAmount,
        category: "transfer",
        charge,
        description,
        netAmount: amount,
        status: "credit",
        userId: receiverId,
      };
      const transaction = await createTransactionDocument(
        transactionData,
        session
      );
      receiverTransactionId = transaction._id;

      const doc: PaymentTransferInsert = {
        amount: totalAmount,
        charge,
        netAmount: amount,
        user: ReceiverUser._id,
        userId: receiverId,
        agentId: userId,
        status: "received",
        transactionId: receiverTransactionId,
      };
      await createPaymentTransferDocument(doc, session);
      await ReceiverUser.checkReactivationPlan(session);
    }

    // commit transaction
    await session.commitTransaction();

    await EmailService.sendTransferPaymentEmail({
      email: user.email,
      subject: "Payment Transferred",
      transactionId: senderTransactionId,
    });
    await EmailService.sendTransferPaymentEmail({
      email: ReceiverUser.email,
      subject: "Payment Received",
      transactionId: receiverTransactionId,
    });

    const amountText = await fCurrency(totalAmount);
    return sendResponse(
      `You have successfully transferred ${amountText} to ${receiverId}`
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * get user transfer payment history
 */
export const transferPaymentHistoryHandler = async ({
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
  const { level } = await user.populateTree();
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
        level: { $subtract: ["$level", level] },
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
            searchStr("user.email", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchStr("status", searchKeyword),
            searchDate("$createdAt", searchKeyword),
            searchNonStr("$amount", searchKeyword),
            searchNonStr("$charge", searchKeyword),
            searchNonStr("$netAmount", searchKeyword),
            searchNonStr("$agentId", searchKeyword),
            searchNonStr("$_id", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        amount: 1,
        charge: 1,
        netAmount: 1,
        displayName: 1,
        createdAt: 1,
        status: 1,
        agentId: 1,
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
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

  const data = await PaymentTransferModel.aggregate(pipeline);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};

/**
 * get transfer payment config
 */
export const getTransferPaymentConfigHandler = async () => {
  const setting = await getSettingInstance();
  const { balanceTransferCharge, balanceTransferChargeType } = setting;
  return {
    charge: balanceTransferCharge,
    chargeType: balanceTransferChargeType,
  };
};

/**
 * search user for transfer payment
 */
export const searchUserTransferPayment = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { userId } = user;
  const search = input;

  if (search) {
    const find = {
      $or: [searchNonStr("$userId", search), searchStr("userName", search)],
    };
    const select = {
      userName: 1,
      userId: 1,
      firstName: 1,
      lastName: 1,
      avatar: 1,
    };
    const users = await UserModel.find(find).select(select).limit(10);
    return users;
  } else {
    const match: ModelFind<PaymentTransferInsert> = {
      status: "transferred",
      userId,
    };

    const users = await PaymentTransferModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "agentId",
          foreignField: "userId",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$agentId",
          createdAt: { $first: "$createdAt" },
          userId: { $first: "$agentId" },
          userName: { $first: "$agent.userName" },
          firstName: { $first: "$agent.firstName" },
          lastName: { $first: "$agent.lastName" },
          avatar: { $first: "$agent.avatar" },
        },
      },
    ]).limit(10);
    return users;
  }
};

export const getTransferPaymentWalletHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const wallet = await user.wallet();
  const transferredAmount = await user.transferredAmount();
  const receivedAmount = await user.receivedAmount();

  return {
    receivedAmount,
    transferredAmount,
    wallet,
  };
};
