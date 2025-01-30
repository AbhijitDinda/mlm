import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import KycTable from "./KycTable";

const RejectedKyc = () => {
  return (
    <Page title="Rejected Kyc">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Rejected Kyc"
        links={[{ name: "Kyc" }, { name: "Rejected Kyc" }]}
      />
      {/* Breadcrumb End */}

      <KycTable
        title="Rejected Kyc"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.kyc.list.useQuery({ status: "rejected", table: queryOptions })
        }
      />
    </Page>
  );
};

export default RejectedKyc;
