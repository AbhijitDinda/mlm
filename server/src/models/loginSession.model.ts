import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { AuthError, ServerError } from "../middleware/errors";
import { ModelInsert } from "../utils/types";
import { LoginSessionModelSchema } from "./schemas/loginSession.schema";

export class LoginSession extends LoginSessionModelSchema {
  verifyToken() {
    const status = this.status;
    if (status !== "active") throw AuthError("Login session token has expired");
  }
}
export type LoginSessionInsert = ModelInsert<LoginSession>;

const LoginSessionModel = getModelForClass(LoginSession);
export default LoginSessionModel;

/**
 * create session model
 */
export const getSessionInstance = async (id: Types.ObjectId) => {
  const session = await LoginSessionModel.findById(id);
  if (!session) return ServerError("No login session found");
  return session;
};
