import {
  Box, Button, Dialog, DialogContent, DialogTitle
} from "@mui/material";
import { useState } from "react";
import EPinGenerateForm from "./EPinGenerateForm";

const EPinGenerate = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Generate E-Pins</DialogTitle>
        <DialogContent>
          <EPinGenerateForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleOpen}
        type="submit"
        size="large"
        variant="contained"
        fullWidth
      >
        Generate E-Pins
      </Button>
    </Box>
  );
};

export default EPinGenerate;
