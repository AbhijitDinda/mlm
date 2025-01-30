import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
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

interface FormValues {
  verificationCode: string;
  step: number;
}

const ProfileTwoFAModal = ({
  resend,
  open,
  onClose,
}: {
  resend: () => void;
  open: boolean;
  onClose: () => void;
}) => {
  const auth = useAuth();
  if (!auth.user) return null;
  const {
    user: { twoFA, email },
    updateTwoFA,
  } = auth;

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
  const { mutate, isLoading: isSubmitting } = trpc.profile.twoFa.useMutation({
    onSuccess(res) {
      onClose();
      if (res && "twoFA" in res) {
        updateTwoFA(res.twoFA);
      }
    },
  });

  const onSubmit = (formData: FormValues) =>
    mutate({ status: twoFA, ...formData });

  const handleResendOtp = async () => {
    try {
      setIsSending(true);
      resend();
    } catch (error) {
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {twoFA
          ? "Disable Two Factor Authentication"
          : "Enable Two Factor Authentication"}
      </DialogTitle>
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
          <Typography variant="h4">Otp Verification</Typography>
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

export default ProfileTwoFAModal;
