import { Box, Card, CardHeader, Divider } from "@mui/material";

import { User } from "../../contexts/JWTContext";
import ProfileDetailsCard from "../genealogy/ProfileDetailsCard";

const UserAbout = ({ user }: { user: Omit<User, "loginSessionId"> }) => {
  return (
    <Card>
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader title="About" />
        <Divider />
      </Box>
      <ProfileDetailsCard user={user} />
    </Card>
  );
};

export default UserAbout;
