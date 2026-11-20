export type ThemeMode = "light" | "dark";

export interface ColorPalette {
  mode: ThemeMode;
  background: string;
  card: string;
  cardElevated: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  inputBg: string;
  headerBg: string;
  tabBarBg: string;
  tabBarBorder: string;
  heroNavy: string;
}

export const lightColors: ColorPalette = {
  mode: "light",
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardElevated: "#FFFFFF",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  primary: "#1D6BF3",       // Electric Cobalt Blue
  primaryLight: "#EFF6FF",
  primaryDark: "#1557CC",
  accent: "#F59E0B",        // Luminous Golden Yellow
  accentLight: "#FEF3C7",
  success: "#10B981",
  successLight: "#ECFDF5",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  inputBg: "#F8FAFC",
  headerBg: "#FFFFFF",
  tabBarBg: "#FFFFFF",
  tabBarBorder: "#E2E8F0",
  heroNavy: "#072448",
};

export const darkColors: ColorPalette = {
  mode: "dark",
  background: "#070d1e",    // Rich Dark Midnight Navy (Profile screen reference)
  card: "#0f1a36",          // Clean elevated midnight card
  cardElevated: "#142247",  // Nested subcard / input layer
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  textPrimary: "#F8FAFC",   // Crisp White
  textSecondary: "#94A3B8", // Gentle Slate
  textMuted: "#64748B",
  primary: "#2563EB",       // Electric Royal Blue (60-30-10 palette)
  primaryLight: "rgba(37, 99, 235, 0.16)",
  primaryDark: "#1D4ED8",
  accent: "#FE9901",        // Signature Estud Amber
  accentLight: "rgba(254, 153, 1, 0.16)",
  success: "#10B981",
  successLight: "rgba(16, 185, 129, 0.16)",
  danger: "#EF4444",
  dangerLight: "rgba(239, 68, 68, 0.16)",
  inputBg: "#0B132B",
  headerBg: "#070d1e",
  tabBarBg: "#070d1e",
  tabBarBorder: "rgba(255, 255, 255, 0.08)",
  heroNavy: "#0B1739",
};

export function getThemeColors(mode: ThemeMode): ColorPalette {
  return mode === "dark" ? darkColors : lightColors;
}
