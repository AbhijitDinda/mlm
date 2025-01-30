import { trpc, userProcedure } from "../../trpc";
import {
  getTransactionsDataHandler,
  getTransactionsListHandler,
} from "../controllers/transaction.controller";
import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";

const list = userProcedure
  .input(dataTableSchema)
  .query(({ input, ctx }) => getTransactionsListHandler({ input, ctx }));
const getData = userProcedure
  .input(stringSchema("Id is required"))
  .query(({ input, ctx }) => getTransactionsDataHandler({ input, ctx }));

export const transactionRouter = trpc.router({
  list,
  getData,
});
