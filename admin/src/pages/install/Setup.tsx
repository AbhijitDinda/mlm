import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { matchIsValidTel } from "mui-tel-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import RHFTelInput from "../../components/hook-form/RHFTelInput";
import Iconify from "../../components/Iconify";
import IconifyIcons from "../../IconifyIcons";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import regex from "../../utils/regex";

const isValidPhoneNumber = (value: string) => {
  const isValid = matchIsValidTel(value);
  return isValid;
};

export interface FormValues {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const Setup = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = {
    firstName: "",
    lastName: "",
    mobileNumber: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .max(10, "Maximum 10 characters are allowed")
      .matches(regex.alphabet, "Only alphabets are allowed"),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(regex.alphabet, "Only alphabets are allowed")
      .max(10, "Maximum 10 characters are allowed"),
    mobileNumber: yup
      .string()
      .required("Mobile Number is required")
      .test("Phone", "Mobile Number is not valid", isValidPhoneNumber),
    userName: yup
      .string()
      .required("Username is required")
      .max(15, "Maximum 15 characters are allowed"),
    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Maximum 20 characters are allowed"),
    confirmPassword: yup
      .string()
      .required("Password is required")
      .oneOf([yup.ref("password")], "Passwords are not matching"),
  });
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } = trpc.setting.install.useMutation({
    onSuccess() {
      navigate(APP_PATH.login);
    },
  });
  const handleSetup = async (formData: FormValues) => mutate(formData);

  return (
    <>
      <Button
        onClick={handleOpen}
        endIcon={<Iconify icon={IconifyIcons.rightDirectionArrow} />}
        variant="contained"
        size="large"
        sx={{ borderRadius: 99 }}
      >
        Setup App
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Setup App</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleSetup)}>
          <DialogContent>
            <Stack spacing={3}>
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="userName" label="Username" />
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTelInput name="mobileNumber" label="Mobile Number" />
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />{" "}
              <RHFTextField
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Iconify
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};
export default Setup;
