import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import { RESPONSIVE_GAP } from "../../../config";
import AboutUsSection from "./AboutUsSection";
import OurMission from "./OurMission";
import OurVision from "./OurVision";

const AboutUs = () => {
  return (
    <Page title="About Us">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="About Us"
        links={[{ name: "Manage Section" }, { name: "About Us" }]}
      />
      {/* Breadcrumb End */}

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12} md={6}>
          <OurMission />
        </Grid>
        <Grid item xs={12} md={6}>
          <OurVision />
        </Grid>
        <Grid item xs={12} md={6}>
          <AboutUsSection />
        </Grid>
      </Grid>
    </Page>
  );
};
export default AboutUs;
