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
        // Logo-aligned Midnight Navy dark theme palette (matches dark squircle background)
        twilight: {
          950: "#040711",
          900: "#070d1e", // Deepest midnight navy page background (exact logo match)
          850: "#0b142c", // Dark navbar & headers
          800: "#101d3f", // Dark cards & container panels
          750: "#15254f", // Dark inputs & nested sub-cards
          700: "#1d3266", // Dark borders & dividers
          600: "#274385", // Dark active borders
          500: "#3d63b8",
          400: "#7093db", // Dark secondary & placeholder text
          300: "#a3bdf0", // Dark body & subtitle text
          200: "#cbd9f7",
          100: "#e6edfb",
          50: "#f4f7fd",
        },
        // Primary Brand: Estud Electric Cobalt Blue (from top ribbon of logo)
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1d6bf3", // Vibrant Electric Blue
          700: "#144ecc", // Hover state
          800: "#1040a8", // Active state
          900: "#0c3080",
          950: "#071c4d",
        },
        // Secondary Brand: Estud Golden Yellow / Amber (from bottom ribbon of logo)
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24", // Luminous Gold
          500: "#f59e0b", // Primary Logo Golden Amber
          600: "#d97706", // Darker gold / hover
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
