import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import FormLabel from "../../components/FormLabel";
import { UploadSingleFile } from "../../components/upload";
import { User } from "../../contexts/JWTContext";
import { fDatePicker } from "../../utils/formatTime";

const KycUserMyProfile = ({
  kycData,
  firstName,
  lastName,
}: {
  kycData: User["kycData"];
  firstName: string;
  lastName: string;
}) => {
  const { user, form } = kycData;
  return (
    <Card>
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader title="Profile" />
        <Divider />
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              disabled
              value={firstName}
              type="text"
              label="First Name"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              disabled
              value={lastName}
              type="text"
              label="Last Name"
            />
          </Grid>
          {form.map((data) => {
            const { _id, label, inputType } = data;
            const value = user[_id];
            return (
              <Grid item xs={12} md={6} key={_id}>
                <Input label={label} value={value} inputType={inputType} />
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

function Input({
  label,
  inputType,
  value,
}: {
  label: User["kycData"]["form"][number]["label"];
  inputType: User["kycData"]["form"][number]["inputType"];
  value?: string;
}) {
  if (inputType === "date" && !!value) {
    value = fDatePicker(value);
  }
  if (!value) value = "";
  switch (inputType) {
    case "input":
    case "date":
    case "dropdown":
      return <TextField fullWidth disabled value={value} label={label} />;
    case "textarea":
      return (
        <TextField
          fullWidth
          disabled
          multiline
          minRows={4}
          value={value}
          label={label}
        />
      );
    case "file": {
      return (
        <Box>
          <FormLabel label={label} />
          <UploadSingleFile disabled file={value} />
        </Box>
      );
    }
    default:
      return null;
  }
}

export default KycUserMyProfile;
