import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { m } from "framer-motion";

import { UseFormSetValue } from "react-hook-form";
import Iconify from "../../../components/Iconify";
import { RHFTextField } from "../../../components/hook-form";
import useFormRepeater from "../../../hooks/useFormRepeater";
import ImageDetailField from "./ImageDetailField";

const ManualDepositDetailFields = ({
  setValue,
}: {
  setValue: UseFormSetValue<any>;
}) => {
  const { fields, onAddField, onRemoveField } = useFormRepeater({
    name: "details",
    append: { label: "", value: "", type: "input" },
  });

  return (
    <>
      <Stack direction={"row"} justifyContent={"flex-end"}>
        <Button
          onClick={() => onAddField({ label: "", value: "", type: "input" })}
        >
          <Iconify icon={"carbon:add"} />
          Add New Label
        </Button>
        <Button
          onClick={() => onAddField({ label: "", value: "", type: "image" })}
        >
          <Iconify icon={"carbon:add"} />
          Add New Image
        </Button>
      </Stack>
      {/* @ts-ignore //todo */}
      {fields.map(({ type, id }, index) => {
        return (
          <Input
            key={id}
            setValue={setValue}
            type={type}
            onRemoveField={onRemoveField}
            index={index}
          />
        );
      })}
    </>
  );
};

function Input({
  type,
  onRemoveField,
  index,
  setValue,
}: {
  type: string;
  onRemoveField: (index: number) => void;
  index: number;
  setValue: UseFormSetValue<any>;
}) {
  return (
    <m.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {type === "input" ? (
        <Card>
          <CardHeader
            title="Details"
            action={
              <IconButton onClick={() => onRemoveField(index)}>
                <Iconify icon={"carbon:delete"} />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <RHFTextField name={`details.${index}.label`} label="Label" />
              <RHFTextField name={`details.${index}.value`} label="Value" />
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <ImageDetailField
          index={index}
          setValue={setValue}
          onRemove={() => onRemoveField(index)}
        />
      )}
    </m.div>
  );
}

export default ManualDepositDetailFields;
