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
import { MobileTab } from "../context/AppContext";

interface MobileBottomNavProps {
  currentTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileBottomNav({
  currentTab,
  onTabChange,
}: MobileBottomNavProps) {
  return (
    <View style={styles.container}>
      <View style={styles.innerBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          onPress={() => onTabChange("home")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <Home
            size={22}
            color={currentTab === "home" ? "#1D6BF3" : "#94A3B8"}
            strokeWidth={currentTab === "home" ? 2.4 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === "home" && styles.tabLabelActive,
            ]}
          >
            Home
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
            color={currentTab === "explore" ? "#1D6BF3" : "#94A3B8"}
            strokeWidth={currentTab === "explore" ? 2.4 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === "explore" && styles.tabLabelActive,
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>

        {/* Center Tab 3: Elevated Sell (+) Button */}
        <TouchableOpacity
          onPress={() => onTabChange("sell")}
          activeOpacity={0.88}
          style={styles.sellButtonContainer}
        >
          <View style={[styles.sellButton, currentTab === "sell" && styles.sellButtonActive]}>
            <Plus size={26} color="#FFFFFF" strokeWidth={2.8} />
          </View>
          <Text style={[styles.sellLabel, currentTab === "sell" && styles.sellLabelActive]}>
            Sell (0%)
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
            color={currentTab === "activity" ? "#1D6BF3" : "#94A3B8"}
            strokeWidth={currentTab === "activity" ? 2.4 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === "activity" && styles.tabLabelActive,
            ]}
          >
            Activity
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
            color={currentTab === "profile" ? "#1D6BF3" : "#94A3B8"}
            strokeWidth={currentTab === "profile" ? 2.4 : 1.8}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === "profile" && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
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
    color: "#94A3B8",
    marginTop: 3,
  },
  tabLabelActive: {
    color: "#1D6BF3",
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
    backgroundColor: "#1D6BF3", // Electric Cobalt Blue
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  sellButtonActive: {
    backgroundColor: "#F59E0B", // Luminous Gold when active
    shadowColor: "#F59E0B",
  },
  sellLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1D6BF3",
    marginTop: 2,
  },
  sellLabelActive: {
    color: "#F59E0B",
  },
});
