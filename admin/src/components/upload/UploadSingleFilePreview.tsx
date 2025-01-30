import { Box, Card, Typography } from "@mui/material";
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
  const regex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-\w{13}-/;
  if (file && isPrivate) file = file.replace(regex, "");

  if (isImg && !isPrivate)
    return (
      <Card
        sx={{
          top: 0,
          left: 0,
          position: "absolute",
          width: 1,
          height: 1,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Image
          alt="file preview"
          src={file}
          sx={{
            borderRadius: 1,
          }}
        />
      </Card>
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
