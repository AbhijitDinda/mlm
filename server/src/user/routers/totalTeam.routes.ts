import { dataTableSchema } from "../schemas/table.schema";
import { trpc, userProcedure } from "../../trpc";
import { getTotalTeamListHandler } from "../controllers/totalTeam.controller";

const list = userProcedure
  .input(dataTableSchema)
  .query(({ input, ctx }) => getTotalTeamListHandler({ input, ctx }));
export const totalTeamRouter = trpc.router({
  list,
});
