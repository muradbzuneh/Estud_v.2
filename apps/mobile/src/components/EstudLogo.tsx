import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export type MobileLogoVariant = "light" | "dark" | "app-icon-light" | "app-icon-dark";

interface EstudLogoProps {
  size?: number;
  variant?: MobileLogoVariant;
  showText?: boolean;
}

export function EstudLogo({
  size = 32,
  variant = "light",
  showText = true,
}: EstudLogoProps) {
  const isDark = variant === "dark" || variant === "app-icon-dark";
  const source = isDark
    ? require("../../assets/logos/estud-app-icon-dark.jpg")
    : require("../../assets/logos/estud-app-icon-light.jpg");

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { width: size, height: size, borderRadius: Math.round(size * 0.28) }]}>
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize: Math.round(size * 0.65), color: isDark ? "#FFFFFF" : "#0F172A" }]}>
          Estud
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    overflow: "hidden",
  },
  logoText: {
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});
