import { Card, IconButton, Link, Stack, Tab, Tabs } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import TableUser from "../../components/TableUser";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import IconifyIcons from "../../IconifyIcons";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

export default function SupportTbl() {
  type Status = "pending" | "all" | "active" | "closed";

  const params = useParams();
  const status = (params.status || "pending") as Status;

  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: upperCase("Ticket Id"),
      minWidth: 100,
      maxWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return (
          <Link to={APP_PATH.support.ticket(value)} component={RouterLink}>
            #{value}
          </Link>
        );
      },
    },
    {
      field: "userId",
      headerName: upperCase("user"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ row: { avatar, displayName, userId } }) => (
        <TableUser
          avatar={avatar}
          title={displayName}
          subtitle={userId}
          userId={userId}
        />
      ),
    },
    {
      field: "subject",
      headerName: upperCase("subject"),
      minWidth: 200,
      flex: 1.5,
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "updatedAt",
      headerName: upperCase("last Replied At"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        const status = (value: string) => {
          if (value === "pending") return "warning";
          if (value === "closed") return "error";
          if (value === "active") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "view",
      headerName: upperCase("view"),
      maxWidth: 100,
      sortable: false,
      renderCell({ row: { _id } }) {
        return (
          <IconButton to={APP_PATH.support.ticket(_id)} component={RouterLink}>
            <Iconify icon={IconifyIcons.rightDirectionArrow}></Iconify>
          </IconButton>
        );
      },
    },
  ];

  const [filterStatus, setFilterStatus] = useState(status || "all");

  const { data } = trpc.dashboard.cards.useQuery();
  const analytics = data! ?? {
    all: 0,
    pending: 0,
    active: 0,
    closed: 0,
  };

  const TABS = [
    {
      value: "all",
      label: "All",
      color: "info" as const,
      count: analytics.totalTickets,
    },
    {
      value: "pending",
      label: "Pending",
      color: "warning" as const,
      count: analytics.pendingTickets,
    },
    {
      value: "active",
      label: "Active",
      color: "success" as const,
      count: analytics.activeTickets,
    },
    {
      value: "closed",
      label: "Closed",
      color: "error" as const,
      count: analytics.closedTickets,
    },
  ];
  const onChangeFilterStatus = (event: React.SyntheticEvent, value: Status) =>
    setFilterStatus(value);
  useEffect(() => {
    setFilterStatus(status);
  }, [status]);

  return (
    <Card>
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={filterStatus}
        onChange={onChangeFilterStatus}
        sx={{ px: 2, bgcolor: "background.neutral" }}
      >
        {TABS.map((tab) => (
          <Tab
            component={RouterLink}
            to={APP_PATH.support.root + "/" + tab.value}
            disableRipple
            key={tab.value}
            value={tab.value}
            label={
              <Stack spacing={1} direction="row" alignItems="center">
                <div>{tab.label}</div>{" "}
                <Label color={tab.color}> {tab.count} </Label>
              </Stack>
            }
          />
        ))}
      </Tabs>
      <DataTable
        title="Support Tickets"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.support.list.useQuery({
            status,
            table: queryOptions,
          })
        }
      />
    </Card>
  );
}
