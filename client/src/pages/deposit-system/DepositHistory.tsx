// components
import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";
import { fShortCurrency } from "../../utils/formatNumber";
import DepositHistoryTable from "./DepositHistoryTable";
import { InfoCard } from "../dashboard/InfoCard";

const DepositHistory = () => {
  const initialData = {
    wallet: 0,
    deposit: 0,
    depositInReview: 0,
  };

  const { data, isLoading } = trpc.dashboard.cards.useQuery();
  const cards = data! ?? initialData;

  return (
    <Page title="Deposit History">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Deposit History"
        links={[{ name: "Dashboard" }, { name: "Deposit History" }]}
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
          label="Total Deposit"
          value={cards.deposit}
          format={fShortCurrency}
          color="secondary"
          icon="uil:money-insert"
        />
        <InfoCard
          loading={isLoading}
          color="warning"
          label="Deposit In Review"
          value={cards.depositInReview}
          format={fShortCurrency}
          icon="fluent:clock-arrow-download-20-regular"
        />
        <Grid item xs={12}>
          <DepositHistoryTable />
        </Grid>
      </Grid>
    </Page>
  );
};

export default DepositHistory;
