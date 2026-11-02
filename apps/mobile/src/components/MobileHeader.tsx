import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MapPin, Bell, User, LogIn, ChevronDown } from "lucide-react-native";
import { EstudLogo } from "./EstudLogo";

interface MobileHeaderProps {
  campusName?: string;
  unreadCount?: number;
  isAuthenticated?: boolean;
  avatarUrl?: string;
  onCampusPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onAuthPress?: () => void;
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
}: MobileHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left: Official Estud Ribbon Logo & Brand Name */}
      <View style={styles.leftSection}>
        <EstudLogo size={28} showText={true} />
      </View>

      {/* Center: Campus Hub Pill Button (Clickable to switch campus) */}
      <TouchableOpacity
        onPress={onCampusPress}
        activeOpacity={0.75}
        style={styles.campusPill}
      >
        <MapPin size={12} color="#1D6BF3" />
        <Text numberOfLines={1} style={styles.campusText}>
          {campusName}
        </Text>
        <ChevronDown size={12} color="#64748B" />
      </TouchableOpacity>

      {/* Right: Notification Bell & Profile Avatar / Sign In */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={onNotificationsPress}
          style={styles.iconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bell size={20} color="#334155" />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {isAuthenticated ? (
          <TouchableOpacity
            onPress={onProfilePress}
            activeOpacity={0.8}
            style={styles.avatarWrapper}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <User size={16} color="#1D6BF3" />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onAuthPress}
            activeOpacity={0.8}
            style={styles.signInButton}
          >
            <LogIn size={13} color="#FFFFFF" />
            <Text style={styles.signInText}>Sign In</Text>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  campusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 140,
  },
  campusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 15,
    height: 15,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#1D6BF3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1D6BF3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
