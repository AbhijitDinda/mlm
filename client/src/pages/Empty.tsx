import React from "react";
// components
import Page from "../components/Page";
import HeaderBreadcrumbs from "../components/HeaderBreadcrumbs";

const Support = () => {
  return (
    <Page title="Support">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Support"
        links={[{ name: "Dashboard" }, { name: "Support" }]}
      />
      {/* Breadcrumb End */}
    </Page>
  );
};

export default Support;
