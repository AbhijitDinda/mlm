import mongoose from "mongoose";
import { UserContext } from "../../context";
import { ClientError, HttpError } from "../../middleware/errors";
import { TransactionInsert } from "../../models/transaction.model";
import UserWithdrawModel, {
  getWithdrawInstance,
  UserWithdrawInsert,
  UserWithdrawRow,
} from "../../models/userWithdraw.model";
import UserWithdrawGatewayModel, {
  UserWithdrawGatewayInsert,
} from "../../models/userWithdrawGateway.model";
import WithdrawGatewayModel, {
  getWithdrawGatewayInstance,
  WithdrawGatewayInsert,
  WithdrawGatewayRow,
} from "../../models/withdrawGateway.model";
import { EmailService } from "../../services/email.service";
import { createTransactionDocument } from "../../services/transaction.service";
import { WithdrawGatewayService } from "../../services/withdrawGateway.service";
import { fCurrency, sendResponse, toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { ModelFind } from "../../utils/types";
import { StringSchemaType } from "../schemas/index.schema";
import { DataTableSchemaType } from "../schemas/table.schema";
import {
  CreateUserWithdrawGatewaySchemaType,
  WithdrawPaymentSchemaType,
} from "../schemas/withdrawGateway.schema";

export const withdrawPaymentHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: WithdrawPaymentSchemaType;
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { user } = ctx;
  const { userId, _id: _userId } = user;
  const { amount, _id } = input;
  const gatewayId = toObjectId(_id);
  const gateway = await getWithdrawGatewayInstance(gatewayId);
  const status = gateway.status;
  const name = gateway.name;
  if (status !== "active")
    throw ClientError(`${name} is currently unavailable`);

  const hasUserData = await gateway.canWithdraw(userId);
  if (!hasUserData)
    throw ClientError("You need to updated details to withdraw");

  const wallet = await user.wallet();
  const amountText = await fCurrency(amount);
  const walletText = await fCurrency(wallet);
  if (wallet < amount) {
    throw ClientError(
      `Insufficient wallet to withdraw. You have only ${walletText} in your wallet`
    );
  }

  try {
    const charge = gateway.getCharge(amount);
    const netAmount = amount - charge;

    // create transaction
    const transactionInput: TransactionInsert = {
      amount,
      charge,
      netAmount,
      userId,
      category: "withdraw",
      status: "pending",
      description: "withdraw",
    };
    const transaction = await createTransactionDocument(
      transactionInput,
      session
    );

    const gatewayDetails = gateway.details;
    const userData = await gateway.getUserGatewayData(userId);
    const details = gatewayDetails.map((data) => ({
      name: data.name,
      label: data.label,
      inputType: data.inputType,
      //@ts-ignore
      value: (userData?.[data.name] ?? "") as string,
    }));

    const gatewayData = {
      name: gateway.name,
      logo: gateway.logo,
      charge: gateway.charge,
      chargeType: gateway.chargeType,
    };

    const doc: UserWithdrawInsert = {
      user: _userId,
      userId,
      actionBy: "user",
      amount,
      charge,
      netAmount,
      details,
      gateway: gatewayData,
      status: "pending",
      transactionId: transaction._id,
    };
    const withdraw = new UserWithdrawModel(doc);
    await withdraw.save({ session });

    // commit transaction
    await session.commitTransaction();
    await EmailService.sendWithdrawEmail(transaction._id);

    return sendResponse(`Withdraw of ${amountText} is in pending`);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getHistoryHandler = async ({
  input,
  ctx,
}: {
  input: DataTableSchemaType;
  ctx: UserContext;
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
        searchNonStr("$userId", searchKeyword),
        searchNonStr("$amount", searchKeyword),
        searchNonStr("$charge", searchKeyword),
        searchNonStr("$netAmount", searchKeyword),
        searchNonStr("$transactionId", searchKeyword),
        searchDate("$createdAt", searchKeyword),
        searchDate("$updatedAt", searchKeyword),
      ],
    }),
  };
  const query = UserWithdrawModel.find(filter).populate("gateway", "logo name");
  const rowCount = await UserWithdrawModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

export const getWithdrawTransactionHandler = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}): Promise<UserWithdrawRow> => {
  const { user } = ctx;
  const { userId } = user;
  const transactionId = input;
  const transaction = await getWithdrawInstance(toObjectId(transactionId));
  if (transaction.userId !== userId)
    throw HttpError("Withdraw not exist", "NOT_FOUND");

  return <UserWithdrawRow>transaction;
};

export const getUserGatewayListHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}): Promise<WithdrawGatewayRow[]> => {
  const { user } = ctx;
  const userId = user.userId;
  const lists = await UserWithdrawGatewayModel.find({ userId }).populate({
    path: "gateway",
    model: WithdrawGatewayModel,
  });
  const rows = <WithdrawGatewayRow[]>lists.map((lists) => lists.gateway);
  return rows;
};

export const getGatewaysListHandler = async (): Promise<
  WithdrawGatewayRow[]
> => {
  const find: ModelFind<WithdrawGatewayInsert> = {
    status: "active",
  };
  const list = await WithdrawGatewayModel.find(find);
  return list;
};

export const getGatewayDataHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}): Promise<{
  gateway: WithdrawGatewayRow;
  userData: { [x: string]: string };
  isUpdated: boolean;
  wallet: number;
}> => {
  const { user } = ctx;
  const userId = user.userId;
  const wallet = await user.wallet();

  const _id = input;
  const gatewayId = toObjectId(_id);
  const gateway = await getWithdrawGatewayInstance(gatewayId);
  if (gateway.status !== "active")
    return ClientError(`${gateway.name} is currently unavailable`);

  let userData = {};

  const isUserGateway = await WithdrawGatewayService.isUserGatewayId(
    userId,
    _id
  );
  if (isUserGateway) {
    const doc = await UserWithdrawGatewayModel.findOne({
      userId,
      gateway: gatewayId,
    });
    userData = doc?.details ?? {};
  }
  const isUpdated = !(await gateway.canWithdraw(userId));

  return { gateway, userData, isUpdated, wallet };
};

export const createUserGatewayHandler = async ({
  input,
  ctx,
}: {
  input: CreateUserWithdrawGatewaySchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { userId, _id: _userId } = user;

  const data = input;
  const { details, _id } = data;
  const gatewayId = toObjectId(_id);
  const isWithdrawGatewayId = await WithdrawGatewayService.isGatewayId(_id);
  if (!isWithdrawGatewayId) throw ClientError("Withdraw Gateway not found");

  let message: string;
  const isUserGateway = await WithdrawGatewayService.isUserGatewayId(
    userId,
    _id
  );

  const doc: UserWithdrawGatewayInsert = {
    details,
    gateway: gatewayId,
    user: _userId,
    userId,
  };

  if (isUserGateway) {
    await UserWithdrawGatewayModel.updateOne(
      { userId, gateway: gatewayId },
      { $set: { details } }
    );
    message = "Withdraw Gateway has been updated";
  } else {
    const res = new UserWithdrawGatewayModel(doc);
    await res.save();
    message = "Withdraw Gateway has been created";
  }

  return sendResponse(message);
};

export const deleteUserGatewayHandler = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}) => {
  const { user } = ctx;
  const { userId } = user;
  const id = input;
  const _id = toObjectId(id);
  const isUserGateway = await WithdrawGatewayService.isUserGatewayId(
    userId,
    id
  );
  if (!isUserGateway) throw ClientError("Gateway not found");

  await UserWithdrawGatewayModel.deleteOne({ gateway: _id, userId });
  return sendResponse("Withdraw gateway has been deleted");
};
