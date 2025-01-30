import {
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Avatar from "../../components/Avatar";

import Image from "../../components/Image";
import useAuth from "../../hooks/useAuth";
import createAvatar from "../../utils/createAvatar";
import { getFileSrc } from "../../utils/fns";
import { fDateTime } from "../../utils/formatTime";

export const MessageCard = ({
  userId: messageUserId,
  createdAt,
  files,
  message,
  pic,
}: {
  userId: number;
  createdAt: string;
  files: string[];
  message: string;
  pic: {
    user: {
      avatar?: string | undefined;
      displayName: string;
    };
    admin: {
      avatar?: string | undefined;
      displayName: string;
    };
  };
}) => {
  const { user } = useAuth();
  if (!user) return null;
  const { userId, userName } = user;
  const isAdmin = userId !== messageUserId;
  const role = isAdmin ? "admin" : "user";
  const { avatar, displayName } = pic[role];

  return (
    <Card sx={{ mb: 4, ...(!isAdmin && { ml: 4 }) }}>
      <CardHeader
        avatar={<GetAvatar avatar={avatar} displayName={displayName} />}
        title={displayName}
        subheader={fDateTime(createdAt)}
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>

        <List sx={{ display: "flex" }}>
          {files?.map((src, i) => {
            return (
              <ListItem
                component="div"
                key={i}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 80,
                  height: 80,
                  borderRadius: 1.25,
                  overflow: "hidden",
                  position: "relative",
                  display: "inline-flex",
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Image openUrl alt="image" ratio="1/1" src={src} />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

function GetAvatar({
  avatar,
  displayName,
}: {
  avatar?: string;
  displayName: string;
}) {
  return (
    <Avatar
      alt={"name"}
      src={getFileSrc(avatar)}
      color={avatar ? "default" : createAvatar(displayName).color}
      sx={{ borderRadius: 99, width: 48, height: 48 }}
    >
      {createAvatar(displayName).name}
    </Avatar>
  );
}
