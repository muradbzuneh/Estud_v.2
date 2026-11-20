import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle, G } from "react-native-svg";
import { Banknote } from "lucide-react-native";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

/**
 * Authentic Telebirr SuperApp Brand Icon & Logo
 * Vibrant Ethio Telecom Cyan & Warm Solar Gold
 */
export function TelebirrLogo({ size = 26, showText = true }: LogoProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tile,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            backgroundColor: "#0078D4",
          },
        ]}
      >
        <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 32 32" fill="none">
          {/* Overlapping stylized dual-curve Telebirr diamond */}
          <Path
            d="M8 6L18 6C23 6 26 9.5 26 14C26 18.5 23 22 18 22L8 22V6Z"
            fill="#FFCC00"
          />
          <Path
            d="M6 10L15 10C19 10 22 12.5 22 16C22 19.5 19 22 15 22L6 22V10Z"
            fill="#00B4D8"
          />
          <Circle cx="12" cy="16" r="3.5" fill="#FFFFFF" />
        </Svg>
      </View>
      {showText && <Text style={styles.telebirrText}>telebirr</Text>}
    </View>
  );
}

/**
 * Authentic Commercial Bank of Ethiopia (CBE) Brand Icon & Logo
 * Regal Imperial Purple & Pure Gold Emblem
 */
export function CbeLogo({ size = 26, showText = true }: LogoProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tile,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            backgroundColor: "#58136A",
          },
        ]}
      >
        <Svg width={size * 0.72} height={size * 0.72} viewBox="0 0 32 32" fill="none">
          {/* CBE Shield & Balance of Trust */}
          <Path
            d="M16 3L6 7V16C6 22.5 10.3 27.5 16 29C21.7 27.5 26 22.5 26 16V7L16 3Z"
            fill="#FFB800"
          />
          <Path
            d="M16 5.5L8 8.8V16C8 21.2 11.5 25.2 16 26.8C20.5 25.2 24 21.2 24 16V8.8L16 5.5Z"
            fill="#58136A"
          />
          {/* Scales & Monogram */}
          <Circle cx="16" cy="12" r="2.2" fill="#FFB800" />
          <Path d="M12 16H20M13 16L11 20M19 16L21 20" stroke="#FFB800" strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      </View>
      {showText && <Text style={styles.cbeText}>CBE Birr</Text>}
    </View>
  );
}

/**
 * Clean Cash at Campus Desk Icon
 */
export function CashDeskLogo({ size = 26, showText = true }: LogoProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tile,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            backgroundColor: "#059669",
          },
        ]}
      >
        <Banknote size={Math.round(size * 0.6)} color="#FFFFFF" />
      </View>
      {showText && <Text style={styles.cashText}>Cash Desk</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  tile: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  telebirrText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0078D4",
    letterSpacing: -0.2,
  },
  cbeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#8B2F9E",
    letterSpacing: 0.1,
  },
  cashText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
  },
});
