import { AdminContext } from "../../context";
import { UserServices } from "../../services/user.service";

export const getAdminProfileHandler = async ({ ctx }: { ctx: AdminContext }) => {
  try {
    const {
      admin: { userId, loginSessionId },
    } = ctx;

    const details = await UserServices.getUserProfileDetails(userId);
    return { ...details, loginSessionId };
  } catch (error) {
    throw error;
  }
};
