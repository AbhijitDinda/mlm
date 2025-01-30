import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import KycSettingList from "./KycSettingList";

const Kyc = () => {
  return (
    <Page title="Kyc Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Kyc Setting"
        links={[{ name: "System Configuration" }, { name: "Kyc Setting" }]}
      />
      {/* Breadcrumb End */}

      <KycSettingList />
    </Page>
  );
};

export default Kyc;
