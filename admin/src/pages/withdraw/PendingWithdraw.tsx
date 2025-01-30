import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import WithdrawTable from "./WithdrawTable";

const PendingWithdraw = () => {
  return (
    <Page title="Pending Withdraw">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Pending Withdraw"
        links={[{ name: "Withdraw" }, { name: "Pending Withdraw" }]}
      />
      {/* Breadcrumb End */}

      <WithdrawTable
        title={"Pending Withdraw"}
        pending
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.withdraw.list.useQuery({
            status: "pending",
            table: queryOptions,
          })
        }
      />
    </Page>
  );
};

export default PendingWithdraw;
