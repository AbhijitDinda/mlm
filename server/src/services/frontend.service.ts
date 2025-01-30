import { ClientSession } from "mongoose";
import FrontendModel, { FrontendInsert } from "../models/frontend.model";

/**
 * create frontend row
 */
export const createFrontend = async (
  input: FrontendInsert,
  session: ClientSession
) => {
  const row = new FrontendModel(input);
  await row.save({ session });
  return row;
};

/**
 * get all columns
 */
export const getAllColumns = async (): Promise<FrontendInsert | null> => {
  const row = await FrontendModel.findOne().lean();
  return row;
};
