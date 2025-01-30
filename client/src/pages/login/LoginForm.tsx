import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Link, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";

import {
  FormProvider,
  RHFCheckbox,
  RHFPasswordInput,
  RHFTextField,
} from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";

// ----------------------------------------------------------------------

export interface LoginFormValues {
  userId: string;
  password: string;
  remember: boolean;
  step: number;
}

export default function LoginForm({
  onSuccess,
}: {
  onSuccess: (email: string, data: LoginFormValues) => void;
}) {
  const { login, isAuthenticated } = useAuth();
  const { mutate: PostLogin, isLoading } = trpc.auth.login.useMutation({
    onSuccess(data, variables) {
      if ("accessToken" in data) {
        const { user, accessToken } = data;
        login({ accessToken, user });
      } else {
        const { twoFA, email } = data;
        if (twoFA) {
          onSuccess(email, variables);
        }
      }
    },
  });

  const LoginSchema = Yup.object().shape({
    userId: Yup.string().required("User Id is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    userId: "1006090",
    password: "admin790",
    remember: true,
    step: 1,
  };

  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;
  const onSubmit = (formData: LoginFormValues) => PostLogin(formData);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="userId" label="User Id / Username" />
        <RHFPasswordInput name="password" label="Password" />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <RHFCheckbox name="remember" label="Remember me" />
        <Link
          component={RouterLink}
          variant="subtitle2"
          to={APP_PATH.resetPassword}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
