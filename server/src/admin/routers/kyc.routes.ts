import { adminProcedure, trpc } from "../../trpc";
import {
  approveKycHandler,
  getKycDetailHandler,
  getKycListHandler,
  rejectKycHandler,
} from "../controllers//kyc.controller";
import { stringSchema } from "../schemas/index.schema";
import { rejectKycSchema } from "../schemas/kyc.schema";
import { userKycTableSchema } from "../schemas/table.schema";

const list = adminProcedure
  .input(userKycTableSchema)
  .query(({ input }) => getKycListHandler({ input }));

const detail = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getKycDetailHandler({ input }));

const approve = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => approveKycHandler({ input }));

const reject = adminProcedure
  .input(rejectKycSchema)
  .mutation(({ input }) => rejectKycHandler({ input }));

export const kycRouter = trpc.router({ list, detail, approve, reject });
