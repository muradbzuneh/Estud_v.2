import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Compass,
  Plus,
  Clock,
  User,
  Star,
  MapPin,
  Building2,
} from "lucide-react-native";
import { MobileHeader } from "../components/MobileHeader";
import { MobileHeroCard } from "../components/MobileHeroCard";
import { MobileSearchBar } from "../components/MobileSearchBar";
import { MobileCategoryList } from "../components/MobileCategoryList";
import {
  MobileProductGrid,
  SAMPLE_MOBILE_PRODUCTS,
} from "../components/MobileProductGrid";
import { MobileProductItem } from "../components/MobileProductCard";
import { MobileBottomNav, MobileTab } from "../components/MobileBottomNav";

export function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [selectedProduct, setSelectedProduct] = useState<MobileProductItem | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // Filter products by active category and search keyword
  const filteredProducts = SAMPLE_MOBILE_PRODUCTS.filter((item) => {
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

  const handleProductPress = (id: string) => {
    const found = SAMPLE_MOBILE_PRODUCTS.find((p) => p.id === id);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const handleConfirmOrder = () => {
    setShowOrderSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Mobile Header */}
      <MobileHeader
        campusName="AAU 4 Kilo"
        unreadCount={2}
        onMenuPress={() => Alert.alert("Estud Menu", "Student navigation drawer with campus links.")}
        onNotificationsPress={() => setActiveTab("activity")}
        onProfilePress={() => setActiveTab("profile")}
      />

      {/* Main Tab Content */}
      {activeTab === "home" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Card */}
          <MobileHeroCard
            onExplorePress={() => setSelectedCategory("all")}
            onSellPress={() => setActiveTab("sell")}
          />

          {/* Search Bar with Filters */}
          <MobileSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() =>
              Alert.alert(
                "Filter Campus",
                "Select your university hub: AAU 4-Kilo, AAiT 5-Kilo, ASTU, or Hawassa."
              )
            }
          />

          {/* Category Carousel (Filters product list) */}
          <MobileCategoryList
            selectedId={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />

          {/* 2-Column Product Grid */}
          <MobileProductGrid
            products={filteredProducts}
            onProductPress={handleProductPress}
            onViewAllPress={() => setSelectedCategory("all")}
          />
        </ScrollView>
      )}

      {/* Tab: Explore */}
      {activeTab === "explore" && (
        <ScrollView contentContainerStyle={styles.centerTab}>
          <Compass size={48} color="#6C5CE7" />
          <Text style={styles.tabTitle}>Explore Ethiopian Campuses</Text>
          <Text style={styles.tabSubtitle}>
            Browse verified student deals at Addis Ababa University, ASTU Adama, Hawassa, and Jimma.
          </Text>
          <TouchableOpacity
            onPress={() => setActiveTab("home")}
            style={styles.actionPill}
          >
            <Text style={styles.actionPillText}>Browse All Items</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Tab: Sell */}
      {activeTab === "sell" && (
        <ScrollView contentContainerStyle={styles.centerTab}>
          <Plus size={48} color="#6C5CE7" />
          <Text style={styles.tabTitle}>List an Item (0% Seller Fee)</Text>
          <Text style={styles.tabSubtitle}>
            Snap photos of your unused books, electronics, or gear and earn 100% of your asking price.
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert("Camera Upload", "Opening camera to take photo of item...")}
            style={[styles.actionPill, { backgroundColor: "#6C5CE7" }]}
          >
            <Text style={styles.actionPillText}>Take Photo & List</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Tab: Activity (Escrow & PIN Tracker) */}
      {activeTab === "activity" && (
        <ScrollView contentContainerStyle={styles.activityContent}>
          <Text style={styles.activityHeader}>SafeTrade Escrow Activity</Text>

          {/* Active Order Card */}
          <View style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <Text style={styles.orderNumber}>Order #EST-84920</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>At Campus Hub</Text>
              </View>
            </View>

            <Text style={styles.orderItemTitle}>
              Laptop Dell Inspiron 15 (16GB RAM)
            </Text>
            <Text style={styles.orderLocation}>
              AAU 4 Kilo - Science Faculty Desk
            </Text>

            {/* Secret 4-Digit PIN */}
            <View style={styles.pinBox}>
              <View style={styles.pinHeader}>
                <Lock size={14} color="#6C5CE7" />
                <Text style={styles.pinLabel}>Secret 4-Digit Inspection PIN</Text>
              </View>
              <Text style={styles.pinCode}>7 2 9 4</Text>
              <Text style={styles.pinNotice}>
                Do not share until you inspect the item at the campus hub.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => Alert.alert("Order Verified", "Item confirmed! 100% payout released to seller.")}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>I Inspected & Accept Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Tab: Profile */}
      {activeTab === "profile" && (
        <ScrollView contentContainerStyle={styles.centerTab}>
          <User size={48} color="#1E293B" />
          <Text style={styles.tabTitle}>Verified Student Profile</Text>
          <Text style={styles.tabSubtitle}>
            Yohannes M. &bull; AAU Computer Science &bull; 98% Escrow Trust Score
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert("Account", "Logged in via Google Better Auth.")}
            style={styles.actionPill}
          >
            <Text style={styles.actionPillText}>Manage Account</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Bottom 5-Tab Navigation Bar */}
      <MobileBottomNav
        currentTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Native Mobile Escrow Modal */}
      {selectedProduct && (
        <Modal
          visible={!!selectedProduct}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setSelectedProduct(null);
            setShowOrderSuccess(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedProduct(null);
                  setShowOrderSuccess(false);
                }}
                style={styles.closeButton}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>

              {showOrderSuccess ? (
                <View style={styles.successContainer}>
                  <CheckCircle2 size={54} color="#6C5CE7" />
                  <Text style={styles.successTitle}>Escrow Payment Reserved!</Text>
                  <Text style={styles.successSubtitle}>
                    Your funds are protected in SafeTrade Escrow. Your 4-digit pickup PIN has been generated.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedProduct(null);
                      setShowOrderSuccess(false);
                      setActiveTab("activity");
                    }}
                    style={styles.viewActivityButton}
                  >
                    <Text style={styles.viewActivityText}>View PIN in Activity Tab</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.modalHeaderRow}>
                    <ShieldCheck size={20} color="#6C5CE7" />
                    <Text style={styles.modalTitle}>SafeTrade Escrow Checkout</Text>
                  </View>

                  <Image
                    source={{ uri: selectedProduct.imageUrl }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />

                  <Text style={styles.modalItemTitle}>{selectedProduct.title}</Text>
                  <Text style={styles.modalCondition}>{selectedProduct.condition}</Text>

                  {/* Math Breakdown */}
                  <View style={styles.breakdownBox}>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>Item Price:</Text>
                      <Text style={styles.breakdownVal}>ETB {selectedProduct.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>5% SafeTrade Escrow:</Text>
                      <Text style={styles.breakdownVal}>+ETB {Math.round(selectedProduct.price * 0.05).toLocaleString()}</Text>
                    </View>
                    <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                      <Text style={styles.totalLabel}>Total Protected Amount:</Text>
                      <Text style={styles.totalVal}>ETB {(selectedProduct.price + Math.round(selectedProduct.price * 0.05)).toLocaleString()}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleConfirmOrder}
                    style={styles.escrowBuyButton}
                  >
                    <Text style={styles.escrowBuyText}>Confirm & Pay with Telebirr / CBE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  tabSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  actionPill: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 8,
  },
  actionPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  activityContent: {
    padding: 16,
    gap: 16,
  },
  activityHeader: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    fontFamily: "monospace",
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400E",
  },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  orderLocation: {
    fontSize: 11,
    color: "#64748B",
  },
  pinBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    marginVertical: 4,
  },
  pinHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3730A3",
    textTransform: "uppercase",
  },
  pinCode: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 6,
    color: "#0F172A",
    fontFamily: "monospace",
  },
  pinNotice: {
    fontSize: 9,
    color: "#6366F1",
    marginTop: 4,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "85%",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    padding: 4,
    zIndex: 10,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalItemTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  modalCondition: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6C5CE7",
    marginTop: 2,
    marginBottom: 12,
  },
  breakdownBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0F172A",
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  totalVal: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6C5CE7",
  },
  escrowBuyButton: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  escrowBuyText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  viewActivityButton: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
  },
  viewActivityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
