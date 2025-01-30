import { Button, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import Iconify from "../../components/Iconify";
import MenuPopover from "../../components/MenuPopover";
import useProductFilter from "./FilterProvider";

const SORT_BY_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "priceDesc", label: "Price: High-Low" },
  { value: "priceAsc", label: "Price: Low-High" },
  { value: "free", label: "Free" },
] as const;
export type SortOptions = typeof SORT_BY_OPTIONS[number]["value"];

const SortFilter = () => {
  const { onChangeSort, sort } = useProductFilter();

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const handleOpen = (currentTarget: HTMLElement) => {
    setOpen(currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };
  const handleSortBy = (value: SortOptions) => {
    handleClose();
    onChangeSort(value);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={(event) => handleOpen(event.currentTarget)}
        endIcon={
          <Iconify
            icon={open ? "eva:chevron-up-fill" : "eva:chevron-down-fill"}
          />
        }
      >
        Sort By:&nbsp;
        <Typography
          component="span"
          variant="subtitle2"
          sx={{ color: "text.secondary" }}
        >
          {renderLabel(sort)}
        </Typography>
      </Button>

      <MenuPopover
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        sx={{
          width: "auto",
          "& .MuiMenuItem-root": { typography: "body2", borderRadius: 0.75 },
        }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === sort}
            onClick={() => handleSortBy(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
};

function renderLabel(label: SortOptions) {
  const sort = SORT_BY_OPTIONS.find((option) => option.value === label);
  return sort?.label;
}

export default SortFilter;
