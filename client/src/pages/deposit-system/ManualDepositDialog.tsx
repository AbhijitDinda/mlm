import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import CurrencyTextField from "../../components/CurrencyTextField";
import FormLabel from "../../components/FormLabel";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFDatePicker from "../../components/hook-form/RHFDatePicker";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { RHFUploadSingleFile } from "../../components/hook-form/RHFUpload";
import Iconify from "../../components/Iconify";
import { UploadSingleFile } from "../../components/upload";
import IconifyIcons from "../../IconifyIcons";
import { APP_PATH } from "../../routes/paths";
import { trpc, RouterOutput } from "../../trpc";
import { fCurrency, fPercent } from "../../utils/formatNumber";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function getPayableAmount(
  amount: number,
  chargeType: "fixed" | "percent",
  charge: number
) {
  if (chargeType !== "fixed") charge = (amount * charge) / 100;
  return Number(amount) + charge;
}

interface FormValues {
  _id: string;
  amount: number;
  transactionId: string;
  transactionDate: string;
  paymentImage: string;
}

export type Gateway = RouterOutput["manualDeposit"]["methods"][number];

const ManualDepositDialog = ({
  selectedGatewayData,
  selectedId,
  open,
  onClose,
}: {
  selectedId: string | null;
  selectedGatewayData: Gateway;
  open: boolean;
  onClose: () => void;
}) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const defaultValues: FormValues = {
    _id: selectedId!,
    amount: "" as any as number,
    transactionId: "",
    transactionDate: "",
    paymentImage: "",
  };

  const validationSchemes = yup.object().shape({
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Amount is required"),
    transactionId: yup.string().required("Transaction Id is required"),
    paymentImage: yup.string().required("Payment Image is required"),
    transactionDate: yup.string().required("Transaction Date is required"),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchemes),
  });

  const { handleSubmit, setValue } = methods;
  const { mutate, isLoading: isSubmitting } =
    trpc.manualDeposit.payment.useMutation({
      onSuccess() {
        utils.deposit.history.invalidate();
        utils.dashboard.cards.invalidate();
        onClose();
        navigate(APP_PATH.depositSystem.history);
      },
    });

  const onSubmit = (formData: FormValues) => mutate(formData);
  const { minDeposit, maxDeposit, charge, chargeType } = selectedGatewayData;

  const [isConfirm, setIsConfirm] = useState(false);
  const [amount, setAmount] = useState(minDeposit ?? "");
  const [payableAmount, setPayableAmount] = useState(minDeposit ?? 0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _amount = Number(value);
    setAmount(_amount);
    setPayableAmount(getPayableAmount(_amount, chargeType, charge));
  };

  useEffect(() => {
    setValue("amount", amount);
  }, [amount]);

  useEffect(() => {
    minDeposit && setAmount(minDeposit);
    minDeposit &&
      setPayableAmount(getPayableAmount(minDeposit, chargeType, charge));
  }, [minDeposit]);

  const handlePayNowSubmit = () => {
    if (amount < minDeposit)
      toast.error(`Minimum deposit is ${fCurrency(minDeposit)}`);
    else if (amount > maxDeposit)
      toast.error(`Maximum deposit is ${fCurrency(maxDeposit)}`);
    else setIsConfirm(true);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-container > .MuiPaper-root": {
          bgcolor: "background.default",
        },
      }}
      maxWidth={"lg"}
      open={open}
      onClose={onClose}
      //@ts-ignore
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <IconButton
          sx={{ position: "absolute", right: 12, top: 6 }}
          edge="start"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <Iconify icon={IconifyIcons.close} />
        </IconButton>
      </DialogTitle>
      <Stack
        sx={{ flexGrow: 1, py: 4 }}
        direction="row"
        justifyContent={"center"}
        alignItems="center"
      >
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert sx={{ mb: 1 }} severity="info">
                Please make the payment to the payee details mentioned below.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailCard details={selectedGatewayData.details} />
              <Alert sx={{ mt: 1 }} severity="error">
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Deposit Limit : {fCurrency(minDeposit)}
                  <Box sx={{ mx: 0.5 }} component={"span"}>
                    -
                  </Box>
                  {fCurrency(maxDeposit)}
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              {isConfirm ? (
                <Card>
                  <CardHeader
                    title={
                      <>
                        <IconButton
                          sx={{ mr: 1 }}
                          onClick={() => setIsConfirm(false)}
                        >
                          <Iconify icon={IconifyIcons.leftArrow} />
                        </IconButton>
                        Details
                      </>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <FormProvider
                      methods={methods}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Stack spacing={3}>
                        <RHFTextField
                          maskCurrency
                          disabled
                          name="amount"
                          label="Amount"
                        />
                        <CurrencyTextField
                          value={payableAmount}
                          disabled
                          label="Payable Amount"
                        />
                        <RHFTextField
                          name="transactionId"
                          label="Transaction Id"
                        />
                        <RHFDatePicker
                          name="transactionDate"
                          label="Transaction Date"
                        />
                        <Box>
                          <FormLabel label="Payment Image" />
                          <RHFUploadSingleFile
                            setValue={setValue}
                            name="paymentImage"
                          />
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <LoadingButton type="submit" loading={isSubmitting}>
                            Submit
                          </LoadingButton>
                        </Box>
                      </Stack>
                    </FormProvider>
                  </CardContent>
                </Card>
              ) : (
                <Stack spacing={3}>
                  <CurrencyTextField
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth
                    label="Amount to Deposit"
                  />
                  <SummarySection
                    onSubmit={handlePayNowSubmit}
                    selectedGatewayData={selectedGatewayData}
                    amount={amount}
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
        </Container>
      </Stack>
    </Dialog>
  );
};

function DetailCard({
  details,
}: {
  details: { label: string; type: "input" | "image"; value: string }[];
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

function SummarySection({
  amount,
  onSubmit,
  selectedGatewayData,
}: {
  amount: number;
  onSubmit: () => void;
  selectedGatewayData: Gateway;
}) {
  
  const {
    chargeType,
    maxDeposit,
    minDeposit,
    name,
    charge: gatewayCharge,
  } = selectedGatewayData;

  let charge = gatewayCharge;
  if (chargeType !== "fixed") charge = (amount * charge) / 100;
  const payableAmount = amount + charge;
  const chargeText = fCurrency(charge);

  return (
    <Grid item flexGrow={4}>
      <Card>
        <CardHeader title="Summary" />
        <CardContent sx={{ pt: 0 }}>
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography color={"text.secondary"}>Payment Method</Typography>
              <Typography variant="subtitle1">{name}</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography color={"text.secondary"}>Amount</Typography>
              <Typography variant="subtitle1">{fCurrency(amount)}</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography color={"text.secondary"}>
                Charge
                {chargeType !== "fixed" && (
                  <Typography
                    sx={{ mx: 1 }}
                    variant="body2"
                    color="text.disabled"
                    component={"span"}
                  >
                    ({fPercent(gatewayCharge)})
                  </Typography>
                )}
              </Typography>
              <Typography variant="subtitle1">{chargeText}</Typography>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography color={"text.secondary"}>Payable Amount</Typography>
              <Typography variant="subtitle1">
                {fCurrency(payableAmount)}
              </Typography>
            </Stack>
            <Button onClick={onSubmit} variant="contained" size="large">
              Pay Now
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Stack spacing={3}>
          <Stack direction={"row"} alignItems="center" sx={{ gap: 2 }}>
            <Iconify
              sx={{ fontSize: 32, color: "text.disabled" }}
              icon="ri:secure-payment-fill"
            />
            <Typography color={"text.disabled"}>
              Additional Level Of Payment Security.
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems="center" sx={{ gap: 2 }}>
            <Iconify
              sx={{ fontSize: 32, color: "text.disabled" }}
              icon="material-symbols:lock-clock"
            />
            <Typography color={"text.disabled"}>
              2048-Bit Strong SSL Security.
            </Typography>
          </Stack>
          <Stack direction={"row"} alignItems="center" sx={{ gap: 2 }}>
            <Iconify
              sx={{ fontSize: 32, color: "text.disabled" }}
              icon="icon-park-solid:protect"
            />
            <Typography color={"text.disabled"}>
              Safe and Secure Payments.
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Grid>
  );
}

export default ManualDepositDialog;
