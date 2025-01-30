import { Box, IconButton, Stack, Typography } from "@mui/material";
import { m } from "framer-motion";
import Iconify from "../../../components/Iconify";
import { RHFTextField } from "../../../components/hook-form";
import useFormRepeater from "../../../hooks/useFormRepeater";

const DropDownOptionFields = () => {
  const { fields, onAddField, onRemoveField } = useFormRepeater({
    name: "dropdownOptions",
    append: { option: "" },
  });

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Typography>Options</Typography>
        <IconButton onClick={() => onAddField()} color="success">
          <Iconify icon={"material-symbols:add"} />
        </IconButton>
      </Stack>
      {fields.map((field, index) => {
        return (
          <Input key={field.id} onRemoveField={onRemoveField} index={index} />
        );
      })}
    </>
  );
};

function Input({
  onRemoveField,
  index,
}: {
  onRemoveField: (index: number) => void;
  index: number;
}) {
  return (
    <m.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <RHFTextField
          name={`dropdownOptions.${index}.option`}
          label="Add Label"
          variant="standard"
        />
        <IconButton onClick={() => onRemoveField(index)} color="error">
          <Iconify icon={"ri:close-fill"} />
        </IconButton>
      </Box>
    </m.div>
  );
}

export default DropDownOptionFields;
