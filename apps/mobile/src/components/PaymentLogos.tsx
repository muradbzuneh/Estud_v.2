import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Banknote } from "lucide-react-native";

export const TELEBIRR_LOGO_IMG = require("../../assets/logos/telebirr-official-trimmed.png");
export const TELEBIRR_ICON_IMG = require("../../assets/logos/telebirr-icon-trimmed.png");
export const CBE_LOGO_IMG = require("../../assets/logos/cbe-official-trimmed.png");

interface LogoProps {
  size?: number;
  showText?: boolean;
}

/**
 * Official Telebirr Brand Logo & Icon (Ethio Telecom official asset)
 */
export function TelebirrLogo({ size = 28, showText = true }: LogoProps) {
  if (showText) {
    return (
      <View style={styles.container}>
        <Image
          source={TELEBIRR_LOGO_IMG}
          style={{ width: Math.round(size * 3.4), height: size }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Image
      source={TELEBIRR_ICON_IMG}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/**
 * Official Commercial Bank of Ethiopia (CBE) Brand Logo (Official Gold Coin Emblem)
 */
export function CbeLogo({ size = 28, showText = true }: LogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={CBE_LOGO_IMG}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showText && <Text style={styles.cbeText}>CBE Birr / Bank</Text>}
    </View>
  );
}

/**
 * Clean Cash at Campus Desk Icon
 */
export function CashDeskLogo({ size = 28, showText = true }: LogoProps) {
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
      {showText && <Text style={styles.cashText}>Cash at Desk</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  cbeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#E5A93C",
    letterSpacing: 0.1,
  },
  cashText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#10B981",
  },
});
