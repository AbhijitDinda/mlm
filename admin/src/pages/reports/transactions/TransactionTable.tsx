import { Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";
import DataTable from "../../../components/DataTable";
import Label from "../../../components/Label";
import TableUser from "../../../components/TableUser";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import { fCurrency } from "../../../utils/formatNumber";
import { fDateTime } from "../../../utils/formatTime";

const TransactionTable = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: upperCase("user"),
      minWidth: 180,
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
      field: "_id",
      headerName: upperCase("txn Id"),
      minWidth: 120,
      flex: 1,
      renderCell({ row: { category, _id } }) {
        return ["withdraw", "deposit", "purchased_product"].includes(
          category
        ) ? (
          <Link
            to={APP_PATH.reports.transactions.view(_id)}
            component={RouterLink}
          >
            #{_id}
          </Link>
        ) : (
          _id
        );
      },
    },
    {
      field: "amount",
      headerName: upperCase("amount"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "charge",
      headerName: upperCase("txn Charge"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "netAmount",
      headerName: upperCase("net Amount"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },

    {
      field: "description",
      headerName: upperCase("description"),
      minWidth: 200,
      flex: 1,
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        const status = (value: string) => {
          if (value === "pending") return "warning";
          if (value === "capping") return "info";
          if (value === "debit" || value === "failed") return "error";
          if (value === "credit") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "updatedAt",
      headerName: upperCase("proceed At"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
  ];
  return (
    <DataTable
      title="Transactions History"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.report.transactionList.useQuery(queryOptions)
      }
    />
  );
};

export default TransactionTable;
