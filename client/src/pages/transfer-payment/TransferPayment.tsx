import { Grid } from "@mui/material";
import AnimatedBox from "../../components/AnimatedBox";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import TransferPaymentHistory from "./TransferPaymentHistory";
import TransferPaymentOverview from "./TransferPaymentOverview";
import TransferPaymentQuickTransfer from "./TransferPaymentQuickTransfer";

const TransferPayment = () => {
  const { data, isLoading } = trpc.transferPayment.wallet.useQuery();
  const { receivedAmount, transferredAmount, wallet } = data! ?? {};

  return (
    <Page title="Transfer Payment">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Transfer Payment"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Transfer Payment" },
        ]}
      />
      {/* Breadcrumb End */}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={8}>
          <AnimatedBox>
            <TransferPaymentOverview
              receivedAmount={receivedAmount}
              transferredAmount={transferredAmount}
              loading={isLoading}
            />
          </AnimatedBox>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AnimatedBox>
            <TransferPaymentQuickTransfer
              receivedAmount={receivedAmount}
              transferredAmount={transferredAmount}
              loading={isLoading}
              wallet={wallet}
            />
          </AnimatedBox>
        </Grid>

        <Grid item xs={12}>
          <AnimatedBox>
            <TransferPaymentHistory />
          </AnimatedBox>
        </Grid>
      </Grid>
    </Page>
  );
};

export default TransferPayment;
