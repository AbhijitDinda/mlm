import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value?: string;
  onChange: (text: string) => void;
  debounce?: number;
  [x: string]: any;
}) {
  const [value, setValue] = useState<string>(initialValue || "");
  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);
  return <TextField onChange={(e) => setValue(e.target.value)} {...props} />;
}
export default DebouncedInput;
