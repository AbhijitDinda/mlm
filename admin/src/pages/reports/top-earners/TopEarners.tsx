import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { upperCase } from "upper-case";
import DataTable from "../../../components/DataTable";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import TableUser from "../../../components/TableUser";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import { trpc } from "../../../trpc";
import { fCurrency } from "../../../utils/formatNumber";
import { fDateTime } from "../../../utils/formatTime";

const TopEarners = () => {
  const sortModel = [
    {
      field: "earning",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: upperCase("user"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ row: { avatar, displayName, email, userId } }) => (
        <TableUser
          avatar={avatar}
          title={displayName}
          subtitle={email}
          userId={userId}
        />
      ),
    },
    {
      field: "userId",
      headerName: upperCase("username / userid"),
      minWidth: 180,
      flex: 1,
      renderCell({ row: { userName, userId } }) {
        return (
          <Box>
            <Typography variant="body2">{userName}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {userId}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("registered At"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "earning",
      headerName: upperCase("earning"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => fCurrency(value),
    },
  ];

  return (
    <Page title="Top Earners">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Top Earners"
        links={[{ name: "Reports" }, { name: "Top Earners" }]}
      />
      {/* Breadcrumb End */}

      <DataTable
        title="Top Earners"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.report.topEarner.useQuery(queryOptions)
        }
      />
    </Page>
  );
};

export default TopEarners;
