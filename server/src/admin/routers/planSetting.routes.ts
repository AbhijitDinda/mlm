import { adminProcedure, trpc } from "../../trpc";
import {
  createPlanHandler,
  getPlanListHandler,
  updateReactivationHandler
} from "../controllers//planSetting.controller";
import {
  createPlanSchema,
  updateReactivationSchema
} from "../schemas/plan.model";

const getPlan = adminProcedure.query(() => getPlanListHandler());
const create = adminProcedure
  .input(createPlanSchema)
  .mutation(({ input }) => createPlanHandler({ input }));

const updateReactivation = adminProcedure
  .input(updateReactivationSchema)
  .mutation(({ input }) => updateReactivationHandler({ input }));

export const planSettingRouter = trpc.router({
  create,
  getPlan,
  updateReactivation,
});
