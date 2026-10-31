import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

interface EstudLogoProps {
  size?: number;
  showText?: boolean;
}

export function EstudLogo({ size = 32, showText = true }: EstudLogoProps) {
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Defs>
          <LinearGradient id="mTopRibbon" x1="6" y1="10" x2="38" y2="10" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#4F46E5" />
            <Stop offset="1" stopColor="#3B82F6" />
          </LinearGradient>
          <LinearGradient id="mMidRibbon" x1="12" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#0284C7" />
            <Stop offset="1" stopColor="#06B6D4" />
          </LinearGradient>
          <LinearGradient id="mBottomRibbon" x1="6" y1="38" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#EA580C" />
            <Stop offset="1" stopColor="#F97316" />
          </LinearGradient>
        </Defs>

        {/* Top Folded Bar */}
        <Path
          d="M10 14C10 10.6863 12.6863 8 16 8H34C37.3137 8 40 10.6863 40 14C40 17.3137 37.3137 20 34 20H16C12.6863 20 10 17.3137 10 14Z"
          fill="url(#mTopRibbon)"
        />

        {/* Left Spine */}
        <Path
          d="M10 14V34C10 37.3137 12.6863 40 16 40C19.3137 40 22 37.3137 22 34V20L10 14Z"
          fill="#4338CA"
          opacity="0.9"
        />

        {/* Middle Folded Bar */}
        <Path
          d="M16 26C16 22.6863 18.6863 20 22 20H38C41.3137 20 44 22.6863 44 26C44 29.3137 41.3137 32 38 32H22C18.6863 32 16 29.3137 16 26Z"
          fill="url(#mMidRibbon)"
        />

        {/* Bottom Folded Bar */}
        <Path
          d="M10 34C10 30.6863 12.6863 28 16 28H32C35.3137 28 38 30.6863 38 34C38 37.3137 35.3137 40 32 40H16C12.6863 40 10 37.3137 10 34Z"
          fill="url(#mBottomRibbon)"
        />
      </Svg>

      {showText && <Text style={styles.brandTitle}>Estud</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
});
