import { trpc, userProcedure } from "../../trpc";
import {
  getDepositDetailHandler,
  getDepositHistoryListHandler,
} from "../controllers/deposit.controller";
import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";

const history = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getDepositHistoryListHandler({ ctx, input }));

const detail = userProcedure
  .input(stringSchema("Id is required"))
  .query(({ ctx, input }) => getDepositDetailHandler({ ctx, input }));

export const depositRouter = trpc.router({
  history,
  detail,
});
