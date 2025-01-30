import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ModelInsert } from "../utils/types";
import { FaqModelSchema } from "./schemas/faq.schema";

export class Faq extends FaqModelSchema {}
export type FaqInsert = ModelInsert<Faq>;
export type FaqRow = FaqInsert & { _id: string | Types.ObjectId };
const FaqModel = getModelForClass(Faq);
export default FaqModel;
