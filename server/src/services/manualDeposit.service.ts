import ManualDepositGatewayModel from "../models/manualDepositGateway.model";
import { toObjectId } from "../utils/fns";

export namespace ManualDepositService {
  export const isGatewayId = async (id: string) => {
    const _id = toObjectId(id);
    const row = await ManualDepositGatewayModel.findById(_id);
    return row !== null;
  };
}
