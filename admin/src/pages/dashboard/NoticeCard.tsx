import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress
} from "@mui/material";
import { trpc } from "../../trpc";
import NoticeUpdate from "./NoticeUpdate";

const NoticeCard = () => {
  const { data, isLoading } = trpc.dashboard.getNotice.useQuery();
  console.log("data->", data)
  return (
    <Card sx={{ marginTop: 6 }}>
      {isLoading && <LinearProgress />}
      <CardHeader
        sx={{ bgcolor: "error.main", color: "#fff" }}
        title="Notice"
        action={<NoticeUpdate />}
      />
      <CardContent>
        <Box dangerouslySetInnerHTML={{ __html: data ?? "" }} />
      </CardContent>
    </Card>
  );
};

export default NoticeCard;
