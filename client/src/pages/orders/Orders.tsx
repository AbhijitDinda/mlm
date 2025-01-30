import { GridColDef } from "@mui/x-data-grid";
import { upperCase } from "upper-case";

import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Avatar from "../../components/Avatar";
import DataTable from "../../components/DataTable";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import createAvatar from "../../utils/createAvatar";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";
import { downloadProduct } from "./ProductDownload";

const sortModel = [
  {
    field: "createdAt",
    sort: "desc" as const,
  },
];
const Orders = () => {
  const columns: GridColDef[] = [
    {
      field: "product",
      headerName: upperCase("product"),
      minWidth: 200,
      maxWidth: 240,
      flex: 1,
      renderCell({ value }) {
        const { name, _id, thumbnail: avatar } = value ?? {};
        return (
          <Link
            component={RouterLink}
            to={APP_PATH.product.view(_id)}
            underline="none"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                alt={name}
                src={avatar}
                color={avatar ? "default" : createAvatar(name).color}
                sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
              >
                {createAvatar(name).name}
              </Avatar>
              <Box>
                <Typography color="text.primary" variant="body2">
                  {name}
                </Typography>
              </Box>
            </Box>
          </Link>
        );
      },
    },
    {
      field: "transactionId",
      headerName: upperCase("Txn Id / download"),
      minWidth: 200,
      maxWidth: 240,
      flex: 1,
      renderCell({ row: { transactionId, product } }) {
        const status = product?.status;
        return <DownloadLink id={transactionId} status={status} />;
      },
    },
    {
      field: "purchasePrice",
      headerName: upperCase("purchase Price"),
      minWidth: 150,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fCurrency(value),
    },
    {
      field: "unitPrice",
      headerName: upperCase("unit Price"),
      minWidth: 150,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fCurrency(value),
    },
    {
      field: "createdAt",
      headerName: upperCase("purchased at"),
      minWidth: 150,
      flex: 1,
      filterable: false,
      renderCell: ({ value }) => fDateTime(value),
    },
  ];
  return (
    <Page title="Orders">
      <HeaderBreadcrumbs
        heading="Orders"
        links={[
          { name: "Products", href: APP_PATH.product.root },
          { name: "Orders" },
        ]}
      />
      <DataTable
        title="Orders"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.product.orders.useQuery(queryOptions)
        }
      />
    </Page>
  );
};

function DownloadLink({ id, status }: { id: string; status: string }) {
  const { download: _download, isDownloading } = downloadProduct(id);
  return (
    <Link
      sx={{
        cursor: "pointer",
        color: status === "active" ? "" : "text.disabled",
      }}
      onClick={() => _download()}
    >
      {isDownloading ? "Downloading..." : `#${id}`}
    </Link>
  );
}

export default Orders;
