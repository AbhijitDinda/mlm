import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import KycTable from "./KycTable";

const AllKyc = () => {
  return (
    <Page title="All Kyc">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="All Kyc"
        links={[{ name: "Kyc" }, { name: "All Kyc" }]}
      />
      {/* Breadcrumb End */}

      <KycTable
        title="All Kyc"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.kyc.list.useQuery({ status: "all", table: queryOptions })
        }
      />
    </Page>
  );
};

export default AllKyc;
