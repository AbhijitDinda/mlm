import { Box, LinearProgress, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import { Extension } from "../../hooks/useUploadFile";
import BlockContent from "./BlockContent";
import RejectionFiles from "./RejectionFiles";
import UploadSingleFilePreview from "./UploadSingleFilePreview";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

export default function UploadSingleFile({
  error = false,
  progress = 0,
  file,
  accept,
  helperText,
  sx,
  ...other
}: {
  error?: boolean;
  progress?: number;
  file: string;
  helperText?: React.ReactNode;
  sx?: SxProps;
  accept?: Extension;
  [x: string]: any;
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      {!!progress && <LinearProgress variant="determinate" value={progress} />}
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "12% 0",
          }),
        }}
      >
        <input
          {...getInputProps()}
          accept={typeof accept === "object" ? accept.join(",") : ""}
        />

        <BlockContent />

        {file && <UploadSingleFilePreview isPrivate={false} file={file} />}
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {helperText && helperText}
    </Box>
  );
}
