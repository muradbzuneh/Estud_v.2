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
  background: "#070D1E",    // Midnight Dark Navy
  card: "#0D182E",          // Elevated Dark Blue
  cardElevated: "#132342",
  border: "rgba(255, 255, 255, 0.12)",
  borderStrong: "rgba(255, 255, 255, 0.22)",
  textPrimary: "#FFFFFF",
  textSecondary: "#CBD5E1",
  textMuted: "#64748B",
  primary: "#3B82F6",       // Vibrant Blue
  primaryLight: "rgba(59, 130, 246, 0.18)",
  primaryDark: "#1D6BF3",
  accent: "#FBBF24",        // Bright Golden Yellow
  accentLight: "rgba(251, 191, 36, 0.18)",
  success: "#34D399",
  successLight: "rgba(52, 211, 153, 0.18)",
  danger: "#F87171",
  dangerLight: "rgba(248, 113, 113, 0.18)",
  inputBg: "#0B1426",
  headerBg: "#070D1E",
  tabBarBg: "#070D1E",
  tabBarBorder: "rgba(255, 255, 255, 0.08)",
  heroNavy: "#05162E",
};

export function getThemeColors(mode: ThemeMode): ColorPalette {
  return mode === "dark" ? darkColors : lightColors;
}
