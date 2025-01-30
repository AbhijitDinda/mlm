import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";

import DataTable from "../../../components/DataTable";
import Label from "../../../components/Label";
import TableUser from "../../../components/TableUser";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import { trpc } from "../../../trpc";
import { fDateTime } from "../../../utils/formatTime";

const JoiningTable = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: upperCase("user"),
      minWidth: 260,
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
      minWidth: 150,
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
      field: "referralId",
      headerName: upperCase("referral Id"),
      minWidth: 120,
      flex: 1,
    },
    {
      field: "placementId",
      headerName: upperCase("placement Id"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "placement",
      headerName: upperCase("placement"),
      minWidth: 80,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("Joined At"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("Status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return value == "active" ? (
          <Label color="success">{capitalCase(value)}</Label>
        ) : (
          <Label color="error">{capitalCase(value)}</Label>
        );
      },
    },
  ];
  return (
    <DataTable
      title={"Users Joining List"}
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.report.joining.useQuery(queryOptions)
      }
    />
  );
};

export default JoiningTable;
