import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import useProductFilter from "./FilterProvider";

const PageSizes = [10, 20, 50, 100] as const;
export type PageSizeOptions = typeof PageSizes[number];

const ProductPagination = () => {
  const { onChangePage, page, pageSize, resultCount, rowCount } =
    useProductFilter();

  const totalPages = Math.floor(rowCount / pageSize);

  const onFirst = () => onChangePage(0);
  const onPrevious = () => onChangePage(page - 1);
  const onNext = () => onChangePage(page + 1);
  const onLast = () => onChangePage(totalPages - 1);

  const canGoFirst = page !== 0;
  const canGoPrev = page !== 0;
  const canGoNext = page < totalPages - 1;
  const canGoLast = page < totalPages - 1;

  const text = `${resultCount === 0 ? 0 : page * pageSize + 1}-${
    page * pageSize + resultCount
  } of ${rowCount}`;

  return (
    <Stack sx={{ mt: 4 }} direction="row" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle1">Rows per page:</Typography>
        <Typography variant="subtitle1">10</Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Box sx={{ mr: 2 }}>
          <Typography variant="subtitle2">{text}</Typography>
        </Box>
        <IconButton disabled={!canGoFirst} onClick={onFirst}>
          <FirstPageIcon />
        </IconButton>
        <IconButton disabled={!canGoPrev} onClick={onPrevious}>
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton disabled={!canGoNext} onClick={onNext}>
          <NavigateNextIcon />
        </IconButton>
        <IconButton disabled={!canGoLast} onClick={onLast}>
          <LastPageIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};
export default ProductPagination;
