import { Card, CardHeader } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";

import useDataTable from "../hooks/useDataTable";
import EmptyContent from "./EmptyContent";

const DataTableClient = ({
  title,
  action,
  subheader,
  columns: dataColumns,
  query,
  sortModel: defaultSortModel,
}: {
  columns: GridColDef[];
  title: React.ReactNode;
  sortModel: GridSortModel;
  query: any;
  subheader?: string;
  action?: React.ReactNode;
}) => {
  const columns = [customRowIndexColumn(), ...dataColumns];
  const {
    sortModel,
    rowsPerPageOptions,
    pageSize,
    localeText,
    onPageSizeChange,
    onSortModelChange,
    onFilterModelChange,
  } = useDataTable({ sortModel: defaultSortModel });

  const { data, isFetching } = query();
  const rows = data ?? [];

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} action={action} />
      <DataGrid
        sx={{
          "& .MuiDataGrid-virtualScroller": {
            ...(!rows.length && {
              height: "500px !important",
              pointerEvents: "none",
            }),
          },
        }}
        components={{ NoRowsOverlay, NoResultsOverlay }}
        getRowId={(row) => row["_id"]}
        rows={rows}
        loading={isFetching}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        onFilterModelChange={onFilterModelChange}
        columns={columns}
        localeText={localeText}
        autoHeight={true}
        density="comfortable"
        disableSelectionOnClick
      />
    </Card>
  );
};

function NoResultsOverlay() {
  return <EmptyContent title="No Search Results Found" />;
}

function NoRowsOverlay() {
  return <EmptyContent title="No Data Found" />;
}

export function customRowIndexColumn() {
  return {
    field: "#",
    sortable: false,
    filterable: false,
    maxWidth: 50,
    headerName: "#",
    renderCell: (index: GridRenderCellParams) =>
      Number(index?.api?.getRowIndex(index.row.id)) + 1,
  };
}

export default DataTableClient;
