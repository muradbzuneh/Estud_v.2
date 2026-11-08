import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Linking,
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
  Copy,
  Check,
  Navigation,
  ExternalLink,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";

export function MobileProductDetailModal() {
  const { selectedProduct, setSelectedProduct, createOrder, setActiveTab, colors, language } = useApp();
  const [collectionMethod, setCollectionMethod] = useState<"hub" | "runner">("hub");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbe" | "cash">("telebirr");
  const [transactionRef, setTransactionRef] = useState("");
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [createdOrderPin, setCreatedOrderPin] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!selectedProduct) return null;

  const itemPrice = selectedProduct.price;
  const escrowFee = Math.round(itemPrice * 0.05);
  const runnerFee = collectionMethod === "runner" ? 75 : 0;
  const totalAmount = itemPrice + escrowFee + runnerFee;
  const isDark = colors.mode === "dark";

  const handleClose = () => {
    setCreatedOrderPin(null);
    setConfirmedRef(null);
    setTransactionRef("");
    setSelectedProduct(null);
  };

  const handleCopyAccount = (acc: string) => {
    setCopiedAccount(true);
    showSuccessToast(
      language === "am" ? "የሂሳብ ቁጥር ተቀድቷል" : "Account Number Copied",
      "Open your banking app to transfer ETB " + totalAmount.toLocaleString()
    );
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleOpenGoogleMaps = (locationName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ", Ethiopia")}`;
    Linking.openURL(url);
  };

  const handleConfirmEscrow = () => {
    if (paymentMethod !== "cash") {
      const cleanRef = transactionRef.trim();
      if (!cleanRef || cleanRef.length < 3) {
        showErrorToast(
          language === "am" ? "የግብይት ቁጥር ያስፈልጋል" : "Transaction Code Required",
          language === "am"
            ? "እባክዎ ከቴሌብር ወይም ንግድ ባንክ የደረሰዎትን የማረጋገጫ ቁጥር ያስገቡ"
            : "Please enter your SMS transaction reference code (e.g. FT260948 or 7GA829104)"
        );
        return;
      }
    }

    const finalRef = paymentMethod === "cash" ? "CASH-HUB" : transactionRef.trim();

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
      transactionReference: finalRef,
    });

    setConfirmedRef(finalRef);
    setCreatedOrderPin(order.secretPin);

    // Live alert dispatch simulation
    showSuccessToast(
      language === "am" ? "ክፍያዎ ለኤስክሮው ተልኳል!" : "Payment Sent to Escrow Desk!",
      language === "am"
        ? `ማረጋገጫ: ${finalRef} • ዴስክ ኃላፊው አረጋግጦ ፒኑን ያጸናል`
        : `Ref: ${finalRef} • Sent to Admin queue for instant confirmation`
    );
  };

  const handleGoToActivity = () => {
    handleClose();
    setActiveTab("activity");
  };

  const currentAccountNumber = paymentMethod === "telebirr" ? "0911 234 567" : "1000 4589 1234 5";
  const currentAccountName = paymentMethod === "telebirr" ? "ESTUD ESCROW (Telebirr Merchant)" : "ESTUD TECHNOLOGIES PLC (CBE)";

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
            style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9" }]}
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {createdOrderPin ? (
            /* Order Placed & Verification Pending View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.successScroll}>
              <Animatable.View animation="zoomIn" duration={450} style={styles.successIconCircle}>
                <CheckCircle2 size={46} color="#10B981" />
              </Animatable.View>

              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                {language === "am" ? "ክፍያዎ ወደ ኤስክሮው ገብቷል!" : "Payment Submitted to Escrow!"}
              </Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                {language === "am"
                  ? `የ ETB ${totalAmount.toLocaleString()} ክፍያዎ በሴፍ ትሬድ ኤስክሮው ተቆልፏል። የካምፓስ አስተዳዳሪው ማረጋገጫ ቁጥር (${confirmedRef}) አረጋግጧል።`
                  : `Your transfer of ETB ${totalAmount.toLocaleString()} is locked in SafeTrade Escrow. Transaction reference (${confirmedRef}) has been delivered to the campus admin desk.`}
              </Text>

              {/* Verified Reference Banner */}
              <View style={[styles.refBanner, { backgroundColor: isDark ? colors.cardElevated : "#F1F5F9", borderColor: colors.border }]}>
                <Text style={[styles.refLabel, { color: colors.textSecondary }]}>
                  {language === "am" ? "የባንክ/ቴሌብር ማረጋገጫ ኮድ:" : "Bank / Telebirr Reference Code:"}
                </Text>
                <Text style={[styles.refCodeText, { color: colors.primary }]}>{confirmedRef}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>Pending Hub Handover</Text>
                </View>
              </View>

              {/* Secret Inspection PIN Box */}
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2500}
                style={[
                  styles.pinBox,
                  {
                    backgroundColor: isDark ? "rgba(56, 189, 248, 0.12)" : "#EFF6FF",
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.pinHeader}>
                  <Lock size={15} color={colors.primary} />
                  <Text style={[styles.pinHeaderTitle, { color: colors.primary }]}>
                    {language === "am" ? "ሚስጥራዊ ባለ 4-ዲጂት መፈተሻ ፒን" : "Secret 4-Digit Pickup PIN"}
                  </Text>
                </View>
                <Text style={[styles.pinCode, { color: colors.textPrimary }]}>{createdOrderPin}</Text>
                <Text style={styles.pinWarning}>
                  {language === "am"
                    ? "ዕቃውን በአካል በካምፓስ ዴስክ ፈትሸው ካላረጋገጡ በስተቀር ይህን ፒን ለማንም ሰው አያጋሩ!"
                    : "Do NOT share this code until you physically test and inspect your item at the campus hub!"}
                </Text>
              </Animatable.View>

              {/* Handover Steps */}
              <View style={[styles.instructionCard, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>1</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>Seller delivers item to {selectedProduct.location}.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>2</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>You test the item thoroughly at the desk.</Text>
                </View>
                <View style={styles.stepRow}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}><Text style={styles.stepNumText}>3</Text></View>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>Provide this 4-digit PIN to release money to the seller.</Text>
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

              {/* Campus Location & Seller (Clickable Google Map Navigator) */}
              <View style={[styles.sellerCard, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
                <View style={styles.sellerLeft}>
                  <View style={[styles.sellerAvatar, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <Text style={[styles.sellerAvatarText, { color: colors.primary }]}>ST</Text>
                  </View>
                  <View>
                    <Text style={[styles.sellerName, { color: colors.textPrimary }]}>Verified Student Seller</Text>
                    {/* Clickable Map Location Pill */}
                    <TouchableOpacity
                      onPress={() => handleOpenGoogleMaps(selectedProduct.location)}
                      style={styles.locationMeta}
                      activeOpacity={0.7}
                    >
                      <MapPin size={12} color={colors.primary} />
                      <Text style={[styles.locationMetaText, { color: colors.primary, textDecorationLine: "underline" }]}>
                        {selectedProduct.location}
                      </Text>
                      <Navigation size={10} color={colors.primary} style={{ marginLeft: 3 }} />
                    </TouchableOpacity>
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
                      backgroundColor: collectionMethod === "hub" ? colors.primaryLight : (isDark ? colors.cardElevated : "#F8FAFC"),
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
                      backgroundColor: collectionMethod === "runner" ? colors.primaryLight : (isDark ? colors.cardElevated : "#F8FAFC"),
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
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Select Payment Wallet</Text>
              <View style={styles.payMethodRow}>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("telebirr")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "telebirr" ? colors.primaryLight : (isDark ? colors.cardElevated : "#F8FAFC"),
                      borderColor: paymentMethod === "telebirr" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "telebirr" ? colors.primary : colors.textSecondary }, paymentMethod === "telebirr" && { fontWeight: "800" }]}>
                    Telebirr SuperApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cbe")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "cbe" ? colors.primaryLight : (isDark ? colors.cardElevated : "#F8FAFC"),
                      borderColor: paymentMethod === "cbe" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "cbe" ? colors.primary : colors.textSecondary }, paymentMethod === "cbe" && { fontWeight: "800" }]}>
                    CBE Birr / Bank
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cash")}
                  style={[
                    styles.payChip,
                    {
                      backgroundColor: paymentMethod === "cash" ? colors.primaryLight : (isDark ? colors.cardElevated : "#F8FAFC"),
                      borderColor: paymentMethod === "cash" ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.payChipText, { color: paymentMethod === "cash" ? colors.primary : colors.textSecondary }, paymentMethod === "cash" && { fontWeight: "800" }]}>
                    Cash at Desk
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Formal Realistic Transfer Details Card */}
              {paymentMethod !== "cash" && (
                <View style={[styles.accountCard, { backgroundColor: isDark ? colors.cardElevated : "#F1F5F9", borderColor: colors.border }]}>
                  <View style={styles.accountCardHeader}>
                    <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                      Transfer to Estud Escrow:
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleCopyAccount(currentAccountNumber)}
                      style={[styles.copyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                      {copiedAccount ? <Check size={12} color="#10B981" /> : <Copy size={12} color={colors.primary} />}
                      <Text style={[styles.copyBtnText, { color: copiedAccount ? "#10B981" : colors.primary }]}>
                        {copiedAccount ? "Copied" : "Copy"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.accountNumberText, { color: colors.textPrimary }]}>
                    {currentAccountNumber}
                  </Text>
                  <Text style={[styles.accountNameText, { color: colors.textMuted }]}>
                    {currentAccountName}
                  </Text>

                  {/* SMS Reference Code Input Box */}
                  <View style={styles.refInputGroup}>
                    <Text style={[styles.refInputLabel, { color: colors.textPrimary }]}>
                      SMS Transaction Reference Code *
                    </Text>
                    <TextInput
                      value={transactionRef}
                      onChangeText={setTransactionRef}
                      placeholder={paymentMethod === "telebirr" ? "e.g. 7GA829104 or FT260948" : "e.g. CBE-84920194"}
                      placeholderTextColor={colors.textMuted}
                      style={[
                        styles.refTextInput,
                        {
                          backgroundColor: colors.inputBg,
                          borderColor: colors.border,
                          color: colors.textPrimary,
                        },
                      ]}
                      autoCapitalize="characters"
                    />
                    <Text style={[styles.refHelperText, { color: colors.textSecondary }]}>
                      Enter the confirmation code from your {paymentMethod === "telebirr" ? "Telebirr" : "CBE"} SMS receipt.
                    </Text>
                  </View>
                </View>
              )}

              {/* Math Escrow Breakdown */}
              <View style={[styles.breakdownBox, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
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
                  <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total Amount to Transfer:</Text>
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
                  Confirm & Lock ETB {totalAmount.toLocaleString()} in Escrow
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
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "92%",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
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
    textTransform: "uppercase",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "900",
  },
  origPriceText: {
    fontSize: 13,
    textDecorationLine: "line-through",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  sellerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
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
    fontSize: 11,
    fontWeight: "600",
  },
  trustScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  trustScoreText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F59E0B",
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  methodCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 11,
    fontWeight: "700",
  },
  methodSub: {
    fontSize: 9,
    marginTop: 1,
  },
  payMethodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  payChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  payChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  accountCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  accountCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  accountLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: "700",
  },
  accountNumberText: {
    fontSize: 17,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  accountNameText: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 10,
  },
  refInputGroup: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  refInputLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  refTextInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  refHelperText: {
    fontSize: 10,
    marginTop: 4,
    lineHeight: 14,
  },
  breakdownBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
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
    fontWeight: "600",
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: "700",
  },
  breakdownTotal: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 2,
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
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  successScroll: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    marginBottom: 14,
    maxWidth: 320,
  },
  refBanner: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 12,
  },
  refLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  refCodeText: {
    fontSize: 15,
    fontWeight: "900",
    fontFamily: "monospace",
    marginVertical: 3,
  },
  pendingBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#F59E0B",
  },
  pinBox: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pinCode: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 6,
    fontFamily: "monospace",
    marginVertical: 4,
  },
  pinWarning: {
    fontSize: 10,
    color: "#EF4444",
    textAlign: "center",
    fontWeight: "700",
    marginTop: 4,
    maxWidth: 280,
    lineHeight: 14,
  },
  instructionCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  stepText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  activityButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  activityButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
