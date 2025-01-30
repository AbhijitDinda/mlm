import { trpc } from "../../trpc";
import { analyticsRouter } from "./analytics.routes";
import { authRouter } from "./auth.routes";
import { categoryRouter } from "./category.routes";
import { dashboardRouter } from "./dashboard.routes";
import { depositRouter } from "./deposit.routes";
import { ePinRouter } from "./ePin.routes";
import { homeRouter } from "./home.routes";
import { incomeHistoryRouter } from "./incomeHistory.routes";
import { instantDepositRouter } from "./instantDeposit.routes";
import { manualDepositRouter } from "./manualDeposit.routes";
import { myReferralRouter } from "./myReferral.routes";
import { networkRouter } from "./network.routes";
import { planRouter } from "./plan.routes";
import { productRouter } from "./product.routes";
import { profileRouter } from "./profile.routes";
import { settingRouter } from "./settings.routes";
import { supportRouter } from "./support.routes";
import { totalTeamRouter } from "./totalTeam.routes";
import { transactionRouter } from "./transaction.routes";
import { transferPaymentRouter } from "./transferPayment.routes";
import { withdrawRouter } from "./withdraw.routes";

export const userRouter = trpc.router({
  product: productRouter,
  category: categoryRouter,
  setting: settingRouter,
  auth: authRouter,
  home: homeRouter,
  dashboard: dashboardRouter,
  profile: profileRouter,
  network: networkRouter,
  totalTeam: totalTeamRouter,
  transaction: transactionRouter,
  myReferral: myReferralRouter,
  transferPayment: transferPaymentRouter,
  withdraw: withdrawRouter,
  deposit: depositRouter,
  instantDeposit: instantDepositRouter,
  manualDeposit: manualDepositRouter,
  incomeHistory: incomeHistoryRouter,
  support: supportRouter,
  plan: planRouter,
  analytics: analyticsRouter,
  ePin: ePinRouter,
});
