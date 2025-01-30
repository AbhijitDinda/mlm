import PlanModel, { PlanRow } from "../../models/plan.model";

export const getPlanListHandler = async (): Promise<PlanRow | null> => {
  const plan = await PlanModel.findOne();
  return plan;
};
