import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import DataTable from "../../components/DataTable";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Label from "../../components/Label";
import Page from "../../components/Page";
import TableUser from "../../components/TableUser";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const PairIncome = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: upperCase("User"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ row: { avatar, userName, userId } }) => (
        <TableUser
          avatar={avatar}
          title={userName}
          subtitle={userId}
          userId={userId}
        />
      ),
    },
    {
      field: "pairIncome",
      headerName: upperCase("amount"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "transactionId",
      headerName: upperCase("transaction Id"),
      minWidth: 150,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("date"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        const status = (value: string) => {
          if (value === "credit") return "success";
          if (value === "capping") return "error";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
  ];

  return (
    <Page title="Pair Income">
      <HeaderBreadcrumbs
        heading="Pair Income"
        links={[{ name: "Reports" }, { name: "Pair Income" }]}
      />
      <DataTable
        title="Pair Income"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.report.pairIncome.useQuery(queryOptions)
        }
      />
    </Page>
  );
};
export default PairIncome;
