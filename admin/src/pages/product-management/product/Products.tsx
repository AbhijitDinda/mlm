import { Box, Button, Link, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";

import { Link as RouterLink } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import Label from "../../../components/Label";
import APP_PATH from "../../../routes/paths";
import createAvatar from "../../../utils/createAvatar";
import { fDateTime } from "../../../utils/formatTime";
import DataTable from "../../../components/DataTable";
import { trpc } from "../../../trpc";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import Iconify from "../../../components/Iconify";
import IconifyIcons from "../../../IconifyIcons";
import { fCurrency } from "../../../utils/formatNumber";

const Products = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: upperCase("product"),
      minWidth: 260,
      flex: 1,
      renderCell: ({ row: { thumbnail, name, _id } }) => (
        <Link
          component={RouterLink}
          to={APP_PATH.productManagement.product.update(_id)}
          underline="none"
        >
          <Box display="flex" alignItems="center">
            <Avatar
              alt={"name"}
              src={thumbnail}
              color={thumbnail ? "default" : createAvatar(name).color}
              sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
            >
              {createAvatar(name).name}
            </Avatar>
            <Box>
              <Typography color="text.primary" variant="body2">
                {name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {_id}
              </Typography>
            </Box>
          </Box>
        </Link>
      ),
    },
    {
      field: "unitPrice",
      headerName: upperCase("unit Price"),
      minWidth: 50,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "purchasePrice",
      headerName: upperCase("purchase Price"),
      minWidth: 50,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => {
        if (!value) return;
        const getColor = (value: string) =>
          value === "active" ? "success" : "error";
        return <Label color={getColor(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "createdAt",
      headerName: upperCase("created At"),
      minWidth: 180,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "category",
      headerName: upperCase("category"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => value?.name ?? "-",
    },
    {
      field: "subCategory",
      headerName: upperCase("sub Cat."),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => value?.name ?? "-",
    },
    {
      field: "subSubCategory",
      headerName: upperCase("sub Sub Cat."),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => value?.name ?? "-",
    },
  ];

  return (
    <Page title="Products">
      <HeaderBreadcrumbs
        heading="Products"
        links={[{ name: "Product Management" }, { name: "Product" }]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={IconifyIcons.add} />}
            component={RouterLink}
            to={APP_PATH.productManagement.product.create}
          >
            Add Product
          </Button>
        }
      />

      <DataTable
        title="Products"
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.product.list.useQuery(queryOptions)
        }
        sortModel={sortModel}
        columns={columns}
      />
    </Page>
  );
};
export default Products;
