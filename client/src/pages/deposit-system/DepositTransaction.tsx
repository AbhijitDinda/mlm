import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ApiError from "../../components/ApiError";

import AnimatedBox from "../../components/AnimatedBox";
import CurrencyTextField from "../../components/CurrencyTextField";
import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import LoadingProgress from "../../components/LoadingProgress";
import Page from "../../components/Page";
import { UploadSingleFile } from "../../components/upload";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDate, fDateTime } from "../../utils/formatTime";

export const DepositTransaction = ({ breadcrumb = true }) => {
  const params = useParams();
  const { id: transactionId } = params;
  if (!transactionId) return null;

  const { data, isLoading, error } =
    trpc.deposit.detail.useQuery(transactionId);
  const response = data! ?? {};

  const {
    userId,
    amount,
    charge,
    netAmount,
    createdAt,
    updatedAt,
    message,
    status,
    type,
    actionBy,
    details,
  } = response;
  const gateway = response.gateway ?? {};
  if (error) return <ApiError error={error} />;

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <Page title={`Deposit Details #${transactionId}`}>
      {breadcrumb && (
        <HeaderBreadcrumbs
          heading="Deposit Details"
          links={[
            {
              name: "Dashboard",
              href: APP_PATH.dashboard,
            },
            {
              name: "Deposits",
              href: APP_PATH.depositSystem.history,
            },
            {
              name: `Deposit #${transactionId}`,
            },
          ]}
        />
      )}

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12}>
          <AnimatedBox>
            {actionBy === "admin" ? (
              <Alert>
                <AlertTitle>Deposit By Admin</AlertTitle>
                {fCurrency(netAmount)} has been deposit on{" "}
                {fDateTime(updatedAt)}
              </Alert>
            ) : (
              <>
                {status === "pending" && (
                  <Alert severity="warning">
                    <AlertTitle>Deposit Pending</AlertTitle>
                    Your deposit of {fCurrency(netAmount)} is in pending since{" "}
                    {fDateTime(createdAt)}
                  </Alert>
                )}

                {status === "review" && (
                  <Alert severity="warning">
                    <AlertTitle>Deposit In Review</AlertTitle>
                    You have requested to deposit {fCurrency(netAmount)} at{" "}
                    {fDateTime(createdAt)}
                  </Alert>
                )}

                {status === "approved" && (
                  <Alert severity="success">
                    <AlertTitle>Deposit Approved</AlertTitle>
                    Your deposit of {fCurrency(netAmount)} has been successful
                    at {fDateTime(updatedAt)}
                  </Alert>
                )}

                {status === "credit" && (
                  <Alert severity="success">
                    <AlertTitle>Deposit Credit</AlertTitle>
                    Your deposit of {fCurrency(netAmount)} has been successful
                    at {fDateTime(updatedAt)}
                  </Alert>
                )}

                {status === "rejected" && (
                  <Alert severity="error">
                    <AlertTitle>Deposit Rejected</AlertTitle>
                    Your deposit of {fCurrency(netAmount)} has been rejected at{" "}
                    {fDateTime(updatedAt)}
                  </Alert>
                )}

                {status === "cancelled" && (
                  <Alert severity="info">
                    <AlertTitle>Deposit Cancelled</AlertTitle>
                    {userId} has requested to deposit {fCurrency(netAmount)} at{" "}
                    {fDateTime(createdAt)}
                  </Alert>
                )}

                {status === "failed" && (
                  <Alert severity="error">
                    <AlertTitle>Deposit Failed</AlertTitle>
                    Your deposit of {fCurrency(netAmount)} has been failed at{" "}
                    {fDateTime(updatedAt)}
                  </Alert>
                )}
              </>
            )}
          </AnimatedBox>

          {!!message && (
            <AnimatedBox>
              <Alert sx={{ mt: RESPONSIVE_GAP }} severity="info">
                {message}
              </Alert>
            </AnimatedBox>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={RESPONSIVE_GAP}>
            {actionBy === "user" && (
              <AnimatedBox>
                <PayeeDetailsCard details={details!.gateway} />
              </AnimatedBox>
            )}

            <AnimatedBox>
              <Card>
                <CardHeader title="Summary" />
                <CardContent sx={{ pt: 0 }}>
                  <Stack spacing={3}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography color={"text.secondary"}>
                        Payment Method
                      </Typography>
                      <Typography variant="subtitle1">
                        {gateway.name}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography color={"text.secondary"}>Amount</Typography>
                      <Typography variant="subtitle1">
                        {fCurrency(netAmount)}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography color={"text.secondary"}>Charge</Typography>
                      <Typography variant="subtitle1">
                        {fCurrency(charge)}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Typography color={"text.secondary"}>
                        Payable Amount
                      </Typography>
                      <Typography variant="subtitle1">
                        {fCurrency(amount)}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </AnimatedBox>
          </Stack>
        </Grid>
        {actionBy === "user" && (
          <Grid item xs={12} md={6}>
            <AnimatedBox>
              <UserDetailsCard
                charge={charge}
                netAmount={amount}
                details={details!.user}
              />
            </AnimatedBox>
          </Grid>
        )}
      </Grid>
    </Page>
  );
};

function PayeeDetailsCard({
  details,
}: {
  details: {
    label: string;
    type: "input" | "image";
    value: string;
  }[];
}) {
  return (
    <Card>
      <CardHeader title="Payee Details" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          {details.map(({ label, type, value }, index) => {
            if (type === "input")
              return (
                <TextField key={index} label={label} disabled value={value} />
              );
            else
              return (
                <Box key={index}>
                  <FormLabel label={label} />
                  <UploadSingleFile disabled file={value} />
                </Box>
              );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

function UserDetailsCard({
  charge,
  netAmount,
  details,
}: {
  charge: number;
  netAmount: number;
  details: {
    transactionId: string;
    paymentImage: string;
    transactionDate: string;
  };
}) {
  const { transactionId, paymentImage, transactionDate } = details;
  return (
    <Card>
      <CardHeader title="Your payment Details" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <CurrencyTextField
            label={"Amount"}
            disabled
            value={`${Number(netAmount) - Number(charge)}`}
          />
          <CurrencyTextField
            label={"Payable Amount"}
            disabled
            value={netAmount}
          />
          <TextField
            label={"Your Transaction Id"}
            disabled
            value={transactionId}
          />
          <TextField
            label={"Your Transaction Date"}
            disabled
            value={fDate(transactionDate)}
          />
          <Box>
            <FormLabel label={"Payment Image"} />
            <UploadSingleFile disabled file={paymentImage} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DepositTransaction;
