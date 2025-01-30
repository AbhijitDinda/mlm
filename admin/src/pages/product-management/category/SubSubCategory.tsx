import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { upperCase } from "upper-case";
import IconifyIcons from "../../../IconifyIcons";
import Avatar from "../../../components/Avatar";
import DataTable from "../../../components/DataTable";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import Label from "../../../components/Label";
import LoadingIconButton from "../../../components/LoadingIconButton";
import Page from "../../../components/Page";
import { DataTableQueryOptions } from "../../../hooks/useDataTable";
import { trpc } from "../../../trpc";
import CreateCategory from "./CreateCategory";

const SubSubCategory = () => {
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // delete
  const { mutate: remove } = trpc.category.remove.useMutation({
    onSuccess() {
      utils.category.list.invalidate();
    },
  });
  const handleDelete = async (id: string) => {
    try {
      await confirm({
        description: "Are you sure want to delete this category?",
      });
      remove(id);
    } catch (error) {}
  };

  //update
  const onSuccess = () => {
    setOpen(false);
    setEditId(null);
  };
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);
  const handleEdit = (id: string) => {
    setOpen(true);
    setEditId(id);
  };

  const sortModel = [
    {
      field: "name",
      sort: "asc" as const,
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: upperCase("image"),
      minWidth: 50,
      maxWidth: 80,
      flex: 1,
      renderCell: ({ value }) => {
        return <Avatar src={value} alt={value} />;
      },
    },
    {
      field: "name",
      headerName: upperCase("name"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "parent",
      headerName: upperCase("parent"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => value?.name ?? "-",
    },
    {
      field: "subParent",
      headerName: upperCase("sub Parent"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => value?.name ?? "-",
    },
    {
      field: "status",
      headerName: upperCase("status"),
      minWidth: 100,
      flex: 1,
      renderCell({ value }) {
        const status = (value: string) => {
          if (value === "inactive") return "error";
          if (value === "active") return "success";
        };
        return <Label color={status(value)}>{capitalCase(value)}</Label>;
      },
    },
    {
      field: "action",
      headerName: upperCase("action"),
      minWidth: 100,
      renderCell: ({ row: { _id } }) => {
        return (
          <>
            <IconButton onClick={() => handleEdit(_id)}>
              <Iconify icon={IconifyIcons.pencil} />
            </IconButton>
            <LoadingIconButton
              loading={deleteId === _id}
              onClick={() => handleDelete(_id)}
            >
              <Iconify icon={IconifyIcons.delete} />
            </LoadingIconButton>
          </>
        );
      },
    },
  ];

  return (
    <Page title="Category">
      <HeaderBreadcrumbs
        heading="Category"
        links={[{ name: "Category" }]}
        action={
          <CreateCategory
            level={3}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
            editId={editId}
            onSuccess={onSuccess}
          />
        }
      />

      <DataTable
        title="Sub Sub Categories"
        sortModel={sortModel}
        columns={columns}
        query={(queryOptions: DataTableQueryOptions) =>
          trpc.category.list.useQuery({
            level: 3,
            query: queryOptions,
          })
        }
      />
    </Page>
  );
};
export default SubSubCategory;
