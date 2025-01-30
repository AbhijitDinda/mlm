import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ClientError } from "../middleware/errors";
import { ModelInsert } from "../utils/types";
import { TicketModelSchema } from "./schemas/ticket.schema";

export class Ticket extends TicketModelSchema {}
export type TicketInsert = ModelInsert<
  Ticket,
  never,
  "createdAt" | "updatedAt"
>;
export type TicketRow = TicketInsert & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
const TicketModel = getModelForClass(Ticket);
export default TicketModel;

/**
 * get ticket instance
 */
export const getTicketInstance = async (_id: Types.ObjectId) => {
  const ticket = await TicketModel.findById(_id);
  if (!ticket) throw ClientError("No ticket found with id " + _id);

  return ticket;
};
