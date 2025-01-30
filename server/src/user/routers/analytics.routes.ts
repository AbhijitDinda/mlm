import { trpc, userProcedure } from "../../trpc";
import { getTeamAndJoiningHandler } from "../controllers/analytics.controller";
import { analyticJoiningSchema } from "../schemas/analytics.schema";

const joining = userProcedure
  .input(analyticJoiningSchema)
  .query(({ ctx, input }) => getTeamAndJoiningHandler({ ctx, input }));

export const analyticsRouter = trpc.router({
  joining,
});
