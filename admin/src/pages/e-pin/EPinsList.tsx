import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import DataTable from "../../components/DataTable";
import Label from "../../components/Label";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

const EPinsList = () => {
  const sortModel = [
    {
      field: "status",
      sort: "asc" as const,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "ePin",
      headerName: upperCase("e-Pin"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
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
          if (value === "expired") return "error";
          if (value === "active") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "activatedAt",
      headerName: upperCase("activated at"),
      minWidth: 180,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "assignedTo",
      headerName: upperCase("assigned to"),
      minWidth: 100,
      renderCell: ({ value }) => value ?? "-",
    },
    {
      field: "registeredBy",
      headerName: upperCase("used by"),
      minWidth: 100,
      renderCell: ({ value }) => value ?? "-",
    },
  ];

  return (
    <DataTable
      title="E-Pin List"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.ePin.ePinList.useQuery(queryOptions)
      }
    />
  );
};

export default EPinsList;
