import { Button, Card, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";

import { fCurrency } from "../../utils/formatNumber";
import TransferPaymentDialog from "./TransferPaymentDialogForm";
import TransferPaymentSearchUser from "./TransferPaymentDialogSearchUser";

const RowStyle = styled("div")({
  display: "flex",
  justifyContent: "space-between",
});

export type TransferUserData = {
  userName: string;
  firstName: string;
  lastName: string;
  userId: number;
  avatar: string;
};

const TransferPaymentQuickTransfer = ({
  receivedAmount,
  transferredAmount,
  wallet,
  loading,
}: {
  receivedAmount: number;
  transferredAmount: number;
  wallet: number;
  loading: boolean;
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TransferUserData | null>(null);
  const handleSearchDialogOpen = () => setStep(1);
  const handleSearchDialogClose = () => setStep(0);
  const handleSearchDialogSubmit = (data: TransferUserData) => {
    setStep(2);
    setData(data);
  };
  const handleTransferDialogBack = () => setStep(1);
  const handleTransferDialogSubmit = () => setStep(0);

  return (
    <Card sx={{ p: 3 }}>
      {step === 1 && (
        <TransferPaymentSearchUser
          open={step === 1}
          onClose={handleSearchDialogClose}
          onSubmit={handleSearchDialogSubmit}
        />
      )}
      {step === 2 && (
        <TransferPaymentDialog
          open={step === 2}
          data={data!}
          onClose={handleTransferDialogSubmit}
          onBack={handleTransferDialogBack}
        />
      )}

      <Typography variant="subtitle2" gutterBottom>
        Quick Transfer
      </Typography>

      <Stack spacing={2}>
        <Typography variant="h3">{fCurrency(wallet)}</Typography>

        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Your Current Balance
          </Typography>
          <Typography variant="body2">{fCurrency(wallet)}</Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Sent Amount
          </Typography>
          <Typography variant="body2">
            {fCurrency(transferredAmount)}
          </Typography>
        </RowStyle>

        <RowStyle>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Received Amount
          </Typography>
          <Typography variant="body2">{fCurrency(receivedAmount)}</Typography>
        </RowStyle>

        <Button
          onClick={handleSearchDialogOpen}
          size="large"
          fullWidth
          variant="contained"
          color="success"
        >
          Transfer Now
        </Button>
      </Stack>
    </Card>
  );
};

export default TransferPaymentQuickTransfer;
