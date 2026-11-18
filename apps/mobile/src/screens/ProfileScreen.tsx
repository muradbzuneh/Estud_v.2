import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  User,
  ShieldCheck,
  Star,
  MapPin,
  Heart,
  Globe,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  RefreshCw,
  Download,
  CheckCircle2,
  Zap,
  CreditCard,
  Search,
  Navigation,
  Wifi,
  Server,
  Edit3,
  Check,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { showInfoToast, showSuccessToast } from "../utils/toast";
import {
  getApiBaseUrl,
  setCustomApiBaseUrl,
  pingBackendServer,
} from "../utils/api";

export function ProfileScreen() {
  const {
    user,
    isAuthenticated,
    logout,
    setAuthModalVisible,
    setCampusModalVisible,
    products,
    favorites,
    setSelectedProduct,
    setActiveTab,
    theme,
    toggleTheme,
    colors,
    language,
    setLanguage,
    t,
    appVersion,
    checkForUpdates,
    createOrder,
    setLostFoundModalVisible,
    isLiveConnected,
  } = useApp();

  const [isTestingPing, setIsTestingPing] = useState(false);
  const [isServerModalOpen, setServerModalOpen] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(getApiBaseUrl());

  const handleTestConnection = async () => {
    setIsTestingPing(true);
    const result = await pingBackendServer();
    setIsTestingPing(false);
    if (result.ok) {
      showSuccessToast(
        language === "am" ? "የሰርቨር ግንኙነት ተሳክቷል!" : "Backend Connected!",
        `Host responded LIVE at ${result.url}`
      );
      checkForUpdates(true);
    } else {
      showInfoToast(
        language === "am" ? "ከሰርቨር ጋር መገናኘት አልተቻለም" : "Backend Offline / Unreachable",
        `${result.statusText} at ${result.url}. Connect to same Wi-Fi / Hotspot.`
      );
    }
  };

  const handleSaveServerUrl = () => {
    const trimmed = serverUrlInput.trim();
    if (!trimmed) return;
    setCustomApiBaseUrl(trimmed);
    setServerModalOpen(false);
    showSuccessToast(
      language === "am" ? "ሰርቨር ተዘምኗል" : "Server Endpoint Saved",
      `Connecting to ${trimmed}`
    );
    handleTestConnection();
  };

  const handleResetServerUrl = () => {
    setCustomApiBaseUrl(null);
    setServerUrlInput(getApiBaseUrl());
    setServerModalOpen(false);
    showInfoToast("Reset to Default", "Reverted to default IP");
    handleTestConnection();
  };

  const savedProducts = products.filter((p) => favorites[p.id]);
  const isDark = colors.mode === "dark";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Student Profile Card with Animatable Motion */}
      {isAuthenticated && user ? (
        <Animatable.View
          animation="fadeInDown"
          duration={500}
          style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.profileTop}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user.name.split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.studentName, { color: colors.textPrimary }]}>{user.name}</Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={11} color="#FFFFFF" />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              </View>
              <Text style={[styles.studentEmail, { color: colors.textSecondary }]}>{user.email}</Text>
              <View style={styles.campusRow}>
                <MapPin size={11} color={colors.primary} />
                <Text style={[styles.campusText, { color: colors.primary }]}>{user.campus}</Text>
              </View>
            </View>
          </View>

          {/* Trust Score & Stats Banner */}
          <View style={[styles.statsRow, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
            <View style={styles.statBox}>
              <View style={styles.statTitleRow}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user.trustScore}%</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.trustScoreLabel}</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{user.tradesCompleted}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.safeTradesLabel}</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{savedProducts.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.savedItemsLabel}</Text>
            </View>
          </View>
        </Animatable.View>
      ) : (
        /* Guest Mode Card */
        <Animatable.View
          animation="fadeInDown"
          duration={500}
          style={[styles.guestCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <User size={44} color={colors.textMuted} />
          <Text style={[styles.guestTitle, { color: colors.textPrimary }]}>
            {language === "am" ? "ወደ ተማሪ መለያዎ ይግቡ" : "Sign in to your Student Account"}
          </Text>
          <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
            {language === "am"
              ? "የ100% ሴፍ ትሬድ ኤስክሮው ጥበቃን ይክፈቱ እና ዕቃዎችን በካምፓስ ይሽጡ።"
              : "Unlock 100% SafeTrade Escrow, create campus listings, and track your secret pickup PINs."}
          </Text>
          <TouchableOpacity
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.88}
            style={[styles.signInBtn, { backgroundColor: colors.primary }]}
          >
            <LogIn size={15} color="#FFFFFF" />
            <Text style={styles.signInBtnText}>{t.signIn}</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      {/* App Preferences: Theme & Language (as requested) */}
      <Animatable.View
        animation="fadeInUp"
        duration={550}
        style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.sectionHeaderTitle, { color: colors.textPrimary }]}>
          {t.sectionPreferences}
        </Text>

        {/* Theme Mode Toggle (Default: Light) */}
        <View style={styles.preferenceRow}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.prefIconBox, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7" }]}>
              {isDark ? <Moon size={16} color="#FBBF24" /> : <Sun size={16} color="#F59E0B" />}
            </View>
            <View>
              <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>{t.themeSetting}</Text>
              <Text style={[styles.prefSub, { color: colors.textSecondary }]}>
                {isDark ? t.themeDark : t.themeLight}
              </Text>
            </View>
          </View>

          {/* Single Theme Toggle Switch */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.8}
            style={[
              styles.singleToggleTrack,
              {
                backgroundColor: isDark ? colors.primary : "#E2E8F0",
              },
            ]}
          >
            <View
              style={[
                styles.singleToggleThumb,
                {
                  transform: [{ translateX: isDark ? 20 : 0 }],
                  backgroundColor: "#FFFFFF",
                },
              ]}
            >
              {isDark ? (
                <Moon size={13} color={colors.primary} />
              ) : (
                <Sun size={13} color="#F59E0B" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Language Switcher (English vs Amharic) */}
        <View style={[styles.preferenceRow, { borderBottomWidth: 0 }]}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.prefIconBox, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#EFF6FF" }]}>
              <Globe size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>{t.languageSetting}</Text>
              <Text style={[styles.prefSub, { color: colors.textSecondary }]}>
                {language === "am" ? "አማርኛ (Amharic)" : "English (English)"}
              </Text>
            </View>
          </View>

          {/* Normal Standard Language Sliding Toggle */}
          <TouchableOpacity
            onPress={() => setLanguage(language === "en" ? "am" : "en")}
            activeOpacity={0.8}
            style={[
              styles.singleToggleTrack,
              {
                backgroundColor: language === "am" ? "#10B981" : colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.singleToggleThumb,
                {
                  transform: [{ translateX: language === "am" ? 20 : 0 }],
                  backgroundColor: "#FFFFFF",
                },
              ]}
            >
              <Text style={{ fontSize: 9, fontWeight: "900", color: language === "am" ? "#10B981" : colors.primary }}>
                {language === "am" ? "አማ" : "EN"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* App Version & Check for Updates Section (as requested) */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.updateCardTop}>
          <View style={styles.preferenceLeft}>
            <View style={[styles.prefIconBox, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5" }]}>
              <Sparkles size={16} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.prefTitle, { color: colors.textPrimary }]}>{t.appVersionTitle}</Text>
              <Text style={[styles.prefSub, { color: colors.textSecondary }]}>{appVersion} &bull; SafeTrade Release</Text>
            </View>
          </View>
          <View
            style={[
              styles.verifiedTag,
              {
                backgroundColor: isLiveConnected ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                borderColor: isLiveConnected ? "#10B981" : "#F59E0B",
              },
            ]}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: isLiveConnected ? "#10B981" : "#F59E0B",
                marginRight: 4,
              }}
            />
            <Text style={[styles.verifiedTagText, { color: isLiveConnected ? "#10B981" : "#D97706" }]}>
              {isLiveConnected ? "Live" : "Local Sync"}
            </Text>
          </View>
        </View>

        {/* Real-time Backend Host Endpoint & Diagnostic Ping */}
        <View
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 10,
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#F1F5F9",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Server size={12} color={colors.primary} />
              <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "700", textTransform: "uppercase" }}>
                Backend Server
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setServerUrlInput(getApiBaseUrl());
                setServerModalOpen(true);
              }}
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Edit3 size={11} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.primary }}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "600", color: colors.textPrimary, marginBottom: 8 }}>
            {getApiBaseUrl()}
          </Text>

          <TouchableOpacity
            onPress={handleTestConnection}
            disabled={isTestingPing}
            activeOpacity={0.8}
            style={{
              paddingVertical: 7,
              borderRadius: 6,
              backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#DBEAFE",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            {isTestingPing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Wifi size={13} color={colors.primary} />
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
                  Test Server Ping
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Dedicated Update Button */}
        <TouchableOpacity
          onPress={() => checkForUpdates(false)}
          activeOpacity={0.88}
          style={[styles.updateBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
        >
          <RefreshCw size={14} color="#FFFFFF" />
          <Text style={styles.updateBtnText}>{t.btnCheckUpdates}</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Backend Server Configuration Modal */}
      <Modal
        visible={isServerModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setServerModalOpen(false)}
      >
        <View style={styles.serverModalOverlay}>
          <View style={[styles.serverModalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Server size={18} color={colors.primary} />
              <Text style={[styles.serverModalTitle, { color: colors.textPrimary }]}>
                Configure Backend Server
              </Text>
            </View>
            <Text style={[styles.serverModalDesc, { color: colors.textSecondary }]}>
              Enter your computer host IP (e.g. http://192.168.137.89:3000) or public deployment URL.
            </Text>

            <TextInput
              value={serverUrlInput}
              onChangeText={setServerUrlInput}
              placeholder="http://192.168.137.89:3000"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.serverModalInput,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />

            <View style={styles.serverModalBtnRow}>
              <TouchableOpacity
                onPress={handleResetServerUrl}
                style={[styles.serverModalSecondaryBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.serverModalSecondaryBtnText, { color: colors.textSecondary }]}>
                  Reset Default
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveServerUrl}
                style={[styles.serverModalPrimaryBtn, { backgroundColor: colors.primary }]}
              >
                <Check size={14} color="#FFFFFF" />
                <Text style={styles.serverModalPrimaryBtnText}>Save & Ping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Saved Items Section */}
      <Animatable.View
        animation="fadeInUp"
        duration={650}
        style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Heart size={16} color="#EF4444" fill="#EF4444" />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t.savedListingsTitle} ({savedProducts.length})
            </Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab("explore")}>
            <Text style={[styles.viewMoreText, { color: colors.primary }]}>{t.viewAll}</Text>
          </TouchableOpacity>
        </View>

        {savedProducts.length === 0 ? (
          <Text style={[styles.emptySavedText, { color: colors.textMuted }]}>
            {language === "am"
              ? "ምንም የተቀመጡ ዕቃዎች የሉም። በዕቃዎች ላይ የልብ ምልክቱን ይጫኑ።"
              : "No saved items yet. Tap the heart icon on any product card."}
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedScroll}>
            {savedProducts.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedProduct(p)}
                activeOpacity={0.85}
                style={styles.savedItemCard}
              >
                <Image source={{ uri: p.imageUrl }} style={styles.savedItemImg} />
                <Text numberOfLines={1} style={[styles.savedItemTitle, { color: colors.textPrimary }]}>
                  {p.title}
                </Text>
                <Text style={[styles.savedItemPrice, { color: colors.primary }]}>
                  ETB {p.price.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Animatable.View>

      {/* Campus Hub & Support Menu */}
      <Animatable.View
        animation="fadeInUp"
        duration={700}
        style={[styles.menuSection, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <TouchableOpacity
          onPress={() => setCampusModalVisible(true)}
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#EFF6FF" }]}>
              <MapPin size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.menuItemTitle, { color: colors.textPrimary }]}>{t.campusLabel}</Text>
              <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                {user?.campus || "AAU 4 Kilo (Science)"}
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            showSuccessToast(
              t.safeTradeProtectionGuarantee,
              language === "am"
                ? "100% የገዢ ጥበቃ እና 0% የሻጭ ክፍያ በካምፓስ ዴስክ"
                : "100% Buyer protection & 0% seller fee with campus desk handover"
            )
          }
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5" }]}>
              <ShieldCheck size={16} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.menuItemTitle, { color: colors.textPrimary }]}>
                {t.safeTradeProtectionGuarantee}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                Verified Escrow guidelines
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            showInfoToast(
              t.campusIntermediarySupport,
              language === "am"
                ? "የአዲስ አበባ ዩኒቨርሲቲ ወይም የአዳማ ሳይንስ ዴስክን ያነጋግሩ"
                : "Visit your campus library intermediary desk or student runner"
            )
          }
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7" }]}>
              <Sparkles size={16} color="#F59E0B" />
            </View>
            <View>
              <Text style={[styles.menuItemTitle, { color: colors.textPrimary }]}>
                {t.campusIntermediarySupport}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                Contact verified campus runner
              </Text>
            </View>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity onPress={logout} style={[styles.menuItem, styles.logoutItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2" }]}>
                <LogOut size={16} color="#EF4444" />
              </View>
              <Text style={styles.logoutText}>{t.signOut}</Text>
            </View>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "800",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  studentEmail: {
    fontSize: 11,
    marginTop: 2,
  },
  campusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  campusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "900",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  guestCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
  },
  guestSubtitle: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 16,
  },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  signInBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 12,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  preferenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  prefIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  prefTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  prefSub: {
    fontSize: 10,
    marginTop: 1,
  },
  singleToggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  singleToggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  singleLangToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  singleLangText: {
    fontSize: 11,
    fontWeight: "700",
  },
  singleLangBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  singleLangBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  pillSwitcher: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
  },
  pillOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
  },
  pillOptionActive: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillOptionText: {
    fontSize: 11,
    fontWeight: "800",
  },
  updateCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  verifiedTagText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#059669",
  },
  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 14,
  },
  updateBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  viewMoreText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptySavedText: {
    fontSize: 11,
    paddingVertical: 8,
  },
  savedScroll: {
    flexDirection: "row",
  },
  savedItemCard: {
    width: 110,
    marginRight: 10,
  },
  savedItemImg: {
    width: 110,
    height: 90,
    borderRadius: 12,
    marginBottom: 6,
  },
  savedItemTitle: {
    fontSize: 11,
    fontWeight: "700",
  },
  savedItemPrice: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },
  menuSection: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  menuItemSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#EF4444",
  },
  serverModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  serverModalContent: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  serverModalTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  serverModalDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  serverModalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 16,
  },
  serverModalBtnRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  serverModalSecondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  serverModalSecondaryBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  serverModalPrimaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  serverModalPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
