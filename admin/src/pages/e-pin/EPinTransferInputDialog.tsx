import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import Avatar from "../../components/Avatar";
import Iconify from "../../components/Iconify";
import IconifyIcons from "../../IconifyIcons";
import createAvatar from "../../utils/createAvatar";
import EPinGenerateForm from "./EPinGenerateForm";
import { TransferUserData } from "./EPinTransfer";

const EPinTransferInputDialog = ({
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
  const { userName, firstName, lastName, userId, avatar } = data;
  const onSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <IconButton onClick={onBack}>
          <Iconify icon={IconifyIcons.leftArrow} />
        </IconButton>
        Transfer E-Pin
      </DialogTitle>
      <DialogContent>
        <EPinGenerateForm
          transferUser={{
            userId,
            content: (
              <Box>
                <Stack
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
            ),
          }}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EPinTransferInputDialog;
