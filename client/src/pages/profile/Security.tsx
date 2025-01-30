import { Stack } from "@mui/material";

import AnimatedBox from "../../components/AnimatedBox";
import { AnimatedProvider } from "../../components/Page";
import ProfileSecurityChangePassword from "./ChangePassword";
import ProfileSecurityTwoFA from "./TwoFA";

const ProfileSecurity = () => {
  return (
    <AnimatedProvider>
      <Stack spacing={3}>
        <AnimatedBox>
          <ProfileSecurityChangePassword />
        </AnimatedBox>
        <AnimatedBox>
          <ProfileSecurityTwoFA />
        </AnimatedBox>
      </Stack>
    </AnimatedProvider>
  );
};

export default ProfileSecurity;
