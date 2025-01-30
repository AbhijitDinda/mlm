import { adminProcedure, trpc } from "../../trpc";
import {
  approveWithdrawHandler,
  getWithdrawDetailHandler,
  getWithdrawListHandler,
  rejectWithdrawHandler
} from "../controllers//withdraw.controller";
import { stringSchema } from "../schemas/index.schema";
import { withdrawTableSchema } from "../schemas/table.schema";
import {
  withdrawApproveSchema,
  withdrawRejectSchema
} from "../schemas/withdraw.schema";

const list = adminProcedure
  .input(withdrawTableSchema)
  .query(({ input }) => getWithdrawListHandler({ input }));

const detail = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getWithdrawDetailHandler({ input }));

const approve = adminProcedure
  .input(withdrawApproveSchema)
  .mutation(({ input }) => approveWithdrawHandler({ input }));

const reject = adminProcedure
  .input(withdrawRejectSchema)
  .mutation(({ input }) => rejectWithdrawHandler({ input }));

export const withdrawRouter = trpc.router({
  list,
  detail,
  approve,
  reject,
});
