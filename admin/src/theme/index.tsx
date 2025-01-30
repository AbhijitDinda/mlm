import { CssBaseline, PaletteMode, alpha } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";
import React, { useMemo } from "react";
import useSettings from "../hooks/useSettings";
import breakpoints from "./breakpoints";
import componentsOverride from "./overrides";
import palette from "./palette";
import shadows, { Shadows, customShadows } from "./shadows";
import typography from "./typography";

// ----------------------------------------------------------------------

export type PaletteBasicColor =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      mode: PaletteMode;
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      background: {
        paper: string;
        default: string;
        neutral: string;
      };
      action: {
        hover: string;
        selected: string;
        disabled: string;
        disabledBackground: string;
        focus: string;
        hoverOpacity: number;
        disabledOpacity: number;
        selectedOpacity: number;
        active: string;
      };
      common: {
        black: string;
        white: string;
      };
      primary: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      secondary: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      info: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      success: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      warning: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      error: {
        contrastText: string;
        lighter: string;
        light: string;
        main: string;
        dark: string;
        darker: string;
      };
      grey: {
        0: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        5008: string;
        50012: string;
        50016: string;
        50024: string;
        50032: string;
        50048: string;
        50056: string;
        50080: string;
      };
      gradients: {
        primary: string;
        info: string;
        success: string;
        warning: string;
        error: string;
      };
      chart: {
        violet: string[];
        blue: string[];
        green: string[];
        yellow: string[];
        red: string[];
      };
      divider: string;
    };
    typography: {
      fontFamily: string;
      fontWeightRegular: number;
      fontWeightMedium: number;
      fontWeightBold: number;
      h1: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
        letterSpacing: number;
      };
      h2: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      h3: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      h4: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      h5: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      h6: {
        "@media (min-width:600px)": {
          fontSize: string;
        };
        "@media (min-width:900px)": {
          fontSize: string;
        };
        "@media (min-width:1200px)": {
          fontSize: string;
        };
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      subtitle1: {
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      subtitle2: {
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
      };
      body1: {
        lineHeight: number;
        fontSize: string;
      };
      body2: {
        lineHeight: number;
        fontSize: string;
      };
      caption: {
        lineHeight: number;
        fontSize: string;
      };
      overline: {
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
        textTransform: "uppercase";
      };
      button: {
        fontWeight: number;
        lineHeight: number;
        fontSize: string;
        textTransform: "capitalize";
      };
    };
    shape: {
      borderRadius: number;
    };
    direction: "ltr" | "rtl";
    shadows: Shadows;
    customShadows: {
      z1: string;
      z8: string;
      z12: string;
      z16: string;
      z20: string;
      z24: string;
      primary: string;
      info: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      card: string;
      dialog: string;
      dropdown: string;
    };
  }
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { themeMode, setColor } = useSettings();
  const isLight = themeMode === "light";

  const themeOptions = useMemo(
    () => ({
      palette: isLight
        ? {
            ...palette.light,
            primary: setColor,
          }
        : {
            ...palette.dark,
            primary: setColor,
          },
      typography,
      breakpoints,
      shape: { borderRadius: 8 },
      shadows: isLight ? shadows.light : shadows.dark,
      customShadows: isLight
        ? {
            ...customShadows.light,
            primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
          }
        : {
            ...customShadows.dark,
            primary: `0 8px 16px 0 ${alpha(setColor.main, 0.24)}`,
          },
    }),
    [isLight, setColor]
  );
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
