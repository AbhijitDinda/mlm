import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Avatar from "../../components/Avatar";
import CurrencyTextField from "../../components/CurrencyTextField";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import IconifyIcons from "../../IconifyIcons";
import { trpc } from "../../trpc";
import createAvatar from "../../utils/createAvatar";
import { isDecNum } from "../../utils/fns";
import { fCurrency } from "../../utils/formatNumber";
import { TransferUserData } from "./TransferPaymentQuickTransfer";

interface FormValues {
  amount: number;
  receiverId: number;
}

const TransferPaymentDialog = ({
  open,
  onClose,
  data,
  onBack,
}: {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  data: TransferUserData;
}) => {
  const utils = trpc.useContext();
  const { userName, firstName, lastName, userId, avatar } = data;
  const onSuccess = () => {
    onClose();
  };

  const { data: config, isLoading } = trpc.transferPayment.getConfig.useQuery();
  const { charge, chargeType } = config ?? { charge: 0, chargeType: "fixed" };

  const validationSchema = yup.object().shape({
    amount: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Amount is required")
      .min(1, "Minimum amount is 1"),
  });

  const [txnCharge, setTxnCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const defaultValues: FormValues = {
    amount: "" as any as number,
    receiverId: userId,
  };
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  const amount = watch("amount");
  const chargeText =
    chargeType === "percent" ? `${charge}%` : fCurrency(charge);

  // transfer
  const { mutate, isLoading: isSubmitting } =
    trpc.transferPayment.transfer.useMutation({
      onSuccess() {
        utils.transferPayment.invalidate();
        onClose();
        reset();
      },
    });

  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    let _amount = Number(amount);
    const _charge = chargeType === "percent" ? (amount * charge) / 100 : charge;
    const _totalAmount = _amount + _charge;
    if (isDecNum(_amount)) {
      setTxnCharge(_charge);
      setTotalAmount(_totalAmount);
    }
  }, [amount]);

  return (
    <Dialog open={open} onClose={onClose}>
      {isLoading && <LinearProgress />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <IconButton onClick={onBack}>
            <Iconify icon={IconifyIcons.leftArrow} />
          </IconButton>
          Transfer Payment
        </DialogTitle>
        <DialogContent>
          <Stack sx={{ py: 3 }} spacing={3}>
            {!!charge && (
              <Alert severity="warning">
                Transfer Payment charge :- {chargeText}
              </Alert>
            )}
            <Box>
              <Stack
                // onClick={() =>
                // handleSubmit({
                //   userName,
                //   userId,
                //   firstName,
                //   lastName,
                //   avatar,
                // })
                // }
                key={userId}
                direction="row"
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2}>
                  <Avatar
                    color={avatar ? "default" : createAvatar(firstName).color}
                    src={avatar}
                  >
                    {createAvatar(firstName).name}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {firstName} {lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userId} - {userName}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>
            <RHFTextField maskCurrency name="amount" label="Amount" />
            <CurrencyTextField disabled value={txnCharge} label="Charge" />
            <Typography>Payable Amount: {fCurrency(totalAmount)}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ textAlign: "right" }}>
          <LoadingButton type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default TransferPaymentDialog;
