import { adminProcedure, trpc } from "../../trpc";
import {
  createEPinHandler,
  ePinSummaryHandler,
  getEPinListHandler,
  getTransferListHandler,
  searchTransferPaymentUserHandler
} from "../controllers//ePin.controller";
import { generateEPinSchema } from "../schemas/ePin.schema";
import { optionalStringSchema } from "../schemas/index.schema";
import { dataTableSchema } from "../schemas/table.schema";

const ePinList = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => getEPinListHandler({ input }));

const create = adminProcedure
  .input(generateEPinSchema)
  .mutation(({ input }) => createEPinHandler({ input }));

const search = adminProcedure
  .input(optionalStringSchema)
  .query(({ input }) => searchTransferPaymentUserHandler({ input }));

const transferList = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => getTransferListHandler({ input }));

const summary = adminProcedure.query(() => ePinSummaryHandler());

export const ePinRouter = trpc.router({
  ePinList,
  create,
  search,
  transferList,
  summary,
});
