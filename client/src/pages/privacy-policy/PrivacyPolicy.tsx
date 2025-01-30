import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  styled,
  Typography,
} from "@mui/material";

import TitleText from "../../components/TitleText";
import { trpc } from "../../trpc";

export const ContentBox = styled(Box)(({ theme }) => ({
  "& p": {
    color: theme.palette.grey[600],
    marginBottom: 8,
  },
  "& :is(h1, h2, h3, h4, h5, h6)": {
    marginBottom: 8,
  },
  "& ul": {
    listStylePosition: "inside",
  },
  "& ul li": {
    marginBottom: 8,
    color: theme.palette.grey[600],
  },
}));

const PrivacyPolicy = () => {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { privacyPolicy } = data! ?? {};
  const { title, description } = privacyPolicy ?? {};

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
        <ContentBox
          dangerouslySetInnerHTML={{ __html: description }}
        ></ContentBox>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicy;
