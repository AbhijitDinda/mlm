import { Card, CardContent, LinearProgress, Typography } from "@mui/material";

import TitleText from "../../components/TitleText";
import { trpc } from "../../trpc";
import { ContentBox } from "../privacy-policy/PrivacyPolicy";

const RefundPolicy = () => {


  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { refundPolicy } = data! ?? {};
  const { title, description } = refundPolicy ?? {};
  return isLoading ? (
    <LinearProgress />
  ) : (
    <Card>
      <CardContent sx={{ p: { xs: 2, md: 5 } }}>
        <Typography
          sx={{ color: "primary.main", textDecoration: "underline" }}
          variant="h2"
          textAlign={"center"}
          mb={4}
        >
          <TitleText text={title} />
        </Typography>
        <ContentBox dangerouslySetInnerHTML={{ __html: description }}></ContentBox>
      </CardContent>
    </Card>
  );
};

export default RefundPolicy;
