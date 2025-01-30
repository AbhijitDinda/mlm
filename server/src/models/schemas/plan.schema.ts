import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
class Reactivation {
  @prop({ type: Number })
  amountIncomeReached: number;

  @prop({ type: Number })
  payableAmount: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class PlanModelSchema {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  referralIncome: number;

  @prop({ required: true })
  pairIncome: number;

  @prop({ required: true })
  dailyPairCapping: number;

  @prop({ required: true })
  indirectReward: number;

  @prop({ required: true })
  dailyIndirectRewardCapping: number;

  @prop({ type: () => [Reactivation] })
  reactivation?: [Reactivation, Reactivation, Reactivation];
}
