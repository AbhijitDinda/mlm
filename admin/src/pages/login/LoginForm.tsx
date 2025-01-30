import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  FormProvider,
  RHFCheckbox,
  RHFPasswordInput,
  RHFTextField,
} from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
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
  const { login } = useAuth();
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

  const navigate = useNavigate();

  const LoginSchema = yup.object().shape({
    userId: yup.string().required("User Id is required"),
    password: yup.string().required("Password is required"),
  });

  const defaultValues = {
    userId: "1006090",
    password: "admin790",
    remember: true,
    step: 1,
  };

  const methods = useForm({
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
