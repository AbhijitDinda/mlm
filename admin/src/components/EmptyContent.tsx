import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "./Image";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(8, 2),
  minHeight: 400,
  // height: 400,
}));

// ----------------------------------------------------------------------

interface Props {
  title?: string;
  img?: string;
  description?: string;
  element?: React.ReactNode;
  [x: string]: any;
}

export default function EmptyContent({
  title,
  description,
  img,
  element,
  ...other
}: Props) {
  return (
    <RootStyle {...other}>
      <Image
        alt="empty content"
        src={
          img ||
          "https://minimals.cc/assets/illustrations/illustration_empty_content.svg"
        }
        sx={{ height: 260, mb: 3 }}
      />
      <Typography variant="h5">{title}</Typography>
      {description && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      )}

      {element && element}
    </RootStyle>
  );
}
