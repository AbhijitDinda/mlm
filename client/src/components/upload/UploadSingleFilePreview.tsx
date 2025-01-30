import { Card, Typography } from "@mui/material";
import localFile from "../../assets/images/file.webp";
import Image, { getFileExt, isImageUrl } from "../Image";

const UploadSingleFilePreview = ({
  file,
  isPrivate,
}: {
  file: string;
  isPrivate?: boolean;
}) => {
  const isImg = isImageUrl(file);

  if (isImg && !isPrivate)
    return (
      <Image
        alt="file preview"
        src={file}
        sx={{
          top: 8,
          left: 8,
          borderRadius: 1,
          position: "absolute",
          width: "calc(100% - 16px)",
          height: "calc(100% - 16px)",
        }}
      />
    );

  return (
    <Card
      sx={{
        width: 1,
        height: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        flexDirection: "column",
        top: 0,
        left: 0,
      }}
    >
      <Image
        alt="file preview"
        src={localFile}
        isLocal
        sx={{
          top: 8,
          left: 8,
          borderRadius: 1,
          maxHeight: 200,
          maxWidth: 200,
        }}
      />
      <Typography>{file?.replace(/^\/public\/files\/\d+-/, "")}</Typography>
    </Card>
  );
};
export default UploadSingleFilePreview;
