import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import UserTable from "./UserTable";

const ActiveUser = () => {
  return (
    <Page title="Active Users">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Active Users"
        links={[{ name: "Users" }, { name: "Active Users" }]}
      />
      {/* Breadcrumb End */}

      <UserTable
        title={"Active Users List"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.user.list.useQuery({ status: "active", table: queryOptions })
        }
      />
    </Page>
  );
};

export default ActiveUser;
