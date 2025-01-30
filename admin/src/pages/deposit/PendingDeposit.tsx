import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import DepositTable from "./DepositTable";

const PendingDeposit = () => {
  return (
    <Page title="Pending Deposit">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Pending Deposit"
        links={[{ name: "Deposit" }, { name: "Pending Deposit" }]}
      />
      {/* Breadcrumb End */}

      <DepositTable
        title="Pending Deposit"
        pending
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.deposit.list.useQuery({
            status: "review",
            table: queryOptions,
          })
        }
      />
    </Page>
  );
};

export default PendingDeposit;
