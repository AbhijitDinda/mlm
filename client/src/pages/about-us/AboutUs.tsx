import { LinearProgress } from "@mui/material";
import Page from "../../components/Page";
import { trpc } from "../../trpc";
import Hero from "../home/Hero";
import HowItWorks from "../home/HowItWorks";
import OurMission from "../home/OurMission";
import OurVision from "../home/OurVision";

const AboutUs = () => {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { aboutUs, hero, ourMission, ourVision } = data! ?? {};
  return (
    <Page title="About Us">
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Hero {...hero} />
          <OurMission {...ourMission} />
          <OurVision {...ourVision} />
          <HowItWorks />
        </>
      )}
    </Page>
  );
};

export default AboutUs;
