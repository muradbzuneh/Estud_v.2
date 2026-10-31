import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MobileHeader } from "../components/MobileHeader";
import { MobileHeroCard } from "../components/MobileHeroCard";
import { MobileSearchBar } from "../components/MobileSearchBar";
import { MobileCategoryList } from "../components/MobileCategoryList";
import {
  MobileProductGrid,
  SAMPLE_MOBILE_PRODUCTS,
} from "../components/MobileProductGrid";
import { MobileBottomNav, MobileTab } from "../components/MobileBottomNav";

export function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<MobileTab>("home");

  const filteredProducts = SAMPLE_MOBILE_PRODUCTS.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleProductPress = (id: string) => {
    Alert.alert(
      "Estud SafeTrade Escrow",
      "Item secured in campus escrow. Buyer inspects at AAU hub before releasing 4-digit PIN."
    );
  };

  const handleTabChange = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === "sell") {
      Alert.alert(
        "List Item on Estud",
        "Open camera to take photos and list with 0% seller fee!"
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Mobile Header */}
      <MobileHeader
        campusName="AAU 4 Kilo"
        unreadCount={2}
        onMenuPress={() => Alert.alert("Estud Menu", "Student navigation drawer")}
        onNotificationsPress={() =>
          Alert.alert("Notifications", "You have 2 pending escrow notifications.")
        }
      />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Card */}
        <MobileHeroCard
          onExplorePress={() => setSelectedCategory("all")}
          onSellPress={() => handleTabChange("sell")}
        />

        {/* Search Bar with Filters */}
        <MobileSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() =>
            Alert.alert("Campus Filters", "Filter by AAU, ASTU, Hawassa, or price.")
          }
        />

        {/* Category Carousel */}
        <MobileCategoryList
          selectedId={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 2-Column Product Grid */}
        <MobileProductGrid
          products={filteredProducts}
          onProductPress={handleProductPress}
          onViewAllPress={() => Alert.alert("All Products", "Viewing all campus items.")}
        />
      </ScrollView>

      {/* Bottom 5-Tab Navigation Bar */}
      <MobileBottomNav
        currentTab={activeTab}
        onTabChange={handleTabChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
