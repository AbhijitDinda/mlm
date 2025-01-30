import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import DepositTable from "./DepositTable";

const AutomaticDeposit = () => {
  return (
    <Page title="Automatic Deposit">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Automatic Deposit"
        links={[{ name: "Deposit" }, { name: "Automatic Deposit" }]}
      />
      {/* Breadcrumb End */}

      <DepositTable
        sortBy="updatedAt"
        title="Automatic Deposit"
        pending={false}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.deposit.list.useQuery({
            status: "instant",
            table: queryOptions,
          })
        }
      />
    </Page>
  );
};

export default AutomaticDeposit;
