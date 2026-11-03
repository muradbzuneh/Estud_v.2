import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { ShieldCheck, Building2 } from "lucide-react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/ToastConfig";

import { useApp } from "../context/AppContext";
import { MobileHeader } from "../components/MobileHeader";
import { MobileHeroCard } from "../components/MobileHeroCard";
import { MobileSearchBar } from "../components/MobileSearchBar";
import { MobileCategoryList } from "../components/MobileCategoryList";
import { MobileProductGrid } from "../components/MobileProductGrid";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { MobileProductDetailModal } from "../components/MobileProductDetailModal";
import { MobileAuthModal } from "../components/MobileAuthModal";
import { MobileCampusModal } from "../components/MobileCampusModal";
import { MobileUpdateModal } from "../components/MobileUpdateModal";

import { ExploreScreen } from "./ExploreScreen";
import { SellScreen } from "./SellScreen";
import { ActivityScreen } from "./ActivityScreen";
import { ProfileScreen } from "./ProfileScreen";

export function HomeScreen() {
  const {
    user,
    isAuthenticated,
    activeTab,
    setActiveTab,
    currentCampus,
    setCurrentCampus,
    isCampusModalVisible,
    setCampusModalVisible,
    setAuthModalVisible,
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    orders,
    colors,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter products for the home tab
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "more" ||
      item.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeOrdersCount = orders.filter((o) => o.status !== "completed").length;
  const isDark = colors.mode === "dark";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.headerBg }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Persistent Top Mobile Header */}
      <MobileHeader
        campusName={currentCampus.split("(")[0].trim()}
        unreadCount={activeOrdersCount}
        isAuthenticated={isAuthenticated}
        avatarUrl={user?.avatarUrl}
        onCampusPress={() => setCampusModalVisible(true)}
        onNotificationsPress={() => setActiveTab("activity")}
        onProfilePress={() => setActiveTab("profile")}
        onAuthPress={() => setAuthModalVisible(true)}
      />

      {/* Screen Body depending on active tab */}
      <View style={[styles.screenBody, { backgroundColor: colors.background }]}>
        {activeTab === "home" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Responsive Full-Width Hero Card */}
            <MobileHeroCard
              onExplorePress={() => {
                setSelectedCategory("all");
                setActiveTab("explore");
              }}
              onSellPress={() => setActiveTab("sell")}
            />

            {/* Live Search Bar */}
            <MobileSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={() => setCampusModalVisible(true)}
            />

            {/* Interactive Category Carousel */}
            <MobileCategoryList
              selectedId={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* SafeTrade Value Props Strip */}
            <Animatable.View
              animation="fadeInUp"
              duration={450}
              style={[
                styles.trustStrip,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.trustItem}>
                <ShieldCheck size={16} color="#10B981" />
                <View>
                  <Text style={[styles.trustTitle, { color: colors.textPrimary }]}>{t.trustEscrowTitle}</Text>
                  <Text style={[styles.trustSub, { color: colors.textSecondary }]}>{t.trustEscrowSub}</Text>
                </View>
              </View>

              <View style={[styles.trustDivider, { backgroundColor: colors.border }]} />

              <View style={styles.trustItem}>
                <Building2 size={16} color={colors.primary} />
                <View>
                  <Text style={[styles.trustTitle, { color: colors.textPrimary }]}>{t.trustHubTitle}</Text>
                  <Text style={[styles.trustSub, { color: colors.textSecondary }]}>{t.trustHubSub}</Text>
                </View>
              </View>
            </Animatable.View>

            {/* 2-Column Responsive Product Grid */}
            <MobileProductGrid
              products={filteredProducts}
              favorites={favorites}
              onProductPress={(id) => {
                const found = products.find((p) => p.id === id);
                if (found) setSelectedProduct(found);
              }}
              onFavoritePress={toggleFavorite}
              onViewAllPress={() => setActiveTab("explore")}
              title={t.featuredTitle}
            />
          </ScrollView>
        )}

        {activeTab === "explore" && <ExploreScreen />}
        {activeTab === "sell" && <SellScreen />}
        {activeTab === "activity" && <ActivityScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </View>

      {/* Bottom 5-Tab Navigation Bar */}
      <MobileBottomNav
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Global Modals */}
      <MobileProductDetailModal />
      <MobileAuthModal />
      <MobileUpdateModal />
      <MobileCampusModal
        visible={isCampusModalVisible}
        selectedCampus={currentCampus}
        onSelectCampus={setCurrentCampus}
        onClose={() => setCampusModalVisible(false)}
      />

      {/* Modern Open-Source Toast Notification Layer */}
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  screenBody: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  trustStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  trustItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: "800",
  },
  trustSub: {
    fontSize: 9,
    marginTop: 1,
  },
  trustDivider: {
    width: 1,
    height: 28,
    marginHorizontal: 8,
  },
});
