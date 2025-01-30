import { Button } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import { upperCase } from "upper-case";
import DataTableClient from "../../../components/DataTableClient";
import Iconify from "../../../components/Iconify";
import LoadingIconButton from "../../../components/LoadingIconButton";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";
import CreateLabelDialog from "./CreateLabelDialog";

const KycSettingList = () => {
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setEditId(null);
  };
  const handleOpen = () => setIsOpen(true);
  const handleEdit = (labelId: string) => {
    setEditId(labelId);
    setIsOpen(true);
  };

  // delete
  const { mutate: remove } = trpc.systemConfiguration.kyc.delete.useMutation({
    onSuccess(data, variables) {
      utils.systemConfiguration.kyc.list.setData(undefined, (lists) =>
        lists?.filter((list) => list._id !== variables)
      );
    },
    onSettled() {
      setDeleteId(null);
    },
  });
  const handleDelete = async (labelId: string) => {
    try {
      await confirm({ description: "Are you sure you want to delete?" });
      setDeleteId(labelId);
      remove(labelId);
    } catch (error) {
      console.log("handleDelete ~ error:", error);
    }
  };

  const sortModel = [
    {
      field: "createdAt",
      sort: "desc" as const,
    },
  ];
  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: upperCase("label"),
      minWidth: 100,
      flex: 1,
    },
    {
      field: "inputType",
      headerName: upperCase("type"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => capitalCase(value),
    },
    {
      field: "required",
      headerName: upperCase("is required"),
      minWidth: 100,
      flex: 1,
      renderCell: ({ value }) => capitalCase(value),
    },
    {
      field: "action",
      headerName: upperCase("action"),
      minWidth: 50,
      sortable: false,
      renderCell({ row: { _id } }) {
        return (
          <>
            <LoadingIconButton
              loading={deleteId === _id}
              onClick={() => handleEdit(_id)}
            >
              <Iconify icon={IconifyIcons.pencil} />
            </LoadingIconButton>
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
    <>
      {isOpen && (
        <CreateLabelDialog
          editId={editId}
          open={isOpen}
          onClose={handleClose}
        />
      )}
      <DataTableClient
        title="Kyc Form Details"
        sortModel={sortModel}
        columns={columns}
        action={
          <Button
            onClick={handleOpen}
            startIcon={<Iconify icon={IconifyIcons.add} />}
            variant="contained"
          >
            Create a new
          </Button>
        }
        query={trpc.systemConfiguration.kyc.list.useQuery}
      />
    </>
  );
};

export default KycSettingList;
