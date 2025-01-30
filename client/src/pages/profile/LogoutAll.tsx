import { LoadingButton } from "@mui/lab";
import { useConfirm } from "material-ui-confirm";

import Iconify from "../../components/Iconify";
import { trpc } from "../../trpc";

const ProfileMainLogoutAll = ({ ...props }) => {
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const { mutate, isLoading } = trpc.profile.logoutAll.useMutation({
    onSuccess() {
      utils.profile.loginSession.invalidate();
    },
  });
  const handleLogoutAll = async () => {
    await confirm({
      description: "Are you sure you want to log out from all devices?",
    });
    mutate();
  };
  return (
    <LoadingButton
      startIcon={<Iconify icon="ri:login-circle-line" rotate={2} />}
      {...props}
      color="error"
      variant="contained"
      loading={isLoading}
      onClick={handleLogoutAll}
    >
      Logout All Sessions
    </LoadingButton>
  );
};

export default ProfileMainLogoutAll;
