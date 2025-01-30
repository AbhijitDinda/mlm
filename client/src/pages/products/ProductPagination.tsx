import { TablePagination } from "@mui/material";
import { useCallback } from "react";
import useProductFilter from "./FilterProvider";

const PageSizes = [10, 25, 50, 100];
export type PageSizeOptions = typeof PageSizes[number];

const ProductPagination = () => {
  const { onChangePage, page, pageSize, onChangePageSize, rowCount } =
    useProductFilter();

  const handlePageChange = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
      page: number
    ) => {
      event && event.stopPropagation();
      onChangePage(page + 1);
    },
    [onChangePage]
  );
  const handlePerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChangePageSize(Number(event.target.value));
    },
    [onChangePageSize]
  );

  return (
    <TablePagination
      sx={{ borderTop: 0 }}
      count={rowCount == null ? -1 : rowCount}
      rowsPerPage={pageSize}
      page={page}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePerPageChange}
      component="div"
      rowsPerPageOptions={PageSizes}
    />
  );
};
export default ProductPagination;
