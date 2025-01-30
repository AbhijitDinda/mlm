import { adminProcedure, trpc } from "../../trpc";
import {
  approveDepositHandler,
  getDepositDetailHandler,
  getDepositHistoryListHandler,
  rejectDepositHandler
} from "../controllers//deposit.controller";
import {
  depositApproveSchema,
  depositRejectSchema
} from "../schemas/deposit.schema";
import { stringSchema } from "../schemas/index.schema";
import { depositTableSchema } from "../schemas/table.schema";

const list = adminProcedure
  .input(depositTableSchema)
  .query(({ input }) => getDepositHistoryListHandler({ input }));

const detail = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getDepositDetailHandler({ input }));

const approve = adminProcedure
  .input(depositApproveSchema)
  .mutation(({ input }) => approveDepositHandler({ input }));

const reject = adminProcedure
  .input(depositRejectSchema)
  .mutation(({ input }) => rejectDepositHandler({ input }));

export const depositRouter = trpc.router({
  list,
  detail,
  approve,
  reject,
});
