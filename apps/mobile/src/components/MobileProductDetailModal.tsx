import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Building2,
  Bike,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";

export function MobileProductDetailModal() {
  const { selectedProduct, setSelectedProduct, createOrder, setActiveTab, colors, language } = useApp();
  const [collectionMethod, setCollectionMethod] = useState<"hub" | "runner">("hub");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbe" | "cash">("telebirr");
  const [createdOrderPin, setCreatedOrderPin] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const itemPrice = selectedProduct.price;
  const escrowFee = Math.round(itemPrice * 0.05);
  const runnerFee = collectionMethod === "runner" ? 75 : 0;
  const totalAmount = itemPrice + escrowFee + runnerFee;
  const isDark = colors.mode === "dark";

  const handleClose = () => {
    setCreatedOrderPin(null);
    setSelectedProduct(null);
  };

  const handleConfirmEscrow = () => {
    const order = createOrder({
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      productPrice: selectedProduct.price,
      escrowFee,
      totalAmount,
      imageUrl: selectedProduct.imageUrl,
      campusHub: selectedProduct.location,
      sellerName: selectedProduct.sellerName || "Verified Campus Senior",
      collectionMethod,
      paymentMethod,
    });

    setCreatedOrderPin(order.secretPin);
  };

  const handleGoToActivity = () => {
    handleClose();
    setActiveTab("activity");
  };

  return (
    <Modal
      visible={!!selectedProduct}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={350}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" }]}
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {createdOrderPin ? (
            /* Order Placed & PIN Generated View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.successScroll}>
              <Animatable.View animation="zoomIn" duration={450} style={styles.successIconCircle}>
                <CheckCircle2 size={46} color="#10B981" />
              </Animatable.View>

              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                {language === "am" ? "ገንዘብ በኤስክሮው ውስጥ ተቆልፏል!" : "Funds Locked in Escrow!"}
              </Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                {language === "am"
                  ? `የ ETB ${totalAmount.toLocaleString()} ክፍያዎ በሴፍ ትሬድ ኤስክሮው ደህንነቱ ተጠብቋል። ሻጩ ዕቃውን በካምፓስ ዴስክ እንዲያደርስ ተነግሮታል።`
                  : `Your payment of ETB ${totalAmount.toLocaleString()} is held securely by SafeTrade Escrow. The seller is notified to drop the item off at the campus desk.`}
              </Text>

              {/* Secret Inspection PIN Box with subtle pulsing animation */}
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2500}
                style={[
                  styles.pinBox,
                  {
                    backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.pinHeader}>
                  <Lock size={15} color={colors.primary} />
                  <Text style={[styles.pinHeaderTitle, { color: colors.primary }]}>
                    {language === "am" ? "ሚስጥራዊ ባለ 4-ዲጂት መፈተሻ ፒን" : "Secret 4-Digit Inspection PIN"}
                  </Text>
                </View>
                <Text style={[styles.pinCode, { color: colors.textPrimary }]}>{createdOrderPin}</Text>
                <Text style={styles.pinWarning}>
                  {language === "am"
                    ? "ዕቃውን በአካል ፈትሸው ካላረጋገጡ በስተቀር ይህን ኮድ ለማንም ሰው አያጋሩ!"
                    : "DO NOT share this code with anyone until you meet at the campus desk and physically inspect the item!"}
                </Text>
              </Animatable.View>

              {/* Handover Instructions */}
              <View style={[styles.instructionCard, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>1</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>Seller drops item at {selectedProduct.location}.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>2</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>You inspect and test the item in person.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>3</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>Give this PIN to release 100% payout to seller.</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                onPress={handleGoToActivity}
                activeOpacity={0.88}
                style={[styles.activityButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.activityButtonText}>
                  {language === "am" ? "በእንቅስቃሴ ገጽ ውስጥ ተከታተል" : "Track Order in Activity Tab"}
                </Text>
                <ArrowRight size={15} color="#FFFFFF" />
              </TouchableOpacity>
            </ScrollView>
          ) : (
            /* Product Details & Checkout View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Product Header Image */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: selectedProduct.imageUrl }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.escrowBadgeTop}>
                  <ShieldCheck size={12} color="#FFFFFF" />
                  <Text style={styles.escrowBadgeTopText}>SafeTrade Escrow Protected</Text>
                </View>
              </View>

              {/* Title & Price Row */}
              <View style={styles.titleSection}>
                <Text style={[styles.conditionPill, { color: colors.primary }]}>{selectedProduct.condition}</Text>
                <Text style={[styles.productTitle, { color: colors.textPrimary }]}>{selectedProduct.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>ETB {selectedProduct.price.toLocaleString()}</Text>
                  {selectedProduct.originalPrice && (
                    <Text style={[styles.origPriceText, { color: colors.textMuted }]}>
                      ETB {selectedProduct.originalPrice.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>

              {/* Campus Location & Seller */}
              <View style={[styles.sellerCard, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}>
                <View style={styles.sellerLeft}>
                  <View style={[styles.sellerAvatar, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <Text style={[styles.sellerAvatarText, { color: colors.primary }]}>ST</Text>
                  </View>
                  <View>
                    <Text style={[styles.sellerName, { color: colors.textPrimary }]}>Verified Student Seller</Text>
                    <View style={styles.locationMeta}>
                      <MapPin size={11} color={colors.textMuted} />
                      <Text style={[styles.locationMetaText, { color: colors.textSecondary }]}>{selectedProduct.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.trustScorePill}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.trustScoreText}>99% Trust</Text>
                </View>
              </View>

              {/* Collection Method Picker */}
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Choose Handover Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  onPress={() => setCollectionMethod("hub")}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: collectionMethod === "hub" ? colors.primaryLight : (isDark ? "#0A1628" : "#F8FAFC"),
                      borderColor: collectionMethod === "hub" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Building2 size={18} color={collectionMethod === "hub" ? colors.primary : colors.textSecondary} />
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodTitle, { color: collectionMethod === "hub" ? colors.primary : colors.textPrimary }]}>
                      Campus Intermediary Hub
                    </Text>
                    <Text style={[styles.methodSub, { color: colors.textSecondary }]}>Inspect at desk &bull; Free</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCollectionMethod("runner")}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: collectionMethod === "runner" ? colors.primaryLight : (isDark ? "#0A1628" : "#F8FAFC"),
                      borderColor: collectionMethod === "runner" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Bike size={18} color={collectionMethod === "runner" ? colors.primary : colors.textSecondary} />
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodTitle, { color: collectionMethod === "runner" ? colors.primary : colors.textPrimary }]}>
                      Student Runner
                    </Text>
                    <Text style={[styles.methodSub, { color: colors.textSecondary }]}>To dorm room &bull; ETB 75</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Payment Method Selector */}
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Select Payment Gateway</Text>
              <View style={styles.payMethodRow}>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("telebirr")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "telebirr" ? colors.primaryLight : (isDark ? "#0A1628" : "#F8FAFC"),
                      borderColor: paymentMethod === "telebirr" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "telebirr" ? colors.primary : colors.textSecondary }, paymentMethod === "telebirr" && { fontWeight: "800" }]}>
                    Telebirr
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cbe")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "cbe" ? colors.primaryLight : (isDark ? "#0A1628" : "#F8FAFC"),
                      borderColor: paymentMethod === "cbe" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "cbe" ? colors.primary : colors.textSecondary }, paymentMethod === "cbe" && { fontWeight: "800" }]}>
                    CBE Birr
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cash")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "cash" ? colors.primaryLight : (isDark ? "#0A1628" : "#F8FAFC"),
                      borderColor: paymentMethod === "cash" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "cash" ? colors.primary : colors.textSecondary }, paymentMethod === "cash" && { fontWeight: "800" }]}>
                    Cash at Hub
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Math Escrow Breakdown */}
              <View style={[styles.breakdownBox, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}>
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Item Price:</Text>
                  <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>ETB {itemPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>SafeTrade Escrow Fee (5%):</Text>
                  <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>+ETB {escrowFee.toLocaleString()}</Text>
                </View>
                {collectionMethod === "runner" && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Dorm Runner Delivery:</Text>
                    <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>+ETB {runnerFee}</Text>
                  </View>
                )}
                <View style={[styles.breakdownRow, styles.breakdownTotal, { borderTopColor: colors.border }]}>
                  <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total Escrow Due:</Text>
                  <Text style={[styles.totalVal, { color: colors.primary }]}>ETB {totalAmount.toLocaleString()}</Text>
                </View>
              </View>

              {/* Checkout Action Button */}
              <TouchableOpacity
                onPress={handleConfirmEscrow}
                activeOpacity={0.88}
                style={[styles.checkoutBtn, { backgroundColor: colors.primary }]}
              >
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.checkoutBtnText}>
                  Lock ETB {totalAmount.toLocaleString()} in Escrow
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.72)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "90%",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageWrapper: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 14,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  escrowBadgeTop: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.92)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  escrowBadgeTopText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  titleSection: {
    marginBottom: 12,
  },
  conditionPill: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 6,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
  },
  origPriceText: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
  },
  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sellerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: {
    fontSize: 12,
    fontWeight: "800",
  },
  sellerName: {
    fontSize: 12,
    fontWeight: "700",
  },
  locationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  locationMetaText: {
    fontSize: 10,
  },
  trustScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trustScoreText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B45309",
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  methodRow: {
    gap: 8,
    marginBottom: 14,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  methodSub: {
    fontSize: 10,
    marginTop: 2,
  },
  payMethodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  payChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  payChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  breakdownBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 11,
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: "700",
  },
  breakdownTotal: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  totalVal: {
    fontSize: 15,
    fontWeight: "900",
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  successScroll: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  successSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  pinBox: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 14,
  },
  pinHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  pinHeaderTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  pinCode: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 6,
    marginVertical: 4,
  },
  pinWarning: {
    fontSize: 10,
    color: "#EF4444",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
  instructionCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  stepText: {
    fontSize: 11,
    flex: 1,
  },
  activityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
  },
  activityButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
