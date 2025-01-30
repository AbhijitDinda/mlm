import { APP_PATH } from "./routes/paths";

// ----------------------------------------------------------------------

export const API_URL = "https://binary-mlm-api.jamsrworld.com";
export const APP_URL = "https://binary-mlm.jamsrworld.com";

// export const API_URL = "http://localhost:8083";
// export const APP_URL = "http://localhost:5173";

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = APP_PATH.dashboard;

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
} as const;

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// Please remove `localStorage` when you set settings.
// ----------------------------------------------------------------------

export const defaultSettings = {
  themeMode: "light",
  themeDirection: "ltr",
  themeColorPresets: "default",
  themeLayout: "horizontal",
  themeStretch: false,
} as const;

const localConfiguration = JSON.parse(
  localStorage.getItem("configuration") as string
);
const defaultState = {
  currency: "₹",
  currencyPosition: "prefix",
  appName: "Jamsr",
  logo: "",
  fullLogo: "",
  favicon: "",
  country: "IN",
  siteConfiguration: {
    contactDetails: false,
    kycVerification: false,
    registration: true,
  },
};

export const initialState =
  typeof localConfiguration === "object"
    ? {
        defaultState,
        ...localConfiguration,
      }
    : defaultState;

export const RESPONSIVE_GAP = { xs: 1, md: 2 };
