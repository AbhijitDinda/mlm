import { useFieldArray, useFormContext } from "react-hook-form";

const useFormRepeater = ({
  name,
  append: appendData,
}: {
  name: string;
  append: Object;
}) => {
  const { control } = useFormContext();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name,
  });
  const onAddField = (data?: Object) => {
    const toAppend = !!data ? data : appendData;
    append(toAppend);
  };
  const onRemoveField = (index: number) => remove(index);

  return {
    fields,
    replace,
    onAddField,
    onRemoveField,
  };
};

export default useFormRepeater;
