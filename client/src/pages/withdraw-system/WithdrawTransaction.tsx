import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ApiError from "../../components/ApiError";

import CurrencyTextField from "../../components/CurrencyTextField";
import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { UploadSingleFile } from "../../components/upload";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";
import AnimatedBox from "../../components/AnimatedBox";

export const WithdrawTransaction = ({ breadcrumb = true }) => {
  const params = useParams();
  const { id: transactionId } = params;
  if (!transactionId) return null;

  const { data, isLoading, error } =
    trpc.withdraw.transaction.useQuery(transactionId);
  const response = data! ?? {};

  const {
    actionBy,
    amount,
    charge,
    netAmount,
    details = [],
    message,
    status,
    createdAt,
    updatedAt,
  } = response;
  const gateway = response.gateway ?? {};
  const gatewayChargeText =
    gateway.chargeType === "percent" ? `(${gateway.charge}%)` : "";

  if (error) return <ApiError error={error} />;
  return isLoading ? (
    <LinearProgress />
  ) : (
    <Page title={`Withdraw Details #${transactionId}`}>
      {breadcrumb && (
        <HeaderBreadcrumbs
          heading="Withdraw Details"
          links={[
            {
              name: "Withdraw",
              href: APP_PATH.withdrawSystem.history,
            },
            {
              name: `Withdraw #${transactionId}`,
            },
          ]}
        />
      )}

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12}>
          <AnimatedBox>
            {actionBy === "admin" ? (
              <Stack spacing={RESPONSIVE_GAP}>
                <Alert severity="success">
                  <AlertTitle>Withdraw By Admin</AlertTitle>
                  Admin withdrawn {fCurrency(amount)} at {fDateTime(createdAt)}
                </Alert>
                {message && <Alert severity="info">{message}</Alert>}
              </Stack>
            ) : (
              <>
                {status === "pending" && (
                  <Alert severity="warning">
                    <AlertTitle>Withdraw Pending</AlertTitle>
                    You have requested to withdraw {fCurrency(amount)} at{" "}
                    {fDateTime(createdAt)}
                  </Alert>
                )}
                {status === "rejected" && (
                  <Stack spacing={RESPONSIVE_GAP}>
                    <Alert severity="error">
                      <AlertTitle>Withdraw Rejected</AlertTitle>
                      Your withdraw has been rejected at {fDateTime(updatedAt)}
                    </Alert>
                    {message && <Alert severity="info">{message}</Alert>}
                  </Stack>
                )}
                {status === "success" && (
                  <Stack spacing={RESPONSIVE_GAP}>
                    <Alert severity="success">
                      <AlertTitle>Withdraw Success</AlertTitle>
                      Your withdraw has been success at {fDateTime(updatedAt)}
                    </Alert>
                    {message && <Alert severity="info">{message}</Alert>}
                  </Stack>
                )}
              </>
            )}
          </AnimatedBox>
        </Grid>

        {actionBy !== "admin" && (
          <Grid item xs={12} md={6}>
            <AnimatedBox>
              <Card>
                <CardHeader title={`Your ${gateway.name} Details`} />
                <Divider />
                <CardContent>
                  <Stack spacing={3}>
                    {details.map((a) => {
                      return <Input key={a.name} {...a} />;
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </AnimatedBox>
          </Grid>
        )}

        <Grid sx={{ marginInline: "auto" }} item xs={12} md={6}>
          <AnimatedBox>
            <Card>
              <CardHeader title="Withdraw Details" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <CurrencyTextField disabled value={amount} label={"Amount"} />
                  <CurrencyTextField
                    value={charge}
                    disabled
                    label={`Withdraw Charge ${gatewayChargeText}`}
                  />
                  <CurrencyTextField
                    value={netAmount}
                    disabled
                    label={"Final Amount"}
                  />
                </Stack>
              </CardContent>
            </Card>
          </AnimatedBox>
        </Grid>
      </Grid>
    </Page>
  );
};

function Input({
  value,
  label,
  inputType,
}: {
  value: string;
  label: string;
  inputType: "date" | "input" | "dropdown" | "file" | "textarea";
}) {
  switch (inputType) {
    case "date":
      return <TextField disabled value={fDateTime(value)} label={label} />;
    case "input":
    case "textarea":
    case "dropdown":
      return <TextField disabled value={value} label={label} />;
    case "file": {
      return (
        <Box>
          <FormLabel label={label} />
          <UploadSingleFile disabled file={value} />
        </Box>
      );
    }
  }
  return null;
}

export default WithdrawTransaction;
