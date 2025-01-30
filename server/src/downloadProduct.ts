import { NextFunction, Request, Response } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { JWT_SECRET_KEY } from "./config";
import { AuthError, ClientError, NOtFoundError } from "./middleware/errors";
import { getSessionInstance } from "./models/loginSession.model";
import { getOrderInstance } from "./models/order.model";
import { getProductInstance } from "./models/product.model";
import { getUserInstance } from "./models/user.model";
import { UserServices } from "./services/user.service";
import { convertToDownloadSlug } from "./utils/fns";

const getUserFromToken = async (authorizationToken: string) => {
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
  const user = await getUserInstance(userId, { error: "Token is not valid" });

  return user;
};

export const downloadProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization)
      return AuthError("No authorization header provided");
    const authorization = req.headers.authorization;
    const user = await getUserFromToken(authorization);
    const id = req.params.id;

    const order = await getOrderInstance(id);
    const { userId: downloadUserId, productId } = order;
    if (user.userId !== downloadUserId)
      throw NOtFoundError("Transaction not found");

    const product = await getProductInstance(productId.toString());
    const { file, name } = product;
    if (product.isDeleted()) throw ClientError("Product has been deleted");

    const filePath = path.join(__dirname, `../private/files/${file}`);
    const ifFileExists = fs.existsSync(filePath);
    if (ifFileExists) {
      res.set("fileName", convertToDownloadSlug({ name, fileName: file }));
      return res.download(filePath);
    } else {
      throw NOtFoundError("File not found");
    }
  } catch (error: any) {
    // const message = error?.message || error;
    // const code = error?.code;

    // if (code === "NOT_FOUND") console.log("error->", error);
    // console.log("error->");
    next(error);
  }
};
