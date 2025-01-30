import mongoose from "mongoose";
import { UserContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import ManualDepositGatewayModel, {
  getManualDepositGatewayInstance,
  ManualDepositGatewayInsert,
  ManualDepositGatewayRow,
} from "../../models/manualDepositGateway.model";
import { TransactionInsert } from "../../models/transaction.model";
import UserDepositModel, {
  UserDepositInsert,
} from "../../models/userDeposit.model";
import { EmailService } from "../../services/email.service";
import { createTransactionDocument } from "../../services/transaction.service";
import { fCurrency, sendResponse, toObjectId } from "../../utils/fns";
import { ModelFind } from "../../utils/types";
import { CreateDepositPaymentSchemaType } from "../schemas/deposit.schema";

export const getManualDepositGatewayListHandler = async (): Promise<
  ManualDepositGatewayRow[]
> => {
  const find: ModelFind<ManualDepositGatewayInsert> = {
    status: "active",
  };
  const methods = await ManualDepositGatewayModel.find(find);
  return methods;
};

export const createManualDepositPaymentHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: CreateDepositPaymentSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;

  const { _id, amount, paymentImage, transactionDate, transactionId } = input;
  const gateway = await getManualDepositGatewayInstance(toObjectId(_id));
  const { minDeposit, maxDeposit, name, logo, charge, chargeType } = gateway;
  const chargeAmt = gateway.getCharge(amount);
  const netAmount = amount + chargeAmt;
  const amountText = await fCurrency(netAmount);

  const minDepositText = await fCurrency(minDeposit);
  const maxDepositText = await fCurrency(maxDeposit);
  if (amount > maxDeposit)
    throw ClientError(`Maximum deposit amount is ${maxDepositText}`);
  if (amount < minDeposit)
    throw ClientError(`Minimum deposit amount is ${minDepositText}`);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // create transaction
    const transactionDoc: TransactionInsert = {
      userId,
      amount: netAmount,
      charge: chargeAmt,
      netAmount: amount,
      category: "deposit",
      status: "pending",
      description: "deposit",
    };
    const transaction = await createTransactionDocument(
      transactionDoc,
      session
    );

    const details = {
      gateway: gateway.details,
      user: {
        amount,
        transactionId,
        transactionDate,
        paymentImage,
      },
    };

    const gatewayData = {
      name: gateway.name,
      logo: gateway.logo,
      charge: gateway.charge,
      chargeType: gateway.chargeType,
    };

    const currency = "$";
    const depositDoc: UserDepositInsert = {
      actionBy: "user",
      amount: netAmount,
      charge: chargeAmt,
      netAmount: amount,
      status: "review",
      currency,
      details,
      gateway: gatewayData,
      transactionId: transaction._id,
      type: "manual",
      user: user._id,
      userId,
    };
    const deposit = new UserDepositModel(depositDoc);
    await deposit.save({ session });

    await session.commitTransaction();

    await EmailService.sendDepositEmail(transaction._id.toString());
    return sendResponse(`Deposit of ${amountText} is in pending`);
  } catch (error) {
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }
};

export const getManualDepositMethodDetail = async () => {};
