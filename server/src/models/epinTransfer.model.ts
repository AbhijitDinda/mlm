import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { EPinTransferModelSchema } from "./schemas/epinTransfer.schema";

export class EPinTransfer extends EPinTransferModelSchema {}
export type EPinTransferInsert = ModelInsert<EPinTransfer>;
const EPinTransferModel = getModelForClass(EPinTransfer);
export default EPinTransferModel;
