import { adminProcedure, trpc } from "../../trpc";
import {
  createInstantDepositGatewayHandler,
  createManualDepositGatewayHandler,
  createWithdrawGatewayHandler,
  deleteInstantDepositGatewayHandler,
  deleteManualDepositGatewayHandler,
  deleteWithdrawGatewayHandler,
  getInstantDepositGatewayCreateListHandler,
  getInstantDepositGatewayDetailsHandler,
  getInstantDepositGatewayListHandler,
  getManualDepositGatewayDetailsHandler,
  getManualDepositGatewayListHandler,
  getWithdrawGatewayDetailsHandler, getWithdrawGatewayListHandler, updateInstantDepositGatewayStatusHandler,
  updateManualDepositGatewayStatusHandler,
  updateWithdrawStatusHandler
} from "../controllers/paymentGateways.controller";
import { stringSchema } from "../schemas/index.schema";
import { updateStatusSchema } from "../schemas/paymentGateway.schema";
import {
  createManualDepositGatewaySchema,
  createWithdrawGatewaySchema
} from "../schemas/paymentGateways.schema";

//!Withdraw Deposit Gateway
const createWithdrawGateway = adminProcedure
  .input(createWithdrawGatewaySchema)
  .mutation(({ input }) => createWithdrawGatewayHandler({ input }));
const updateWithdrawStatus = adminProcedure
  .input(updateStatusSchema)
  .mutation(({ input }) => updateWithdrawStatusHandler({ input }));
const getWithdrawList = adminProcedure.query(() =>
  getWithdrawGatewayListHandler()
);
const getWithdrawDetails = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getWithdrawGatewayDetailsHandler({ input }));
const deleteWithdrawGateway = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => deleteWithdrawGatewayHandler({ input }));

//!Instant Deposit Gateway
const getInstantDepositGatewayCreateList = adminProcedure.query(() =>
  getInstantDepositGatewayCreateListHandler()
);
const createInstantDepositGateway = adminProcedure.mutation(() =>
  createInstantDepositGatewayHandler()
);
const updateInstantDepositGatewayStatus = adminProcedure
  .input(updateStatusSchema)
  .mutation(({ input }) => updateInstantDepositGatewayStatusHandler({ input }));
const getInstantDepositGatewayList = adminProcedure.query(() =>
  getInstantDepositGatewayListHandler()
);
const getInstantDepositGatewayDetails = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getInstantDepositGatewayDetailsHandler({ input }));
const deleteInstantDepositGateway = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => deleteInstantDepositGatewayHandler({ input }));

//!Manual Deposit Gateway
const getManualDepositGatewayList = adminProcedure.query(() =>
  getManualDepositGatewayListHandler()
);
const createManualDepositGateway = adminProcedure
  .input(createManualDepositGatewaySchema)
  .mutation(({ input }) => createManualDepositGatewayHandler({ input }));
const updateManualDepositGatewayStatus = adminProcedure
  .input(updateStatusSchema)
  .mutation(({ input }) => updateManualDepositGatewayStatusHandler({ input }));
const getManualDepositGatewayDetails = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getManualDepositGatewayDetailsHandler({ input }));
const deleteManualDepositGateway = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => deleteManualDepositGatewayHandler({ input }));

const withdrawRouter = trpc.router({
  list: getWithdrawList,
  getDetail: getWithdrawDetails,
  create: createWithdrawGateway,
  status: updateWithdrawStatus,
  delete: deleteWithdrawGateway,
});

const instantDepositRouter = trpc.router({
  createList: getInstantDepositGatewayCreateList,
  list: getInstantDepositGatewayList,
  create: createInstantDepositGateway,
  getDetail: getInstantDepositGatewayDetails,
  status: updateInstantDepositGatewayStatus,
  delete: deleteInstantDepositGateway,
});

const manualDepositRouter = trpc.router({
  list: getManualDepositGatewayList,
  getDetail: getManualDepositGatewayDetails,
  create: createManualDepositGateway,
  status: updateManualDepositGatewayStatus,
  delete: deleteManualDepositGateway,
});

export const paymentGatewaysRouter = trpc.router({
  withdraw: withdrawRouter,
  instantDeposit: instantDepositRouter,
  manualDeposit: manualDepositRouter,
});
