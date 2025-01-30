import { Box, Tooltip, Typography } from "@mui/material";
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
import { fDateTime } from "../../utils/formatTime";

const TotalTeamList = () => {
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
      renderCell({ row: { avatar, displayName, email } }) {
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
                {email}
              </Typography>
            </Box>
          </Box>
        );
      },
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
      field: "level",
      headerName: upperCase("level"),
      minWidth: 80,
      flex: 1,
    },
    {
      field: "kyc",
      headerName: upperCase("kyc"),
      minWidth: 70,
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
      field: "referralId",
      headerName: upperCase("Referral By"),
      minWidth: 180,
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
      field: "placement",
      headerName: upperCase("placement"),
      minWidth: 100,
      sortable: false,
      filterable: false,
      flex: 1,
      // renderCell: ({ value }) => capitalCase(value),
    },
    {
      field: "createdAt",
      headerName: upperCase("registered At"),
      minWidth: 180,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
  ];

  return (
    <DataTable
      title="Total Team"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.totalTeam.list.useQuery(queryOptions)
      }
    />
  );
};

export default TotalTeamList;
