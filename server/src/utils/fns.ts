import jwt from "jsonwebtoken";
import { isValidObjectId, Types } from "mongoose";
import { API_URL, JWT_SECRET_KEY } from "../config";
import { ClientError } from "../middleware/errors";
import { getSettingInstance } from "../models/setting.model";
import HttpStatusCode from "./HttpStatusCode";

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const formatApiUrl = (url: string): string => {
  return API_URL + url;
};
export const getApiFileUrl = (fileName: string, isPrivate: boolean) =>
  isPrivate ? fileName : `/public/files/${fileName}`;

export const fCurrency = async (amount: number): Promise<string> => {
  const setting = await getSettingInstance();
  const { currency, currencyPosition } = setting;
  if (currencyPosition === "prefix") {
    return `${currency}${amount}`;
  }
  return `${amount}${currency}`;
};

type UserResponse<T> = {
  success: boolean;
  status: HttpStatusCode;
  toastMessage: string;
} & T;
export const sendResponse = <T extends Record<string, unknown>>(
  toastMessage: string,
  response: T = {} as T,
  status: HttpStatusCode = 200
): UserResponse<T> => {
  return { success: true, status, toastMessage, ...response };
};
export const signJwt = (id: number, remember: boolean) => {
  const token = jwt.sign({ id }, JWT_SECRET_KEY, {
    expiresIn: remember ? "7d" : "1d",
  });
  return token;
};

export const toObjectId = (id: string | Types.ObjectId) => {
  const isId = isValidObjectId(id);
  if (!isId) throw ClientError(`Invalid id ${id}`);
  return id as any as Types.ObjectId;
};

export const convertToDownloadSlug = ({
  name,
  fileName,
}: {
  name: string;
  fileName: string;
}) => {
  const slugName = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  const ext = fileName.split(".").pop();
  return `${slugName}.${ext}`;
};
