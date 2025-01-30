import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";

import Iconify from "../../components/Iconify";
import useFormEdit from "../../hooks/useFormEdit";
import IconifyIcons from "../../IconifyIcons";
import ContactDetailsForm from "./ContactDetailsForm";

// ----------------------------------------------------------------------

const ProfileMainContactDetails = () => {
  const { isEditing, startEditing, stopEditing } = useFormEdit();

  return (
    <Card>
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader
          title="Contact Details"
          action={
            !isEditing ? (
              <IconButton onClick={startEditing}>
                <Iconify icon={IconifyIcons.pencil} />
              </IconButton>
            ) : undefined
          }
        />
        <Divider />
      </Box>
      <CardContent>
        <ContactDetailsForm
          disabled={!isEditing}
          onSuccess={stopEditing}
          action={(isSubmitting: boolean) => (
            <>
              {isEditing && (
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button size="large" onClick={stopEditing}>
                    Cancel
                  </Button>
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save Changes
                  </LoadingButton>
                </Stack>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
};
export default ProfileMainContactDetails;
