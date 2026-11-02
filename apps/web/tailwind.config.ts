import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AMU-inspired twilight dark theme palette
        twilight: {
          950: "#13121d",
          900: "#181726", // Deep dark page background
          850: "#1e1d2e", // Dark navbar & headers
          800: "#222134", // Dark cards & container panels
          750: "#29283d", // Dark inputs & nested cards
          700: "#34324d", // Dark borders & dividers
          600: "#444160", // Dark active borders
          500: "#5c597e",
          400: "#7c7a96", // Dark secondary & placeholder text
          300: "#9d9bb5", // Dark body & subtitle text
          200: "#c7c5dd",
          100: "#e6e5f3",
          50: "#f5f4fa",
        },
        // Unified Royal Indigo / Violet brand colors (matching Image 2 button)
        brand: {
          50: "#f4f2fe",
          100: "#ebe6fd",
          200: "#d9d0fc",
          300: "#beabfa",
          400: "#9f7ef6",
          500: "#825cf2",
          600: "#6c5ce7", // Primary brand button from reference Image 2
          700: "#5d4ce0", // Primary hover
          800: "#4e3ecc", // Primary active
          900: "#3d2fa6",
        },
      },
    },
  },
  plugins: [],
};

export default config;
