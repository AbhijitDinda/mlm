import { modelOptions, prop } from "@typegoose/typegoose";

export const chargeTypeArr = ["fixed", "percent"] as const;
export type ChargeType = typeof chargeTypeArr[number];
export const statusArr = ["active", "inactive"] as const;
export type Status = typeof statusArr[number];

export class Detail {
  @prop({ required: true })
  label: string;

  @prop({ required: true })
  value: string;

  @prop({ required: true, enum: ["input", "image"] as const, type: String })
  type: "input" | "image";
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class ManualDepositGatewayModelSchema {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  logo: string;

  @prop({ required: true })
  processingTime: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ required: true })
  minDeposit: number;

  @prop({ required: true })
  maxDeposit: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true, enum: chargeTypeArr, type: String })
  chargeType: ChargeType;

  @prop({ required: true, type: () => [Detail] })
  details: Detail[];
}
