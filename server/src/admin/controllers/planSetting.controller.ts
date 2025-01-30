import { ClientError } from "../../middleware/errors";
import PlanModel, { PlanInsert } from "../../models/plan.model";
import { sendResponse } from "../../utils/fns";
import {
  CreatePlanSchemaType,
  UpdateReactivationSchemaType,
} from "../schemas/plan.model";

export const getPlanListHandler = async (): Promise<PlanInsert | null> => {
  const row = await PlanModel.findOne();
  return row;
};

export const createPlanHandler = async ({
  input,
}: {
  input: CreatePlanSchemaType;
}) => {
  const docData: PlanInsert = input;
  const row = await PlanModel.findOne().lean();
  let message: string;
  let data: PlanInsert;
  if (row) {
    data = <PlanInsert>(
      await PlanModel.findOneAndUpdate(
        undefined,
        { $set: docData },
        { new: true }
      )
    );
    message = "Plan has been updated";
  } else {
    data = await PlanModel.create(docData);
    message = "Plan has been created";
  }
  return sendResponse(message, { data });
};

export const updateReactivationHandler = async ({
  input,
}: {
  input: UpdateReactivationSchemaType;
}) => {
  const plan = await PlanModel.findOne();
  if (!plan) throw ClientError("Please create the plan first");
  plan.reactivation = input.reactivation;
  await plan.save();
  return sendResponse("Reactivation has been updated");
};
