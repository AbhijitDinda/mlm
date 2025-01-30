import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import UserTable from "./UserTable";

const BlockedUser = () => {
  return (
    <Page title="Blocked Users">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Blocked Users"
        links={[{ name: "Users" }, { name: "Blocked Users" }]}
      />
      {/* Breadcrumb End */}

      <UserTable
        title={"Blocked Users List"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.user.list.useQuery({ status: "blocked", table: queryOptions })
        }
      />
    </Page>
  );
};

export default BlockedUser;
