import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { FrontendModelSchema } from "./schemas/frontend.schema";
import { NOtFoundError } from "../middleware/errors";
import { Types } from "mongoose";

export class Frontend extends FrontendModelSchema {}
export type FrontendInsert = ModelInsert<Frontend>;
export type FrontendRow = FrontendInsert & { _id: string | Types.ObjectId };

const FrontendModel = getModelForClass(Frontend);
export default FrontendModel;

export const getFrontendInstance = async (): Promise<FrontendRow> => {
  const row = await FrontendModel.findOne();
  if (!row) throw NOtFoundError("Frontend setup not found");
  return row;
};
