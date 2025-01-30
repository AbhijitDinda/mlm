import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import AuthGuard from "../guards/AuthGuard";
import useAuth from "../hooks/useAuth";
import DashboardLayout from "../layouts/dashboard";
import { trpc } from "../trpc";
import { globals } from "../utils/globals";
import APP_PATH from "./paths";
import { LinearProgress } from "@mui/material";

const Loadable =
  (Component: React.FC<{}>) => (props: JSX.IntrinsicAttributes) => {
    return (
      <Suspense fallback={<LinearProgress sx={{ width: 1 }} />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default function Router() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const utils = trpc.useContext();

  useEffect(() => {
    globals.logout = () => {
      logout();
      navigate(APP_PATH.home);
      utils.invalidate();
    };
  }, []);
  return (
    <Routes>
      <Route path={APP_PATH.install} element={<Install />} />
      <Route path={APP_PATH.home} element={<Home />} />
      <Route path={APP_PATH.login} element={<Login />} />
      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route path={APP_PATH.dashboard} element={<Dashboard />} />
        <Route path={APP_PATH.ePin} element={<EPin />} />
        <Route path={APP_PATH.genealogy} element={<Genealogy />} />
        <Route path={APP_PATH.users.all} element={<AllUsers />} />
        <Route path={APP_PATH.users.active} element={<ActiveUsers />} />
        <Route path={APP_PATH.users.blocked} element={<BlockedUsers />} />
        <Route
          path={APP_PATH.users.viewProfile(":userId")}
          element={<UserProfile />}
        />
        <Route path={APP_PATH.kyc.all} element={<AllKyc />} />
        <Route path={APP_PATH.kyc.pending} element={<PendingKyc />} />
        <Route path={APP_PATH.kyc.approved} element={<ApprovedKyc />} />
        <Route path={APP_PATH.kyc.rejected} element={<RejectedKyc />} />
        <Route path={APP_PATH.kyc.view(":id")} element={<KycView />} />
        <Route path={APP_PATH.support.root} element={<Support />} />
        <Route
          path={APP_PATH.support.root + "/:status"}
          element={<Support />}
        />
        <Route
          path={APP_PATH.support.ticket(":id")}
          element={<SupportTicket />}
        />
        <Route path={APP_PATH.withdraw.all} element={<AllWithdraw />} />
        <Route path={APP_PATH.withdraw.pending} element={<PendingWithdraw />} />
        <Route path={APP_PATH.withdraw.success} element={<SuccessWithdraw />} />
        <Route
          path={APP_PATH.withdraw.rejected}
          element={<RejectedWithdraw />}
        />
        <Route
          path={APP_PATH.withdraw.transaction + "/:id"}
          element={<WithdrawTransaction />}
        />
        <Route path={APP_PATH.deposit.all} element={<AllDeposit />} />
        <Route path={APP_PATH.deposit.pending} element={<PendingDeposit />} />
        <Route path={APP_PATH.deposit.approved} element={<ApprovedDeposit />} />
        <Route path={APP_PATH.deposit.rejected} element={<RejectedDeposit />} />
        <Route
          path={APP_PATH.deposit.automatic}
          element={<AutomaticDeposit />}
        />
        <Route
          path={APP_PATH.deposit.transaction + "/:id"}
          element={<DepositTransaction />}
        />
        <Route path={APP_PATH.reports.joining} element={<ReportsJoining />} />
        <Route
          path={APP_PATH.reports.transactions.root}
          element={<ReportsTransactions />}
        />
        <Route
          path={APP_PATH.reports.transactions.view(":id")}
          element={<ReportsTransactionsView />}
        />
        <Route
          path={APP_PATH.reports.referralIncome}
          element={<ReportsReferralIncome />}
        />
        <Route
          path={APP_PATH.reports.pairIncome}
          element={<ReportsPairIncome />}
        />
        <Route
          path={APP_PATH.reports.indirectReward}
          element={<ReportsIndirectReward />}
        />
        <Route
          path={APP_PATH.reports.topSponsors}
          element={<ReportsTopSponsors />}
        />
        <Route
          path={APP_PATH.reports.topEarners}
          element={<ReportsTopEarners />}
        />
        <Route
          path={APP_PATH.reports.analytics}
          element={<ReportsAnalytics />}
        />
        <Route
          path={APP_PATH.reactivationLevel}
          element={<ReactivationLevel />}
        />
        <Route path={APP_PATH.planSetting.root} element={<PlanSetting />} />
        <Route
          path={APP_PATH.planSetting.create}
          element={<PlanSettingCreatePlan />}
        />
        <Route
          path={APP_PATH.planSetting.update(":id")}
          element={<PlanSettingCreatePlan />}
        />
        <Route
          path={APP_PATH.paymentGateways.withdraw}
          element={<WithdrawSetting />}
        />
        <Route
          path={APP_PATH.paymentGateways.createWithdrawGateway}
          element={<CreateWithdrawGateway />}
        />
        <Route
          path={APP_PATH.paymentGateways.createWithdrawGateway + "/:id"}
          element={<CreateWithdrawGateway />}
        />
        <Route
          path={APP_PATH.paymentGateways.manualDeposit}
          element={<ManualDepositSetting />}
        />
        <Route
          path={APP_PATH.paymentGateways.createManualDeposit}
          element={<CreateManualDeposit />}
        />
        <Route
          path={APP_PATH.paymentGateways.createManualDeposit + "/:id"}
          element={<CreateManualDeposit />}
        />
        <Route
          path={APP_PATH.systemConfiguration.emailSetting}
          element={<EmailSetting />}
        />
        <Route
          path={APP_PATH.systemConfiguration.emailPreferences}
          element={<EmailPreferences />}
        />
        <Route
          path={APP_PATH.systemConfiguration.kyc}
          element={<KycSetting />}
        />
        <Route
          path={APP_PATH.systemConfiguration.logo}
          element={<LogoSetting />}
        />
        <Route
          path={APP_PATH.systemConfiguration.site}
          element={<SiteSetting />}
        />
        <Route path={APP_PATH.manageSection.hero} element={<HeroFrontend />} />
        <Route
          path={APP_PATH.manageSection.aboutUs}
          element={<AboutUsFrontend />}
        />
        <Route
          path={APP_PATH.manageSection.contactUs}
          element={<ContactUsFrontend />}
        />
        <Route path={APP_PATH.manageSection.faq} element={<FaqFrontend />} />
        <Route
          path={APP_PATH.manageSection.privacyPolicy}
          element={<PrivacyPolicyFrontend />}
        />
        <Route
          path={APP_PATH.manageSection.refundPolicy}
          element={<RefundPolicyFrontend />}
        />
        <Route
          path={APP_PATH.manageSection.commissionPolicy}
          element={<CommissionPolicyFrontend />}
        />
        <Route
          path={APP_PATH.manageSection.termsAndConditions}
          element={<TermsAndConditionsFrontend />}
        />
        <Route path={APP_PATH.help} element={<Help />} />
        //! /** * products */
        <Route
          path={APP_PATH.productManagement.category.main}
          element={<MainCategory />}
        />
        <Route
          path={APP_PATH.productManagement.category.subCategory}
          element={<SubCategory />}
        />
        <Route
          path={APP_PATH.productManagement.category.subSubCategory}
          element={<SubSubCategory />}
        />
        <Route
          path={APP_PATH.productManagement.product.list}
          element={<ProductsList />}
        />
        <Route
          path={APP_PATH.productManagement.product.create}
          element={<ProductCreate />}
        />
        <Route
          path={APP_PATH.productManagement.product.update(":id")}
          element={<ProductCreate />}
        />
        <Route
          path={APP_PATH.productManagement.order.list}
          element={<OrdersList />}
        />
        <Route
          path={APP_PATH.productManagement.order.view(":id")}
          element={<ViewOrder />}
        />
        //! /** * products */?
        <Route
          path={APP_PATH.extra.changePassword}
          element={<ChangePassword />}
        />
      </Route>
      <Route path={"*"} element={<Page404 />} />
    </Routes>
  );
}

// *Routes

const Help = Loadable(lazy(() => import("../pages/help")));
const Install = Loadable(lazy(() => import("../pages/install")));
const Home = Loadable(lazy(() => import("../pages/Home")));
const Login = Loadable(lazy(() => import("../pages/login")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const EPin = Loadable(lazy(() => import("../pages/e-pin")));
const Genealogy = Loadable(lazy(() => import("../pages/genealogy")));

const AllUsers = Loadable(lazy(() => import("../pages/users/AllUser")));
const ActiveUsers = Loadable(lazy(() => import("../pages/users/ActiveUser")));
const BlockedUsers = Loadable(lazy(() => import("../pages/users/BlockedUser")));
const UserProfile = Loadable(lazy(() => import("../pages/users/UserProfile")));

const PendingKyc = Loadable(lazy(() => import("../pages/kyc/PendingKyc")));
const ApprovedKyc = Loadable(lazy(() => import("../pages/kyc/ApprovedKyc")));
const RejectedKyc = Loadable(lazy(() => import("../pages/kyc/RejectedKyc")));
const AllKyc = Loadable(lazy(() => import("../pages/kyc/AllKyc")));
const KycView = Loadable(lazy(() => import("../pages/kyc/KycView")));

const Support = Loadable(lazy(() => import("../pages/support")));
const SupportTicket = Loadable(
  lazy(() => import("../pages/support/SupportTicket"))
);

const PendingWithdraw = Loadable(
  lazy(() => import("../pages/withdraw/PendingWithdraw"))
);
const SuccessWithdraw = Loadable(
  lazy(() => import("../pages/withdraw/SuccessWithdraw"))
);
const RejectedWithdraw = Loadable(
  lazy(() => import("../pages/withdraw/RejectedWithdraw"))
);
const WithdrawTransaction = Loadable(
  lazy(() => import("../pages/withdraw/WithdrawTransaction"))
);
const AllWithdraw = Loadable(
  lazy(() => import("../pages/withdraw/AllWithdraw"))
);

const PendingDeposit = Loadable(
  lazy(() => import("../pages/deposit/PendingDeposit"))
);
const ApprovedDeposit = Loadable(
  lazy(() => import("../pages/deposit/ApprovedDeposit"))
);
const RejectedDeposit = Loadable(
  lazy(() => import("../pages/deposit/RejectedDeposit"))
);
const AutomaticDeposit = Loadable(
  lazy(() => import("../pages/deposit/AutomaticDeposit"))
);
const DepositTransaction = Loadable(
  lazy(() => import("../pages/deposit/DepositTransaction"))
);
const AllDeposit = Loadable(lazy(() => import("../pages/deposit/AllDeposit")));

const ReportsJoining = Loadable(lazy(() => import("../pages/reports/joining")));
const ReportsTransactions = Loadable(
  lazy(() => import("../pages/reports/transactions"))
);
const ReportsTransactionsView = Loadable(
  lazy(() => import("../pages/reports/transactions/TransactionView"))
);
const ReportsReferralIncome = Loadable(
  lazy(() => import("../pages/reports/referral-income"))
);
const ReportsPairIncome = Loadable(
  lazy(() => import("../pages/reports/PairIncome"))
);
const ReportsIndirectReward = Loadable(
  lazy(() => import("../pages/reports/IndirectReward"))
);
const ReportsTopSponsors = Loadable(
  lazy(() => import("../pages/reports/top-sponsors"))
);
const ReportsTopEarners = Loadable(
  lazy(() => import("../pages/reports/top-earners"))
);
const ReportsAnalytics = Loadable(
  lazy(() => import("../pages/reports/analytics"))
);

const ReactivationLevel = Loadable(
  lazy(() => import("../pages/reactivation-level"))
);
const PlanSetting = Loadable(lazy(() => import("../pages/plan-setting")));
const PlanSettingCreatePlan = Loadable(
  lazy(() => import("../pages/plan-setting/CreatePlan"))
);

const WithdrawSetting = Loadable(
  lazy(() => import("../pages/payment-gateways/withdraw"))
);
const ManualDepositSetting = Loadable(
  lazy(() => import("../pages/payment-gateways/manual-deposit"))
);

const CreateWithdrawGateway = Loadable(
  lazy(() => import("../pages/payment-gateways/withdraw/CreateWithdrawGateway"))
);
const CreateManualDeposit = Loadable(
  lazy(
    () => import("../pages/payment-gateways/manual-deposit/CreateManualDeposit")
  )
);

const EmailSetting = Loadable(
  lazy(() => import("../pages/system-configuration/email-setting"))
);
const EmailPreferences = Loadable(
  lazy(() => import("../pages/system-configuration/email-preferences"))
);
const KycSetting = Loadable(
  lazy(() => import("../pages/system-configuration/kyc-setting"))
);
const LogoSetting = Loadable(
  lazy(() => import("../pages/system-configuration/logo"))
);
const SiteSetting = Loadable(
  lazy(() => import("../pages/system-configuration/site"))
);

// Manage Section

const HeroFrontend = Loadable(
  lazy(() => import("../pages/mange-section/hero"))
);
const AboutUsFrontend = Loadable(
  lazy(() => import("../pages/mange-section/about-us"))
);
const ContactUsFrontend = Loadable(
  lazy(() => import("../pages/mange-section/contact-us"))
);
const FaqFrontend = Loadable(lazy(() => import("../pages/mange-section/faq")));
const PrivacyPolicyFrontend = Loadable(
  lazy(() => import("../pages/mange-section/privacy-policy"))
);
const TermsAndConditionsFrontend = Loadable(
  lazy(() => import("../pages/mange-section/terms-and-conditions"))
);
const RefundPolicyFrontend = Loadable(
  lazy(() => import("../pages/mange-section/refund-policy"))
);
const CommissionPolicyFrontend = Loadable(
  lazy(() => import("../pages/mange-section/commission-policy"))
);
const MainCategory = Loadable(
  lazy(() => import("../pages/product-management/category/MainCategory"))
);
const SubCategory = Loadable(
  lazy(() => import("../pages/product-management/category/SubCategory"))
);
const SubSubCategory = Loadable(
  lazy(() => import("../pages/product-management/category/SubSubCategory"))
);
const ProductsList = Loadable(
  lazy(() => import("../pages/product-management/product"))
);
const ProductCreate = Loadable(
  lazy(() => import("../pages/product-management/product/CreateProduct"))
);
const OrdersList = Loadable(
  lazy(() => import("../pages/product-management/order"))
);
const ViewOrder = Loadable(
  lazy(() => import("../pages/product-management/order/ViewOrder"))
);
const ChangePassword = Loadable(lazy(() => import("../pages/change-password")));
// ERRORS
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
