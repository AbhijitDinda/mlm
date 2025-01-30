import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import ProfileCoverImage from "../../assets/images/profile_cover.jpg";
import Image from "../../components/Image";
import { FormProvider, RHFUploadAvatar } from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
import { trpc } from "../../trpc";
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

interface FormValues {
  avatar: string;
}

export default function ProfileCover() {
  const { user, updateAvatar } = useAuth();
  const { mutate } = trpc.profile.avatar.useMutation();

  const defaultValues = {
    avatar: "",
  };
  const methods = useForm({
    defaultValues,
  });
  const { setValue } = methods;

  useEffect(() => {
    setValue("avatar", user?.avatar ?? "");
  }, [user?.avatar]);
  const onSuccess = (file: string) => {
    mutate(file);
    updateAvatar(file);
  };

  return (
    <RootStyle>
      <InfoStyle>
        <FormProvider methods={methods} onSubmit={() => {}}>
          <RHFUploadAvatar
            onSuccess={onSuccess}
            name="avatar"
            setValue={setValue}
          />
        </FormProvider>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: "common.white",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Typography variant="h4">{user?.displayName}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{user?.userId}</Typography>
        </Box>
      </InfoStyle>
      <Image
        alt="profile cover"
        isLocal
        src={ProfileCoverImage}
        sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
