import crypto from "crypto";
import { ClientError } from "../../middleware/errors";
import ManualDepositGatewayModel, {
  ManualDepositGatewayInsert,
  ManualDepositGatewayRow
} from "../../models/manualDepositGateway.model";
import WithdrawGatewayModel, {
  WithdrawGatewayInsert,
  WithdrawGatewayRow
} from "../../models/withdrawGateway.model";
import { ManualDepositService } from "../../services/manualDeposit.service";
import { WithdrawGatewayService } from "../../services/withdrawGateway.service";
import { sendResponse, toObjectId } from "../../utils/fns";
import { StringSchemaType } from "../schemas/index.schema";
import { UpdateStatusSchemaType } from "../schemas/paymentGateway.schema";
import {
  CreateManualDepositGatewaySchemaType,
  CreateWithdrawGatewaySchemaType
} from "../schemas/paymentGateways.schema";

//! Withdraw

/**
 * create withdraw gateway payment system
 */
export const createWithdrawGatewayHandler = async ({
  input,
}: {
  input: CreateWithdrawGatewaySchemaType;
}) => {
  const {
    _id,
    logo,
    name,
    processingTime,
    minWithdraw,
    maxWithdraw,
    charge,
    chargeType,
    status,
    details,
  } = input;

  details.forEach((row) => {
    const inputType = row.inputType;
    if (inputType !== "dropdown") {
      //@ts-ignore
      delete row?.dropdownOptions;
    }
    if (!row.name) {
      row.name = crypto.randomBytes(6).toString("hex") as string;
    }
  });

  const doc: WithdrawGatewayInsert = {
    logo,
    name,
    processingTime,
    minWithdraw,
    maxWithdraw,
    charge,
    chargeType,
    status,
    //@ts-ignore
    details,
  };

  if (maxWithdraw < minWithdraw)
    throw ClientError("maxWithdraw must be smaller than minWithdraw");

  let data: WithdrawGatewayRow;
  let message: string;

  if (_id) {
    const isWithdrawGatewayId = await WithdrawGatewayService.isGatewayId(_id);
    if (!isWithdrawGatewayId)
      throw ClientError("No withdraw gateway with id: " + _id);

    data = <WithdrawGatewayRow>(
      await WithdrawGatewayModel.findByIdAndUpdate(
        _id,
        { $set: doc },
        { new: true }
      )
    );
    message = `Withdraw gateway ${name} has been updated`;
  } else {
    data = await WithdrawGatewayModel.create(doc);
    message = `Withdraw gateway ${name} has been created`;
  }
  return sendResponse(message, { data });
};

/**
 * update withdraw gateway status
 */
export const updateWithdrawStatusHandler = async ({
  input,
}: {
  input: UpdateStatusSchemaType;
}) => {
  const { status, id } = input;
  const updateStatus = status === "active" ? "inactive" : "active";

  const _id = toObjectId(id);
  const data: WithdrawGatewayRow = <WithdrawGatewayRow>(
    await WithdrawGatewayModel.findByIdAndUpdate(
      _id,
      {
        $set: { status: updateStatus },
      },
      { new: true }
    )
  );
  return sendResponse(`Status has been updated to ${updateStatus}`, { data });
};

/**
 * get withdraw gateways list
 */
export const getWithdrawGatewayListHandler = async (): Promise<
  WithdrawGatewayRow[]
> => {
  const list = await WithdrawGatewayModel.find();
  return list;
};

/**
 * get withdraw gateway details
 */
export const getWithdrawGatewayDetailsHandler = async ({
  input,
}: {
  input: StringSchemaType;
}): Promise<WithdrawGatewayInsert | null> => {
  const id = toObjectId(input);
  const data = await WithdrawGatewayModel.findById(id);
  return data;
};

/**
 * delete withdraw gateway
 */
export const deleteWithdrawGatewayHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  const isGatewayId = await WithdrawGatewayService.isGatewayId(id);
  if (!isGatewayId) throw ClientError(`No deposit gateway for id ${id}`);

  await WithdrawGatewayModel.findByIdAndDelete(id);
  return sendResponse("Withdraw Gateway has been deleted");
};

//! Instant Deposit

/**
 * first
 */
export const getInstantDepositGatewayCreateListHandler = async () => {};

/**
 * first
 */
export const createInstantDepositGatewayHandler = async () => {};

/**
 * first
 */
export const updateInstantDepositGatewayStatusHandler = async ({
  input,
}: {
  input: UpdateStatusSchemaType;
}) => {};

/**
 * first
 */
export const getInstantDepositGatewayListHandler = async () => {};

/**
 * first
 */
export const getInstantDepositGatewayDetailsHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {};

/**
 * first
 */
export const deleteInstantDepositGatewayHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {};

//! Manual Deposit

/**
 * get manual deposit gateways all list
 */
export const getManualDepositGatewayListHandler = async (): Promise<
  ManualDepositGatewayRow[]
> => {
  const list = await ManualDepositGatewayModel.find();
  return list;
};

/**
 * create manual deposit gateway
 */
export const createManualDepositGatewayHandler = async ({
  input,
}: {
  input: CreateManualDepositGatewaySchemaType;
}) => {
  const {
    _id,
    name,
    logo,
    processingTime,
    status,
    minDeposit,
    maxDeposit,
    charge,
    chargeType,
    details,
  } = input;

  const doc: ManualDepositGatewayInsert = {
    name,
    logo,
    processingTime,
    status,
    minDeposit,
    maxDeposit,
    charge,
    chargeType,
    details,
  };

  let data: ManualDepositGatewayRow;

  let message: string;
  if (_id) {
    const isGatewayId = await ManualDepositService.isGatewayId(_id);
    if (!isGatewayId)
      throw ClientError(`Deposit gateway not found for id ${_id}`);

    data = <ManualDepositGatewayRow>(
      await ManualDepositGatewayModel.findByIdAndUpdate(
        _id,
        {
          $set: doc,
        },
        { new: true }
      )
    );
    message = `Deposit Gateway ${name} has been updated`;
  } else {
    data = <ManualDepositGatewayRow>await ManualDepositGatewayModel.create(doc);
    message = `Deposit Gateway ${name} has been created`;
  }
  return sendResponse(message, { data });
};

/**
 * update manual deposit gateway status
 */
export const updateManualDepositGatewayStatusHandler = async ({
  input,
}: {
  input: UpdateStatusSchemaType;
}) => {
  const { status, id } = input;
  const updateStatus = status === "active" ? "inactive" : "active";

  const _id = toObjectId(id);
  const data: ManualDepositGatewayRow = <ManualDepositGatewayRow>(
    await ManualDepositGatewayModel.findByIdAndUpdate(
      _id,
      {
        $set: { status: updateStatus },
      },
      { new: true }
    )
  );
  return sendResponse(`Status has been updated to ${updateStatus}`, { data });
};

/**
 * get manual deposit gateway details
 */
export const getManualDepositGatewayDetailsHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  const isGatewayId = await ManualDepositService.isGatewayId(id);
  if (!isGatewayId) throw ClientError(`No deposit gateway for id ${id}`);
  const data = await ManualDepositGatewayModel.findById(id);
  return data;
};

/**
 * delete manual deposit gateway
 */
export const deleteManualDepositGatewayHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  const isGatewayId = await ManualDepositService.isGatewayId(id);
  if (!isGatewayId) throw ClientError(`No deposit gateway for id ${id}`);
  await ManualDepositGatewayModel.findByIdAndDelete(id);
  return sendResponse("Withdraw Gateway has been deleted");
};
