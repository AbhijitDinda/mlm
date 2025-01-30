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
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import CurrencyTextField from "../../components/CurrencyTextField";
import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import { UploadSingleFile } from "../../components/upload";
import { RESPONSIVE_GAP } from "../../config";
import IconifyIcons from "../../IconifyIcons";
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

  const { mutate, isLoading: isSubmitting } = trpc.withdraw.approve.useMutation(
    {
      onSuccess() {
        utils.withdraw.list.invalidate();
        utils.withdraw.detail.invalidate(transactionId);
        navigate(APP_PATH.withdraw.pending);
      },
    }
  );
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
    defaultValues: { message: "", id: transactionId },
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } = trpc.withdraw.reject.useMutation({
    onSuccess() {
      utils.withdraw.list.invalidate();
      utils.withdraw.detail.invalidate(transactionId);
      navigate(APP_PATH.withdraw.pending);
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

const WithdrawTransaction = ({ breadcrumb = true }) => {
  const params = useParams();
  const { id: transactionId } = params;
  if (!transactionId) return null;
  const { data, isLoading } = trpc.withdraw.detail.useQuery(transactionId);
  const response = data! ?? {};

  const {
    actionBy,
    userId,
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

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const handleApproveClose = () => setApproveOpen(false);
  const handleRejectClose = () => setRejectOpen(false);

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Page title={`Withdraw Details #${transactionId}`}>
      {breadcrumb && (
        <HeaderBreadcrumbs
          heading="Withdraw Details"
          links={[
            {
              name: "Withdraws",
              href: APP_PATH.withdraw.all,
            },
            {
              name: `Withdraw #${transactionId}`,
            },
          ]}
        />
      )}

      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {actionBy === "admin" ? (
              <Alert severity="success">
                <AlertTitle>Withdraw By Admin</AlertTitle>
                {fCurrency(amount)} withdrawn from {userId} on{" "}
                {fDateTime(createdAt)}
              </Alert>
            ) : (
              <>
                {status === "pending" && (
                  <>
                    <Dialog onClose={handleApproveClose} open={approveOpen}>
                      <DialogTitle>Accept Withdraw</DialogTitle>
                      <AcceptForm
                        transactionId={transactionId}
                        onClose={handleApproveClose}
                      />
                    </Dialog>

                    <Dialog onClose={handleRejectClose} open={rejectOpen}>
                      <DialogTitle>Reject Withdraw</DialogTitle>
                      <RejectForm
                        transactionId={transactionId}
                        onClose={handleRejectClose}
                      />
                    </Dialog>

                    <Alert severity="warning">
                      <AlertTitle>Withdraw Pending</AlertTitle>
                      {userId} request for withdraw on {fDateTime(createdAt)}
                    </Alert>
                  </>
                )}
                {status === "rejected" && (
                  <Alert severity="error">
                    <AlertTitle>Withdraw Rejected</AlertTitle>
                    You rejected the withdraw on {fDateTime(updatedAt)}
                  </Alert>
                )}
                {status === "success" && (
                  <Alert severity="success">
                    <AlertTitle>Withdraw Success</AlertTitle>
                    You approved the withdraw on {fDateTime(updatedAt)}
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
          {actionBy === "user" && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title={`User ${gateway.name} details`} />
                <Divider />
                <CardContent>
                  <Stack spacing={3}>
                    {details.map((a) => {
                      return <Input key={a.name} {...a} />;
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid sx={{ marginInline: "auto" }} item xs={12} md={6}>
            <Card>
              <CardHeader title="Withdraw Details" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <CurrencyTextField disabled value={amount} label={"Amount"} />
                  <CurrencyTextField
                    disabled
                    value={charge}
                    label={`Withdraw Charge ${gatewayChargeText}`}
                  />
                  <CurrencyTextField
                    disabled
                    value={netAmount}
                    label={"Final Amount"}
                  />
                  {status === "pending" && (
                    <Grid item xs={12}>
                      <Stack
                        justifyContent={"flex-end"}
                        direction="row"
                        spacing={3}
                      >
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
                    </Grid>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
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
