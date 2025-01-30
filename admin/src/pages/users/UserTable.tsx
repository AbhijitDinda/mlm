import { Box, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import TableUser from "../../components/TableUser";
import { fDateTime } from "../../utils/formatTime";

const UserTable = ({ query, title }: { query: any; title: string }) => {
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
    { field: "level", headerName: upperCase("level"), minWidth: 50, flex: 1 },
    {
      field: "kyc",
      headerName: upperCase("kyc"),
      minWidth: 50,
      flex: 1,
      renderCell: ({ value }) => {
        const getIcon = () => {
          if (value === "approved") return "lucide:check-circle";
          if (value === "pending") return "mdi:clock-time-three-outline";
          return "ri:close-circle-line";
        };
        const getColor = () => {
          if (value === "approved") return "success";
          if (value === "pending") return "warning";
          if (value === "rejected") return "error";
          return "info";
        };
        return (
          <Tooltip title={capitalCase(value || "unverified")}>
            <Box>
              <Iconify
                color={getColor() + ".main"}
                sx={{ fontSize: 24 }}
                icon={getIcon()}
              />
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => {
        const getColor = (value: string) =>
          value === "active" ? "success" : "error";
        return <Label color={getColor(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("registered At"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "referralId",
      headerName: upperCase("Referral By"),
      minWidth: 100,
      flex: 1,
      renderCell({ row: { referralDisplayName, referralId } }) {
        return (
          <Box>
            <Typography variant="body2">{referralDisplayName}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {referralId}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "placementId",
      headerName: upperCase("Placement At"),
      minWidth: 100,
      flex: 1,
      renderCell({ row: { placementDisplayName, placementId } }) {
        return (
          <Box>
            <Typography variant="body2">{placementDisplayName}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {placementId}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "placement",
      headerName: upperCase("placement"),
      minWidth: 100,
      flex: 1,
    },
  ];

  return (
    <DataTable
      title={title}
      query={query}
      sortModel={sortModel}
      columns={columns}
    />
  );
};

export default UserTable;
