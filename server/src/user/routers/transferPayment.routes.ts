import { trpc, userProcedure } from "../../trpc";
import {
  getTransferPaymentConfigHandler,
  getTransferPaymentWalletHandler,
  searchUserTransferPayment,
  transferPaymentHandler,
  transferPaymentHistoryHandler
} from "../controllers/transferPayment.controller";
import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";
import { transferPaymentSchema } from "../schemas/transferPayment.schema";

const transfer = userProcedure
  .input(transferPaymentSchema)
  .mutation(({ input, ctx }) => transferPaymentHandler({ input, ctx }));
const history = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => transferPaymentHistoryHandler({ ctx, input }));
const getConfig = userProcedure.query(() => getTransferPaymentConfigHandler());
const wallet = userProcedure.query(({ ctx }) =>
  getTransferPaymentWalletHandler({ ctx })
);
const searchUser = userProcedure
  .input(stringSchema("Search"))
  .query(({ input, ctx }) => searchUserTransferPayment({ input, ctx }));

export const transferPaymentRouter = trpc.router({
  transfer,
  history,
  getConfig,
  searchUser,
  wallet,
});
