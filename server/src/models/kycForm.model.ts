import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { ModelInsert } from "../utils/types";
import { KycFormModelSchema } from "./schemas/kycForm.schema";

export class KycForm extends KycFormModelSchema {}
export type KycFormInsert = ModelInsert<KycForm>;
export type KycFormRow = KycFormInsert & { _id: string | Types.ObjectId };
const KycFormModel = getModelForClass(KycForm);
export default KycFormModel;
