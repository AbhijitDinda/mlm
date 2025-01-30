import { Box, Link, Stack, Typography } from "@mui/material";
import { m } from "framer-motion";
import { varFade } from "../../components/animate";
import Page from "../../components/Page";
import Setup from "./Setup";

const AnimatedBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <m.div variants={varFade({ distance: 200, durationIn: 1 }).inDown}>
      {children}
    </m.div>
  );
};

const Install = () => {
  const text = "Jamsrmlm".split("").join(",") + ",:)";
  const texts = text.split(",");

  return (
    <Page
      title="Installation"
      sx={{
        height: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Stack spacing={3} justifyContent="center" alignItems="center">
          <Box>
            <Stack direction={"row"}>
              {texts.map((text, i) => (
                <AnimatedBox key={i}>
                  <Typography component={"h1"} variant="h1">
                    {text}
                  </Typography>
                </AnimatedBox>
              ))}
            </Stack>
            <AnimatedBox>
              <Typography sx={{ textAlign: "right" }} variant="body2">
                Created by{" "}
                <Link target="_blank" href="https://jamsrworld.com/">
                  jamsrworld.com
                </Link>
              </Typography>
            </AnimatedBox>
          </Box>
          <AnimatedBox>
            <Typography sx={{ color: "text.secondary" }}>
              Version 5.0
            </Typography>
          </AnimatedBox>
          <AnimatedBox>
            <Setup />
          </AnimatedBox>
        </Stack>
      </Box>
    </Page>
  );
};

export default Install;
