import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";

import { RHFTextField } from "../../../components/hook-form";
import { FileExtensions } from "./CreateLabelDialog";

const icon = <></>;
const checkedIcon = <></>;

export default function FileExtensionsInput({
  name,
  fileExtensions,
  setFileExtensions,
}: {
  name: string;
  fileExtensions: FileExtensions;
  setFileExtensions: (value: FileExtensions) => void;
}) {
  return (
    <Autocomplete
      value={fileExtensions}
      multiple
      options={fileExtensionsArr}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      onChange={(event, value) => setFileExtensions(value.concat())}
      style={{ width: 500 }}
      renderInput={(params) => (
        <RHFTextField
          name={name}
          {...params}
          label="File Extensions"
          variant="standard"
        />
      )}
    />
  );
}

const fileExtensionsArr = [
  "JPG",
  "JPEG",
  "PNG",
  "WEBP",
  "PDF",
  "DOC",
  "DOCX",
  "TXT",
  "XLX",
  "XLSX",
  "CSV",
] as const;
