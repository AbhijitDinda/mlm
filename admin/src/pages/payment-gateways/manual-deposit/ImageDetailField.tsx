import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { UseFormSetValue } from "react-hook-form";
import Iconify from "../../../components/Iconify";
import {
  RHFTextField,
  RHFUploadSingleFile,
} from "../../../components/hook-form";

const ImageDetailField = ({
  index,
  onRemove,
  setValue,
}: {
  index: number;
  onRemove: (index: number) => void;
  setValue: UseFormSetValue<any>;
}) => {
  return (
    <Card>
      <CardHeader
        title="Details"
        action={
          <IconButton onClick={() => onRemove(index)}>
            <Iconify icon={"carbon:delete"} />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <RHFTextField name={`details.${index}.label`} label="Label" />
          <RHFUploadSingleFile
            name={`details.${index}.value`}
            setValue={setValue}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ImageDetailField;
