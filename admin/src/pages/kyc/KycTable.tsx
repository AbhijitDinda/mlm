import { Box, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import TableUser from "../../components/TableUser";
import IconifyIcons from "../../IconifyIcons";
import APP_PATH from "../../routes/paths";
import { fDateTime } from "../../utils/formatTime";

const KycTable = ({
  query,
  title,
  pending = false,
}: {
  query: any;
  title: string;
  pending?: boolean;
}) => {
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
      field: "createdAt",
      headerName: upperCase("requested At"),
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
        const getLabel = (status: string) => {
          if (status === "pending") return "warning";
          if (status === "rejected") return "error";
          if (status === "approved") return "success";
        };
        return <Label color={getLabel(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "action",
      headerName: upperCase("Action"),
      minWidth: 50,
      sortable: false,
      renderCell({ row: { _id } }) {
        return (
          <>
            <IconButton component={RouterLink} to={APP_PATH.kyc.view(_id)}>
              <Iconify icon={IconifyIcons.rightDirectionArrow} />
            </IconButton>
          </>
        );
      },
    },
  ];
  if (!pending) {
    columns.splice(3, 0, {
      field: "updatedAt",
      headerName: upperCase("proceed at"),
      minWidth: 200,
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

export default KycTable;
