import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import { ObjectId, Types } from "mongoose";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { WithdrawGatewayModelSchema } from "./schemas/withdrawGateway.schema";
import UserWithdrawGatewayModel from "./userWithdrawGateway.model";

export class WithdrawGateway extends WithdrawGatewayModelSchema {
  async getUserGatewayData(
    this: DocumentType<WithdrawGateway>,
    userId: number
  ) {
    const userData = await UserWithdrawGatewayModel.findOne({
      gateway: this._id,
      userId,
    });
    return userData?.details ?? {};
  }

  async canWithdraw(this: DocumentType<WithdrawGateway>, userId: number) {
    const userData = await this.getUserGatewayData(userId);
    const requiredNames = this.details.map(({ name }) => name);
    const requestedNames = Object.keys(userData || {});
    return requiredNames.every((key) => requestedNames.includes(key));
  }

  getCharge(amount: number) {
    const charge = this.charge;
    const chargeType = this.chargeType;
    if (chargeType === "fixed") return charge;
    return (amount * charge) / 100;
  }
}
const WithdrawGatewayModel = getModelForClass(WithdrawGateway);
export default WithdrawGatewayModel;

export type WithdrawGatewayInsert = ModelInsert<WithdrawGateway>;
export type WithdrawGatewayRow = WithdrawGatewayInsert & {
  _id: string | Types.ObjectId;
};

/**
 * create withdraw gateway model instance
 */
export const getWithdrawGatewayInstance = async (
  id: string | Types.ObjectId
) => {
  const _id = toObjectId(id);
  const gateway = await WithdrawGatewayModel.findById(id);
  if (!gateway) throw new Error(`No withdraw gateway found with id ${id}`);

  return gateway;
};
