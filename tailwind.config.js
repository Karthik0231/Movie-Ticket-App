/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Brand (Neon Cinematic) ----
        primary: {
          light: "#FF4F9F",   // Neon soft pink
          DEFAULT: "#FF006E", // Main neon pink
          dark: "#D4005F",    // Deep neon
        },

        // ---- Gold (Ratings, Premium Badges) ----
        gold: "#FFD700",

        // ---- Accent (Buttons, highlights) ----
        accent: {
          blue: "#00D4FF", // futuristic cyan glow
          purple: "#8B5CF6",
        },

        // ---- Icon + Gray scales ----
        icon: {
          gray: "#9CA3AF",
          high: "#E5E7EB",
          default: "#6B7280",
        },

        gray: {
          DEFAULT: "#737373",
          soft: "#A1A1A1",
        },

        // ---- Error ----
        error: {
          main: "#FF3B30",
        },

        // ---- Shared neutral ----
        divider: "#2A2A2A",
        base: "#181818",

        // ---- Light Theme ----
        light: {
          background_paper: "#FFFFFF",
          background_default: "#F5F5F5",
          background_neutral: "#F0F0F0",

          text_primary: "#1A1A1A",
          text_secondary: "#4B4B4B",
          text_disabled: "#9E9E9E",
        },

        // ---- Dark Theme ---- (Cinematic)
        dark: {
          background_paper: "#1A1A1A",
          background_default: "#0D0D0D",
          background_neutral: "#121212",

          text_primary: "#FFFFFF",
          text_secondary: "#C5C5C5",
          text_disabled: "#7A7A7A",
        },
      },

      fontSize: {
        base: "17px",
      },

      fontFamily: {
        p_thin: ["Poppins-Thin"],
        p_elight: ["Poppins-ExtraLight"],
        p_light: ["Poppins-Light"],
        p_reg: ["Poppins-Regular"],
        p_med: ["Poppins-Medium"],
        p_semi: ["Poppins-SemiBold"],
        p_bold: ["Poppins-Bold"],
        p_ebold: ["Poppins-ExtraBold"],
      },
    },
  },
  plugins: [],
};
