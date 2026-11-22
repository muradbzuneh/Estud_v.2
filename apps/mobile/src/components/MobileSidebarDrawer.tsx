import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  X,
  Home,
  Compass,
  PlusCircle,
  ShieldCheck,
  Search,
  MapPin,
  Bell,
  Moon,
  Sun,
  Globe,
  RefreshCw,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { EstudLogo } from "./EstudLogo";

interface MobileSidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 330);

export function MobileSidebarDrawer({ visible, onClose }: MobileSidebarDrawerProps) {
  const {
    user,
    isAuthenticated,
    logout,
    setAuthModalVisible,
    activeTab,
    setActiveTab,
    currentCampus,
    setCampusModalVisible,
    orders,
    unreadNotificationsCount,
    setNotificationsModalVisible,
    setLostFoundModalVisible,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    appVersion,
    checkForUpdates,
    colors,
  } = useApp();

  if (!visible) return null;

  const isDark = theme === "dark";
  const activeOrdersCount = orders.filter((o) => o.status !== "completed").length;

  const handleNav = (tab: "home" | "explore" | "sell" | "activity" | "profile") => {
    setActiveTab(tab);
    onClose();
  };

  const handleOpenLostFound = () => {
    onClose();
    setLostFoundModalVisible(true);
  };

  const handleOpenCampusModal = () => {
    onClose();
    setCampusModalVisible(true);
  };

  const handleOpenNotifications = () => {
    onClose();
    setNotificationsModalVisible(true);
  };

  const handleAuthPress = () => {
    onClose();
    setAuthModalVisible(true);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Dimmed backdrop - taps close the drawer */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Sliding Drawer Container */}
        <Animatable.View
          animation="slideInLeft"
          duration={240}
          style={[
            styles.drawerContent,
            {
              width: DRAWER_WIDTH,
              backgroundColor: colors.card,
              borderRightColor: colors.border,
            },
          ]}
        >
          {/* Top Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.logoRow}>
              <EstudLogo size={28} showText={true} variant={isDark ? "dark" : "light"} />
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9" }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollArea}
          >
            {/* User Profile Card */}
            {isAuthenticated && user ? (
              <TouchableOpacity
                onPress={() => handleNav("profile")}
                activeOpacity={0.8}
                style={[
                  styles.userCard,
                  {
                    backgroundColor: isDark ? "#1E293B" : "#F8FAFC",
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.userAvatarText}>
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text numberOfLines={1} style={[styles.userName, { color: colors.textPrimary }]}>
                      {user.name}
                    </Text>
                    <View style={styles.verifiedMiniPill}>
                      <ShieldCheck size={10} color="#10B981" />
                    </View>
                  </View>
                  <Text numberOfLines={1} style={[styles.userEmail, { color: colors.textSecondary }]}>
                    {user.email}
                  </Text>
                  <View style={styles.userCampusRow}>
                    <MapPin size={11} color={colors.primary} />
                    <Text numberOfLines={1} style={[styles.userCampusText, { color: colors.primary }]}>
                      {user.campus.split("(")[0].trim()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.guestCard,
                  {
                    backgroundColor: isDark ? "#1E293B" : "#EFF6FF",
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.guestTop}>
                  <Sparkles size={20} color={colors.primary} />
                  <Text style={[styles.guestTitle, { color: colors.textPrimary }]}>
                    {language === "am" ? "የኢስቱድ ተማሪ ይሁኑ" : "Welcome to Estud!"}
                  </Text>
                </View>
                <Text style={[styles.guestSub, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "ዕቃ ለመሸጥ፣ በሴፍ ትሬድ ጥበቃ ለመግዛትና ፒን ለመቀበል ይግቡ።"
                    : "Sign in with your campus account for SafeTrade Buyer Protection."}
                </Text>
                <TouchableOpacity
                  onPress={handleAuthPress}
                  style={[styles.guestBtn, { backgroundColor: colors.primary }]}
                >
                  <LogIn size={14} color="#FFFFFF" />
                  <Text style={styles.guestBtnText}>{t.signIn}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Section 1: Main Marketplace Navigation */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {language === "am" ? "የገበያ አሰሳ" : "Marketplace"}
              </Text>

              <TouchableOpacity
                onPress={() => handleNav("home")}
                style={[
                  styles.navItem,
                  activeTab === "home" && {
                    backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                  },
                ]}
              >
                <Home
                  size={19}
                  color={activeTab === "home" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.navItemText,
                    {
                      color: activeTab === "home" ? colors.primary : colors.textPrimary,
                      fontWeight: activeTab === "home" ? "700" : "500",
                    },
                  ]}
                >
                  {language === "am" ? "መነሻ ገበያ" : "Home Marketplace"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNav("explore")}
                style={[
                  styles.navItem,
                  activeTab === "explore" && {
                    backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                  },
                ]}
              >
                <Compass
                  size={19}
                  color={activeTab === "explore" ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.navItemText,
                    {
                      color: activeTab === "explore" ? colors.primary : colors.textPrimary,
                      fontWeight: activeTab === "explore" ? "700" : "500",
                    },
                  ]}
                >
                  {language === "am" ? "ዝርዝሮችን ያስሱ" : "Explore Catalog"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNav("sell")}
                style={[
                  styles.navItem,
                  activeTab === "sell" && {
                    backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                  },
                ]}
              >
                <PlusCircle
                  size={19}
                  color={activeTab === "sell" ? colors.primary : colors.textSecondary}
                />
                <View style={styles.navItemRow}>
                  <Text
                    style={[
                      styles.navItemText,
                      {
                        color: activeTab === "sell" ? colors.primary : colors.textPrimary,
                        fontWeight: activeTab === "sell" ? "700" : "500",
                      },
                    ]}
                  >
                    {language === "am" ? "ዕቃ ይሽጡ" : "Sell an Item"}
                  </Text>
                  <View style={styles.commissionPill}>
                    <Text style={styles.commissionPillText}>0% Fee</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleNav("activity")}
                style={[
                  styles.navItem,
                  activeTab === "activity" && {
                    backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                  },
                ]}
              >
                <ShieldCheck
                  size={19}
                  color={activeTab === "activity" ? colors.primary : colors.textSecondary}
                />
                <View style={styles.navItemRow}>
                  <Text
                    style={[
                      styles.navItemText,
                      {
                        color: activeTab === "activity" ? colors.primary : colors.textPrimary,
                        fontWeight: activeTab === "activity" ? "700" : "500",
                      },
                    ]}
                  >
                    {language === "am" ? "የተጠበቁ ትዕዛዞች" : "SafeTrade Orders"}
                  </Text>
                  {activeOrdersCount > 0 && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{activeOrdersCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Section 2: Campus Services */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {language === "am" ? "የካምፓስ አገልግሎቶች" : "Campus Services"}
              </Text>

              <TouchableOpacity
                onPress={handleOpenLostFound}
                style={styles.navItem}
              >
                <Search size={19} color="#10B981" />
                <View style={styles.navItemRow}>
                  <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                    {language === "am" ? "የጠፉና የተገኙ ዕቃዎች" : "Lost & Found Hub"}
                  </Text>
                  <View style={[styles.commissionPill, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
                    <Text style={[styles.commissionPillText, { color: "#10B981" }]}>Active</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenCampusModal}
                style={styles.navItem}
              >
                <MapPin size={19} color="#F59E0B" />
                <View style={styles.navItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                      {language === "am" ? "የካምፓስ ደላላ ዴስክ" : "Campus SafeTrade Desk"}
                    </Text>
                    <Text numberOfLines={1} style={[styles.subValue, { color: colors.textMuted }]}>
                      {currentCampus.split("(")[0].trim()}
                    </Text>
                  </View>
                  <ChevronRight size={15} color={colors.textMuted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenNotifications}
                style={styles.navItem}
              >
                <Bell size={19} color={colors.primary} />
                <View style={styles.navItemRow}>
                  <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                    {language === "am" ? "ማሳወቂያዎች" : "Notifications"}
                  </Text>
                  {unreadNotificationsCount > 0 && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{unreadNotificationsCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Section 3: Preferences & Quick Controls */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {language === "am" ? "ቅንብሮች" : "Preferences"}
              </Text>

              {/* Language Switcher */}
              <TouchableOpacity
                onPress={toggleLanguage}
                style={styles.navItem}
              >
                <Globe size={19} color={colors.textSecondary} />
                <View style={styles.navItemRow}>
                  <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                    Language / ቋንቋ
                  </Text>
                  <View style={[styles.controlPill, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
                    <Text style={[styles.controlPillText, { color: colors.primary }]}>
                      {language === "en" ? "English 🇺🇸" : "አማርኛ 🇪🇹"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Theme Mode Toggle */}
              <TouchableOpacity
                onPress={toggleTheme}
                style={styles.navItem}
              >
                {isDark ? (
                  <Moon size={19} color="#38BDF8" />
                ) : (
                  <Sun size={19} color="#F59E0B" />
                )}
                <View style={styles.navItemRow}>
                  <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                    {isDark ? "Dark Midnight" : "Light Default"}
                  </Text>
                  <View style={[styles.controlPill, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
                    <Text style={[styles.controlPillText, { color: colors.textSecondary }]}>
                      {isDark ? "Dark" : "Light"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Version & Update Diagnostic */}
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  checkForUpdates(false);
                }}
                style={styles.navItem}
              >
                <RefreshCw size={18} color={colors.textMuted} />
                <View style={styles.navItemRow}>
                  <View>
                    <Text style={[styles.navItemText, { color: colors.textPrimary }]}>
                      App Release
                    </Text>
                    <Text style={[styles.subValue, { color: colors.textMuted }]}>
                      {appVersion} &bull; SafeTrade
                    </Text>
                  </View>
                  <View style={[styles.controlPill, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
                    <Text style={[styles.controlPillText, { color: colors.primary, fontSize: 10 }]}>
                      Check
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bottom Sign Out / In Action */}
            <View style={[styles.bottomSection, { borderTopColor: colors.border }]}>
              {isAuthenticated ? (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.logoutBtn}
                >
                  <LogOut size={16} color="#EF4444" />
                  <Text style={styles.logoutText}>{t.signOut}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleAuthPress}
                  style={[styles.loginBtn, { backgroundColor: colors.primary }]}
                >
                  <LogIn size={16} color="#FFFFFF" />
                  <Text style={styles.loginBtnText}>{t.signIn}</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  drawerContent: {
    height: "100%",
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
  },
  verifiedMiniPill: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    padding: 2,
    borderRadius: 4,
  },
  userEmail: {
    fontSize: 11,
  },
  userCampusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  userCampusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  guestCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    gap: 6,
  },
  guestTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  guestSub: {
    fontSize: 11,
    lineHeight: 16,
  },
  guestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  guestBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    marginBottom: 2,
  },
  navItemRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navItemText: {
    fontSize: 13.5,
  },
  commissionPill: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  commissionPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  badgePill: {
    backgroundColor: "#10B981",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subValue: {
    fontSize: 10.5,
    marginTop: 1,
  },
  controlPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  controlPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  bottomSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EF4444",
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
