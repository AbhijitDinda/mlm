import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

// ----------------------------------------------------------------------

interface FormValues {
  email: string;
}

export default function SendTestEmail() {
  const ChangePassWordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email Address  is required")
      .email("Email Address is not valid"),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.sendTestMail.useMutation({
      onSuccess() {
        reset();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <Card>
      <CardHeader
        title="Email Setting"
        subheader="You can send a test mail to check if your mail server is working."
        sx={{
          "& .MuiCardHeader-subheader": {
            color: "info.main",
          },
        }}
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField name="email" type="email" label="Email Address" />
            <LoadingButton
              sx={{ marginLeft: "auto !important" }}
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Send Email
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
