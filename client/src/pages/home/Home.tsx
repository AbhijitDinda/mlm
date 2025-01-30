import { LinearProgress } from "@mui/material";
import Page from "../../components/Page";
import { trpc } from "../../trpc";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import OurMission from "./OurMission";
import OurVision from "./OurVision";

const Home = () => {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { aboutUs, hero, ourMission, ourVision } = data! ?? {};

  return (
    <Page title="Home">
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
export default Home;
