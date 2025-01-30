import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";

import Avatar from "../../components/Avatar";
import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import createAvatar from "../../utils/createAvatar";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const TransferPaymentHistory = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "agentId",
      headerName: upperCase("User"),
      minWidth: 200,
      flex: 1,
      renderCell({ row: { agentId, avatar, displayName, status } }) {
        return (
          <Box display="flex" alignItems="center">
            <Box sx={{ position: "relative" }}>
              <Avatar
                alt={"name"}
                src={avatar}
                sx={{ borderRadius: 999, width: 48, height: 48 }}
                color={avatar ? "default" : createAvatar(displayName).color}
              >
                {createAvatar(displayName).name}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 18,
                  height: 18,
                  bgcolor:
                    status !== "transferred" ? "success.main" : "error.main",
                  borderRadius: 999,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Iconify
                  icon={
                    status === "transferred"
                      ? "material-symbols:arrow-outward-rounded"
                      : "ph:arrow-down-left-bold"
                  }
                />
              </Box>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2">{displayName}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {agentId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "_id",
      headerName: upperCase("txn Id"),
      minWidth: 200,
      flex: 1,
    },
    {
      field: "amount",
      headerName: upperCase("amount"),
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return fCurrency(params.value);
      },
    },
    {
      field: "charge",
      headerName: upperCase("charge"),
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return fCurrency(params.value);
      },
    },
    {
      field: "netAmount",
      headerName: upperCase("net Amount"),
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return fCurrency(params.value);
      },
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return (
          <Label color={value === "received" ? "success" : "error"}>
            {capitalCase(value)}
          </Label>
        );
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("date"),
      minWidth: 180,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
  ];

  return (
    <DataTable
      title="Transfer Payment History"
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.transferPayment.history.useQuery(queryOptions)
      }
      sortModel={sortModel}
      columns={columns}
    />
  );
};

export default TransferPaymentHistory;
