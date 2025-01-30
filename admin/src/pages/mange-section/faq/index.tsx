// components
import { Stack } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import FaqForm from "./FaqForm";
import FaqList from "./FaqList";

export default function () {
  return (
    <Page title="Faq Section">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Faq Section"
        links={[{ name: "Manage Section" }, { name: "Faq Section" }]}
      />
      {/* Breadcrumb End */}

      <Stack spacing={4}>
        <FaqForm />
        <FaqList />
      </Stack>
    </Page>
  );
}
