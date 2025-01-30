import { trpc, userProcedure } from "../../trpc";
import {
  createManualDepositPaymentHandler,
  getManualDepositGatewayListHandler,
  getManualDepositMethodDetail,
} from "../controllers/manualDeposit.controller";
import { createDepositPaymentSchema } from "../schemas/deposit.schema";

const methods = userProcedure.query(() => getManualDepositGatewayListHandler());
const payment = userProcedure
  .input(createDepositPaymentSchema)
  .mutation(({ ctx, input }) =>
    createManualDepositPaymentHandler({ ctx, input })
  );
const detail = userProcedure.query(() => getManualDepositMethodDetail());

export const manualDepositRouter = trpc.router({
  methods,
  payment,
  detail,
});
