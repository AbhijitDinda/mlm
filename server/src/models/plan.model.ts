import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ModelInsert } from "../utils/types";
import { PlanModelSchema } from "./schemas/plan.schema";

class Plan extends PlanModelSchema {}
export type PlanInsert = ModelInsert<Plan, "reactivation">;
export type PlanRow = PlanInsert & { _id: string | Types.ObjectId };

const PlanModel = getModelForClass(Plan);
export default PlanModel;

/**
 * create plan model instance
 */
export const getPlanInstance = async () => {
  const plan = await PlanModel.findOne();
  if (!plan) throw new Error("Plan document not found");

  return plan;
};
