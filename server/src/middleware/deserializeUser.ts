import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config";
import { getSessionInstance } from "../models/loginSession.model";
import { getUserInstance } from "../models/user.model";
import { UserServices } from "../services/user.service";

const AuthError = (error: string): never => {
  //@ts-ignore
  return undefined;
};

export const deserializeUser = async ({
  req,
}: CreateExpressContextOptions & { isAdmin: boolean }) => {
  try {
    if (!req.headers.authorization)
      return AuthError("No authorization header provided");

    const authorizationToken: string = req.headers.authorization;
    if (!authorizationToken.startsWith("Bearer "))
      return AuthError("Authorization token is invalid");

    const token = authorizationToken.split(" ")[1];
    const verifiedToken = <jwt.JwtPayload>jwt.verify(token, JWT_SECRET_KEY);
    const { id: userId, exp } = verifiedToken;
    const currentTime = Date.now() / 1000;
    if (!exp || exp < currentTime) return AuthError("Token is expired");
    if (!userId) return AuthError("Token is not valid");

    const sessionId = await UserServices.getLoginSessionIdByToken(token);
    const session = await getSessionInstance(sessionId);
    session.verifyToken();
    const tokenId = session._id.toString();
    const user = await getUserInstance(userId, { error: "Token is not valid" });

    return Object.assign(user, { loginSessionId: tokenId });
  } catch (error) {
    return AuthError("Unauthorized");
  }
};
