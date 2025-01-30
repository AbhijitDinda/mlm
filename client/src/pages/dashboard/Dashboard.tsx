import { Grid } from "@mui/material";

import ApiError from "../../components/ApiError";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";
import { fShortCurrency } from "../../utils/formatNumber";
import { InfoCard } from "./InfoCard";
import NoticeCard from "./NoticeCard";
import ReactivationAlert from "./ReactivationAlert";

export default function Dashboard() {
  const { data, isLoading, error } = trpc.dashboard.cards.useQuery();
  if (error) return <ApiError error={error} />;

  return (
    <Page title="Dashboard">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs heading="Dashboard" links={[{ name: "Dashboard" }]} />
      {/* Breadcrumb End */}

      <Grid container spacing={RESPONSIVE_GAP}>
        <ReactivationAlert />
        <InfoCard
          loading={isLoading}
          label="Wallet"
          value={data?.wallet}
          format={fShortCurrency}
          color="primary"
          icon="teenyicons:wallet-alt-outline"
        />
        <InfoCard
          loading={isLoading}
          label="Total Income"
          value={data?.totalIncome}
          format={fShortCurrency}
          color="primary"
          icon="game-icons:take-my-money"
        />
        <InfoCard
          loading={isLoading}
          label="Referral Income"
          value={data?.referralIncome}
          format={fShortCurrency}
          color="primary"
          icon="game-icons:take-my-money"
        />
        <InfoCard
          loading={isLoading}
          label="Pair Income"
          value={data?.pairIncome}
          format={fShortCurrency}
          icon="game-icons:take-my-money"
        />
        <InfoCard
          loading={isLoading}
          label="Indirect Reward"
          value={data?.indirectReward}
          format={fShortCurrency}
          icon="game-icons:take-my-money"
        />
        <InfoCard
          loading={isLoading}
          label="Total Team"
          value={data?.totalTeam}
          color="error"
          icon="heroicons:user-group"
        />
        <InfoCard
          loading={isLoading}
          label="Left Count"
          value={data?.leftCount}
          color="error"
          icon="icon-park-outline:people-left"
        />
        <InfoCard
          loading={isLoading}
          label="Right Count"
          value={data?.rightCount}
          color="error"
          icon="icon-park-outline:people-right"
        />
        <InfoCard
          loading={isLoading}
          label="Direct Referral"
          value={data?.directReferral}
          color="error"
          icon="bi:people"
        />
        <InfoCard
          loading={isLoading}
          label="Today Indirect Referral"
          value={data?.todayIndirectReferral}
          color="error"
          icon="bi:people"
        />
        <InfoCard
          loading={isLoading}
          label="Today Pair Count"
          value={data?.todayPairCount}
          color="error"
          icon="icon-park-outline:people-right"
        />
        <InfoCard
          loading={isLoading}
          label="Last Deposit"
          value={data?.lastDeposit}
          format={fShortCurrency}
          color="secondary"
          icon="uil:money-insert"
        />
        <InfoCard
          loading={isLoading}
          label="Last Withdraw"
          value={data?.lastWithdraw}
          format={fShortCurrency}
          color="secondary"
          icon="uil:money-withdraw"
        />
        <InfoCard
          loading={isLoading}
          label="Total Withdraw"
          value={data?.withdraw}
          format={fShortCurrency}
          color="secondary"
          icon="uil:money-withdraw"
        />
        <InfoCard
          loading={isLoading}
          color="warning"
          label="Deposit In Review"
          value={data?.depositInReview}
          format={fShortCurrency}
          icon="fluent:clock-arrow-download-20-regular"
        />
        <InfoCard
          loading={isLoading}
          color="warning"
          label="Pending Withdraw"
          value={data?.pendingWithdraw}
          format={fShortCurrency}
          icon="fluent:clock-arrow-download-20-regular"
          rotate={2}
        />
      </Grid>
      <NoticeCard />
    </Page>
  );
}
