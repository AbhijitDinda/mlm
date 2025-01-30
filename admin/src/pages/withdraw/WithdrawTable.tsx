import { Box, Link, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";

import Avatar from "../../components/Avatar";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import APP_PATH from "../../routes/paths";
import createAvatar from "../../utils/createAvatar";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const WithdrawTable = ({
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
      renderCell({ row: { userName, userId, avatar } }) {
        return (
          <Box display="flex" alignItems="center">
            <Avatar
              alt={"name"}
              src={avatar}
              color={avatar ? "default" : createAvatar(userName).color}
              sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
            >
              {createAvatar(userName).name}
            </Avatar>
            <Box>
              <Typography variant="body2">{userName}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {userId}
              </Typography>
            </Box>
          </Box>
        );
      },
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
            to={APP_PATH.withdraw.transaction + "/" + transactionId}
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
      minWidth: 89,
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
        const getStatus = (status: string) => {
          if (status === "rejected") return "error";
          if (status === "pending") return "warning";
          if (status === "success") return "success";
        };

        return <Label color={getStatus(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
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

export default WithdrawTable;
