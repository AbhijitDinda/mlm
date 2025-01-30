import { Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import UserWithdrawGatewayModel from "../models/userWithdrawGateway.model";
import WithdrawGatewayModel from "../models/withdrawGateway.model";
import { toObjectId } from "../utils/fns";

export namespace WithdrawGatewayService {
  /**
   * check if id is withdraw gateway id
   */
  export const isGatewayId = async (id: string): Promise<boolean> => {
    const _id = toObjectId(id);
    const row = WithdrawGatewayModel.findById(_id);
    return row !== null;
  };

  export const isUserGatewayId = async (
    userId: number,
    id: string
  ): Promise<boolean> => {
    const _id = toObjectId(id);
    const row = await UserWithdrawGatewayModel.findOne({
      userId,
      gateway: _id,
    });
    return row !== null;
  };
}
