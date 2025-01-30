// components
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import KycTable from "./KycTable";

const PendingKyc = () => {
  return (
    <Page title="Pending Kyc">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Pending Kyc"
        links={[{ name: "Kyc" }, { name: "Pending Kyc" }]}
      />
      {/* Breadcrumb End */}

      <KycTable
        pending
        title="Pending Kyc"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.kyc.list.useQuery({ status: "pending", table: queryOptions })
        }
      />
    </Page>
  );
};

export default PendingKyc;
