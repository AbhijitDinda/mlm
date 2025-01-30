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

const ReferralIncome = () => {
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
      renderCell({ row: { avatar, userId, displayName } }) {
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
                {userId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "transactionId",
      headerName: upperCase("txn Id"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "referralIncome",
      headerName: upperCase("Income"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("referred At"),
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
        return <Label color="success">{capitalCase(value)}</Label>;
      },
    },
  ];

  return (
    <Page title="Referral Income">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Referral Income"
        links={[{ name: "Dashboard" }, { name: "Referral Income" }]}
      />
      {/* Breadcrumb End */}
      <DataTable
        title="Referral Income"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.incomeHistory.referralIncome.useQuery(queryOptions)
        }
      />
    </Page>
  );
};

export default ReferralIncome;
