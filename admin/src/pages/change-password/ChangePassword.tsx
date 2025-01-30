import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { FormProvider, RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import { trpc } from "../../trpc";
import ChangePasswordVerifyCode from "./ChangePasswordVerifyCode";

export interface ChangePasswordFormValues {
  oldPassword: string;
  password: string;
  confirmPassword: string;
  step: number;
}

const ChangePassword = () => {
  const [open, setOpen] = useState(true);
  const onClose = () => setOpen(false);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<ChangePasswordFormValues | null>(null);

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Current Password is required"),
    password: Yup.string()
      .required("New Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Maximum 20 characters are allowed"),
    confirmPassword: Yup.string()
      .required("Confirm New Password is required")
      .oneOf([Yup.ref("password")], "Passwords are not matching"),
  });

  const defaultValues = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
    step: 1,
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const { mutate, isLoading, reset } = trpc.changePassword.update.useMutation({
    onSuccess(_, variables) {
      setStep(2);
      setOpen(true);
      setData(variables);
    },
  });

  const { handleSubmit } = methods;
  const onSubmit = async (data: ChangePasswordFormValues) => mutate(data);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const onSuccess = () => {
    reset();
    setStep(1);
  };

  return (
    <Card>
      {step === 2 && (
        <ChangePasswordVerifyCode
          open={open}
          onClose={onClose}
          onSuccess={onSuccess}
          data={data!}
        />
      )}
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader title="Change Password" />
        <Divider />
      </Box>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              autoComplete="new-password"
              name="oldPassword"
              type={showPassword ? "text" : "password"}
              label="Current Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle Password"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Iconify icon={"eva:eye-off-fill"} />
                      ) : (
                        <Iconify icon={"eva:eye-fill"} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="password"
              type={showPassword ? "text" : "password"}
              label="New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle Password"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Iconify icon={"eva:eye-off-fill"} />
                      ) : (
                        <Iconify icon={"eva:eye-fill"} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              label="Confirm New Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle Password"
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Iconify icon={"eva:eye-off-fill"} />
                      ) : (
                        <Iconify icon={"eva:eye-fill"} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Alert icon={false} variant="outlined" severity="error">
              <AlertTitle>Password Requirements</AlertTitle>
              <List
                sx={{
                  listStyle: "disc inside",
                  "& li": { display: "list-item" },
                }}
              >
                <ListItem>
                  Minimum 6 characters long - the more, the better
                </ListItem>
                <ListItem>
                  At least one lowercase & one uppercase character
                </ListItem>
                <ListItem>At least one number, symbol</ListItem>
              </List>
            </Alert>

            <LoadingButton
              sx={{ marginLeft: "auto !important" }}
              size="large"
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              Change Password
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
