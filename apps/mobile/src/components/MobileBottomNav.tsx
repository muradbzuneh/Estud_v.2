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

export type MobileTab = "home" | "explore" | "sell" | "activity" | "profile";

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
            color={currentTab === "home" ? "#059669" : "#94A3B8"}
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
            color={currentTab === "explore" ? "#059669" : "#94A3B8"}
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
          activeOpacity={0.85}
          style={styles.sellButtonContainer}
        >
          <View style={styles.sellButton}>
            <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.sellLabel}>Sell</Text>
        </TouchableOpacity>

        {/* Tab 4: Activity */}
        <TouchableOpacity
          onPress={() => onTabChange("activity")}
          activeOpacity={0.7}
          style={styles.tabButton}
        >
          <Clock
            size={22}
            color={currentTab === "activity" ? "#059669" : "#94A3B8"}
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
            color={currentTab === "profile" ? "#059669" : "#94A3B8"}
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
    borderTopColor: "#F1F5F9",
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
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
    width: 60,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 3,
  },
  tabLabelActive: {
    color: "#059669",
    fontWeight: "800",
  },
  sellButtonContainer: {
    alignItems: "center",
    top: -12,
  },
  sellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  sellLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
    marginTop: 2,
  },
});
