import { trpc, userProcedure } from "../../trpc";
import {
  createUserGatewayHandler,
  deleteUserGatewayHandler,
  getGatewayDataHandler,
  getGatewaysListHandler,
  getHistoryHandler,
  getUserGatewayListHandler,
  getWithdrawTransactionHandler,
  withdrawPaymentHandler,
} from "../controllers/withdraw.controller";
import { stringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";
import {
  createUserWithdrawGatewaySchema,
  withdrawPaymentSchema,
} from "../schemas/withdrawGateway.schema";

const withdrawPayment = userProcedure
  .input(withdrawPaymentSchema)
  .mutation(({ input, ctx }) => withdrawPaymentHandler({ input, ctx }));

const history = userProcedure
  .input(dataTableSchema)
  .query(({ input, ctx }) => getHistoryHandler({ input, ctx }));
const getUserGatewayList = userProcedure.query(({ ctx }) =>
  getUserGatewayListHandler({ ctx })
);
const transaction = userProcedure
  .input(stringSchema("Id is required"))
  .query(({ input, ctx }) => getWithdrawTransactionHandler({ input, ctx }));

const getGatewaysList = userProcedure.query(() => getGatewaysListHandler());
const getGatewayData = userProcedure
  .input(stringSchema("Id is required"))
  .query(({ ctx, input }) => getGatewayDataHandler({ ctx, input }));
const createUserGateway = userProcedure
  .input(createUserWithdrawGatewaySchema)
  .mutation(({ input, ctx }) => createUserGatewayHandler({ input, ctx }));
const deleteUserGateway = userProcedure
  .input(stringSchema("Id is required"))
  .mutation(({ input, ctx }) => deleteUserGatewayHandler({ input, ctx }));

export const withdrawRouter = trpc.router({
  transaction,
  withdrawPayment,
  history,
  getUserGatewayList,
  getGatewaysList,
  getGatewayData,
  createUserGateway,
  deleteUserGateway,
});
