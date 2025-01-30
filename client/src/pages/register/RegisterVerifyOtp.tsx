import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Link, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SmartPhoneImg from "../../assets/images/smartphone.svg";

import { FormProvider, RHFOtpInput } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import Image from "../../components/Image";
import { RegisterContext } from "./RegisterProvider";

export interface RegisterOtpFormValues {
  verificationCode: string;
}

const RegisterVerifyOtp = () => {
  const { registerData, onGoBack, register, isLoading } =
    useContext(RegisterContext);
  const [isSending, setIsSending] = useState(false);
  const validationSchema = yup.object().shape({
    verificationCode: yup
      .string()
      .required("Verification Code is required")
      .length(6, "Verification Code is invalid"),
  });
  const methods = useForm({
    defaultValues: {
      verificationCode: "",
      step: 2,
    },
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = async (formData: RegisterOtpFormValues) => {
    register({ ...registerData, ...formData });
  };

  const handleResendOtp = async () => {
    try {
      setIsSending(true);
      register(registerData);
    } catch (error) {
      console.log(
        "🚀 ~ file: RegisterVerifyOtp.jsx:43 ~ handleResendOtp ~ error",
        error
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, marginInline: "auto", p: { xs: 2, md: 6 } }}>
      <CardContent
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Image src={SmartPhoneImg} isLocal sx={{ width: 200 }} />
        <Typography variant="h4">Otp Verification</Typography>
        <Typography color="text.secondary">
          Enter the verification code sent to{" "}
        </Typography>
        <Typography>{registerData?.email}</Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFOtpInput name="verificationCode" label="Otp" />
          <LoadingButton
            type="submit"
            sx={{ mt: 2 }}
            loading={isLoading}
            variant="contained"
            size="large"
            fullWidth
          >
            Verify
          </LoadingButton>
        </FormProvider>
        <Typography sx={{ color: "text.secondary" }} variant="body2">
          Didn't get the code?{" "}
          {isSending ? (
            <Link sx={{ cursor: "pointer", opacity: 0.7 }}>Sending...</Link>
          ) : (
            <Link onClick={handleResendOtp} sx={{ cursor: "pointer" }}>
              Resend
            </Link>
          )}
        </Typography>

        <Link
          onClick={onGoBack}
          sx={{
            cursor: "pointer",
            alignItems: "center",
            display: "inline-flex",
          }}
          variant="subtitle2"
        >
          <Iconify
            sx={{ width: 16, height: 16 }}
            icon="eva:arrow-ios-back-fill"
          />
          Change Email
        </Link>
      </CardContent>
    </Card>
  );
};

export default RegisterVerifyOtp;
