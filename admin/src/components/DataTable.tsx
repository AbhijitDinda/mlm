import { Box, Card, CardHeader, InputAdornment } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridSortModel,
} from "@mui/x-data-grid";

import useDataTable from "../hooks/useDataTable";
import DebouncedInput from "./DebounceInput";
import EmptyContent from "./EmptyContent";
import Iconify from "./Iconify";

const DataTable = ({
  title,
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
}) => {
  const columns = [customRowIndexColumn(), ...dataColumns];
  const {
    sortModel,
    page,
    rowsPerPageOptions,
    pageSize,
    queryOptions,
    localeText,
    onPageChange,
    onPageSizeChange,
    onSortModelChange,
    onFilterModelChange,
    onChangeSearchFilter,
  } = useDataTable({ sortModel: defaultSortModel });

  const { data, isLoading, isFetching } = query(queryOptions);
  const { rows, rowCount }: { rows: GridRowsProp; rowCount: number } = data ?? {
    rows: [],
    rowCount: 0,
  };

  const NoRowsOverlay = () => {
    return <EmptyContent title="No Data Found" />;
  };
  const NoResultsOverlay = () => {
    return (
      <EmptyContent
        title="No Search Results Found"
        element={
          <Box
            onClick={() => onChangeSearchFilter()}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              color: "text.secondary",
              cursor: "pointer",
            }}
          >
            Reset Search <Iconify icon="system-uicons:reset-alt" />
          </Box>
        }
      />
    );
  };

  return (
    <Card>
      <CardHeader
        sx={[
          (theme) => ({
            [theme.breakpoints.down("md")]: {
              "& .MuiCardHeader-action": {
                width: 1,
              },
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            },
          }),
        ]}
        title={title}
        subheader={subheader}
        action={
          <DebouncedInput
            placeholder="Search..."
            variant="standard"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon={"eva:search-fill"}
                    sx={{ color: "text.disabled", width: 20, height: 20 }}
                  />
                </InputAdornment>
              ),
            }}
            onChange={onChangeSearchFilter}
            fullWidth
          />
        }
      />
      <DataGrid
        disableColumnFilter
        getRowId={({ _id }) => _id}
        sx={{
          "& .MuiDataGrid-virtualScroller": {
            ...(!rows.length && {
              height: "500px !important",
              pointerEvents: "none",
            }),
          },
        }}
        components={{ NoRowsOverlay, NoResultsOverlay }}
        rows={rows}
        rowCount={rowCount}
        loading={isLoading || isFetching}
        rowsPerPageOptions={rowsPerPageOptions}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        onPageChange={onPageChange}
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

export function customRowIndexColumn() {
  return {
    field: "#",
    sortable: false,
    filterable: false,
    maxWidth: 50,
    headerName: "#",
    renderCell: (index: GridRenderCellParams) =>
      Number(index?.api?.getRowIndex(index.row._id)) + 1,
  };
}

export default DataTable;
