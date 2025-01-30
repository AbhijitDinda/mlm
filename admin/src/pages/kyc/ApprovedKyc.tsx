import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import KycTable from "./KycTable";

const ApprovedKyc = () => {
  return (
    <Page title="Approved Kyc">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Approved Kyc"
        links={[{ name: "Package" }, { name: "Approved Kyc" }]}
      />
      {/* Breadcrumb End */}

      <KycTable
        title="Approved Kyc"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.kyc.list.useQuery({ status: "approved", table: queryOptions })
        }
      />
    </Page>
  );
};

export default ApprovedKyc;
