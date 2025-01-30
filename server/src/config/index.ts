export const MONGODB_URI = process.env.MONGODB_URI as string;
export const PORT = Number(process.env.PORT) as number;
export const NODE_ENV = process.env.NODE_ENV as "production" | "development";
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;
export const DEPOSIT_SUCCESS_URL = CLIENT_URL + "/deposit-system/history";
export const API_URL = process.env.API_URL as string;
export const MAX_LOGIN_SESSION = 100;
export const IS_DEMO = process.env.IS_DEMO === "TRUE";