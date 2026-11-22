import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MapPin, Bell, User, LogIn, ChevronDown, Sparkles, Menu } from "lucide-react-native";
import { EstudLogo } from "./EstudLogo";
import { useApp } from "../context/AppContext";

interface MobileHeaderProps {
  campusName?: string;
  unreadCount?: number;
  isAuthenticated?: boolean;
  avatarUrl?: string;
  onCampusPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onAuthPress?: () => void;
  onMenuPress?: () => void;
}

export function MobileHeader({
  campusName = "AAU 4 Kilo",
  unreadCount = 1,
  isAuthenticated = true,
  avatarUrl,
  onCampusPress,
  onNotificationsPress,
  onProfilePress,
  onAuthPress,
  onMenuPress,
}: MobileHeaderProps) {
  const { colors, t, checkForUpdates, isLiveConnected } = useApp();
  const isDark = colors.mode === "dark";

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
      {/* Left: Hamburger Sidebar Toggle + Official Estud Ribbon Logo */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onMenuPress}
          activeOpacity={0.7}
          style={styles.menuBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Menu size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <EstudLogo size={26} showText={true} variant={isDark ? "dark" : "light"} />
      </View>

      {/* Center: Campus Hub Pill Button */}
      <TouchableOpacity
        onPress={onCampusPress}
        activeOpacity={0.75}
        style={[styles.campusPill, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
      >
        <MapPin size={12} color={colors.primary} />
        <Text numberOfLines={1} style={[styles.campusText, { color: colors.textPrimary }]}>
          {campusName}
        </Text>
        <ChevronDown size={12} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Right: Sync, Notifications & Avatar */}
      <View style={styles.rightSection}>
        {/* Live Sync Status Indicator */}
        <View style={styles.syncStatusPill}>
          <View style={[styles.syncStatusDot, { backgroundColor: isLiveConnected ? "#10B981" : "#F59E0B" }]} />
          <Text style={[styles.syncStatusText, { color: isLiveConnected ? "#10B981" : "#D97706" }]}>
            {isLiveConnected ? "LIVE" : "SYNC"}
          </Text>
        </View>

        {/* Notifications Bell */}
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bell size={19} color={colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Avatar / Sign In */}
        {isAuthenticated ? (
          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.8}
            style={[styles.avatarWrapper, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <User size={15} color={colors.primary} />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onAuthPress}
            activeOpacity={0.8}
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
          >
            <LogIn size={13} color="#FFFFFF" />
            <Text style={styles.signInText}>{t.signIn}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuBtn: {
    padding: 3,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  campusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 135,
  },
  campusText: {
    fontSize: 11,
    fontWeight: "700",
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  updatePill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    padding: 3,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 1,
    right: 1,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 14,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
  avatarWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  syncStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  syncStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  syncStatusText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
