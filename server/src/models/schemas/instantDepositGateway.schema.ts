import { modelOptions, prop } from "@typegoose/typegoose";

const statusArr = ["active", "inactive", "deleted"] as const;
type Status = typeof statusArr[number];
const chargeArr = ["fixed", "percent"] as const;
type Charge = typeof chargeArr[number];

@modelOptions({ schemaOptions: { timestamps: true } })
export class InstantDepositGatewayModelSchema {
  @prop({ required: true, unique: true, index: true })
  uniqId: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  logo: string;

  @prop({ required: true })
  image: string;

  @prop({ required: true })
  config: string;

  @prop({ required: true })
  details: string;

  @prop({ required: true })
  charge: number;

  @prop({ required: true, enum: chargeArr, type: String })
  chargeType: Charge;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;
}
