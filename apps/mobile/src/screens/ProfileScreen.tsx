import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  User,
  ShieldCheck,
  Star,
  MapPin,
  Package,
  Heart,
  Globe,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";

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
  } = useApp();

  const savedProducts = products.filter((p) => favorites[p.id]);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Student Profile Card */}
      {isAuthenticated && user ? (
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>{user.name}</Text>
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={11} color="#FFFFFF" />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.studentEmail}>{user.email}</Text>
              <View style={styles.campusRow}>
                <MapPin size={11} color="#1D6BF3" />
                <Text style={styles.campusText}>{user.campus}</Text>
              </View>
            </View>
          </View>

          {/* Trust Score & Stats Banner */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statTitleRow}>
                <Star size={13} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.statValue}>{user.trustScore}%</Text>
              </View>
              <Text style={styles.statLabel}>Escrow Trust Score</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user.tradesCompleted}</Text>
              <Text style={styles.statLabel}>Safe Trades</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{savedProducts.length}</Text>
              <Text style={styles.statLabel}>Saved Items</Text>
            </View>
          </View>
        </View>
      ) : (
        /* Guest State */
        <View style={styles.guestCard}>
          <User size={44} color="#94A3B8" />
          <Text style={styles.guestTitle}>Sign in to your Student Account</Text>
          <Text style={styles.guestSubtitle}>
            Unlock 100% SafeTrade Escrow, create campus listings, and track your secret pickup PINs.
          </Text>
          <TouchableOpacity
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.88}
            style={styles.signInBtn}
          >
            <LogIn size={15} color="#FFFFFF" />
            <Text style={styles.signInBtnText}>Sign In / Register</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Saved Items Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Heart size={16} color="#EF4444" fill="#EF4444" />
            <Text style={styles.sectionTitle}>Saved Listings ({savedProducts.length})</Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab("explore")}>
            <Text style={styles.viewMoreText}>Browse More</Text>
          </TouchableOpacity>
        </View>

        {savedProducts.length === 0 ? (
          <Text style={styles.emptySavedText}>No saved items yet. Tap the heart icon on any card.</Text>
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
                <Text numberOfLines={1} style={styles.savedItemTitle}>
                  {p.title}
                </Text>
                <Text style={styles.savedItemPrice}>ETB {p.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Campus Settings & Preferences */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          onPress={() => setCampusModalVisible(true)}
          style={styles.menuItem}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#EFF6FF" }]}>
              <MapPin size={16} color="#1D6BF3" />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>University Campus Hub</Text>
              <Text style={styles.menuItemSubtitle}>{user?.campus || "Select campus"}</Text>
            </View>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "SafeTrade Escrow Guarantee",
              "1. Buyer funds are held in escrow until physical handover.\n2. Seller earns 100% of price (0% seller fee).\n3. 4-digit PIN ensures zero dispute risk."
            )
          }
          style={styles.menuItem}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#ECFDF5" }]}>
              <ShieldCheck size={16} color="#10B981" />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>SafeTrade Buyer & Seller Protection</Text>
              <Text style={styles.menuItemSubtitle}>Escrow security terms & guidelines</Text>
            </View>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Campus Support Desk", "Need help? Visit the AAU 4 Kilo or AAiT 5 Kilo campus library desk, or call +251 911 000 000.")
          }
          style={styles.menuItem}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.menuIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Sparkles size={16} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Campus Intermediary Support</Text>
              <Text style={styles.menuItemSubtitle}>Contact campus desk runner</Text>
            </View>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.logoutItem]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconBox, { backgroundColor: "#FEE2E2" }]}>
                <LogOut size={16} color="#EF4444" />
              </View>
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    backgroundColor: "#1D6BF3",
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
    color: "#0F172A",
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
    color: "#64748B",
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
    fontWeight: "600",
    color: "#1D6BF3",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
  },
  guestCard: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 10,
  },
  guestSubtitle: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
    marginBottom: 16,
  },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1D6BF3",
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  signInBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 16,
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
    color: "#0F172A",
  },
  viewMoreText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D6BF3",
  },
  emptySavedText: {
    fontSize: 11,
    color: "#94A3B8",
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
    backgroundColor: "#F1F5F9",
    marginBottom: 6,
  },
  savedItemTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  savedItemPrice: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1D6BF3",
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    color: "#0F172A",
  },
  menuItemSubtitle: {
    fontSize: 10,
    color: "#64748B",
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
});
