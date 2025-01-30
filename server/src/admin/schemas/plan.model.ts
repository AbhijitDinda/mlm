import { coerce, number, object, string, tuple, TypeOf } from "zod";

export const createPlanSchema = object({
  name: string({ required_error: "Name is required" }),
  price: coerce.number({ required_error: "Price is required" }),
  referralIncome: coerce.number({
    required_error: "Referral Income is required",
  }),
  pairIncome: coerce.number({ required_error: "Pair income is required" }),
  dailyPairCapping: coerce.number({
    required_error: "Daily Pair Capping is required",
  }),
  indirectReward: coerce.number({
    required_error: "Indirect Reward is required",
  }),
  dailyIndirectRewardCapping: coerce.number({
    required_error: "Daily Indirect Reward Capping is required",
  }),
});

export const updateReactivationSchema = object({
  reactivation: tuple([
    object({
      amountIncomeReached: number({
        required_error: "Amount income reached is required",
      }),
      payableAmount: number({ required_error: "Payable Amount is required" }),
    }),
    object({
      amountIncomeReached: number({
        required_error: "Amount income reached is required",
      }),
      payableAmount: number({ required_error: "Payable Amount is required" }),
    }),
    object({
      amountIncomeReached: number({
        required_error: "Amount income reached is required",
      }),
      payableAmount: number({ required_error: "Payable Amount is required" }),
    }),
  ]),
});

export type CreatePlanSchemaType = TypeOf<typeof createPlanSchema>;
export type UpdateReactivationSchemaType = TypeOf<
  typeof updateReactivationSchema
>;
