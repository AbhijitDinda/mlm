import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import WithdrawTable from "./WithdrawTable";

const AllWithdraw = () => {
  return (
    <Page title="All Withdraw">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="All Withdraw"
        links={[{ name: "Withdraw" }, { name: "All Withdraw" }]}
      />
      {/* Breadcrumb End */}

      <WithdrawTable
        title={"All Withdraw"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.withdraw.list.useQuery({ status: "all", table: queryOptions })
        }
      />
    </Page>
  );
};

export default AllWithdraw;
