import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFCheckbox } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

interface FormValues {
  registrationSuccess: boolean;
  paymentTransfer: boolean;
  paymentDeposit: boolean;
  paymentWithdraw: boolean;
}

const EmailPreferences = () => {
  const utils = trpc.useContext();
  const { data, isLoading } =
    trpc.systemConfiguration.getEmailPreferences.useQuery();
  const defaultValues = {
    registrationSuccess: false,
    paymentTransfer: false,
    paymentDeposit: false,
    paymentWithdraw: false,
  };
  const methods = useForm<FormValues>({
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.updateEmailPreferences.useMutation({
      onSuccess(data, variables) {
        utils.systemConfiguration.getEmailPreferences.setData(
          undefined,
          variables
        );
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    data && reset(data);
  }, [data]);

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader title="Email Preferences" sx={{ pb: 2 }} />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <Stack spacing={2} sx={{ width: 1 }}>
              <RHFCheckbox
                name="registrationSuccess"
                label={
                  <Stack sx={{ ml: 1 }}>
                    <Typography variant="overline">
                      Successful Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive an email on successful registration.
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0 }}
              />
              <Divider />
              <RHFCheckbox
                name="paymentTransfer"
                label={
                  <Stack sx={{ ml: 1 }}>
                    <Typography variant="overline">Transfer Payment</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive an email on successful transferred and received
                      payment .
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0 }}
              />
              <Divider />
              <RHFCheckbox
                name="paymentDeposit"
                label={
                  <Stack sx={{ ml: 1 }}>
                    <Typography variant="overline">Payment Deposit</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive an email on payment deposit request, reject and
                      success.
                    </Typography>
                  </Stack>
                }
                sx={{ m: 0 }}
              />

              <Divider />
              <RHFCheckbox
                label={
                  <Stack sx={{ ml: 1 }}>
                    <Typography variant="overline">Payment Withdraw</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive an email on payment withdraw request, reject and
                      success.
                    </Typography>
                  </Stack>
                }
                name="paymentWithdraw"
                sx={{ m: 0 }}
              />
            </Stack>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default EmailPreferences;
