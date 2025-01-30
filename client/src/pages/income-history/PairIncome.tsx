import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import DataTable from "../../components/DataTable";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Label from "../../components/Label";
import Page from "../../components/Page";
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
      headerName: upperCase("txn Id"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("date"),
      minWidth: 200,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return (
          <Label color={value === "credit" ? "success" : "error"}>
            {capitalCase(value)}
          </Label>
        );
      },
    },
  ];

  return (
    <Page title="Pair Income">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Pair Income"
        links={[{ name: "Dashboard" }, { name: "Pair Income" }]}
      />
      {/* Breadcrumb End */}
      <DataTable
        title="Pair Income"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.incomeHistory.pairIncome.useQuery(queryOptions)
        }
        sortModel={sortModel}
        columns={columns}
      />
    </Page>
  );
};

export default PairIncome;
