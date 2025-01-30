import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/system";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { APP_LOGIN_PATH, RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";

type Status = "active" | "blocked";

const UserActionLoadingButtons = ({
  userId,
  status,
}: {
  userId: number;
  status: Status;
}) => {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={RESPONSIVE_GAP}>
      <AddBalance userId={userId} />
      <SubtractBalance userId={userId} />
      <LoginAsClient userId={userId} />
      <BlockUser userId={userId} status={status} />
    </Stack>
  );
};

interface FormValues {
  userId: number;
  amount: number;
  message: string;
}

function AddBalance({ userId }: { userId: number }) {
  const utils = trpc.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleView = async () => setIsOpen(!isOpen);

  const defaultValues = {
    userId,
    amount: "" as any as number,
    message: "",
  };
  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Amount is required"),
    message: yup.string().required("Message is required"),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } = trpc.user.deposit.useMutation({
    onSuccess() {
      utils.user.getProfile.invalidate(userId);
      toggleView();
    },
  });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <>
      <LoadingButton
        onClick={toggleView}
        sx={{ flexGrow: 1 }}
        variant="contained"
        color="primary"
        size="large"
      >
        Add Balance
      </LoadingButton>
      <Dialog open={isOpen} onClose={toggleView}>
        <DialogTitle>Add Balance</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3}>
              <RHFTextField maskCurrency name="amount" placeholder="Amount" />
              <RHFTextField
                name="message"
                placeholder="Message"
                multiline
                minRows={4}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleView} color="primary">
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
}

function SubtractBalance({ userId }: { userId: number }) {
  const utils = trpc.useContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleView = async () => setIsOpen(!isOpen);

  const defaultValues = {
    userId,
    amount: "" as any as number,
    message: "",
  };
  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Amount is required"),
    message: yup.string().required("Message is required"),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } = trpc.user.withdraw.useMutation({
    onSuccess() {
      utils.user.getProfile.invalidate(userId);
      toggleView();
    },
  });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <>
      <LoadingButton
        onClick={toggleView}
        sx={{ flexGrow: 1 }}
        variant="contained"
        color="warning"
        size="large"
      >
        Subtract Balance
      </LoadingButton>
      <Dialog open={isOpen} onClose={toggleView}>
        <DialogTitle>Subtract Balance</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={3}>
              <RHFTextField maskCurrency name="amount" placeholder="Amount" />
              <RHFTextField
                name="message"
                placeholder="Message"
                multiline
                minRows={4}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleView} color="primary">
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
}

function LoginAsClient({ userId }: { userId: number }) {
  const { mutate, isLoading } = trpc.user.token.useMutation({
    onSuccess({ accessToken }) {
      window.open(
        APP_LOGIN_PATH + "/token/" + accessToken?.replaceAll(".", "__")
      );
    },
  });

  return (
    <LoadingButton
      onClick={() => mutate(userId)}
      sx={{ flexGrow: 1 }}
      variant="contained"
      color="secondary"
      loading={isLoading}
      size="large"
    >
      Login As Client
    </LoadingButton>
  );
}

function BlockUser({ userId, status }: { userId: number; status: Status }) {
  const utils = trpc.useContext();
  const confirm = useConfirm();

  const { mutate, isLoading } = trpc.user.status.useMutation({
    onSuccess() {
      utils.user.getProfile.invalidate(userId);
    },
  });
  const handleBlockUnblock = async () => {
    try {
      await confirm({
        description:
          status === "active"
            ? "Are you sure you want to block this user"
            : "Are you sure you want to unblock this userZ",
      });
      mutate({ userId, status });
    } catch (error) {
      console.log("handleBlockUnblock ~ error:", error);
    }
  };

  return (
    <LoadingButton
      onClick={handleBlockUnblock}
      sx={{ flexGrow: 1 }}
      variant="contained"
      color="error"
      size="large"
      loading={isLoading}
    >
      {status === "active" ? "Block User" : "Unblock User"}
    </LoadingButton>
  );
}

export default UserActionLoadingButtons;
