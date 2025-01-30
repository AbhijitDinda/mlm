import { Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import TableUser from "../../components/TableUser";
import APP_PATH from "../../routes/paths";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const DepositTable = ({
  query,
  title,
  pending,
  sortBy = "createdAt",
}: {
  query: any;
  title: string;
  pending?: boolean;
  sortBy?: string;
}) => {
  const sortModel = [
    {
      field: sortBy,
      sort: pending ? ("asc" as const) : ("desc" as const),
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
      field: "gateway",
      headerName: upperCase("gateway"),
      minWidth: 120,
      flex: 1,
    },
    {
      field: "transactionId",
      headerName: upperCase("txn Id"),
      minWidth: 140,
      flex: 1,
      renderCell({ row: { id, transactionId } }) {
        return (
          <Link
            component={RouterLink}
            to={APP_PATH.deposit.transaction + "/" + transactionId}
          >
            #{transactionId}
          </Link>
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
      headerName: upperCase("charge"),
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
      field: "status",
      headerName: upperCase("Status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        const getLabel = (status: string) => {
          if (status === "approved" || status === "credit") return "success";
          if (status === "pending" || status === "review") return "warning";
          if (
            status === "failed" ||
            status === "cancel" ||
            status === "rejected"
          )
            return "error";
        };
        return <Label color={getLabel(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 180,
      flex: 1,
      renderCell({ value }) {
        return fDateTime(value);
      },
    },
  ];

  if (!pending) {
    columns.splice(8, 0, {
      field: "updatedAt",
      headerName: upperCase("proceed at"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    });
  }

  return (
    <DataTable
      title={title}
      query={query}
      sortModel={sortModel}
      columns={columns}
    />
  );
};

export default DepositTable;
