import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fShortCurrency } from "../../utils/formatNumber";
import WithdrawHistoryTable from "./WithdrawHistoryTable";
import { InfoCard } from "../dashboard/InfoCard";

const WithdrawHistory = () => {
  const initialData = {
    wallet: 0,
    withdraw: 0,
    pendingWithdraw: 0,
  };

  const { data, isLoading } = trpc.dashboard.cards.useQuery();
  const cards = data! ?? initialData;

  return (
    <Page title="Withdraw History">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Withdraw History"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Withdraw History" },
        ]}
      />
      {/* Breadcrumb End */}

      <Grid container spacing={RESPONSIVE_GAP}>
        <InfoCard
          loading={isLoading}
          label="Wallet"
          value={cards.wallet}
          format={fShortCurrency}
          color="primary"
          icon="teenyicons:wallet-alt-outline"
        />
        <InfoCard
          loading={isLoading}
          label="Total Withdraw"
          value={cards.withdraw}
          format={fShortCurrency}
          color="error"
          icon="uil:money-withdraw"
        />
        <InfoCard
          loading={isLoading}
          color="warning"
          label="Pending Withdraw"
          value={cards.pendingWithdraw}
          format={fShortCurrency}
          icon="fluent:clock-arrow-download-20-regular"
          rotate={2}
        />
        <Grid item xs={12}>
          <WithdrawHistoryTable />
        </Grid>
      </Grid>
    </Page>
  );
};

export default WithdrawHistory;
