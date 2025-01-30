import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
} from "@mui/material";
import AnimatedBox from "../../components/AnimatedBox";
import { trpc } from "../../trpc";

const NoticeCard = () => {
  const { data, isLoading } = trpc.dashboard.notice.useQuery();

  return (
    <AnimatedBox>
      <Card sx={{ marginTop: 6 }}>
        {isLoading && <LinearProgress />}
        <CardHeader
          sx={{ bgcolor: "error.main", color: "#fff", fontWeight: 900 }}
          title="Notice"
        />
        <CardContent>
          <Box dangerouslySetInnerHTML={{ __html: data ?? "" }} />
        </CardContent>
      </Card>
    </AnimatedBox>
  );
};

export default NoticeCard;
