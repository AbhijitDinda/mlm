import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { m } from "framer-motion";

import { Link as RouterLink } from "react-router-dom";
import ProgressSvg from "../../assets/progress";
import { MotionViewport, varFade } from "../../components/animate";
import Image from "../../components/Image";
import TitleText from "../../components/TitleText";
import useAuth from "../../hooks/useAuth";
import APP_PATH from "../../routes/paths";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const Curve = styled(Box)(({ theme }) => ({
  "& svg path": {
    fill: theme.palette.background.paper,
  },
}));

const Hero: React.FC<Props> = ({ title, description, image }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Box sx={{ height: 800, py: 12, position: "relative" }}>
      <Container component={MotionViewport}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <m.div variants={varFade().inLeft}>
              <Stack spacing={4}>
                <Typography sx={{ textTransform: "capitalize" }} variant="h1">
                  <TitleText text={title} />
                </Typography>

                <Typography color="text.secondary">
                  <TitleText text={description} />
                </Typography>
                <div>
                  <Button
                    component={RouterLink}
                    to={isAuthenticated ? APP_PATH.dashboard : APP_PATH.login}
                    variant="contained"
                    size="large"
                  >
                    Get Started
                  </Button>
                </div>
              </Stack>
            </m.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <m.div variants={varFade().inRight}>
              {image ? (
                <Image sx={{ maxWidth: 1 }} src={image} />
              ) : (
                <ProgressSvg sx={{ "& svg": { maxWidth: 1 } }} />
              )}
            </m.div>
          </Grid>
        </Grid>
      </Container>
      <Curve sx={{ position: "absolute", bottom: -7, left: 0, width: 1 }}>
        <svg
          preserveAspectRatio="xMinYMin meet"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 158"
        >
          <defs></defs>
          <path
            fillRule="evenodd"
            d="M1440-27h2v185H0V8c88-20.667 267.333 3 538 71s571.333 45.333 902-68v-38z"
          ></path>
        </svg>
      </Curve>
    </Box>
  );
};

export default Hero;
