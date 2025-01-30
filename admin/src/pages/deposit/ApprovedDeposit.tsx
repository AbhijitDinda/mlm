
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import DepositTable from "./DepositTable";

const ApprovedDeposit = () => {
  return (
    <Page title="Approved Deposit">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Approved Deposit"
        links={[{ name: "Deposit" }, { name: "Approved Deposit" }]}
      />
      {/* Breadcrumb End */}

      <DepositTable
        sortBy="updatedAt"
        title="Approved Deposit"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.deposit.list.useQuery({
            status: "approved",
            table: queryOptions,
          })
        }
        pending={false}
      />
    </Page>
  );
};

export default ApprovedDeposit;
