import React from "react";
import { View, Image, StyleSheet } from "react-native";

export type MobileLogoVariant = "light" | "dark" | "app-icon-light" | "app-icon-dark";

interface EstudLogoProps {
  size?: number;
  variant?: MobileLogoVariant;
  showText?: boolean;
}

export function EstudLogo({
  size = 32,
  variant = "light",
}: EstudLogoProps) {
  let source = require("../../assets/logos/estud-logo-light.png");
  if (variant === "dark") {
    source = require("../../assets/logos/estud-logo-dark.png");
  } else if (variant === "app-icon-light") {
    source = require("../../assets/logos/estud-app-icon-light.jpg");
  } else if (variant === "app-icon-dark") {
    source = require("../../assets/logos/estud-app-icon-dark.jpg");
  }

  // Horizontal logo aspect ratio is ~3.2:1
  const width = size * 3.2;

  return (
    <View style={styles.container}>
      <Image
        source={source}
        style={{ height: size, width: width }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
