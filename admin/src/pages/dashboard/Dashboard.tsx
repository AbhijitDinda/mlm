import { Container, Grid } from "@mui/material";
import { m } from "framer-motion";

import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { MotionViewport, varFade } from "../../components/animate";
import { RESPONSIVE_GAP } from "../../config";
import useSettings from "../../hooks/useSettings";
import { trpc } from "../../trpc";
import { fShortCurrency } from "../../utils/formatNumber";
import { InfoCard } from "./InfoCard";
import NoticeCard from "./NoticeCard";

const Dashboard = () => {
  const { data, isLoading } = trpc.dashboard.cards.useQuery();
  const { themeStretch } = useSettings();

  return (
    <Page title="Dashboard">
      <HeaderBreadcrumbs heading="Dashboard" links={[{ name: "Home" }]} />
      <Container
        maxWidth={themeStretch ? false : "lg"}
        disableGutters
        component={MotionViewport}
      >
        <Grid container spacing={RESPONSIVE_GAP}>
          <InfoCard
            label="Today Joining"
            value={data?.todayJoining}
            icon="heroicons:user-group"
            loading={isLoading}
            color="primary"
          />
          <InfoCard
            label="Left Joining"
            value={data?.leftJoining}
            icon="icon-park-outline:people-left"
            color="primary"
            loading={isLoading}
          />
          <InfoCard
            label="Right Joining"
            value={data?.rightJoining}
            icon="icon-park-outline:people-right"
            color="primary"
            loading={isLoading}
          />
          <InfoCard
            label="Active Users"
            value={data?.activeUsers}
            icon="heroicons:user-group"
            color="primary"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Deposits"
            value={data?.pendingDepositRequest}
            icon="fluent:clock-arrow-download-20-regular"
            color="warning"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Deposit"
            value={data?.pendingDeposit}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="warning"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Withdraws"
            value={data?.pendingWithdrawRequest}
            icon="fluent:clock-arrow-download-20-regular"
            color="warning"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Withdraw"
            value={data?.pendingWithdraw}
            icon="fluent:clock-arrow-download-20-regular"
            format={fShortCurrency}
            color="warning"
            loading={isLoading}
          />
          <InfoCard
            label="Total Deposit"
            value={data?.totalDeposit}
            icon="game-icons:take-my-money"
            format={fShortCurrency}
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Total Withdraw"
            value={data?.totalWithdraw}
            icon="uil:money-withdraw"
            format={fShortCurrency}
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Tickets"
            value={data?.pendingTickets}
            icon="material-symbols:contact-support-outline"
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Active Tickets"
            value={data?.activeTickets}
            icon="material-symbols:contact-support-outline"
            color="info"
            loading={isLoading}
          />
          <InfoCard
            label="Pending Kyc"
            value={data?.pendingKyc}
            icon="mdi:user-card-details-outline"
            color="warning"
            loading={isLoading}
          />
        </Grid>
        <m.div variants={varFade().inLeft}>
          <NoticeCard />
        </m.div>
      </Container>
    </Page>
  );
};

export default Dashboard;
