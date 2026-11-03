import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Home,
  Compass,
  Plus,
  Clock,
  User,
} from "lucide-react-native";
import { MobileTab, useApp } from "../context/AppContext";

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileBottomNav({
  currentTab,
  onTabChange,
}: MobileBottomNavProps) {
  const { colors, t } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.tabBarBg, borderTopColor: colors.tabBarBorder }]}>
      <View style={styles.innerBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          onPress={() => onTabChange("home")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <Home
            size={22}
            color={currentTab === "home" ? colors.primary : colors.textMuted}
            strokeWidth={currentTab === "home" ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "home" ? colors.primary : colors.textMuted },
              currentTab === "home" && styles.tabLabelActive,
            ]}
          >
            {t.tabHome}
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Explore */}
        <TouchableOpacity
          onPress={() => onTabChange("explore")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <Compass
            size={22}
            color={currentTab === "explore" ? colors.primary : colors.textMuted}
            strokeWidth={currentTab === "explore" ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "explore" ? colors.primary : colors.textMuted },
              currentTab === "explore" && styles.tabLabelActive,
            ]}
          >
            {t.tabExplore}
          </Text>
        </TouchableOpacity>

        {/* Center Tab 3: Elevated Sell (+) Button */}
        <TouchableOpacity
          onPress={() => onTabChange("sell")}
          activeOpacity={0.88}
          style={styles.sellButtonContainer}
        >
          <View
            style={[
              styles.sellButton,
              {
                backgroundColor: currentTab === "sell" ? colors.accent : colors.primary,
                borderColor: colors.card,
              },
            ]}
          >
            <Plus size={26} color="#FFFFFF" strokeWidth={2.8} />
          </View>
          <Text
            style={[
              styles.sellLabel,
              { color: currentTab === "sell" ? colors.accent : colors.primary },
            ]}
          >
            {t.tabSell}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Activity (Escrow & PIN Tracker) */}
        <TouchableOpacity
          onPress={() => onTabChange("activity")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <Clock
            size={22}
            color={currentTab === "activity" ? colors.primary : colors.textMuted}
            strokeWidth={currentTab === "activity" ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "activity" ? colors.primary : colors.textMuted },
              currentTab === "activity" && styles.tabLabelActive,
            ]}
          >
            {t.tabActivity}
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          onPress={() => onTabChange("profile")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <User
            size={22}
            color={currentTab === "profile" ? colors.primary : colors.textMuted}
            strokeWidth={currentTab === "profile" ? 2.5 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: currentTab === "profile" ? colors.primary : colors.textMuted },
              currentTab === "profile" && styles.tabLabelActive,
            ]}
          >
            {t.tabProfile}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 22 : 8,
    shadowColor: "#070D1E",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  innerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    height: 56,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 62,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 3,
  },
  tabLabelActive: {
    fontWeight: "800",
  },
  sellButtonContainer: {
    alignItems: "center",
    top: -14,
  },
  sellButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
  },
  sellLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },
});
