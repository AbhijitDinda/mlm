import UserModel from "../models/user.model";

export const hasInstalled = async (): Promise<boolean> => {
  const user = await UserModel.find();
  return !!user.length;
};
