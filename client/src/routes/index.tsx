import LinearProgress from "@mui/material/LinearProgress";
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import AuthGuard from "../guards/AuthGuard";
import useAuth from "../hooks/useAuth";
import DashboardLayout from "../layouts/dashboard";
import MainLayout from "../layouts/main";
import { trpc } from "../trpc";
import { globals } from "../utils/globals";
import { APP_PATH } from "./paths";

const Loadable =
  (Component: React.FC<{}>) => (props: JSX.IntrinsicAttributes) => {
    return (
      <Suspense fallback={<LinearProgress sx={{ width: 1 }} />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default function AppRouter() {
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
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={APP_PATH.home} element={<HomePage />} />
          <Route path={APP_PATH.plans} element={<PlansPage />} />
          <Route path={APP_PATH.aboutUs} element={<About />} />
          <Route path={APP_PATH.contactUs} element={<Contact />} />
          <Route path={APP_PATH.faq} element={<Faq />} />
          <Route
            path={APP_PATH.termsAndCondition}
            element={<TermsAndCondition />}
          />
          <Route path={APP_PATH.privacyPolicy} element={<PrivacyPolicy />} />
          <Route path={APP_PATH.refundPolicy} element={<RefundPolicy />} />
          <Route
            path={APP_PATH.commissionPolicy}
            element={<CommissionPolicy />}
          />
        </Route>

        <Route path={APP_PATH.login} element={<Login />} />
        <Route
          path={APP_PATH.login + "/token/:token"}
          element={<LoginWithToken />}
        />
        <Route path={APP_PATH.register} element={<Register />} />
        <Route
          path={APP_PATH.registrationSuccess(":userId" as unknown as number)}
          element={<RegistrationSuccess />}
        />
        <Route path={APP_PATH.resetPassword} element={<ResetPassword />} />
        
        <Route
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route path={APP_PATH.dashboard} element={<Dashboard />} />
          <Route path={APP_PATH.ePin} element={<EPin />} />
          <Route path={APP_PATH.product.root} element={<ProductsList />} />
          <Route
            path={APP_PATH.product.view(":_id")}
            element={<ViewProduct />}
          />
          <Route path={APP_PATH.order.root} element={<OrdersList />} />
          <Route path={APP_PATH.plan} element={<Plan />} />

          <Route path={APP_PATH.network.genealogy} element={<Genealogy />} />
          <Route path={APP_PATH.network.tree} element={<Tree />} />
          <Route path={APP_PATH.myReferrals} element={<MyReferrals />} />
          <Route path={APP_PATH.totalTeam} element={<TotalTeam />} />
          <Route path={APP_PATH.analytics} element={<Analytics />} />
          <Route path={APP_PATH.transaction.root} element={<Transactions />} />
          <Route
            path={APP_PATH.transaction.view(":id")}
            element={<TransactionsView />}
          />
          <Route
            path={APP_PATH.transferPayment}
            element={<TransferPayment />}
          />

          {/* Withdraw */}
          <Route
            path={APP_PATH.withdrawSystem.withdraw}
            element={<Withdraw />}
          />
          <Route
            path={APP_PATH.withdrawSystem.history}
            element={<WithdrawHistory />}
          />
          <Route
            path={APP_PATH.withdrawSystem.methods}
            element={<WithdrawMethods />}
          />
          <Route
            path={APP_PATH.withdrawSystem.addMethod + "/:id"}
            element={<AddWithdrawMethod />}
          />
          <Route
            path={APP_PATH.withdrawSystem.withdrawPayment + "/:id"}
            element={<WithdrawPayment />}
          />
          <Route
            path={APP_PATH.withdrawSystem.transaction + "/:id"}
            element={<WithdrawTransaction />}
          />

          <Route path={APP_PATH.depositSystem.deposit} element={<Deposit />} />
          <Route
            path={APP_PATH.depositSystem.history}
            element={<DepositHistory />}
          />
          <Route
            path={APP_PATH.depositSystem.transaction + "/:id"}
            element={<DepositTransaction />}
          />

          <Route
            path={APP_PATH.incomeHistory.referralIncome}
            element={<ReferralIncome />}
          />
          <Route
            path={APP_PATH.incomeHistory.pairIncome}
            element={<PairIncome />}
          />
          <Route
            path={APP_PATH.incomeHistory.indirectReward}
            element={<IndirectReward />}
          />
          <Route path={APP_PATH.profile} element={<Profile />} />
          <Route path={APP_PATH.addMember} element={<AddMember />} />
          <Route path={APP_PATH.referralLink} element={<ReferralLink />} />

          <Route path={APP_PATH.support.root} element={<Support />} />
          <Route path={APP_PATH.support.create} element={<CreateTicket />} />
          <Route
            path={APP_PATH.support.ticket(":id")}
            element={<ViewTicket />}
          />
        </Route>
        <Route path={"*"} element={<Page404 />} />
      </Routes>
    </>
  );
}

// *Routes

// MAIN
const HomePage = Loadable(lazy(() => import("../pages/home")));
const PlansPage = Loadable(lazy(() => import("../pages/home/PlansPage")));
const About = Loadable(lazy(() => import("../pages/about-us")));
const Contact = Loadable(lazy(() => import("../pages/contact-us")));
const Faq = Loadable(lazy(() => import("../pages/faq")));
const TermsAndCondition = Loadable(
  lazy(() => import("../pages/terms-and-condition"))
);
const PrivacyPolicy = Loadable(lazy(() => import("../pages/privacy-policy")));
const RefundPolicy = Loadable(lazy(() => import("../pages/refund-policy")));
const CommissionPolicy = Loadable(
  lazy(() => import("../pages/commission-policy"))
);

const Login = Loadable(lazy(() => import("../pages/login")));
const LoginWithToken = Loadable(
  lazy(() => import("../pages/login/LoginWithToken"))
);
const Register = Loadable(lazy(() => import("../pages/register")));
const RegistrationSuccess = Loadable(
  lazy(() => import("../pages/register/RegistrationSuccess"))
);
const ResetPassword = Loadable(lazy(() => import("../pages/reset-password")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const ProductsList = Loadable(lazy(() => import("../pages/products")));
const ViewProduct = Loadable(lazy(() => import("../pages/products/product")));
const OrdersList = Loadable(lazy(() => import("../pages/orders")));
const EPin = Loadable(lazy(() => import("../pages/e-pin")));
const Plan = Loadable(lazy(() => import("../pages/plan")));

const Genealogy = Loadable(lazy(() => import("../pages/network/Genealogy")));
const Tree = Loadable(lazy(() => import("../pages/network/Tree")));
const MyReferrals = Loadable(lazy(() => import("../pages/my-referral")));
const TotalTeam = Loadable(lazy(() => import("../pages/total-team")));
const Analytics = Loadable(lazy(() => import("../pages/analytic")));
const Transactions = Loadable(lazy(() => import("../pages/transaction")));
const TransactionsView = Loadable(
  lazy(() => import("../pages/transaction/TransactionView"))
);
const TransferPayment = Loadable(
  lazy(() => import("../pages/transfer-payment"))
);

// Withdraw
const Withdraw = Loadable(lazy(() => import("../pages/withdraw-system")));
const WithdrawHistory = Loadable(
  lazy(() => import("../pages/withdraw-system/WithdrawHistory"))
);
const WithdrawMethods = Loadable(
  lazy(() => import("../pages/withdraw-system/WithdrawMethods"))
);
const AddWithdrawMethod = Loadable(
  lazy(() => import("../pages/withdraw-system/AddWithdrawMethod"))
);
const WithdrawPayment = Loadable(
  lazy(() => import("../pages/withdraw-system/WithdrawPayment"))
);
const WithdrawTransaction = Loadable(
  lazy(() => import("../pages/withdraw-system/WithdrawTransaction"))
);

const Deposit = Loadable(lazy(() => import("../pages/deposit-system/Deposit")));
const DepositHistory = Loadable(
  lazy(() => import("../pages/deposit-system/DepositHistory"))
);
const DepositTransaction = Loadable(
  lazy(() => import("../pages/deposit-system/DepositTransaction"))
);

const PairIncome = Loadable(
  lazy(() => import("../pages/income-history/PairIncome"))
);
const IndirectReward = Loadable(
  lazy(() => import("../pages/income-history/IndirectReward"))
);
const ReferralIncome = Loadable(
  lazy(() => import("../pages/income-history/ReferralIncome"))
);
const Profile = Loadable(lazy(() => import("../pages/profile")));
const AddMember = Loadable(lazy(() => import("../pages/AddMember")));
const ReferralLink = Loadable(lazy(() => import("../pages/referral-link")));

const Support = Loadable(lazy(() => import("../pages/support")));
const CreateTicket = Loadable(
  lazy(() => import("../pages/support/SupportCreateTicket"))
);
const ViewTicket = Loadable(
  lazy(() => import("../pages/support/SupportTicket"))
);

// ERRORS
const Page404 = Loadable(lazy(() => import("../pages/Page404")));
