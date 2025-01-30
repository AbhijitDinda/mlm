import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { InstantDepositGatewayModelSchema } from "./schemas/instantDepositGateway.schema";

export class InstantDepositGateway extends InstantDepositGatewayModelSchema {}
export type InstantDepositGatewayInsert = ModelInsert<InstantDepositGateway>;
const InstantDepositGatewayModel = getModelForClass(InstantDepositGateway);
export default InstantDepositGatewayModel;
