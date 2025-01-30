import { UserContext } from "../../context";
import { getSettingInstance } from "../../models/setting.model";
import { PlanService } from "../../services/plan.service";

export const getNoticeHandler = async () => {
  const setting = await getSettingInstance();
  return setting.notice;
};

export const getReactivationNotice = async ({ ctx }: { ctx: UserContext }) => {
  const { user } = ctx;
  const reactivation = await PlanService.getReactivation();
  if (!reactivation) return null;

  const reactivationLevel = user.reactivationLevel;
  if (reactivationLevel === 3 || reactivationLevel > 2) return null;

  const currentReactivation = reactivation[reactivationLevel];
  const { amountIncomeReached, payableAmount } = currentReactivation;

  const totalIncome = await user.totalIncome();
  if (totalIncome < amountIncomeReached) return null;

  const wallet = await user.wallet();

  return {
    payableAmount,
    reactivationLevel,
    wallet,
  };
};

export const getDashboardCardsHandler = async ({
  ctx,
}: {
  ctx: UserContext;
}): Promise<{
  wallet: number;
  totalIncome: number;
  totalTeam: number;
  referralIncome: number;
  pairIncome: number;
  indirectReward: number;
  todayPairCount: number;
  leftCount: number;
  rightCount: number;
  directReferral: number;
  todayIndirectReferral: number;
  deposit: number;
  withdraw: number;
  lastDeposit: number;
  lastWithdraw: number;
  depositInReview: number;
  pendingWithdraw: number;
}> => {
  const { user } = ctx;
  const tree = await user.populateTree();
  const { leftCount, rightCount } = tree;

  const wallet = await user.wallet();
  const totalIncome = await user.totalIncome();
  const totalTeam = await user.totalTeam();
  const referralIncome = await user.referralIncome();
  const pairIncome = await user.pairIncome();
  const indirectReward = await user.indirectReward();
  const directReferral = await user.directReferral();
  const deposit = await user.deposit();
  const withdraw = await user.withdraw();
  const lastDeposit = await user.lastDeposit();
  const lastWithdraw = await user.lastWithdraw();
  const depositInReview = await user.depositInReview();
  const pendingWithdraw = await user.pendingWithdraw();
  const todayPairCount = await user.todayPairCount();
  const todayIndirectReferral = await user.todayIndirectRewardCount();

  return {
    wallet,
    totalIncome,
    totalTeam,
    referralIncome,
    pairIncome,
    indirectReward,
    todayPairCount,
    leftCount,
    rightCount,
    directReferral,
    todayIndirectReferral,
    deposit,
    withdraw,
    lastDeposit,
    lastWithdraw,
    depositInReview,
    pendingWithdraw,
  };
};
