import { adminProcedure, trpc } from "../../trpc";
import {
  addReplyHandler,
  closeTicketHandler,
  getTicketHandler,
  getTicketsListHandler
} from "../controllers//support.controller";
import { stringSchema } from "../schemas/index.schema";
import { addTicketReplySchema } from "../schemas/support.schema";
import { supportTableSchema } from "../schemas/table.schema";

const list = adminProcedure
  .input(supportTableSchema)
  .query(({ input }) => getTicketsListHandler({ input }));

const get = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getTicketHandler({ input }));

const close = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => closeTicketHandler({ input }));

const reply = adminProcedure
  .input(addTicketReplySchema)
  .mutation(({ input,ctx }) => addReplyHandler({ input,ctx }));

export const supportRouter = trpc.router({
  list,
  get,
  close,
  reply,
});
