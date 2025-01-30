import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { FormProvider, RHFTextField } from "../../components/hook-form";
import useIsMountedRef from "../../hooks/useIsMountedRef";
import { trpc } from "../../trpc";

// ----------------------------------------------------------------------

interface FormValues {
  userId: string;
}

export default function ForgotPasswordForm({
  onSent,
}: {
  onSent: ({ email, userId }: { email: string; userId: string }) => void;
}) {
  const isMountedRef = useIsMountedRef();
  const ForgotPasswordSchema = Yup.object().shape({
    userId: Yup.string().required("User Id is required"),
  });

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: { userId: "" },
  });

  const { handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } =
    trpc.auth.forgotPassword.useMutation({
      onSuccess({ email, userId }) {
        onSent({ email, userId });
      },
    });

  const onSubmit = (data: FormValues) => mutate(data.userId);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="userId" label="User Id" />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
