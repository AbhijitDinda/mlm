import { dataTableSchema } from "../schemas/table.schema";
import { trpc, userProcedure } from "../../trpc";
import {
  getIndirectRewardListHandler,
  getPairIncomeListHandler,
  getReferralIncomeListHandler
} from "../controllers/incomeHistory.controller";

const referralIncome = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getReferralIncomeListHandler({ ctx, input }));
const pairIncome = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getPairIncomeListHandler({ ctx, input }));
const indirectReward = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getIndirectRewardListHandler({ ctx, input }));

export const incomeHistoryRouter = trpc.router({
  referralIncome,
  pairIncome,
  indirectReward,
});
