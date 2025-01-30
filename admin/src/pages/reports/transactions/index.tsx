import { Container, Grid } from "@mui/material";
import { m } from "framer-motion";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import { MotionViewport, varFade } from "../../../components/animate";
import { RESPONSIVE_GAP } from "../../../config";
import { trpc } from "../../../trpc";
import { fShortCurrency } from "../../../utils/formatNumber";
import { InfoCard } from "../../dashboard/InfoCard";
import TransactionTable from "./TransactionTable";

export default function () {
  const { data, isLoading } = trpc.dashboard.cards.useQuery();
  const cards = data! ?? {};

  const {
    pendingDeposit,
    pendingWithdraw,
    totalDeposit,
    totalWithdraw,
    paymentTransfer,
    transactionsCharge,
    todayDeposit,
    todayWithdraw,
  } = cards;

  return (
    <Page title="Transactions">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Transactions"
        links={[{ name: "Reports" }, { name: "Transactions" }]}
      />
      {/* Breadcrumb End */}

      <Container disableGutters component={MotionViewport}>
        <Grid container spacing={RESPONSIVE_GAP}>
          <InfoCard
            label="Total Deposit"
            value={totalDeposit}
            icon="game-icons:take-my-money"
            format={fShortCurrency}
            color="error"
            loading={isLoading}
          />
          <InfoCard
            label="Total Withdraw"
            value={totalWithdraw}
            icon="uil:money-withdraw"
            format={fShortCurrency}
            color="secondary"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Deposit"
            value={pendingDeposit}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Withdraw"
            value={pendingWithdraw}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="error"
            loading={isLoading}
          />
          <InfoCard
            label="Today Deposit"
            value={todayDeposit}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Today Withdraw"
            value={todayWithdraw}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="error"
            loading={isLoading}
          />
          <InfoCard
            label="Payment Transferred"
            value={paymentTransfer}
            icon="mingcute:transfer-3-fill"
            format={fShortCurrency}
            color="secondary"
            loading={isLoading}
          />
          <InfoCard
            label="Txn Charge"
            value={transactionsCharge}
            icon="bi:lightning-charge"
            format={fShortCurrency}
            color="secondary"
            loading={isLoading}
          />
          <Grid item xs={12}>
            <m.div variants={varFade().inLeft}>
              <TransactionTable />
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
