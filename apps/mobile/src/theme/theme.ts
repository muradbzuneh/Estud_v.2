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
  background: "#0F172A",    // Soft Slate 900 (gentle, light dark mode)
  card: "#1E293B",          // Elevated Slate 800
  cardElevated: "#2D3B4F",  // Subtle Elevated Layer
  border: "rgba(255, 255, 255, 0.09)",
  borderStrong: "rgba(255, 255, 255, 0.18)",
  textPrimary: "#F8FAFC",   // Crisp Slate 50
  textSecondary: "#94A3B8", // Gentle Slate 400
  textMuted: "#64748B",
  primary: "#38BDF8",       // Bright Sky Blue (high contrast & attractive)
  primaryLight: "rgba(56, 189, 248, 0.14)",
  primaryDark: "#0284C7",
  accent: "#FBBF24",        // Warm Golden Amber
  accentLight: "rgba(251, 191, 36, 0.16)",
  success: "#34D399",
  successLight: "rgba(52, 211, 153, 0.16)",
  danger: "#F87171",
  dangerLight: "rgba(248, 113, 113, 0.16)",
  inputBg: "#162032",
  headerBg: "#0F172A",
  tabBarBg: "#0F172A",
  tabBarBorder: "rgba(255, 255, 255, 0.08)",
  heroNavy: "#1E293B",
};

export function getThemeColors(mode: ThemeMode): ColorPalette {
  return mode === "dark" ? darkColors : lightColors;
}
