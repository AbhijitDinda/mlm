import { adminProcedure, trpc } from "../../trpc";
import {
  analyticsHandler,
  indirectRewardHandler,
  joiningHandler,
  pairIncomeHandler,
  referralIncomeHandler,
  topEarnerHandler,
  topSponsorHandler,
  transactionHandler,
  transactionListHandler
} from "../controllers//report.controller";
import { analyticSchema } from "../schemas/analytics.schema";
import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";

const joining = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => joiningHandler({ input }));
const transactionList = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => transactionListHandler({ input }));
const referralIncome = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => referralIncomeHandler({ input }));
const topSponsor = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => topSponsorHandler({ input }));
const topEarner = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => topEarnerHandler({ input }));
const pairIncome = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => pairIncomeHandler({ input }));
const indirectReward = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => indirectRewardHandler({ input }));

const analytics = trpc.router({
  registration: adminProcedure
    .input(analyticSchema)
    .query(({ input }) => analyticsHandler.registration({ input })),
  deposit: adminProcedure
    .input(analyticSchema)
    .query(({ input }) => analyticsHandler.deposit({ input })),
  withdraw: adminProcedure
    .input(analyticSchema)
    .query(({ input }) => analyticsHandler.withdraw({ input })),
});

const transaction = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => transactionHandler({ input }));

export const reportRouter = trpc.router({
  joining,
  referralIncome,
  topSponsor,
  topEarner,
  pairIncome,
  indirectReward,
  transactionList,
  analytics,
  transaction,
});
