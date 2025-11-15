import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const commonColors = {
  primary_light: "#FF6699",
  primary_main: "#FF3366",
  primary_dark: "#C21044",

  gold: "#F0A500",

  iconGray: "#999999",
  iconhigh: "#CCCCCC",
  iconColor: "#666666",

  error_main: "#E03E2F",

  divider: "#E0E0E0",
  base: "#121212",
};

export const lightTheme = {
  ...MD3LightTheme,
  custom: "lightTheme",
  colors: {
    ...MD3LightTheme.colors,
    ...commonColors,

    primary: commonColors.primary_main,
    onPrimary: "#FFFFFF",

    secondary: commonColors.gold,
    onSecondary: "#000000",

    background: "#FAFAFA",
    surface: "#FFFFFF",

    background_paper: "#FFFFFF",
    background_default: "#FAFAFA",
    background_neutral: "#F0F0F0",

    text: "#222222",
    text_primary: "#222222",
    text_secondary: "#666666",
    text_disabled: "#A1A1A1",

    disabled: "#A1A1A1",
    placeholder: commonColors.iconColor,
    backdrop: "rgba(0,0,0,0.2)",

    error: commonColors.error_main,
    onError: "#FFFFFF",

    divider: commonColors.divider,
  },
  roundness: 14,
};

export const darkTheme = {
  ...MD3DarkTheme,
  custom: "darkTheme",
  colors: {
    ...MD3DarkTheme.colors,
    ...commonColors,

    primary: commonColors.primary_main,
    onPrimary: "#FFFFFF",

    secondary: commonColors.gold,
    onSecondary: "#000000",

    background: commonColors.base,
    surface: "#1E1E1E",

    background_paper: "#121212",
    background_default: "#121212",
    background_neutral: "#1E1E1E",

    text: "#E0E0E0",
    text_primary: "#E0E0E0",
    text_secondary: "#999999",
    text_disabled: "#7A7A7A",

    disabled: "#7A7A7A",
    placeholder: commonColors.iconColor,
    backdrop: "rgba(255,255,255,0.2)",

    error: commonColors.error_main,
    onError: "#000000",

    divider: "#333333",
  },
  roundness: 14,
};
