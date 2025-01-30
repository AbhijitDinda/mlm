import { Types } from "mongoose";
import OrderModel, { OrderInsert, OrderRow } from "../models/order.model";
import { ModelFind, ModelMatch, _ModelColumn } from "../utils/types";

export namespace OrderService {
  export const totalSold = async (): Promise<number> => {
    const count = await OrderModel.countDocuments();
    return count;
  };

  export const premiumSold = async (): Promise<number> => {
    const find: ModelMatch<OrderInsert> = {
      purchasePrice: { $gt: 0 },
    };
    const count = await OrderModel.countDocuments(find);
    return count;
  };

  export const freeSold = async (): Promise<number> => {
    const find: ModelMatch<OrderInsert> = {
      purchasePrice: 0,
    };
    const count = await OrderModel.countDocuments(find);
    return count;
  };

  export const earning = async (): Promise<number> => {
    const sumColumn: _ModelColumn<OrderRow> = "$purchasePrice";
    const sum = await OrderModel.aggregate([
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const hasUserPurchased = async ({
    userId,
    productId,
  }: {
    userId: number;
    productId: Types.ObjectId;
  }) => {
    const find: ModelFind<OrderRow> = {
      userId,
      productId,
    };
    const row = await OrderModel.findOne(find);
    if (!row)
      return {
        status: false,
      };
    return {
      status: true,
      id: row.transactionId.toString(),
    };
  };
}
