import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import UserTable from "./UserTable";

const AllUser = () => {
  return (
    <Page title="All Users">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="All Users"
        links={[{ name: "Users" }, { name: "All Users" }]}
      />
      {/* Breadcrumb End */}

      <UserTable
        title={"All Users List"}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.user.list.useQuery({ status: "all", table: queryOptions })
        }
      />
    </Page>
  );
};

export default AllUser;
