import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import EPinsList from "./EPinsList";
const EPin = () => {
  return (
    <Page title="E-Pin">
      <HeaderBreadcrumbs heading="E-Pin" links={[{ name: "E-Pins" }]} />
      <EPinsList />
    </Page>
  );
};
export default EPin;
