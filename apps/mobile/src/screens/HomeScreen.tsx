import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { ShieldCheck, Building2, Bell, Radio, Megaphone, Sparkles, Download } from "lucide-react-native";
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
import { MobileLostFoundModal } from "../components/MobileLostFoundModal";

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
    isLostFoundModalVisible,
    setLostFoundModalVisible,
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    orders,
    colors,
    t,
    broadcasts,
    refreshLiveProducts,
    refreshLiveBroadcasts,
    isLiveConnected,
    language,
    isUpdateAvailable,
    serverRelease,
    setUpdateModalVisible,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshLiveProducts(), refreshLiveBroadcasts()]);
    setIsRefreshing(false);
  };

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
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
          >
            {/* In-App Update Alert Notification Banner */}
            {isUpdateAvailable && serverRelease && (
              <Animatable.View
                animation="bounceIn"
                duration={500}
                style={[
                  styles.updateAlertBanner,
                  {
                    backgroundColor: isDark ? "#1E293B" : "#EFF6FF",
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.updateAlertLeft}>
                  <View style={[styles.updateAlertIcon, { backgroundColor: colors.primary }]}>
                    <Download size={14} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.updateAlertTitle, { color: colors.textPrimary }]}>
                      {language === "am"
                        ? `አዲስ ስሪት ተገኝቷል (${serverRelease.version})`
                        : `New Update Available (${serverRelease.version})`}
                    </Text>
                    <Text style={[styles.updateAlertSub, { color: colors.textSecondary }]} numberOfLines={1}>
                      {serverRelease.title || "LiveSync & Device Photo Upload"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setUpdateModalVisible(true)}
                  style={[styles.updateAlertBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.updateAlertBtnText}>
                    {language === "am" ? "አዘምን" : "Update"}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            )}

            {/* Live Campus Breaking News & Admin Announcements */}
            {broadcasts && broadcasts.length > 0 && (
              <Animatable.View
                animation="fadeInDown"
                duration={400}
                style={[
                  styles.newsCard,
                  {
                    backgroundColor: isDark ? colors.cardElevated : "#F0FDF4",
                    borderColor: isDark ? colors.border : "#BBF7D0",
                  },
                ]}
              >
                <View style={styles.newsCardHeader}>
                  <View style={styles.newsLiveBadge}>
                    <View style={styles.pulseLiveDot} />
                    <Text style={styles.newsLiveBadgeText}>
                      {language === "am" ? "የካምፓስ ዜና" : "Campus Alert"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.priorityPill,
                      {
                        backgroundColor:
                          broadcasts[0].priority === "URGENT"
                            ? "rgba(239, 68, 68, 0.15)"
                            : "rgba(16, 185, 129, 0.15)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityPillText,
                        {
                          color:
                            broadcasts[0].priority === "URGENT"
                              ? "#EF4444"
                              : "#10B981",
                        },
                      ]}
                    >
                      {broadcasts[0].priority}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.newsCardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {broadcasts[0].title}
                </Text>
                <Text style={[styles.newsCardMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                  {broadcasts[0].message}
                </Text>
              </Animatable.View>
            )}

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
      <MobileLostFoundModal
        visible={isLostFoundModalVisible}
        onClose={() => setLostFoundModalVisible(false)}
      />
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
  },
  newsCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  newsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  newsLiveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pulseLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#10B981",
  },
  newsLiveBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#059669",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityPillText: {
    fontSize: 9,
    fontWeight: "900",
  },
  newsCardTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 2,
  },
  newsCardMessage: {
    fontSize: 11,
    lineHeight: 15,
    marginHorizontal: 8,
  },
  updateAlertBanner: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  updateAlertLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  updateAlertIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  updateAlertSub: {
    fontSize: 10,
    marginTop: 1,
  },
  updateAlertBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  updateAlertBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
