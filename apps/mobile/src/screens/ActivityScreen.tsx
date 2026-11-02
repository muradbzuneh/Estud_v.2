import React, { useState } from "react";
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
  ShieldCheck,
  Lock,
  CheckCircle2,
  Clock,
  Building2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";

export function ActivityScreen() {
  const { orders, completeOrder, setActiveTab } = useApp();
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const activeOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const displayOrders = filter === "active" ? activeOrders : completedOrders;

  const handleConfirmInspection = (orderId: string, orderNumber: string) => {
    Alert.alert(
      "Confirm Item Handover",
      `Have you physically inspected order ${orderNumber} at the campus desk and verified it meets your expectations?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Release Payout",
          style: "default",
          onPress: () => {
            completeOrder(orderId);
            Alert.alert(
              "Trade Completed!",
              "100% of the funds have been released to the student seller. SafeTrade Escrow completed successfully."
            );
          },
        },
      ]
    );
  };

  const handleDispute = (orderNumber: string) => {
    Alert.alert(
      "SafeTrade Buyer Protection",
      `Order ${orderNumber} is on escrow hold. If the item does not match description, the campus intermediary will cancel and refund 100% of your funds.`
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Top Banner */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={26} color="#1D6BF3" />
          <View>
            <Text style={styles.title}>SafeTrade Escrow Activity</Text>
            <Text style={styles.subtitle}>Track your student trades & secret pickup PINs</Text>
          </View>
        </View>
      </View>

      {/* Tabs: Active vs Completed */}
      <View style={styles.tabToggle}>
        <TouchableOpacity
          onPress={() => setFilter("active")}
          style={[styles.toggleBtn, filter === "active" && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, filter === "active" && styles.toggleBtnTextActive]}>
            Active Escrows ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("completed")}
          style={[styles.toggleBtn, filter === "completed" && styles.toggleBtnActive]}
        >
          <Text style={[styles.toggleBtnText, filter === "completed" && styles.toggleBtnTextActive]}>
            Completed ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {displayOrders.length === 0 ? (
        <View style={styles.emptyCard}>
          <Clock size={44} color="#94A3B8" />
          <Text style={styles.emptyTitle}>
            No {filter === "active" ? "active" : "completed"} orders yet
          </Text>
          <Text style={styles.emptySubtitle}>
            Browse student listings on the Home or Explore tab to buy with safe escrow.
          </Text>
          <TouchableOpacity
            onPress={() => setActiveTab("home")}
            style={styles.browseBtn}
          >
            <Text style={styles.browseBtnText}>Browse Marketplace</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Orders List */
        displayOrders.map((order) => {
          const isCompleted = order.status === "completed";

          return (
            <View key={order.id} style={styles.orderCard}>
              {/* Card Header */}
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderTime}>{order.createdAt}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted ? styles.statusBadgeCompleted : styles.statusBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isCompleted ? styles.statusTextCompleted : styles.statusTextActive,
                    ]}
                  >
                    {isCompleted ? "Handover Completed" : "Ready for Inspection"}
                  </Text>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productRow}>
                <Image source={{ uri: order.imageUrl }} style={styles.productThumb} />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {order.productTitle}
                  </Text>
                  <Text style={styles.sellerName}>Seller: {order.sellerName}</Text>
                  <Text style={styles.priceTag}>ETB {order.totalAmount.toLocaleString()} in Escrow</Text>
                </View>
              </View>

              {/* Campus Desk Location */}
              <View style={styles.locationBox}>
                <Building2 size={13} color="#1D6BF3" />
                <Text style={styles.locationText} numberOfLines={1}>
                  {order.campusHub}
                </Text>
              </View>

              {/* Secret 4-Digit PIN Box (Only if active) */}
              {!isCompleted ? (
                <View style={styles.pinCard}>
                  <View style={styles.pinHeader}>
                    <Lock size={14} color="#1D6BF3" />
                    <Text style={styles.pinHeaderTitle}>Secret 4-Digit Inspection PIN</Text>
                  </View>
                  <Text style={styles.pinCode}>{order.secretPin}</Text>
                  <Text style={styles.pinNotice}>
                    Share this code with the desk intermediary only after you physically test the item.
                  </Text>
                </View>
              ) : (
                <View style={styles.completedNoticeBox}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={styles.completedNoticeText}>
                    Payout released to seller. Thank you for trading safely!
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              {!isCompleted && (
                <View style={styles.actionBtnRow}>
                  <TouchableOpacity
                    onPress={() => handleConfirmInspection(order.id, order.orderNumber)}
                    activeOpacity={0.88}
                    style={styles.confirmInspectBtn}
                  >
                    <CheckCircle2 size={15} color="#FFFFFF" />
                    <Text style={styles.confirmInspectBtnText}>I Inspected & Accept Item</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDispute(order.orderNumber)}
                    style={styles.disputeBtn}
                  >
                    <AlertTriangle size={13} color="#EF4444" />
                    <Text style={styles.disputeBtnText}>Report Issue</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  tabToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  toggleBtnTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  orderTime: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeActive: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statusBadgeCompleted: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  statusTextActive: {
    color: "#1D6BF3",
  },
  statusTextCompleted: {
    color: "#059669",
  },
  productRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 17,
  },
  sellerName: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  priceTag: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1D6BF3",
    marginTop: 4,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 10,
    color: "#334155",
    fontWeight: "600",
    flex: 1,
  },
  pinCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#1D6BF3",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  pinHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  pinHeaderTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D6BF3",
  },
  pinCode: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 6,
    marginVertical: 2,
  },
  pinNotice: {
    fontSize: 9,
    color: "#64748B",
    textAlign: "center",
    marginTop: 2,
  },
  completedNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  completedNoticeText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "700",
    flex: 1,
  },
  actionBtnRow: {
    gap: 8,
  },
  confirmInspectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1D6BF3",
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  confirmInspectBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  disputeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
  },
  disputeBtnText: {
    color: "#EF4444",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 16,
  },
  browseBtn: {
    backgroundColor: "#1D6BF3",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
  browseBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
