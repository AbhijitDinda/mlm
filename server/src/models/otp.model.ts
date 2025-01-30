import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { OtpModelSchema } from "./schemas/otp.schema";

export class Otp extends OtpModelSchema {}
export type OtpInsert = ModelInsert<Otp>;
const OtpModel = getModelForClass(Otp);
export default OtpModel;
