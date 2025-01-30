import { trpc } from "../../trpc";
import { authRouter } from "./auth.routes";
import { categoryRouter } from "./category.routes";
import { changePasswordRouter } from "./changePassword.routes";
import { dashboardRouter } from "./dashboard.routes";
import { depositRouter } from "./deposit.routes";
import { ePinRouter } from "./ePin.routes";
import { faqRouter } from "./faq.routes";
import { installRouter } from "./install.routes";
import { kycRouter } from "./kyc.routes";
import { manageSectionRouter } from "./manageSection.routes";
import { networkRouter } from "./networkRouter.routes";
import { orderRouter } from "./order.routes";
import { paymentGatewaysRouter } from "./paymentGateways.routes";
import { planSettingRouter } from "./planSetting.routes";
import { productRouter } from "./product.routes";
import { profileRouter } from "./profile.routes";
import { reportRouter } from "./report.routes";
import { settingRouter } from "./settings.routes";
import { supportRouter } from "./support.routes";
import { systemConfigurationRouter } from "./systemConfiguration.routes";
import { userRouter } from "./user.routes";
import { withdrawRouter } from "./withdraw.routes";

export const adminRouter = trpc.router({
  product: productRouter,
  order: orderRouter,
  category: categoryRouter,
  setting: settingRouter,
  auth: authRouter,
  install: installRouter,
  network: networkRouter,
  profile: profileRouter,
  support: supportRouter,
  user: userRouter,
  kyc: kycRouter,
  deposit: depositRouter,
  withdraw: withdrawRouter,
  report: reportRouter,
  changePassword: changePasswordRouter,
  manageSection: manageSectionRouter,
  systemConfiguration: systemConfigurationRouter,
  paymentGateways: paymentGatewaysRouter,
  planSetting: planSettingRouter,
  dashboard: dashboardRouter,
  ePin: ePinRouter,
  faq: faqRouter,
});
