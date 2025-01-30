import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  OutlinedInput,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import ReferralImage from "../../assets/images/Referral.png";
import AnimatedBox from "../../components/AnimatedBox";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Image from "../../components/Image";
import Page from "../../components/Page";
import { copyToClipboard } from "../../functions";
import useAuth from "../../hooks/useAuth";
import useConfiguration from "../../hooks/useConfiguration";
import { formatUrl } from "../../utils/fns";

const Input = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.grey[600]
      : theme.palette.grey[800],
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  marginTop: -120,
  boxShadow: "none",
  padding: theme.spacing(16, 5, 5, 5),
  color: theme.palette.common.white,
}));

const Icon = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: 999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 40,
  padding: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.1),
}));

const ReferralCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <Grid
      component={AnimatedBox}
      xs={12}
      md={4}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      textAlign={"center"}
      item
    >
      <Icon sx={{ margin: "auto" }}>
        <Iconify color="primary.main" icon={icon} />
      </Icon>
      <Typography variant="subtitle1" color={"text.primary"}>
        {title}
      </Typography>
      <Typography color={"text.secondary"}>{description}</Typography>
    </Grid>
  );
};

const ReferralLink = () => {
  const { appName } = useConfiguration();
  const { user } = useAuth();
  if (!user) return null;
  const { userId } = user;

  const [leftLinkCopied, setLeftLinkCopied] = useState(false);
  const [rightLinkCopied, setRightLinkCopied] = useState(false);

  const referralLinks = {
    left: formatUrl(`/register?referral_id=${userId}&placement=left`),
    right: formatUrl(`/register?referral_id=${userId}&placement=right`),
  };

  const handleLeftLink = () => {
    setLeftLinkCopied(true);
    toast.success("Referral link copied to clipboard");
    copyToClipboard(referralLinks.left);
    setTimeout(() => {
      setLeftLinkCopied(false);
    }, 1000);
  };

  const handleRightLink = () => {
    setRightLinkCopied(true);
    toast.success("Referral link copied to clipboard");
    copyToClipboard(referralLinks.right);
    setTimeout(() => {
      setRightLinkCopied(false);
    }, 1000);
  };

  return (
    <Page title="Referral Link">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Referral Link"
        links={[{ name: "Dashboard" }, { name: "Referral Link" }]}
      />
      {/* Breadcrumb End */}

      <Box sx={{ mb: 2 }}>
        <AnimatedBox sx={{ zIndex: 9, position: "relative" }}>
          <Image
            visibleByDefault
            disabledEffect
            src={ReferralImage}
            isLocal
            sx={{
              left: 40,
              zIndex: 9,
              width: 140,
              position: "relative",
              filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.24))",
            }}
          />
        </AnimatedBox>

        <ContentStyle>
          <AnimatedBox>
            <Typography
              color={"text.primary"}
              mb={1}
              textAlign={"center"}
              variant="h4"
            >
              Invite friends and earn
            </Typography>
          </AnimatedBox>
          <AnimatedBox>
            <Typography color={"text.secondary"} textAlign={"center"}>
              Invite your friend to {appName}, if they sign up, you and your
              friend will get 30 days free trial
            </Typography>
          </AnimatedBox>

          <Box sx={{ py: 4 }}>
            <Grid spacing={3} container>
              <ReferralCard
                icon="ri:share-fill"
                title="Send Invitation 🤟🏻"
                description="Send your referral link to your friend"
              />
              <ReferralCard
                icon="mdi:register"
                title="Registration 👩🏻‍💻"
                description="Let them register to our services"
              />
              <ReferralCard
                icon="zondicons:badge"
                title="Purchase Package 🎉"
                description="You will get referral income"
              />
            </Grid>
            <AnimatedBox>
              <Divider sx={{ pt: 4 }} />
            </AnimatedBox>
          </Box>

          <AnimatedBox>
            <Typography color={"text.primary"} variant="h5">
              Share the referral link
            </Typography>
          </AnimatedBox>

          <AnimatedBox>
            <Box>
              <Typography
                color={"text.secondary"}
                variant="body2"
                sx={{ mt: 2, mb: 1 }}
              >
                Left Side Referral Link
              </Typography>

              <Stack
                sx={{ mb: 3 }}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  size="small"
                  placeholder="Left Side Referral Link"
                  sx={{
                    width: 1,
                    color: "common.white",
                    fontWeight: "fontWeightMedium",
                    "& input::placeholder": {
                      color: (theme) => alpha(theme.palette.common.white, 0.48),
                    },
                    "& fieldset": { display: "none" },
                  }}
                  value={referralLinks.left}
                />
                <Button onClick={handleLeftLink} variant="contained">
                  {!leftLinkCopied ? "Copy" : "Copied"}
                </Button>
              </Stack>
            </Box>
          </AnimatedBox>

          <AnimatedBox>
            <Box>
              <Typography
                color={"text.secondary"}
                variant="body2"
                sx={{ mt: 2, mb: 1 }}
              >
                Right Side Referral Link
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Input
                  size="small"
                  placeholder="Right Side Referral Link"
                  sx={{
                    width: 1,
                    color: "common.white",
                    fontWeight: "fontWeightMedium",
                    "& input::placeholder": {
                      color: (theme) => alpha(theme.palette.common.white, 0.48),
                    },
                    "& fieldset": { display: "none" },
                  }}
                  value={referralLinks.right}
                />
                <Button onClick={handleRightLink} variant="contained">
                  {!rightLinkCopied ? "Copy" : "Copied"}
                </Button>
              </Stack>
            </Box>
          </AnimatedBox>
        </ContentStyle>
      </Box>

      {/* <Card sx={{ mb: 2 }}>
      <Box sx={{ px: 3, py: 2, bgcolor: "background.neutral" }}>
        <Typography variant="h5">Left Side Referral Link</Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            value={referralLinks.left}
            readOnly
            startAdornment={
              <InputAdornment position="end">
                <Box sx={{ width: 20, height: 20, mr: 2 }}>
                  <MdShare style={{ width: "100%", height: "100%" }} />
                </Box>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color={leftLinkCopied ? "primary" : undefined}
                  aria-label="Copy"
                  onClick={handleLeftLink}
                  edge="end"
                >
                  {leftLinkCopied ? <BsCheck2All /> : <MdContentCopy />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Card>

    <Card>
      <Box sx={{ px: 3, py: 2, bgcolor: "background.neutral" }}>
        <Typography variant="h5">Right Side Referral Link</Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            value={referralLinks.right}
            readOnly
            startAdornment={
              <InputAdornment position="end">
                <Box sx={{ width: 20, height: 20, mr: 2 }}>
                  <MdShare style={{ width: "100%", height: "100%" }} />
                </Box>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color={rightLinkCopied ? "primary" : undefined}
                  aria-label="Copy"
                  onClick={handleRightLink}
                  edge="end"
                >
                  {rightLinkCopied ? <BsCheck2All /> : <MdContentCopy />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Card> */}
    </Page>
  );
};

export default ReferralLink;
