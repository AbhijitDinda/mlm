import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";
import { createTicketSchema } from "../schemas/support.schema";
import { trpc, userProcedure } from "../../trpc";
import {
  closeTicketHandler,
  createTicketHandler,
  getTicketHandler,
  getTicketsListHandler,
} from "../controllers/support.controller";

const list = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getTicketsListHandler({ ctx, input }));

const getTicket = userProcedure
  .input(stringSchema("Id"))
  .query(({ ctx, input }) => getTicketHandler({ ctx, input }));

const createTicket = userProcedure
  .input(createTicketSchema)
  .mutation(({ ctx, input }) => createTicketHandler({ ctx, input }));

const closeTicket = userProcedure
  .input(stringSchema("Id"))
  .mutation(({ ctx, input }) => closeTicketHandler({ ctx, input }));

export const supportRouter = trpc.router({
  list,
  getTicket,
  createTicket,
  closeTicket,
});
