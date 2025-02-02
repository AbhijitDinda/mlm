import { useDropzone } from "react-dropzone";
// @mui
import { Box, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
//
import BlockContent from "./BlockContent";
import MultiFilePreview from "./MultiFilePreview";
import RejectionFiles from "./RejectionFiles";
import { Extension } from "../../hooks/useUploadFile";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

export default function UploadMultiFile({
  error,
  accept,
  showPreview = true,
  files,
  onRemove,
  helperText,
  sx,
  maxSize = 3145728,
  ...other
}: {
  accept: Extension;
  error?: boolean;
  showPreview?: boolean;
  files: string[];
  onRemove?: (file: string) => void;
  helperText: React.ReactNode;
  sx?: SxProps;
  maxFiles?: number;
  maxSize?: number;
  [x: string]: any;
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
        }}
      >
        <input
          {...getInputProps()}
          accept={typeof accept === "object" ? accept.join(",") : accept}
        />

        <BlockContent />
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      <MultiFilePreview
        files={files}
        showPreview={showPreview}
        onRemove={onRemove}
      />

      {helperText && helperText}
    </Box>
  );
}
