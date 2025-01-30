import { Box, Card, styled, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";

import AnimatedBox from "../../components/AnimatedBox";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Page, { AnimatedProvider } from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import useTabs from "../../hooks/useTabs";
import APP_PATH from "../../routes/paths";
import ProfileCover from "./Cover";
import ProfileKycStatus from "./KycStatus";
import ProfileMain from "./ProfileMain";
import ProfileSecurity from "./Security";

const TabsWrapperStyle = styled("div")(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: "100%",
  display: "flex",
  position: "absolute",
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up("sm")]: {
    justifyContent: "center",
  },
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-end",
    paddingRight: theme.spacing(3),
  },
}));

const Profile = () => {
  const { currentTab, onChangeTab } = useTabs("profile");

  const PROFILE_TABS = [
    {
      value: "profile",
      icon: <Iconify icon={"ic:round-account-box"} width={20} height={20} />,
      component: <ProfileMain />,
    },
    {
      value: "security",
      icon: <Iconify icon={"mdi:secure"} width={20} height={20} />,
      component: <ProfileSecurity />,
    },
  ];

  return (
    <Page title="Profile" animate={false}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Profile"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Profile" },
        ]}
      />
      {/* Breadcrumb End */}
      <ProfileKycStatus />
      <AnimatedProvider>
        <AnimatedBox>
          <Card
            sx={{
              mb: RESPONSIVE_GAP,
              height: { xs: 340, md: 280 },
              position: "relative",
            }}
          >
            <ProfileCover />
            <TabsWrapperStyle>
              <Tabs
                allowScrollButtonsMobile
                variant="scrollable"
                scrollButtons="auto"
                value={currentTab}
                onChange={onChangeTab}
              >
                {PROFILE_TABS.map((tab) => (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    icon={tab.icon}
                    label={capitalCase(tab.value)}
                  />
                ))}
              </Tabs>
            </TabsWrapperStyle>
          </Card>
        </AnimatedBox>
      </AnimatedProvider>
      {PROFILE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Page>
  );
};

export default Profile;
