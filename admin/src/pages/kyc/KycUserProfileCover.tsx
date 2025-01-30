import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import Image from "../../components/Image";
import cssStyles from "../../utils/cssStyles";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
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
  left: 0,
  right: 0,
  zIndex: 99,
  position: "absolute",
  marginTop: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    right: "auto",
    display: "flex",
    alignItems: "center",
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

import Avatar from "../../components/Avatar";

const KycUserProfileCover = ({
  displayName,
  userId,
  avatar,
}: {
  displayName: string;
  userId: number;
  avatar?: string;
}) => {
  return (
    <RootStyle>
      <InfoStyle>
        <Avatar sx={{ width: 200, height: 200 }} src={avatar} />
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4">{displayName}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{userId}</Typography>
        </Box>
      </InfoStyle>
      <Image
        alt="profile cover"
        //todo
        src={""}
        sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
};
export default KycUserProfileCover;
