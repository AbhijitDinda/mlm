import UserDepositModel, {
  UserDepositInsert,
} from "../models/userDeposit.model";
import { toObjectId } from "../utils/fns";
import { ModelFind } from "../utils/types";

export namespace DepositService {
  export const isTransactionId = async (id: string): Promise<boolean> => {
    const _id = toObjectId(id);
    const find: ModelFind<UserDepositInsert> = {
      transactionId: _id,
    };
    const row = await UserDepositModel.findOne(find);
    return row !== null;
  };
}
