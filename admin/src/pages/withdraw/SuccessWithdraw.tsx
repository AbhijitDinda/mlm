import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import WithdrawTable from "./WithdrawTable";

const SuccessWithdraw = () => {
  return (
    <Page title="Success Withdraw">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Success Withdraw"
        links={[{ name: "Withdraw" }, { name: "Success Withdraw" }]}
      />
      {/* Breadcrumb End */}
      <WithdrawTable
        sortBy="updatedAt"
        title={"Success Withdraw"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.withdraw.list.useQuery({
            status: "success",
            table: queryOptions,
          })
        }
      />
    </Page>
  );
};

export default SuccessWithdraw;
