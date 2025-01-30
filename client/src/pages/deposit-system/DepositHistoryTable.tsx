import { Box, Link, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
// RouterLink
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Image from "../../components/Image";
import Label from "../../components/Label";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const getColor = (status: string) => {
  if (status === "pending" || status === "review") return "warning";
  if (status === "rejected" || status === "cancelled" || status === "failed")
    return "error";
  if (status === "credit" || status === "approved") return "success";
  return "success";
};

export default function DepositHistoryTable() {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "gateway",
      headerName: upperCase("gateway"),
      minWidth: 180,
      flex: 1,
      renderCell({
        row: {
          gateway: { logo, name },
        },
      }) {
        return (
          <Box display="flex" alignItems="center">
            <Image
              disabledEffect
              alt={name}
              src={logo}
              sx={{ borderRadius: 999, width: 48, height: 48, mr: 2 }}
            />
            <Box>
              <Typography variant="body2">{name}</Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "transactionId",
      headerName: upperCase("txn Id"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return (
          <Link
            to={APP_PATH.depositSystem.transaction + "/" + value}
            component={RouterLink}
          >
            #{value}
          </Link>
        );
      },
    },
    {
      field: "amount",
      headerName: upperCase("amount"),
      minWidth: 120,
      flex: 1,
      renderCell: ({ row: { amount, status } }) => (
        <Box color={getColor(status) + ".main"}>{fCurrency(amount)}</Box>
      ),
    },
    {
      field: "charge",
      headerName: upperCase("charge"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ row: { charge, status } }) => (
        <Box color={getColor(status) + ".main"}>{fCurrency(charge)}</Box>
      ),
    },
    {
      field: "netAmount",
      headerName: upperCase("net Amount"),
      minWidth: 120,
      flex: 1,
      renderCell: ({ row: { netAmount, status } }) => (
        <Box color={getColor(status) + ".main"}>{fCurrency(netAmount)}</Box>
      ),
    },
    {
      field: "createdAt",
      headerName: upperCase("requested At"),
      minWidth: 170,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "updatedAt",
      headerName: upperCase("proceed At"),
      minWidth: 160,
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
        const status = (value: string) => {
          if (value === "pending" || value === "review") return "warning";
          if (
            value === "rejected" ||
            value === "cancelled" ||
            value === "failed"
          )
            return "error";
          if (value === "credit" || value === "approved") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
  ];

  return (
    <DataTable
      title="Deposit History"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.deposit.history.useQuery(queryOptions)
      }
    />
  );
}
