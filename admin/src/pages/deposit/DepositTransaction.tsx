import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import IconifyIcons from "../../IconifyIcons";
import ApiError from "../../components/ApiError";
import CurrencyTextField from "../../components/CurrencyTextField";
import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import LoadingProgress from "../../components/LoadingProgress";
import Page from "../../components/Page";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { UploadSingleFile } from "../../components/upload";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

interface FormValues {
  id: string;
  message: string;
}

const AcceptForm = ({
  onClose,
  transactionId,
}: {
  onClose: () => void;
  transactionId: string;
}) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: { id: transactionId, message: "" },
  });

  const { handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } = trpc.deposit.approve.useMutation({
    onSuccess() {
      utils.deposit.list.invalidate();
      utils.deposit.detail.invalidate(transactionId);
      navigate(APP_PATH.deposit.pending);
    },
  });

  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <RHFTextField
          multiline
          minRows={4}
          name="message"
          label="Message (optional)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" loading={isSubmitting}>
          Approve
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

const RejectForm = ({
  onClose,
  transactionId,
}: {
  onClose: () => void;
  transactionId: string;
}) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    message: yup.string().required("Message is required"),
  });
  const methods = useForm({
    defaultValues: { id: transactionId, message: "" },
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } = trpc.deposit.reject.useMutation({
    onSuccess() {
      utils.deposit.list.invalidate();
      utils.deposit.detail.invalidate(transactionId);
      navigate(APP_PATH.deposit.pending);
    },
  });

  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <RHFTextField multiline minRows={4} name="message" label="Message" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton type="submit" loading={isSubmitting}>
          Reject
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
};

const DepositTransaction = ({ breadcrumb = true }) => {
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
              name: "Deposits",
              href: APP_PATH.deposit.all,
            },
            {
              name: `Deposit #${transactionId}`,
            },
          ]}
        />
      )}

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12}>
          {actionBy === "admin" ? (
            <Alert>
              <AlertTitle>Deposit By Admin</AlertTitle>
              {fCurrency(amount)} has been deposit on {fDateTime(updatedAt)}
            </Alert>
          ) : (
            <>
              {status === "pending" && (
                <Alert severity="warning">
                  <AlertTitle>Deposit Pending</AlertTitle>
                  {userId} has requested to deposit {fCurrency(netAmount)} on{" "}
                  {fDateTime(createdAt)}
                </Alert>
              )}

              {status === "review" && (
                <Alert severity="warning">
                  <AlertTitle>Deposit In Review</AlertTitle>
                  {userId} has requested to deposit {fCurrency(netAmount)} on{" "}
                  {fDateTime(createdAt)}
                </Alert>
              )}

              {status === "approved" && (
                <Alert severity="success">
                  <AlertTitle>Deposit Approved</AlertTitle>
                  {userId} - deposit of {fCurrency(netAmount)} has been approved
                  at {fDateTime(updatedAt)}
                </Alert>
              )}

              {status === "credit" && (
                <Alert severity="success">
                  <AlertTitle>Deposit Credit</AlertTitle>
                  {userId} - deposit of {fCurrency(netAmount)} has been
                  successful at {fDateTime(updatedAt)}
                </Alert>
              )}

              {status === "rejected" && (
                <Alert severity="error">
                  <AlertTitle>Deposit Rejected</AlertTitle>
                  {userId} - deposit of {fCurrency(netAmount)} has been rejected
                  at {fDateTime(updatedAt)}
                </Alert>
              )}

              {status === "cancelled" && (
                <Alert severity="info">
                  <AlertTitle>Deposit Cancelled</AlertTitle>
                  {userId} has requested to deposit {fCurrency(netAmount)} on{" "}
                  {fDateTime(createdAt)}
                </Alert>
              )}

              {status === "failed" && (
                <Alert severity="error">
                  <AlertTitle>Deposit Failed</AlertTitle>
                  {userId} - deposit of {fCurrency(netAmount)} has been failed
                  at {fDateTime(updatedAt)}
                </Alert>
              )}
            </>
          )}

          {!!message && (
            <Alert sx={{ mt: RESPONSIVE_GAP }} severity="info">
              {message}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={RESPONSIVE_GAP}>
            {actionBy === "user" && (
              <PayeeDetailsCard details={details!.gateway} />
            )}
            <Card>
              <CardHeader title="Summary" />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={3}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography color={"text.secondary"}>
                      Payment Method
                    </Typography>
                    <Typography variant="subtitle1">{gateway.name}</Typography>
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
          </Stack>
        </Grid>
        {actionBy === "user" && (
          <Grid item xs={12} md={6}>
            <UserDetailsCard
              transactionId={transactionId}
              status={status}
              charge={charge}
              netAmount={amount}
              details={details!.user}
            />
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
  status,
  transactionId,
  charge,
  netAmount,
  details,
}: {
  status: string;
  transactionId: string;
  charge: number;
  netAmount: number;
  details: {
    transactionId: string;
    paymentImage: string;
    transactionDate: string;
  };
}) {
  const {
    transactionId: userTransactionId,
    paymentImage,
    transactionDate,
  } = details;
  const [approveOpen, setApproveOpen] = useState(false);
  const handleApproveClose = () => setApproveOpen(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const handleRejectClose = () => setRejectOpen(false);
  return (
    <Card>
      {status === "review" && (
        <Grid item xs={12}>
          <Dialog onClose={handleRejectClose} open={rejectOpen}>
            <DialogTitle>Reject Deposit</DialogTitle>
            <RejectForm
              transactionId={transactionId}
              onClose={handleRejectClose}
            />
          </Dialog>
          <Dialog onClose={handleApproveClose} open={approveOpen}>
            <DialogTitle>Approve Deposit</DialogTitle>
            <AcceptForm
              transactionId={transactionId}
              onClose={handleApproveClose}
            />
          </Dialog>
        </Grid>
      )}

      <CardHeader title="User Payment Details" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <TextField
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
            label={"User Transaction Id"}
            disabled
            value={userTransactionId}
          />
          {/* <TextField
            label={"User Transaction Date"}
            disabled
            value={fDate(transactionDate)}
          /> */}
          <Box>
            <FormLabel label={"Payment Image"} />
            <UploadSingleFile disabled file={paymentImage} />
          </Box>
          {status === "review" && (
            <Stack justifyContent={"flex-end"} direction="row" spacing={3}>
              <LoadingButton
                fullWidth
                variant="contained"
                color="error"
                size="large"
                startIcon={<Iconify icon={IconifyIcons.close} />}
                onClick={() => setRejectOpen(true)}
              >
                Reject
              </LoadingButton>
              <LoadingButton
                fullWidth
                variant="contained"
                color="success"
                size="large"
                startIcon={<Iconify icon={IconifyIcons.check} />}
                onClick={() => setApproveOpen(true)}
              >
                Approve
              </LoadingButton>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DepositTransaction;
