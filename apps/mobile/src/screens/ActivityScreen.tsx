import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
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
import { showSuccessToast, showInfoToast } from "../utils/toast";

export function ActivityScreen() {
  const { orders, completeOrder, setActiveTab, colors, t, language } = useApp();
  const [filter, setFilter] = useState<"active" | "completed">("active");

  const activeOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const displayOrders = filter === "active" ? activeOrders : completedOrders;

  const handleConfirmInspection = (orderId: string, orderNumber: string) => {
    completeOrder(orderId);
  };

  const handleDispute = (orderNumber: string) => {
    showInfoToast(
      language === "am" ? "የሴፍ ትሬድ የገዢ ዋስትና" : "SafeTrade Buyer Protection",
      `Order ${orderNumber} is under escrow protection. Contact campus desk.`
    );
  };

  const isDark = colors.mode === "dark";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Banner with Animation */}
      <Animatable.View animation="fadeInDown" duration={450} style={styles.header}>
        <View style={styles.headerLeft}>
          <ShieldCheck size={26} color={colors.primary} />
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{t.activityTitle}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.activitySubtitle}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* Tabs: Active vs Completed */}
      <View style={[styles.tabToggle, { backgroundColor: isDark ? "#0A1628" : "#F1F5F9" }]}>
        <TouchableOpacity
          onPress={() => setFilter("active")}
          style={[
            styles.toggleBtn,
            filter === "active" && [styles.toggleBtnActive, { backgroundColor: colors.card }],
          ]}
        >
          <Text
            style={[
              styles.toggleBtnText,
              { color: filter === "active" ? colors.primary : colors.textSecondary },
              filter === "active" && { fontWeight: "800" },
            ]}
          >
            {t.tabActiveEscrow} ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("completed")}
          style={[
            styles.toggleBtn,
            filter === "completed" && [styles.toggleBtnActive, { backgroundColor: colors.card }],
          ]}
        >
          <Text
            style={[
              styles.toggleBtnText,
              { color: filter === "completed" ? colors.primary : colors.textSecondary },
              filter === "completed" && { fontWeight: "800" },
            ]}
          >
            {t.tabCompletedEscrow} ({completedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {displayOrders.length === 0 ? (
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Clock size={44} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            {language === "am"
              ? `ምንም ${filter === "active" ? "በሂደት ላይ ያለ" : "የተጠናቀቀ"} ግብይት የለም`
              : `No ${filter === "active" ? "active" : "completed"} orders yet`}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {language === "am"
              ? "በካምፓስ ዕቃዎችን በኤስክሮው ለመግዛት መነሻ ወይም አስስ ገጽን ይመልከቱ።"
              : "Browse student listings on the Home or Explore tab to buy with safe escrow."}
          </Text>
          <TouchableOpacity
            onPress={() => setActiveTab("home")}
            style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.browseBtnText}>{t.heroExploreBtn}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ) : (
        /* Orders List */
        displayOrders.map((order, idx) => {
          const isCompleted = order.status === "completed";

          return (
            <Animatable.View
              key={order.id}
              animation="fadeInUp"
              duration={450}
              delay={idx * 100}
              style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              {/* Card Header */}
              <View style={styles.orderTopRow}>
                <View>
                  <Text style={[styles.orderNumber, { color: colors.textPrimary }]}>{order.orderNumber}</Text>
                  <Text style={[styles.orderTime, { color: colors.textMuted }]}>{order.createdAt}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted
                      ? { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5", borderColor: "#A7F3D0" }
                      : { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: isCompleted ? "#10B981" : colors.primary },
                    ]}
                  >
                    {isCompleted
                      ? (language === "am" ? "መረከብ ተጠናቋል" : "Handover Completed")
                      : (language === "am" ? "ለመፈተሽ ዝግጁ ነው" : "Ready for Inspection")}
                  </Text>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productRow}>
                <Image source={{ uri: order.imageUrl }} style={styles.productThumb} />
                <View style={styles.productInfo}>
                  <Text style={[styles.productTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                    {order.productTitle}
                  </Text>
                  <Text style={[styles.sellerName, { color: colors.textSecondary }]}>Seller: {order.sellerName}</Text>
                  <Text style={[styles.priceTag, { color: colors.primary }]}>
                    ETB {order.totalAmount.toLocaleString()} in Escrow
                  </Text>
                </View>
              </View>

              {/* Campus Desk Location */}
              <View style={[styles.locationBox, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}>
                <Building2 size={13} color={colors.primary} />
                <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {order.campusHub}
                </Text>
              </View>

              {/* Secret 4-Digit PIN Box with Animation */}
              {!isCompleted ? (
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={3000}
                  style={[
                    styles.pinCard,
                    {
                      backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  <View style={styles.pinHeader}>
                    <Lock size={14} color={colors.primary} />
                    <Text style={[styles.pinHeaderTitle, { color: colors.primary }]}>
                      {t.secretPinTitle}
                    </Text>
                  </View>
                  <Text style={[styles.pinCode, { color: colors.textPrimary }]}>{order.secretPin}</Text>
                  <Text style={[styles.pinNotice, { color: colors.textSecondary }]}>
                    {t.secretPinNotice}
                  </Text>
                </Animatable.View>
              ) : (
                <View style={styles.completedNoticeBox}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text style={styles.completedNoticeText}>
                    {language === "am"
                      ? "ክፍያው ለሻጩ ተለቋል። በደህንነት ስለነገዱ እናመሰግናለን!"
                      : "Payout released to seller. Thank you for trading safely!"}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              {!isCompleted && (
                <View style={styles.actionBtnRow}>
                  <TouchableOpacity
                    onPress={() => handleConfirmInspection(order.id, order.orderNumber)}
                    activeOpacity={0.88}
                    style={[styles.confirmInspectBtn, { backgroundColor: colors.primary }]}
                  >
                    <CheckCircle2 size={15} color="#FFFFFF" />
                    <Text style={styles.confirmInspectBtnText}>{t.btnConfirmInspection}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDispute(order.orderNumber)}
                    style={styles.disputeBtn}
                  >
                    <AlertTriangle size={13} color="#EF4444" />
                    <Text style={styles.disputeBtnText}>{t.btnReportIssue}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animatable.View>
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
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  tabToggle: {
    flexDirection: "row",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderCard: {
    borderRadius: 20,
    borderWidth: 1,
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
  },
  orderTime: {
    fontSize: 10,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
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
    lineHeight: 17,
  },
  sellerName: {
    fontSize: 10,
    marginTop: 2,
  },
  priceTag: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 4,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 10,
    fontWeight: "600",
    flex: 1,
  },
  pinCard: {
    borderWidth: 1.5,
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
  },
  pinCode: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 6,
    marginVertical: 2,
  },
  pinNotice: {
    fontSize: 9,
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
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#000000",
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
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 16,
  },
  browseBtn: {
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
