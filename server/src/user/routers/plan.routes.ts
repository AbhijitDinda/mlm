import { publicProcedure, trpc } from "../../trpc";
import { getPlanListHandler } from "../controllers/plan.controller";

const list = publicProcedure.query(() => getPlanListHandler());
export const planRouter = trpc.router({
  list,
});
