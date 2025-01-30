import { getModelForClass } from "@typegoose/typegoose";
import { HttpError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { OrderModelSchema } from "./schemas/order.schema";

class Order extends OrderModelSchema {}

export type OrderInsert = ModelInsert<Order>;
export type OrderRow = OrderInsert & { _id: string };

const OrderModel = getModelForClass(Order);
export default OrderModel;

export const getOrderInstance = async (id: string) => {
  const _id = toObjectId(id);
  const order = await OrderModel.findOne({ transactionId: id });
  if (!order) throw HttpError(`No order exist with id ${_id}`, "NOT_FOUND");
  return order;
};
