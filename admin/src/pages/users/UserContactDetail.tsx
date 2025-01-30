import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from "@mui/material";

const UserContactDetail = ({
  address,
  country,
  state,
  city,
  pinCode,
  mobileNumber,
}: {
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: number;
  mobileNumber: string;
}) => {
  return (
    <Card>
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader title="Contact Details" />
        <Divider />
      </Box>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={address}
              type="text"
              label="Address"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={country}
              type="text"
              label="Country"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={state}
              type="text"
              label="State/Region"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={city}
              type="text"
              label="City"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={pinCode}
              type="text"
              label="Pin Code/Zip Code"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled
              fullWidth
              value={mobileNumber}
              label="Mobile Number"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserContactDetail;
