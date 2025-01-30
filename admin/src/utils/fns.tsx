import { API_URL, APP_URL } from "../config";

export const formatUrl = (url: string) => {
  return APP_URL + url;
};

export const isUserName = (userName: string) => {
  //regex
  let regex = /[A-Za-z]/.test(userName);
  if (!regex) return false;

  return /^[a-zA-Z0-9]+$/.test(userName);
};

export const isNumber = (t: string) => {
  return /^\d+$/.test(t);
};

export const isDecNum = (t: string) => {
  return /^\d+(\.\d+)?$/.test(t);
};

export const isAlphabet = (t: string) => {
  return /^[a-zA-Z /s]+$/.test(t);
};

export const isAlphaNumeric = (t: string) => {
  return /^[a-zA-Z0-9 /s]+$/.test(t);
};

export const isUserId = (userId: string) => {
  return !!userId && String(userId).length > 6 && isNumber(userId);
};

export const isObjEmpty = (obj: unknown) => {
  if (typeof obj !== "object" || !obj) return true;
  return Object.keys(obj).length === 0;
};

export const getFileSrc = (url?: string) => {
  const isLink = (url: string) => /^https|http/.test(url);
  if (!url || isLink(url)) return url ?? "";
  return API_URL + url;
};

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getDiscount = (mrp: number, price: number) => {
  const discount = 100 - (price / mrp) * 100;
  return discount.toFixed(2);
};
