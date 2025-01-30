import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "../../components/Iconify";
import Logo from "../../components/Logo";
import SocialsButton from "../../components/SocialsButton";
import TitleText from "../../components/TitleText";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#213343",
  color: "#fff",
}));

// ----------------------------------------------------------------------
const currentYear = new Date().getFullYear();

export default function MainFooter() {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { contactUs, aboutUs } = data! ?? {};
  const { email, whatsapp, location } = contactUs ?? {};

  const LINKS = [
    {
      headline: "Company",
      children: [
        { name: "About us", href: APP_PATH.aboutUs },
        { name: "Contact us", href: APP_PATH.contactUs },
        { name: "FAQs", href: APP_PATH.faq },
        { name: "Plans", href: APP_PATH.plans },
      ],
    },
    {
      headline: "Legal",
      children: [
        { name: "Terms and Condition", href: APP_PATH.termsAndCondition },
        { name: "Privacy Policy", href: APP_PATH.privacyPolicy },
        { name: "Refund Policy", href: APP_PATH.refundPolicy },
        { name: "Commission Policy", href: APP_PATH.commissionPolicy },
      ],
    },
    {
      headline: "Contact",
      children: [
        { name: email, icon: "ic:round-email", color: "info.main" },
        {
          name: whatsapp,
          icon: "ri:whatsapp-fill",
          color: "#25D366",
        },
        {
          name: location,
          icon: "material-symbols:location-on",
          color: "error.main",
        },
      ],
    },
  ];

  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={"space-between"}
          sx={{ textAlign: { md: "left" } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: "auto", md: "inherit" } }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              <TitleText text={aboutUs?.description} />
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              {LINKS.map((list, index) => (
                <Stack key={index} spacing={2}>
                  <Typography
                    component="p"
                    textTransform={"uppercase"}
                    color="grey.500"
                    variant="subtitle2"
                  >
                    {list.headline}
                  </Typography>
                  {list.children.map((link, index) => (
                    <Stack
                      key={index}
                      alignItems="center"
                      direction="row"
                      gap={1}
                    >
                      {"icon" in link && (
                        <Iconify color={link.color} icon={link.icon} />
                      )}
                      {"href" in link ? (
                        <Link
                          to={link.href}
                          color="inherit"
                          variant="body2"
                          component={RouterLink}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <Link color="inherit" variant="body2" underline="none">
                          {link.name}
                        </Link>
                      )}
                    </Stack>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 2,
          }}
        />
        <Box>
          <Typography
            variant="body2"
            sx={{
              pb: 2,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            Copyright© {currentYear}. All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}
