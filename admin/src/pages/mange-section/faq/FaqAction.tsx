import { IconButton, Stack } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useState } from "react";
import Iconify from "../../../components/Iconify";
import LoadingIconButton from "../../../components/LoadingIconButton";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";
import FaqCreateDialog from "./FaqCreateDialog";

const FaqAction = ({
  question,
  answer,
  _id,
}: {
  question: string;
  answer: string;
  _id: string;
}) => {
  const utils = trpc.useContext();
  const [open, setOpen] = useState(false);
  const confirm = useConfirm();

  const { mutate, isLoading } = trpc.faq.delete.useMutation({
    onSuccess(data, _id) {
      utils.faq.list.setData(undefined, (lists) => {
        return lists?.filter((list) => list._id !== _id);
      });
    },
  });
  const handleDelete = async () => {
    try {
      await confirm({
        description: "Are you sure you want to delete this question?",
      });
      mutate(_id);
    } catch (error) {}
  };

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={handleOpen}>
        <Iconify icon={IconifyIcons.pencil} />
      </IconButton>
      <LoadingIconButton loading={isLoading} onClick={handleDelete}>
        <Iconify icon={IconifyIcons.delete} />
      </LoadingIconButton>
      <FaqCreateDialog
        question={question}
        answer={answer}
        _id={_id}
        open={open}
        handleClose={handleClose}
      />
    </Stack>
  );
};

export default FaqAction;
