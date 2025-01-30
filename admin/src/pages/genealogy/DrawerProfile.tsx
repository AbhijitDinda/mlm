import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import ImagePlaceholder from "../../assets/images/profile_cover.jpg";
import Image from "../../components/Image";
import cssStyles from "../../utils/cssStyles";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  height: 200,
  position: "relative",
  "&:before": {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
}));

const InfoStyle = styled("div")(({ theme }) => ({
  zIndex: 99,
  width: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  top: "50%",
}));

// ----------------------------------------------------------------------

export default function ProfileCover({
  avatar,
  displayName,
}: {
  avatar?: string;
  displayName?: string;
}) {
  return (
    <RootStyle>
      <InfoStyle>
        <Avatar
          src={avatar}
          alt={displayName}
          sx={{
            mx: "auto",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "common.white",
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        />
      </InfoStyle>
      <Image
        isLocal
        alt="profile cover"
        src={ImagePlaceholder}
        sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
