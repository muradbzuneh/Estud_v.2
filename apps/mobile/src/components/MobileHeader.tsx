import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Menu, Bell } from "lucide-react-native";

interface MobileHeaderProps {
  campusName?: string;
  unreadCount?: number;
  avatarUrl?: string;
  onMenuPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
}

export function MobileHeader({
  campusName = "AAU 4 Kilo",
  unreadCount = 2,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  onMenuPress,
  onNotificationsPress,
  onProfilePress,
}: MobileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: Hamburger Menu & Estud Logo */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          onPress={onMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconButton}
        >
          <Menu size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          {/* Estud Dual-tone Cap Emblem */}
          <View style={styles.logoBadge}>
            <View style={styles.logoDiamond} />
          </View>
          <Text style={styles.brandTitle}>Estud</Text>
        </View>
      </View>

      {/* Right: Notification Bell & Profile Avatar */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Bell size={20} color="#334155" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onProfilePress} style={styles.avatarWrapper}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </TouchableOpacity>
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
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: "relative",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
  },
  logoDiamond: {
    width: 12,
    height: 12,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    borderRadius: 2,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  avatarWrapper: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#10B981",
    padding: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
