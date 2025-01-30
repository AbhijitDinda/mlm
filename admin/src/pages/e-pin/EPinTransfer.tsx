import { Box, Button } from "@mui/material";
import { useState } from "react";
import EPinTransferInputDialog from "./EPinTransferInputDialog";
import EPinTransferSearchUser from "./EPinTransferSearchUser";

export type TransferUserData = {
  userName: string;
  firstName: string;
  lastName: string;
  userId: number;
  avatar: string;
};

const EPinTransfer = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TransferUserData | null>(null);
  const handleSearchDialogOpen = () => setStep(1);
  const handleSearchDialogClose = () => setStep(0);
  const handleSearchDialogSubmit = (data: TransferUserData) => {
    setStep(2);
    setData(data);
  };
  const handleEPinDialogBack = () => setStep(1);
  const handleEPinDialogSubmit = () => setStep(0);

  return (
    <Box>
      {step === 1 && (
        <EPinTransferSearchUser
          open={step === 1}
          onClose={handleSearchDialogClose}
          onSubmit={handleSearchDialogSubmit}
        />
      )}
      {step === 2 && (
        <EPinTransferInputDialog
          open={step === 2}
          data={data!}
          onClose={handleEPinDialogSubmit}
          onBack={handleEPinDialogBack}
        />
      )}
      <Button
        onClick={handleSearchDialogOpen}
        size="large"
        fullWidth
        variant="contained"
        color="success"
      >
        Transfer E-Pin
      </Button>
    </Box>
  );
};
export default EPinTransfer;
