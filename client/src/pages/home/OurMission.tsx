import { Container, Grid, Paper, Typography } from "@mui/material";
import { m } from "framer-motion";
import Image from "../../components/Image";
import TitleText from "../../components/TitleText";
import { MotionViewport, varFade } from "../../components/animate";

const OurMission = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <Paper sx={{ py: 6 }}>
      <Container component={MotionViewport}>
        <m.div variants={varFade().inLeft}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mb: 6 }} variant="h3">
                <TitleText text={title} />
              </Typography>
              <Typography
                variant="h6"
                fontWeight={"normal"}
                color="text.secondary"
              >
                <TitleText text={description} />
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Image src={image} />
            </Grid>
          </Grid>
        </m.div>
      </Container>
    </Paper>
  );
};

export default OurMission;
