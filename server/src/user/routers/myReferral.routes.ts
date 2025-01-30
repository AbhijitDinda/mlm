import { trpc, userProcedure } from "../../trpc";
import { getMyReferralListHandler } from "../controllers/myReferral.controller";
import { dataTableSchema } from "../schemas/table.schema";

const list = userProcedure
  .input(dataTableSchema)
  .query(({ input, ctx }) => getMyReferralListHandler({ input, ctx }));

export const myReferralRouter = trpc.router({
  list,
});
