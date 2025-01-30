import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import IconifyIcons from "../../IconifyIcons";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";
import UserAbout from "../users/UserAbout";
import KycUserContactDetail from "./KycUserContactDetail";
import KycUserMyProfile from "./KycUserMyProfile";
import KycUserProfileCover from "./KycUserProfileCover";

const KycView = () => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const { id: kycId } = params;
  if (!kycId) return null;

  const { data, isLoading } = trpc.kyc.detail.useQuery(kycId);

  const res = data! ?? { kyc: {}, user: {} };
  const kyc = res.kyc ?? {};
  const user = res.user ?? {};
  const { kycData, firstName, lastName, contact, userId, mobileNumber } = user;
  const { createdAt, updatedAt, message, status } = kyc;

  const handleDialogClose = () => {
    setOpen(false);
  };

  return isLoading ? (
    <LinearProgress />
  ) : (
    <>
      <Grid container spacing={2}>
        {status === "pending" && (
          <>
            <Dialog onClose={handleDialogClose} open={open}>
              <DialogTitle>Reject Kyc Verification</DialogTitle>
              <RejectForm kycId={kycId} onClose={handleDialogClose} />
            </Dialog>

            <Grid item xs={12}>
              <Stack justifyContent={"flex-end"} direction="row" spacing={3}>
                <LoadingButton
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<Iconify icon={IconifyIcons.close} />}
                  onClick={() => setOpen(true)}
                >
                  Reject
                </LoadingButton>
                <ApproveButton kycId={kycId} />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="warning">
                <AlertTitle>Pending</AlertTitle>
                {userId} requested for kyc verification on{" "}
                {fDateTime(createdAt)}
              </Alert>
            </Grid>
          </>
        )}
        {status === "approved" && (
          <Grid item xs={12}>
            <Alert severity="success">
              <AlertTitle>Approved</AlertTitle>
              Kyc approved on {fDateTime(updatedAt)}
            </Alert>
          </Grid>
        )}
        {status === "rejected" && (
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Alert severity="error">
                <AlertTitle>Rejected</AlertTitle>
                Kyc rejected on {fDateTime(updatedAt)}
              </Alert>
              <Alert severity="info">{message}</Alert>
            </Stack>
          </Grid>
        )}
        <Grid item xs={12}>
          <Card sx={{ height: 280 }}>
            <KycUserProfileCover {...user} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <UserAbout user={user} />
        </Grid>
        <Grid item xs={12} md={8}>
          <KycUserMyProfile
            kycData={kycData}
            firstName={firstName}
            lastName={lastName}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <KycUserContactDetail mobileNumber={mobileNumber} {...contact} />
        </Grid>
      </Grid>
    </>
  );
};

function ApproveButton({ kycId }: { kycId: string }) {
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { mutate, isLoading: isSubmitting } = trpc.kyc.approve.useMutation({
    onSuccess() {
      utils.kyc.list.invalidate();
      utils.kyc.detail.invalidate(kycId);
      navigate(APP_PATH.kyc.pending);
    },
  });

  const handleApprove = async () => {
    try {
      await confirm({ description: "Are you sure want to approve?" });
      mutate(kycId);
    } catch (error) {
      console.log("handleApprove ~ error:", error);
    }
  };

  return (
    <LoadingButton
      loading={isSubmitting}
      variant="contained"
      color="success"
      size="large"
      startIcon={<Iconify icon={IconifyIcons.check} />}
      onClick={handleApprove}
    >
      Approve
    </LoadingButton>
  );
}

interface FormValues {
  message: string;
}

function RejectForm({
  onClose,
  kycId,
}: {
  onClose: () => void;
  kycId: string;
}) {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const validationSchema = yup.object().shape({
    message: yup.string().required("Message is required"),
  });
  const methods = useForm({
    defaultValues: { message: "" },
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } = trpc.kyc.reject.useMutation({
    onSuccess() {
      utils.kyc.list.invalidate();
      utils.kyc.detail.invalidate(kycId);
      navigate(APP_PATH.kyc.pending);
    },
  });

  const onSubmit = (formData: FormValues) => mutate({ id: kycId, ...formData });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <RHFTextField multiline minRows={4} name="message" label="Message" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Disagree</Button>
        <LoadingButton type="submit" loading={isSubmitting}>
          Reject
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}

export default KycView;
