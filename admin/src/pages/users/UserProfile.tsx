import { Card, Grid, LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";
import UserAbout from "./UserAbout";
import UserActionButtons from "./UserActionButtons";
import UserContactDetail from "./UserContactDetail";
import UserMyProfile from "./UserMyProfile";
import UserProfileCover from "./UserProfileCover";

const UserProfile = () => {
  const params = useParams();
  const { userId: _userId } = params;
  if (!_userId) return null;

  const { data, isLoading } = trpc.user.getProfile.useQuery(Number(_userId));
  const user = data! ?? { kycData: { form: [], user: {} } };
  const {
    kycData,
    firstName,
    lastName,
    contact,
    userId,
    mobileNumber,
    status,
  } = user;

  return (
    <Page title={`User Profile - ${_userId}`}>
      <HeaderBreadcrumbs
        heading={`User Profile`}
        links={[{ name: "Users" }, { name: `Profile - ${_userId}` }]}
      />

      {isLoading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={RESPONSIVE_GAP}>
          <Grid item xs={12}>
            <Card sx={{ height: 280 }}>
              <UserProfileCover {...user} />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <UserActionButtons userId={userId} status={status} />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserAbout user={user} />
          </Grid>
          <Grid item xs={12} md={8}>
            <UserMyProfile
              userId={userId}
              kycData={kycData}
              firstName={firstName}
              lastName={lastName}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <UserContactDetail mobileNumber={mobileNumber} {...contact} />
          </Grid>
        </Grid>
      )}
    </Page>
  );
};

export default UserProfile;
