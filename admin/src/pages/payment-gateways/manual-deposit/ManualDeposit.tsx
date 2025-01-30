import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";
import IconifyIcons from "../../../IconifyIcons";
import Avatar from "../../../components/Avatar";
import DataTableClient from "../../../components/DataTableClient";
import Iconify from "../../../components/Iconify";
import Label from "../../../components/Label";
import LoadingIconButton from "../../../components/LoadingIconButton";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import createAvatar from "../../../utils/createAvatar";
import { fCurrency, fPercent } from "../../../utils/formatNumber";
import { fDateTime } from "../../../utils/formatTime";

const ManualDeposit = () => {
  const utils = trpc.useContext();
  const [statusId, setStatusId] = useState<string | null>(null);
  const { mutate } = trpc.paymentGateways.manualDeposit.status.useMutation({
    onSuccess({ data }) {
      utils.paymentGateways.manualDeposit.list.setData(undefined, (lists) => {
        return lists?.map((list) => (list._id === data._id ? data : list));
      });
    },
    onSettled() {
      setStatusId(null);
    },
  });

  const changeStatus = async (
    gatewayId: string,
    status: "active" | "inactive"
  ) => {
    setStatusId(gatewayId);
    mutate({ id: gatewayId, status });
  };

  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: upperCase("name"),
      minWidth: 200,
      flex: 1,
      renderCell({ row: { name, logo } }) {
        return (
          <Box display="flex" alignItems="center">
            <Avatar
              alt={name}
              src={logo}
              color={logo ? "default" : createAvatar(name).color}
              sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
            />
            <Box>
              <Typography color="text.primary" variant="body2">
                {name}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "charge",
      headerName: upperCase("charge"),
      minWidth: 50,
      flex: 1,
      renderCell({ row: { charge, chargeType } }) {
        return chargeType === "fixed" ? fCurrency(charge) : fPercent(charge);
      },
    },
    {
      field: "minDeposit",
      headerName: upperCase("limit"),
      minWidth: 200,
      flex: 1,
      renderCell({ row }) {
        return `${fCurrency(row.minDeposit)} - ${fCurrency(row.maxDeposit)}`;
      },
    },
    {
      field: "processingTime",
      headerName: upperCase("processing Time"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return fDateTime(value);
      },
    },
    {
      field: "status",
      headerName: upperCase("status"),
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
    {
      field: "action",
      headerName: upperCase("action"),
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell({ row: { _id, status } }) {
        return (
          <>
            <LoadingIconButton
              loading={statusId === _id}
              onClick={() => changeStatus(_id, status)}
            >
              {status === "active" ? (
                <Iconify icon="ant-design:eye-invisible-filled" />
              ) : (
                <Iconify icon="ant-design:eye-filled" />
              )}
            </LoadingIconButton>
            <IconButton
              component={RouterLink}
              to={APP_PATH.paymentGateways.createManualDeposit + "/" + _id}
            >
              <Iconify icon={IconifyIcons.pencil} />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <DataTableClient
      title="Manual Deposits"
      action={
        <Button
          component={RouterLink}
          to={APP_PATH.paymentGateways.createManualDeposit}
          startIcon={<Iconify icon="carbon:add" />}
          variant="contained"
        >
          Create a new
        </Button>
      }
      sortModel={sortModel}
      columns={columns}
      query={trpc.paymentGateways.manualDeposit.list.useQuery}
    />
  );
};

export default ManualDeposit;
