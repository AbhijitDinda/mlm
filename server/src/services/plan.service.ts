import PlanModel, { PlanRow, getPlanInstance } from "../models/plan.model";

export namespace PlanService {
  /**
   * get plan row
   */
  export const getPlan = async (): Promise<PlanRow | null> => {
    const row = await PlanModel.findOne();
    return row;
  };

  /**
   * get reactivation
   */
  export const getReactivation = async () => {
    const plan = await getPlanInstance();
    const reactivation = plan.reactivation;
    return reactivation;
  };
}
