import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { upperCase } from "upper-case";

import DataTable from "../../../components/DataTable";
import Label from "../../../components/Label";
import TableUser from "../../../components/TableUser";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import { trpc } from "../../../trpc";
import { fCurrency } from "../../../utils/formatNumber";
import { fDateTime } from "../../../utils/formatTime";

const ReferralIncomeTable = () => {
  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "referralId",
      headerName: upperCase("User"),
      minWidth: 200,
      flex: 1,
      renderCell: ({ row: { avatar, displayName, referralId } }) => (
        <TableUser
          avatar={avatar}
          title={displayName}
          subtitle={referralId}
          userId={referralId}
        />
      ),
    },
    {
      field: "referralIncome",
      headerName: upperCase("referral Income"),
      minWidth: 150,
      flex: 1,
      renderCell({ value }) {
        return fCurrency(value);
      },
    },
    {
      field: "userId",
      headerName: upperCase("referred id"),
      minWidth: 150,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: upperCase("referred At"),
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
        const status = (value: string) => {
          if (value === "pending") return "warning";
          if (value === "level_exceed") return "error";
          if (value === "credit") return "success";
          if (value === "capping") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
  ];

  return (
    <DataTable
      title="Referral Income"
      sortModel={sortModel}
      columns={columns}
      query={(queryOptions: DataTableQueryOptions) =>
        trpc.report.referralIncome.useQuery(queryOptions)
      }
    />
  );
};

export default ReferralIncomeTable;
