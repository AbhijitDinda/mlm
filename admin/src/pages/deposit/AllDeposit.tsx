import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import DepositTable from "./DepositTable";

const AllDeposit = () => {
  return (
    <Page title="All Deposit">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="All Deposit"
        links={[{ name: "Deposit" }, { name: "All Deposit" }]}
      />
      {/* Breadcrumb End */}

      <DepositTable
        title="All Deposit"
        pending={false}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.deposit.list.useQuery({ status: "all", table: queryOptions })
        }
      />
    </Page>
  );
};

export default AllDeposit;
