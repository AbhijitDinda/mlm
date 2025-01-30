import { IconButton, Link } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
import { upperCase } from "upper-case";

import DataTable from "../../components/DataTable";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import IconifyIcons from "../../IconifyIcons";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

const sortModel = [
  {
    field: "createdAt",
    sort: "desc" as const,
  },
];
const SupportTicketList = () => {
  const columns: GridColDef[] = [
    {
      field: "_id",
      headerName: upperCase("Ticket Id"),
      minWidth: 200,
      maxWidth: 240,
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
      field: "subject",
      headerName: upperCase("subject"),
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 150,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "updatedAt",
      headerName: upperCase("last Replied At"),
      minWidth: 150,
      flex: 1,
      filterable: false,
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
      flex: 1,
      renderCell({ row: { _id } }) {
        return (
          <IconButton to={APP_PATH.support.ticket(_id)} component={RouterLink}>
            <Iconify icon={IconifyIcons.rightDirectionArrow}></Iconify>
          </IconButton>
        );
      },
    },
  ];
  return (
    <DataTable
      title="Support Tickets"
      subheader="List of tickets opened by you"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.support.list.useQuery(queryOptions)
      }
    />
  );
};

export default SupportTicketList;
