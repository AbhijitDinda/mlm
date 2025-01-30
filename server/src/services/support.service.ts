import TicketModel, { TicketInsert } from "../models/ticket.model";

export const createTicketDocument = async (input: TicketInsert) => {
  const ticket = new TicketModel(input);
  await ticket.save();
  return ticket;
};
