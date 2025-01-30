import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { parse } from "date-fns";
import { useMemo, useState } from "react";
import { fDateToUtc } from "../utils/formatTime";

const rowsPerPageOptions = [10, 25, 50, 100];

interface Props {
  sortModel: GridSortModel;
  page?: number;
  pageSize?: number;
}

export interface DataTableQueryOptions {
  pageIndex: number;
  pageSize: number;
  sortModel: GridSortModel;
  searchFilter: string;
  filterModel: GridFilterModel;
}

const useDataTable = (props?: Props) => {
  const [sortModel, setSortModel] = useState(props?.sortModel);
  const [page, setPage] = useState(props?.page || 0);
  const [pageSize, setPageSize] = useState(
    props?.pageSize || rowsPerPageOptions[0]
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [searchFilter, setSearchFilter] = useState<string>("");

  const onPageChange = (newPage: number) => setPage(newPage);
  const onPageSizeChange = (newPageSize: number) => setPageSize(newPageSize);
  const onSortModelChange = (model: GridSortModel) => {
    if (JSON.stringify(model) !== JSON.stringify(sortModel)) {
      setSortModel(model);
    }
  };
  const onFilterModelChange = (filterModel: GridFilterModel) =>
    setFilterModel(filterModel);
  const onChangeSearchFilter = (e?: string) => {
    let value: string;
    if (e) {
      value = e;
      const date = parse(e, "dd MMM yyyy HH:mm:ss", new Date());
      if (date.toString() !== "Invalid Date") {
        value = fDateToUtc(value);
      }
    } else {
      value = "";
    }
    setSearchFilter(value);
  };

  const queryOptions = useMemo(
    () => ({
      pageIndex: page,
      pageSize,
      sortModel,
      searchFilter,
      filterModel,
    }),
    [page, pageSize, sortModel, searchFilter, filterModel]
  );

  const localeText = {
    MuiTablePagination: {
      labelRowsPerPage: "Rows per page:",
      labelDisplayedRows: ({
        from,
        to,
        count,
      }: {
        from: number;
        to: number;
        count: number;
      }) => `${from} - ${to} of ${count}`,
    },
  };

  return {
    sortModel,
    page,
    pageSize,
    filterModel,
    searchFilter,
    //
    queryOptions,
    localeText,
    rowsPerPageOptions,
    //
    onPageChange,
    onPageSizeChange,
    onSortModelChange,
    onFilterModelChange,
    onChangeSearchFilter,
  };
};

export default useDataTable;
