import { Box, FormHelperText, LinearProgress } from "@mui/material";
import { useCallback } from "react";
import {
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  useFormContext,
} from "react-hook-form";
import { toast } from "react-toastify";
import useUploadFile, { Extension } from "../../hooks/useUploadFile";
import { UploadAvatar, UploadMultiFile, UploadSingleFile } from "../upload";

// ----------------------------------------------------------------------

export function RHFUploadAvatar({
  name,
  setValue,
  onSuccess,
  ...other
}: {
  name: string;
  setValue: UseFormSetValue<any>;
  onSuccess?: (file: string) => void;
  [x: string]: any;
}) {
  const accept: Extension = [".png", ".jpg", ".webp", ".jpeg"];
  const { control } = useFormContext();
  const { isSuccess, uploadFile, progress } = useUploadFile(accept);
  const handleDropSingleFile = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const exts = accept.toString().replace(/\./g, "").split(",");
      const mimeType = file.type;
      const mimeExt = mimeType.split("/")[1];

      if (!exts.includes(mimeExt)) {
        return toast.error(`Only ${accept.join(",")} formats are allowed`);
      }

      const formData = new FormData();
      formData.append("file", file);
      const { fileUrl } = await uploadFile(formData);
      setValue(name, fileUrl);
      onSuccess && onSuccess(fileUrl);
    }
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;
        return (
          <div>
            <UploadAvatar
              onDrop={handleDropSingleFile}
              error={checkError}
              file={field.value}
              progress={progress}
              accept={accept}
              {...other}
            />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: "center" }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadSingleFile({
  name,
  setValue,
  accept = [".png", ".jpg", ".webp", ".jpeg"],
  ...other
}: {
  name: string;
  setValue: UseFormSetValue<any>;
  accept?: Extension;
  [x: string]: any;
}) {

  const { control } = useFormContext();
  const { isSuccess, uploadFile, progress } = useUploadFile(accept);
  const handleDropSingleFile = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (accept !== "all") {
        const exts = accept.toString().replace(/\./g, "").split(",");
        const mimeType = file.type;
        const mimeExt = mimeType.split("/")[1];

        if (!exts.includes(mimeExt)) {
          return toast.error(`Only ${accept.join(",")} formats are allowed`);
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      const { fileUrl } = await uploadFile(formData);
      setValue(name, fileUrl);
    }
  }, []);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;
        return (
          <UploadSingleFile
            accept={accept!}
            file={field.value}
            error={checkError}
            progress={progress}
            onDrop={handleDropSingleFile}
            helperText={
              checkError && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadMultiFile({
  name,
  accept = [".png", ".jpg", ".webp", ".jpeg"],
  setValue,
  getValues,
  maxFiles = 5,
  ...other
}: {
  accept?: Extension;
  name: string;
  maxFiles?: number;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  [x: string]: any;
}) {
  const { control } = useFormContext();
  const { uploadFile, progress } = useUploadFile(accept);
  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    const files = getValues(name);
    const totalLength = files.length + acceptedFiles.length;
    if (files?.length >= maxFiles || totalLength > maxFiles) {
      return toast.error(`Maximum ${maxFiles} files are allowed`);
    }
    for (const file of acceptedFiles) {
      const files = getValues(name);
      if (accept !== "all") {
        const exts = accept.toString().replace(/\./g, "").split(",");
        const mimeType = file.type;
        const mimeExt = mimeType.split("/")[1];

        if (!exts.includes(mimeExt)) {
          return toast.error(`Only ${accept.join(",")} formats are allowed`);
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      const { fileUrl } = await uploadFile(formData);
      setValue(name, [...files, fileUrl]);
    }
  }, []);
  const handleRemoveAll = () => {
    setValue(name, []);
  };
  const handleRemove = (file: string) => {
    const files = getValues(name);
    const filteredItems = files?.filter((_file: string) => _file !== file);
    setValue("files", filteredItems);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {!!progress && (
        <Box>
          <LinearProgress
            sx={{
              width: 1,
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
            variant="determinate"
            value={progress}
          />
        </Box>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const checkError = !!error && field.value?.length === 0;
          return (
            <UploadMultiFile
              accept={accept}
              files={field.value}
              error={checkError}
              maxFiles={maxFiles}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onRemoveAll={handleRemoveAll}
              helperText={
                checkError && (
                  <FormHelperText error sx={{ px: 2 }}>
                    {error?.message}
                  </FormHelperText>
                )
              }
              {...other}
            />
          );
        }}
      />
    </Box>
  );
}
