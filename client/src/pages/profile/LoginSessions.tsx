import { Box, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import LoadingIconButton from "../../components/LoadingIconButton";
import useAuth from "../../hooks/useAuth";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import IconifyIcons from "../../IconifyIcons";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";
import ProfileMainLogoutAll from "./LogoutAll";

const LoginSessions = () => {
  const utils = trpc.useContext();
  const { user } = useAuth();
  if (!user) return null;
  const { loginSessionId } = user;
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const confirm = useConfirm();
  const { mutate } = trpc.profile.expireToken.useMutation({
    onSuccess() {
      utils.profile.loginSession.invalidate();
    },
    onSettled() {
      setLoadingId(null);
    },
  });

  const handleTokeExpire = async (id: string) => {
    await confirm({ description: "Are you sure want to log out?" });
    setLoadingId(id);
    mutate(id);
  };

  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "region",
      headerName: upperCase("location"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ row: { region, city, country } }) => (
        <Tooltip title={`${region} - ${city}  -${country}`}>
          <Box>{`${region} - ${city} - ${country}`}</Box>
        </Tooltip>
      ),
    },
    {
      field: "device",
      headerName: upperCase("device"),
      minWidth: 300,
      flex: 1,
      renderCell({ row: { device, browser, os } }) {
        return `${device} - ${browser} - ${os}`;
      },
    },
    { field: "ip", headerName: upperCase("ip"), minWidth: 150, flex: 1 },
    {
      field: "createdAt",
      headerName: upperCase("time"),
      minWidth: 200,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("session"),
      minWidth: 50,
      flex: 0.5,
      renderCell({ value }) {
        const getIcon = () => {
          if (value === "active") return "lucide:check-circle";
          return "ri:close-circle-line";
        };
        const getColor = () => {
          if (value === "active") return "success";
          return "error";
        };
        return (
          <Tooltip title={capitalCase(value)}>
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
      field: "id",
      headerName: upperCase("action"),
      maxWidth: 100,
      sortable: false,
      flex: 1,
      renderCell({ row: { _id, status } }) {
        return status === "active" ? (
          <>
            {_id === loginSessionId ? (
              "This device"
            ) : (
              <LoadingIconButton
                loading={loadingId === _id}
                onClick={() => handleTokeExpire(_id)}
              >
                <Iconify icon={IconifyIcons.delete}></Iconify>
              </LoadingIconButton>
            )}
          </>
        ) : (
          <Box>{capitalCase(status)}</Box>
        );
      },
    },
  ];
  return (
    <DataTable
      title={
        <Box>
          Login Sessions
          <ProfileMainLogoutAll sx={{ ml: 2 }} />
        </Box>
      }
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.profile.loginSession.useQuery(queryOptions)
      }
      sortModel={sortModel}
      columns={columns}
    />
  );
};

export default LoginSessions;
