import React from "react";
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { Box, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import Avatar from "../../components/Avatar";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import createAvatar from "../../utils/createAvatar";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";
import { GridColDef } from "@mui/x-data-grid";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
const IndirectReward = () => {
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
      renderCell({ row: { avatar, agentId, displayName } }) {
        return (
          <Box display="flex" alignItems="center">
            <Avatar
              alt={"name"}
              src={avatar}
              color={avatar ? "default" : createAvatar(displayName).color}
              sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
            >
              {createAvatar(displayName).name}
            </Avatar>
            <Box>
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
      field: "indirectReward",
      headerName: upperCase("indirectReward"),
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
    <Page title="Indirect Reward">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Indirect Reward"
        links={[{ name: "Dashboard" }, { name: "Indirect Reward" }]}
      />
      {/* Breadcrumb End */}
      <DataTable
        title="Indirect Reward"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.incomeHistory.indirectReward.useQuery(queryOptions)
        }
      />
    </Page>
  );
};
export default IndirectReward;
