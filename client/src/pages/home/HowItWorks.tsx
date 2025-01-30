import { Box, Card, Container, Grid, Paper, Typography } from "@mui/material";
import { m } from "framer-motion";
import Image from "../../components/Image";
import { MotionViewport, varFade } from "../../components/animate";

import RealEstateImage from "../../assets/icons/real-estate.png";
import RocketImg from "../../assets/icons/rocket.png";
import ShieldImg from "../../assets/icons/shield.png";

const HowItWorks = () => {
  const boxShadow = "0px 50px 100px 0px rgba(1,1,64,0.06)";
  const darkBoxShadow = "0px 50px 100px 0px rgba(156, 156, 227, 0.06)";

  return (
    <Paper
      sx={{ height: { sm: "auto", md: 800 }, py: 6, position: "relative" }}
    >
      <Container component={MotionViewport}>
        <Typography textAlign={"center"} variant="h2">
          How It Works
        </Typography>
        <Grid sx={{ pb: 6, pt: { xs: 6, md: 24 } }} container spacing={8}>
          <Grid item xs={12} md={4}>
            <m.div variants={varFade().inLeft}>
              <Card
                sx={{
                  py: 12,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  gap: 6,
                  boxShadow: (theme) =>
                    theme.palette.mode === "light" ? boxShadow : darkBoxShadow,
                }}
              >
                <Box>
                  <Image
                    sx={{ width: 60 }}
                    alt="sign up"
                    isLocal
                    src={ShieldImg}
                  />
                </Box>
                <Typography variant="h5">Sign Up</Typography>
              </Card>
            </m.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <m.div variants={varFade().inUp}>
              <Card
                sx={{
                  py: 12,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  gap: 6,
                  marginTop: { sm: 0, md: -10 },
                  boxShadow: (theme) =>
                    theme.palette.mode === "light" ? boxShadow : darkBoxShadow,
                }}
              >
                <Box>
                  <Image
                    sx={{ width: 60 }}
                    alt="bring people"
                    isLocal
                    src={RocketImg}
                  />
                </Box>
                <Typography variant="h5">Bring People</Typography>
              </Card>
            </m.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <m.div variants={varFade().inRight}>
              <Card
                sx={{
                  py: 12,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  gap: 6,
                  marginTop: { sm: 0, md: -20 },
                  boxShadow: (theme) =>
                    theme.palette.mode === "light" ? boxShadow : darkBoxShadow,
                }}
              >
                <Box>
                  <Image
                    sx={{ width: 60 }}
                    alt="get paid"
                    isLocal
                    src={RealEstateImage}
                  />
                </Box>
                <Typography variant="h5">Get Paid</Typography>
              </Card>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default HowItWorks;
