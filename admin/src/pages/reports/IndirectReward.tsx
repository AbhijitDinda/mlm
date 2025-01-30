import { Box, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";
import DataTable from "../../components/DataTable";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Label from "../../components/Label";
import Page from "../../components/Page";
import TableUser from "../../components/TableUser";
import { DataTableQueryOptions } from "../../hooks/useDataTable";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import { fDateTime } from "../../utils/formatTime";

const IndirectReward = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: upperCase("User"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ row: { avatar, userName, userId } }) => (
        <TableUser
          avatar={avatar}
          title={userName}
          subtitle={userId}
          userId={userId}
        />
      ),
    },
    {
      field: "agentId",
      headerName: upperCase("agentId"),
      minWidth: 150,
      flex: 1,
      renderCell: ({ row: { agentUserName, agentId } }) => (
        <Box>
          <Typography color="text.primary" variant="body2">
            {agentUserName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {agentId}
          </Typography>
        </Box>
      ),
    },
    {
      field: "indirectReward",
      headerName: upperCase("indirectReward"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "transactionId",
      headerName: upperCase("transaction Id"),
      minWidth: 150,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("date"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ value }) => fDateTime(value),
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        return <Label color="success">{capitalCase(value)}</Label>;
      },
    },
  ];
  return (
    <Page title="Indirect Reward">
      <HeaderBreadcrumbs
        heading="Indirect Reward"
        links={[{ name: "Reports" }, { name: "Indirect Reward" }]}
      />
      <DataTable
        title="Indirect Reward"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.report.indirectReward.useQuery(queryOptions)
        }
      />
    </Page>
  );
};
export default IndirectReward;
