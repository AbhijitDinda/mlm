import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { upperCase } from "upper-case";
import DataTable from "../../components/DataTable";
import TableUser from "../../components/TableUser";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

const EPinTransferHistory = () => {
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
      field: "ePins",
      headerName: upperCase("ePins"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("transferred at"),
      minWidth: 180,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
  ];

  return (
    <DataTable
      title="E-Pin Transfer List"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.ePin.transferList.useQuery(queryOptions)
      }
    />
  );
};

export default EPinTransferHistory;
