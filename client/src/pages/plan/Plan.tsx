import { Box, Container, Grid, Typography } from "@mui/material";
import AnimatedBox from "../../components/AnimatedBox";
import ApiError from "../../components/ApiError";
import LoadingProgress from "../../components/LoadingProgress";
import { MotionViewport } from "../../components/animate";
import { RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";
import PlanCard from "./PlanCard";

const Plan = () => {
  const { data, isLoading, error } = trpc.plan.list.useQuery();
  if (error) return <ApiError error={error} />;

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <Container disableGutters component={MotionViewport}>
      {data ? (
        <>
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <AnimatedBox>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Choose the{" "}
                <Typography
                  variant="h2"
                  component="span"
                  sx={{
                    color: "primary.main",
                    borderBottomColor: "primary.main",
                    borderBottom: "3px solid",
                  }}
                >
                  right plan
                </Typography>{" "}
                for your business
              </Typography>
            </AnimatedBox>
            <AnimatedBox>
              <Typography
                sx={{
                  color: "text.secondary",
                }}
              >
                Choose the perfect plan for your needs. Always flexible to grow
              </Typography>
            </AnimatedBox>
          </Box>

          <Grid
            container
            rowSpacing={RESPONSIVE_GAP}
            columnSpacing={RESPONSIVE_GAP}
          >
            <Grid item xs={12} md={4}>
              <AnimatedBox>
                <PlanCard {...data!} />
              </AnimatedBox>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography>No Plan</Typography>
      )}
    </Container>
  );
};

export default Plan;
