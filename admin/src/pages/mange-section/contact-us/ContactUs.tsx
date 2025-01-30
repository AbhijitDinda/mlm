import { Stack } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import { RESPONSIVE_GAP } from "../../../config";
import ContactUsForm from "./ContactUsForm";
import SocialLinksForm from "./SocialLinksForm";

const ContactUs = () => {
  return (
    <Page title="Contact Us">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Contact Us"
        links={[{ name: "Manage Section" }, { name: "Contact Us" }]}
      />
      {/* Breadcrumb End */}

      <Stack spacing={RESPONSIVE_GAP}>
        <ContactUsForm />
        <SocialLinksForm />
      </Stack>
    </Page>
  );
};

export default ContactUs;
