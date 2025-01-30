import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Grid, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { matchIsValidTel } from "mui-tel-input";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../components/hook-form";
import RHFTelInput from "../../components/hook-form/RHFTelInput";
import Iconify from "../../components/Iconify";
import { trpc } from "../../trpc";
import { isObjEmpty, isUserId } from "../../utils/fns";
import regex from "../../utils/regex";
import { RegisterContext } from "./RegisterProvider";

// ----------------------------------------------------------------------

export interface RegisterFormValues {
  referralId: string;
  placementId?: string;
  placementSide: "left" | "right";
  userName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  ePin: string;
  step: number;
  referralUsername: string;
  placementUsername: string;
}

const isValidPhoneNumber = (value: string) => {
  const isValid = matchIsValidTel(value);
  return isValid;
};

const errors = {
  referralId: {
    error: false,
    message: "",
  },
  placementId: {
    error: false,
    message: "",
  },
  placementSide: {
    error: false,
    message: "",
  },
  userName: {
    error: false,
    message: "",
  },
};

export default function RegisterForm({
  isRegistrationEnabled,
}: {
  isRegistrationEnabled: boolean;
}) {
  const { mutate: checkReferralId } = trpc.auth.checkReferralId.useMutation();
  const { mutate: checkPlacementId } = trpc.auth.checkPlacementId.useMutation();
  const { mutate: checkPlacementSide } =
    trpc.auth.checkPlacementSide.useMutation();
  const { mutate: checkUserName } = trpc.auth.checkUserName.useMutation();

  const { registerData, register, isLoading } = useContext(RegisterContext);

  const [searchParams] = useSearchParams();
  const referralId = searchParams.get("referral_id") ?? "";
  const placementId = searchParams.get("placement_id") ?? "";
  const placementSide = (searchParams.get("placement") ?? "") as
    | "left"
    | "right";

  const [showPassword, setShowPassword] = useState(false);
  const RegisterSchema = Yup.object().shape({
    referralId: Yup.string()
      .required("Referral Id is required")
      .test("validReferralId", errors.referralId.message, (val, schema) => {
        if (errors.referralId.error) {
          return schema.createError({
            message: errors.referralId.message,
          });
        }
        return !errors.referralId.error;
      }),
    placementId: Yup.string().test(
      "validatePlacementId",
      errors.placementId.message,
      (val, schema) => {
        if (errors.placementId.error) {
          return schema.createError({
            message: errors.placementId.message,
          });
        }
        return !errors.placementId.error;
      }
    ),
    placementSide: Yup.string()
      .required("Placement Side is required")
      .test(
        "validatePlacementSide",
        errors.placementSide.message,
        (val, schema) => !errors.placementSide.error
      ),
    userName: Yup.string()
      .required("Username is required")
      .max(15, "Maximum 15 characters are allowed")
      .test(
        "validateUserName",
        errors.userName.message,
        (val, schema) => !errors.userName.error
      ),
    firstName: Yup.string()
      .required("First name is required")
      .max(10, "Maximum 10 characters are allowed")
      .matches(regex.alphabet, "Only alphabets are allowed"),
    lastName: Yup.string()
      .required("Last name is required")
      .matches(regex.alphabet, "Only alphabets are allowed")
      .max(10, "Maximum 10 characters are allowed"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .test("Phone", "Mobile Number is not valid", isValidPhoneNumber),
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Maximum 20 characters are allowed"),
    confirmPassword: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password")], "Passwords are not matching"),
    ePin: Yup.string().required("E-Pin is required"),
  });

  const defaultValues = {
    step: 1,
    referralId,
    referralUsername: "",
    placementSide,
    placementId,
    placementUsername: "",
    userName: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    ePin: "",
  };

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
    mode: "onChange",
  });

  const { reset, handleSubmit, setValue, setError, clearErrors, watch } =
    methods;

  useEffect(() => {
    if (!isObjEmpty(registerData)) reset(registerData);
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      register(data);
    } catch (error) {
      console.log(error);
    }
  };

  const _referralId = watch("referralId");
  const _placementId = watch("placementId");
  const _placementSide = watch("placementSide");
  const _userName = watch("userName");

  useEffect(() => {
    const value = _referralId;
    const onError = (message: string) => {
      errors.referralId.error = true;
      errors.referralId.message = message;
      setValue("referralUsername", "");
      setError("referralId", {
        type: "referralIdManual",
        message,
      });
    };
    const onSuccess = (userName: string) => {
      errors.referralId.error = false;
      errors.referralId.message = "";
      setValue("referralUsername", userName);
      clearErrors("referralId");
    };

    if (!_referralId) return onSuccess("");
    if (!isUserId(value)) return onError("Referral Id is not valid");

    checkReferralId(value, {
      onSuccess({ success, userName }) {
        if (success) onSuccess(userName);
        else onError("Referral Id doesn't exist");
      },
    });
  }, [_referralId]);

  useEffect(() => {
    const value = _placementId;
    const onError = (message: string) => {
      errors.placementId.error = true;
      errors.placementId.message = message;
      setValue("placementUsername", "");
      setError("placementId", {
        type: "placementIdManual",
        message,
      });
    };
    const onSuccess = (placementUsername: string) => {
      errors.placementId.error = false;
      errors.placementId.message = "";
      setValue("placementUsername", placementUsername);
      clearErrors("placementId");
    };

    if (!value || value?.length < 1) return onSuccess("");
    if (!isUserId(value)) return onError("Placement Id is not valid");

    checkPlacementId(value, {
      onSuccess({ success, userName }) {
        if (success) onSuccess(userName);
        else onError("Placement Id doesn't exist");
      },
    });
  }, [_placementId]);

  useEffect(() => {
    const value = _placementSide;

    const onSuccess = () => {
      errors.placementSide.error = false;
      errors.placementSide.message = "";
      clearErrors("placementSide");
    };

    const onError = (message: string) => {
      errors.placementSide.error = true;
      errors.placementSide.message = message;
      setError("placementSide", {
        type: "placementSideManual",
        message,
      });
    };

    if (!_placementId || !isUserId(_placementId)) return onSuccess();

    checkPlacementSide(_placementId, {
      onSuccess({ leftId, rightId, success }) {
        if (success) {
          const left = !!leftId;
          const right = !!rightId;
          const both = left && right;

          let message;
          if (both) message = "Both left and right side are in use";
          if (left && value === "left") message = "Left side is in use";
          if (right && value === "right") message = "Right side is in use";

          if (message) onError(message);
          else onSuccess();
        } else onSuccess();
      },
    });
  }, [_placementId, _placementSide]);

  useEffect(() => {
    const value = _userName;
    if (!value) return;

    checkUserName(value, {
      onSuccess(success) {
        if (success) {
          errors.userName.error = false;
          errors.userName.message = "";
          clearErrors("userName");
        } else {
          errors.userName.error = true;
          errors.userName.message = "Username is already registered";
          setError("userName", {
            type: "userNameManual",
            message: "Username is already registered",
          });
        }
      },
    });
  }, [_userName]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RHFTextField
            name="referralId"
            label="Referral Id"
            placeholder="use 1006090 if not available"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled
            name="referralUsername"
            label="Referral Username"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            placeholder="(optional)"
            name="placementId"
            label="Placement Id"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled
            name="placementUsername"
            label="Placement Username"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFSelect name="placementSide" label="Placement Side">
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </RHFSelect>
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField name="userName" label="Username" />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField name="firstName" label="First Name" />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField name="lastName" label="Last Name" />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTelInput name="mobileNumber" label="Mobile Number" />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField name="email" label="Email" />
        </Grid>
        <Grid item xs={12} md={6}>
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
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField name="ePin" label="E-Pin" />
        </Grid>

        <Grid item xs={12}>
          <LoadingButton
            disabled={!isRegistrationEnabled}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Register
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
