import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import APP_PATH from "../routes/paths";

const AddMember = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user) return null;

  const url = APP_PATH.register + `?referral_id=${user.userId}`;

  useEffect(() => {
    navigate(url, { replace: true });
  });

  return <div>{url}</div>;
};

export default AddMember;
