import axios from "axios";
import { API_URL } from "../config";
import { getLoginToken } from "./jwt";

export const Axios = axios.create({
  baseURL: API_URL,
});

Axios.interceptors.request.use(function (config) {
  const token = getLoginToken(true);
  config.headers.Authorization = token;
  return config;
});
