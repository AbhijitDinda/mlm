import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { upperCase } from "upper-case";
import DataTable from "../../../components/DataTable";

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import TableUser from "../../../components/TableUser";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import { trpc } from "../../../trpc";
import { fDateTime } from "../../../utils/formatTime";

const TopSponsors = () => {
  const sortModel = [
    {
      field: "referrals",
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
      field: "referrals",
      headerName: upperCase("referrals"),
      minWidth: 100,
      flex: 1,
    },
  ];

  return (
    <Page title="Top Sponsors">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Top Sponsors"
        links={[{ name: "Reports" }, { name: "Top Sponsors" }]}
      />
      {/* Breadcrumb End */}

      <DataTable
        title="Top Sponsors"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.report.topSponsor.useQuery(queryOptions)
        }
      />
    </Page>
  );
};

export default TopSponsors;
