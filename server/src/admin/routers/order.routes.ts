import { adminProcedure, trpc } from "../../trpc";
import {
  getOrderCardsHandler,
  getOrdersListHandler,
} from "../controllers/order.controller";
import { dataTableSchema } from "../schemas/table.schema";

const list = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => getOrdersListHandler({ input }));

const cards = adminProcedure.query(() => getOrderCardsHandler());

export const orderRouter = trpc.router({
  list,
  cards,
});
