import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import WithdrawTable from "./WithdrawTable";

const RejectedWithdraw = () => {
  return (
    <Page title="Rejected Withdraw">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Rejected Withdraw"
        links={[{ name: "Withdraw" }, { name: "Rejected Withdraw" }]}
      />
      {/* Breadcrumb End */}

      <WithdrawTable
        sortBy="updatedAt"
        title={"Rejected Withdraw"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.withdraw.list.useQuery({ status: "rejected", table: queryOptions })
        }
      />
    </Page>
  );
};

export default RejectedWithdraw;
