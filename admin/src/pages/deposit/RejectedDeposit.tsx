import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import DepositTable from "./DepositTable";

const RejectedDeposit = () => {
  return (
    <Page title="Rejected Deposit">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Rejected Deposit"
        links={[{ name: "Deposit" }, { name: "Rejected Deposit" }]}
      />
      {/* Breadcrumb End */}

      <DepositTable
        sortBy="updatedAt"
        title="Rejected Deposit"
        pending={false}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.deposit.list.useQuery({
            status: "rejected",
            table: queryOptions,
          })
        }
      />
    </Page>
  );
};

export default RejectedDeposit;
