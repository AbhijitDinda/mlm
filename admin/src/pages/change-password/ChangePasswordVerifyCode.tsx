import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import SmartPhoneImg from "../../assets/images/smartphone.svg";
import { FormProvider, RHFOtpInput } from "../../components/hook-form";
import Image from "../../components/Image";
import useAuth from "../../hooks/useAuth";
import { trpc } from "../../trpc";
import { ChangePasswordFormValues } from "./ChangePassword";

interface FormValues {
  verificationCode: string;
  step: number;
}

const ChangePasswordVerifyCode = ({
  open,
  onClose,
  data,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data: ChangePasswordFormValues;
}) => {
  const { user } = useAuth();
  if (!user) return null;
  const { email } = user;

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
  const { mutate, isLoading: isSubmitting } =
    trpc.changePassword.update.useMutation();

  const onSubmit = (formData: FormValues) => {
    mutate(
      { ...data, ...formData },
      {
        onSuccess() {
          onSuccess();
        },
      }
    );
  };

  const handleResendOtp = () => {
    setIsSending(true);
    mutate(data, {
      onSettled() {
        setIsSending(false);
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Email Verification</DialogTitle>
      <DialogContent>
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
          <Image src={SmartPhoneImg} sx={{ width: 200 }} isLocal />
          <Typography variant="h4">Email Verification</Typography>
          <Typography color="text.secondary">
            Enter the verification code sent to{" "}
          </Typography>
          <Typography>{email}</Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFOtpInput name="verificationCode" label="Otp" />
            <LoadingButton
              type="submit"
              sx={{ mt: 2 }}
              loading={isSubmitting}
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
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordVerifyCode;
