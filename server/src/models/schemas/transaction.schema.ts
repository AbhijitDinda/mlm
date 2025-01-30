import { modelOptions, prop } from "@typegoose/typegoose";

const statusArr = ["credit", "debit", "pending", "failed"] as const;
type Status = typeof statusArr[number];
const transactionTypeArr = [
  "referral_income",
  "pair_income",
  "deposit",
  "transfer",
  "withdraw",
  "indirect_reward",
  "reactivation",
  "product",
] as const;
export type TransactionType = typeof transactionTypeArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class TransactionModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  amount: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true })
  netAmount: number;

  @prop({ required: true, enum: transactionTypeArr, type: String })
  category: TransactionType;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ required: true })
  description: string;

  createdAt: string;
  updatedAt: string;
}
