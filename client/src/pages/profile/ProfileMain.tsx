import { Grid } from "@mui/material";
import { RESPONSIVE_GAP } from "../../config";

import AnimatedBox from "../../components/AnimatedBox";
import { AnimatedProvider } from "../../components/Page";
import About from "./About";
import LoginSessions from "./LoginSessions";
import ContactDetails from "./MainContactDetails";
import MyProfile from "./MyProfile";

const ProfileMain = () => {
  return (
    <AnimatedProvider>
      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12} md={4}>
          <AnimatedBox>
            <About />
          </AnimatedBox>
        </Grid>
        <Grid item xs={12} md={8}>
          <AnimatedBox>
            <MyProfile />
          </AnimatedBox>
        </Grid>
        <Grid item xs={12} md={12}>
          <AnimatedBox>
            <ContactDetails />
          </AnimatedBox>
        </Grid>
        <Grid item xs={12} md={12}>
          <AnimatedBox>
            <LoginSessions />
          </AnimatedBox>
        </Grid>
      </Grid>
    </AnimatedProvider>
  );
};

export default ProfileMain;
