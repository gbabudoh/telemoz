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
          50: "#f2fde8",
          100: "#d9f5b0",
          200: "#c0ed78",
          300: "#a7e540",
          400: "#6ece39",
          500: "#58b82c",
          600: "#42a21f",
          700: "#2c8c12",
          800: "#167605",
          900: "#0a4a00",
          green: "#6ece39",
        },
        telemoz: {
          white: "#ffffff",
          "light-gray": "#e0e1dd",
          teal: "#0a9396",
          green: "#6ece39",
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

