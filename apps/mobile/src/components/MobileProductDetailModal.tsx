import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
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
  const { selectedProduct, setSelectedProduct, createOrder, setActiveTab } = useApp();
  const [collectionMethod, setCollectionMethod] = useState<"hub" | "runner">("hub");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbe" | "cash">("telebirr");
  const [createdOrderPin, setCreatedOrderPin] = useState<string | null>(null);

  if (!selectedProduct) return null;

  const itemPrice = selectedProduct.price;
  const escrowFee = Math.round(itemPrice * 0.05);
  const runnerFee = collectionMethod === "runner" ? 75 : 0;
  const totalAmount = itemPrice + escrowFee + runnerFee;

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
        <View style={styles.modalCard}>
          {/* Close Button */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={18} color="#64748B" />
          </TouchableOpacity>

          {createdOrderPin ? (
            /* Order Placed & PIN Generated View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.successScroll}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={46} color="#10B981" />
              </View>

              <Text style={styles.successTitle}>Funds Locked in Escrow!</Text>
              <Text style={styles.successSubtitle}>
                Your payment of ETB {totalAmount.toLocaleString()} is held securely by SafeTrade Escrow. The seller is notified to drop the item off at the campus desk.
              </Text>

              {/* Secret Inspection PIN Box */}
              <View style={styles.pinBox}>
                <View style={styles.pinHeader}>
                  <Lock size={15} color="#1D6BF3" />
                  <Text style={styles.pinHeaderTitle}>Secret 4-Digit Inspection PIN</Text>
                </View>
                <Text style={styles.pinCode}>{createdOrderPin}</Text>
                <Text style={styles.pinWarning}>
                  DO NOT share this code with anyone until you meet at the campus desk and physically inspect the item!
                </Text>
              </View>

              {/* Handover Instructions */}
              <View style={styles.instructionCard}>
                <View style={styles.stepRow}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
                  <Text style={styles.stepText}>Seller drops item at {selectedProduct.location}.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
                  <Text style={styles.stepText}>You inspect and test the item in person.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
                  <Text style={styles.stepText}>Give this PIN to release 100% payout to seller.</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                onPress={handleGoToActivity}
                activeOpacity={0.88}
                style={styles.activityButton}
              >
                <Text style={styles.activityButtonText}>Track Order in Activity Tab</Text>
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
                <Text style={styles.conditionPill}>{selectedProduct.condition}</Text>
                <Text style={styles.productTitle}>{selectedProduct.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>ETB {selectedProduct.price.toLocaleString()}</Text>
                  {selectedProduct.originalPrice && (
                    <Text style={styles.origPriceText}>ETB {selectedProduct.originalPrice.toLocaleString()}</Text>
                  )}
                </View>
              </View>

              {/* Campus Location & Seller */}
              <View style={styles.sellerCard}>
                <View style={styles.sellerLeft}>
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerAvatarText}>ST</Text>
                  </View>
                  <View>
                    <Text style={styles.sellerName}>Verified Student Seller</Text>
                    <View style={styles.locationMeta}>
                      <MapPin size={11} color="#64748B" />
                      <Text style={styles.locationMetaText}>{selectedProduct.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.trustScorePill}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.trustScoreText}>99% Trust</Text>
                </View>
              </View>

              {/* Collection Method Picker */}
              <Text style={styles.sectionHeading}>Choose Handover Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  onPress={() => setCollectionMethod("hub")}
                  style={[styles.methodCard, collectionMethod === "hub" && styles.methodCardActive]}
                >
                  <Building2 size={18} color={collectionMethod === "hub" ? "#1D6BF3" : "#64748B"} />
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodTitle, collectionMethod === "hub" && styles.methodTitleActive]}>
                      Campus Intermediary Hub
                    </Text>
                    <Text style={styles.methodSub}>Inspect at desk &bull; Free</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCollectionMethod("runner")}
                  style={[styles.methodCard, collectionMethod === "runner" && styles.methodCardActive]}
                >
                  <Bike size={18} color={collectionMethod === "runner" ? "#1D6BF3" : "#64748B"} />
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodTitle, collectionMethod === "runner" && styles.methodTitleActive]}>
                      Student Runner
                    </Text>
                    <Text style={styles.methodSub}>To dorm room &bull; ETB 75</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Payment Method Selector */}
              <Text style={styles.sectionHeading}>Select Payment Gateway</Text>
              <View style={styles.payMethodRow}>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("telebirr")}
                  style={[styles.payChip, paymentMethod === "telebirr" && styles.payChipActive]}
                >
                  <Text style={[styles.payChipText, paymentMethod === "telebirr" && styles.payChipTextActive]}>
                    Telebirr
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cbe")}
                  style={[styles.payChip, paymentMethod === "cbe" && styles.payChipActive]}
                >
                  <Text style={[styles.payChipText, paymentMethod === "cbe" && styles.payChipTextActive]}>
                    CBE Birr
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cash")}
                  style={[styles.payChip, paymentMethod === "cash" && styles.payChipActive]}
                >
                  <Text style={[styles.payChipText, paymentMethod === "cash" && styles.payChipTextActive]}>
                    Cash at Hub
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Math Escrow Breakdown */}
              <View style={styles.breakdownBox}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Item Price:</Text>
                  <Text style={styles.breakdownVal}>ETB {itemPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>SafeTrade Escrow Fee (5%):</Text>
                  <Text style={styles.breakdownVal}>+ETB {escrowFee.toLocaleString()}</Text>
                </View>
                {collectionMethod === "runner" && (
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Dorm Runner Delivery:</Text>
                    <Text style={styles.breakdownVal}>+ETB {runnerFee}</Text>
                  </View>
                )}
                <View style={[styles.breakdownRow, styles.breakdownTotal]}>
                  <Text style={styles.totalLabel}>Total Escrow Due:</Text>
                  <Text style={styles.totalVal}>ETB {totalAmount.toLocaleString()}</Text>
                </View>
              </View>

              {/* Checkout Action Button */}
              <TouchableOpacity
                onPress={handleConfirmEscrow}
                activeOpacity={0.88}
                style={styles.checkoutBtn}
              >
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.checkoutBtnText}>
                  Lock ETB {totalAmount.toLocaleString()} in Escrow
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    backgroundColor: "#F1F5F9",
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
    backgroundColor: "#F1F5F9",
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
    color: "#1D6BF3",
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
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
    color: "#1D6BF3",
  },
  origPriceText: {
    fontSize: 12,
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  sellerAvatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1D6BF3",
  },
  sellerName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },
  locationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  locationMetaText: {
    fontSize: 10,
    color: "#64748B",
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
    color: "#334155",
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
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  methodCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  methodTitleActive: {
    color: "#1D6BF3",
  },
  methodSub: {
    fontSize: 10,
    color: "#64748B",
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
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  payChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
    borderWidth: 1.5,
  },
  payChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  payChipTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  breakdownBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#64748B",
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  breakdownTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  totalVal: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1D6BF3",
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1D6BF3", // Electric Blue
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
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
    color: "#0F172A",
  },
  successSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  pinBox: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#1D6BF3",
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
    color: "#1D6BF3",
    letterSpacing: 0.3,
  },
  pinCode: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
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
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    backgroundColor: "#1D6BF3",
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
    color: "#334155",
    flex: 1,
  },
  activityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1D6BF3",
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
