import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f7f8",
          100: "#b3e8eb",
          200: "#80d9de",
          300: "#4dcad1",
          400: "#1abac4",
          500: "#0a9396",
          600: "#087579",
          700: "#06575c",
          800: "#04393d",
          900: "#021b1e",
        },
        accent: {
          50: "#f0faf8",
          100: "#d4f0e8",
          200: "#b8e6d8",
          300: "#9cdcc8",
          400: "#94d2bd",
          500: "#7bc4a8",
          600: "#62b693",
          700: "#4a8870",
          800: "#325a4d",
          900: "#1a2c26",
          mint: "#94d2bd",
        },
        telemoz: {
          white: "#ffffff",
          "light-gray": "#e0e1dd",
          teal: "#0a9396",
          mint: "#94d2bd",
          gray: "#a8a9ad",
        },
      },
      animation: {
        "gradient-shift": "gradient-shift 3s ease infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;

