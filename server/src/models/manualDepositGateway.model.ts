import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import { ModelInsert } from "../utils/types";
import { ManualDepositGatewayModelSchema } from "./schemas/manualDepositGateway.schema";

class ManualDepositGateway extends ManualDepositGatewayModelSchema {
  getCharge(amount: number) {
    const charge = this.charge;
    const chargeType = this.chargeType;
    if (chargeType === "fixed") return charge;
    return (amount * charge) / 100;
  }
}
export type ManualDepositGatewayInsert = ModelInsert<ManualDepositGateway>;
export type ManualDepositGatewayRow = ManualDepositGatewayInsert & {
  _id: string | Types.ObjectId;
};

const ManualDepositGatewayModel = getModelForClass(ManualDepositGateway);
export default ManualDepositGatewayModel;

/**
 * get manual deposit gateway instance
 */
export const getManualDepositGatewayInstance = async (id: Types.ObjectId) => {
  const gateway = await ManualDepositGatewayModel.findById(id);
  if (!gateway) return ClientError(`No deposit gateway for id ${id}`);
  return gateway;
};
