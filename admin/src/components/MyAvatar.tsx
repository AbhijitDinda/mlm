import useAuth from "../hooks/useAuth";
import createAvatar from "../utils/createAvatar";
import Avatar from "./Avatar";

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();
  return (
    <Avatar
      src={user?.avatar}
      alt={user?.displayName}
      color={user?.avatar ? "default" : createAvatar(user?.displayName).color}
      {...other}
    >
      {createAvatar(user?.displayName).name}
    </Avatar>
  );
}
