import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Page from "../../components/Page";
import { UploadSingleFile } from "../../components/upload";
import { RESPONSIVE_GAP } from "../../config";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDatePicker } from "../../utils/formatTime";
import { LabelFormValues } from "./AddWithdrawMethod";

const Input = ({
  userData,
  label,
  inputType,
  fileExtensions,
  dropdownOptions,
  name,
}: LabelFormValues & {
  userData: {
    [x: string]: string;
  };
}) => {
  let value = userData[name];
  if (inputType === "date" && !!value) {
    value = fDatePicker(value);
  }
  switch (inputType) {
    case "input":
    case "date":
      return <TextField disabled value={value} label={label} />;
    case "dropdown":
      return <TextField disabled value={value} label={label} />;
    case "textarea":
      return (
        <TextField disabled multiline minRows={4} value={value} label={label} />
      );
    case "file": {
      return (
        <Box>
          <FormLabel label={label} />
          <UploadSingleFile disabled file={userData[name]} />
        </Box>
      );
    }
  }
};

interface FormValues {
  wallet: any;
  amount: number;
  charge: number;
  finalAmount: number;
  _id: string;
}

const WithdrawPayment = () => {
  const utils = trpc.useContext();
  const params = useParams();
  const { id: gatewayId } = params;
  const navigate = useNavigate();
  if (!gatewayId) return null;

  const { data, isLoading } = trpc.withdraw.getGatewayData.useQuery(gatewayId);
  const { userData, wallet = 0, isUpdated, gateway } = data! ?? {};

  const {
    minWithdraw,
    maxWithdraw,
    charge,
    chargeType,
    details = [],
  } = gateway ?? {};

  useEffect(() => {
    isUpdated && navigate(APP_PATH.withdrawSystem.addMethod + "/" + gatewayId);
  }, [isUpdated]);

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Amount is required"),
  });

  const defaultValues = {
    wallet: wallet,
    amount: 0,
    charge: 0,
    finalAmount: 0,
    _id: gatewayId,
  };

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, setValue, watch } = methods;

  const amount = watch("amount");

  const calculateCharge = () => {
    if (chargeType === "fixed") return charge;
    return amount === 0 ? 0 : (amount * charge) / 100;
  };

  const calculateFinalAmount = () => {
    const charge = calculateCharge();
    return Number(amount) - Number(charge);
  };

  useEffect(() => {
    setValue("charge", calculateCharge());
    setValue("finalAmount", calculateFinalAmount());
  }, [amount]);

  useEffect(() => {
    setValue("wallet", wallet);
  }, [wallet]);

  useEffect(() => {
    if (!minWithdraw) return;
    setValue("amount", minWithdraw);
  }, [minWithdraw]);

  const { mutate, isLoading: isSubmitting } =
    trpc.withdraw.withdrawPayment.useMutation({
      onSuccess() {
        utils.withdraw.history.invalidate();
        utils.dashboard.cards.invalidate()
        navigate(APP_PATH.withdrawSystem.history);
      },
    });

  const onSubmit = async (formData: FormValues) => mutate(formData);

  return (
    <Page title="Withdraw Payment">
      <HeaderBreadcrumbs
        heading="Withdraw Payment"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Withdraw", href: APP_PATH.withdrawSystem.methods },
          { name: "Withdraw Payment" },
        ]}
      />
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={RESPONSIVE_GAP}>
          <Grid item xs={12} md={6}>
            <Stack spacing={RESPONSIVE_GAP}>
              <Card>
                <CardHeader title={`Your ${name} details`} />
                <Divider />
                <CardContent>
                  <Stack spacing={3}>
                    {details.map((a) => {
                      return <Input userData={userData} key={a.name} {...a} />;
                    })}
                  </Stack>
                </CardContent>
              </Card>
              <Alert sx={{ mt: 1 }} severity="error">
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Withdraw Limit : {fCurrency(minWithdraw)}
                  <Box sx={{ mx: 0.5 }} component={"span"}>
                    -
                  </Box>
                  {fCurrency(maxWithdraw)}
                </Typography>
              </Alert>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Withdraw Details" />
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
                      name="wallet"
                      label={"Available Balance"}
                    />
                    <RHFTextField maskCurrency name="amount" label={"Amount"} />
                    <RHFTextField
                      maskCurrency
                      disabled
                      name="charge"
                      label={`Withdraw Charge ${
                        chargeType === "percent" ? `(${charge}%)` : ""
                      } `}
                    />
                    <RHFTextField
                      maskCurrency
                      disabled
                      name="finalAmount"
                      label={"Final Amount"}
                    />
                    <Box sx={{ textAlign: "right" }}>
                      <LoadingButton
                        type="submit"
                        size="large"
                        variant="contained"
                        loading={isSubmitting}
                      >
                        Withdraw
                      </LoadingButton>
                    </Box>
                  </Stack>
                </FormProvider>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Page>
  );
};

export default WithdrawPayment;
