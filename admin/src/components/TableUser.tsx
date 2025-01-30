import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import APP_PATH from "../routes/paths";
import createAvatar from "../utils/createAvatar";
import Avatar from "./Avatar";

const TableUser = ({
  userId,
  title,
  subtitle,
  avatar,
}: {
  userId: number;
  title: string;
  subtitle: string;
  avatar: string;
}) => {
  return (
    <Link
      component={RouterLink}
      to={APP_PATH.users.viewProfile(userId)}
      underline="none"
    >
      <Box display="flex" alignItems="center">
        <Avatar
          alt={"name"}
          src={avatar}
          color={avatar ? "default" : createAvatar(title).color}
          sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
        >
          {createAvatar(title).name}
        </Avatar>
        <Box>
          <Typography color="text.primary" variant="body2">
            {title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default TableUser;
