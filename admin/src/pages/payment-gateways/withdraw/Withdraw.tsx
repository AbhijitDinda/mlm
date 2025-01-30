import { Button, IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";
import IconifyIcons from "../../../IconifyIcons";
import DataTableClient from "../../../components/DataTableClient";
import Iconify from "../../../components/Iconify";
import Image from "../../../components/Image";
import Label from "../../../components/Label";
import LoadingIconButton from "../../../components/LoadingIconButton";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import { fCurrency, fPercent } from "../../../utils/formatNumber";
import { fDateTime } from "../../../utils/formatTime";

const Withdraw = () => {
  const utils = trpc.useContext();
  const [statusId, setStatusId] = useState<string | null>(null);
  const { mutate } = trpc.paymentGateways.withdraw.status.useMutation({
    onSuccess({ data }) {
      utils.paymentGateways.withdraw.list.setData(undefined, (lists) => {
        return lists?.map((list) => (list._id === data._id ? data : list));
      });
      setStatusId(null);
    },
  });
  const changeStatus = async (id: string, status: "active" | "inactive") => {
    setStatusId(id);
    mutate({ id, status });
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
      headerName: upperCase("Method"),
      minWidth: 200,
      flex: 1,
      renderCell({ row: { logo, name } }) {
        return (
          <>
            <Image
              disabledEffect
              alt={"name"}
              src={logo}
              sx={{
                borderRadius: 999,
                width: 48,
                minWidth: 48,
                height: 48,
                mr: 2,
              }}
            />
            {name}
          </>
        );
      },
    },
    {
      field: "charge",
      headerName: upperCase("charge"),
      minWidth: 50,
      flex: 0.8,
      renderCell({ row: { charge, chargeType } }) {
        return chargeType === "fixed" ? fCurrency(charge) : fPercent(charge);
      },
    },
    {
      field: "minWithdraw",
      headerName: upperCase("limit"),
      minWidth: 150,
      flex: 1,
      renderCell({ row }) {
        return `${fCurrency(row.minWithdraw)} - ${fCurrency(row.maxWithdraw)}`;
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
      minWidth: 180,
      flex: 1,
      renderCell({ value }) {
        return fDateTime(value);
      },
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 80,
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
      filterable: false,
      sortable: false,
      renderCell({ row: { _id, status } }) {
        return (
          <>
            <LoadingIconButton
              loading={statusId === _id}
              onClick={() => changeStatus(_id, status)}
            >
              {status === "active" ? (
                <Iconify icon={IconifyIcons.eyeClosed} />
              ) : (
                <Iconify icon={IconifyIcons.eye} />
              )}
            </LoadingIconButton>
            <IconButton
              component={RouterLink}
              to={APP_PATH.paymentGateways.updateWithdrawGateway(_id)}
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
      title="Withdraw Methods"
      sortModel={sortModel}
      columns={columns}
      action={
        <Button
          component={RouterLink}
          to={APP_PATH.paymentGateways.createWithdrawGateway}
          startIcon={<Iconify icon="carbon:add" />}
          variant="contained"
        >
          Create a new
        </Button>
      }
      query={trpc.paymentGateways.withdraw.list.useQuery}
    />
  );
};

export default Withdraw;
