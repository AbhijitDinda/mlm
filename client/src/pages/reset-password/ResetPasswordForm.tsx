import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Link, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  FormProvider,
  RHFOtpInput,
  RHFPasswordInput,
  RHFTextField,
} from "../../components/hook-form";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";

interface FormValues {
  userId: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    otp: Yup.string().required("Otp is required").length(6, "Otp is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Maximum 20 characters are allowed"),
    confirmPassword: Yup.string()
      .required("ConfirmPassword is required")
      .oneOf([Yup.ref("password")], "Passwords are not matching"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      userId: userId,
      otp: "",
      password: "",
      confirmPassword: "",
    } as FormValues,
  });

  const { handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } =
    trpc.auth.resetPassword.useMutation({
      onSuccess() {
        navigate(APP_PATH.login);
      },
    });
  const onSubmit = (data: FormValues) => mutate(data);

  const { mutate: forgotPassword, isLoading: sendingCode } =
    trpc.auth.forgotPassword.useMutation();
  const handleResendCode = () => {
    if (isSubmitting) return;
    forgotPassword(userId);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField disabled name="userId" label="User Id" />
        <RHFOtpInput name="otp" />
        <RHFPasswordInput name="password" label="New Password" />
        <RHFPasswordInput name="confirmPassword" label="Confirm New Password" />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Reset Password
        </LoadingButton>
        <Typography variant="body2">
          Don't have a code?{" "}
          {sendingCode ? (
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "primary.main",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              Sending Code...
            </Typography>
          ) : (
            <Link sx={{ cursor: "pointer" }} onClick={handleResendCode}>
              Resend Code
            </Link>
          )}
        </Typography>
      </Stack>
    </FormProvider>
  );
}
