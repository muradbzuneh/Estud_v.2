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
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Navigation,
  Upload,
  Camera,
  Heart,
  ChevronRight,
  Info,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";
import { pickImageFromDevice, takePhotoWithCamera } from "../utils/imagePicker";
import { TelebirrLogo, CbeLogo, CashDeskLogo } from "./PaymentLogos";

export function MobileProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    createOrder,
    setActiveTab,
    colors,
    language,
    isAuthenticated,
    setAuthModalVisible,
    favorites,
    toggleFavorite,
  } = useApp();

  const [viewMode, setViewMode] = useState<"detail" | "checkout">("detail");
  const [collectionMethod, setCollectionMethod] = useState<"hub" | "runner">("hub");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbe" | "cash">("telebirr");
  const [transactionRef, setTransactionRef] = useState("");
  const [screenshotProof, setScreenshotProof] = useState<string | null>(null);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [confirmedScreenshot, setConfirmedScreenshot] = useState<string | null>(null);
  const [createdOrderPin, setCreatedOrderPin] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!selectedProduct) return null;

  const itemPrice = selectedProduct.price;
  const escrowFee = Math.round(itemPrice * 0.05);
  const runnerFee = collectionMethod === "runner" ? 75 : 0;
  const totalAmount = itemPrice + escrowFee + runnerFee;
  const isDark = colors.mode === "dark";
  const isFav = !!favorites[selectedProduct.id];

  const handleClose = () => {
    setCreatedOrderPin(null);
    setConfirmedRef(null);
    setConfirmedScreenshot(null);
    setScreenshotProof(null);
    setTransactionRef("");
    setViewMode("detail");
    setSelectedProduct(null);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      showErrorToast(
        language === "am" ? "መግባት ያስፈልጋል" : "Sign In Required",
        language === "am"
          ? "ዕቃ በሴፍ ትሬድ ለመግዛት እባክዎ አስቀድመው ይግቡ"
          : "Please sign in with your verified student account to purchase with buyer protection."
      );
      setAuthModalVisible(true);
      return;
    }
    setViewMode("checkout");
  };

  const handlePickProofFromDevice = async () => {
    const uri = await pickImageFromDevice();
    if (uri) {
      setScreenshotProof(uri);
      showSuccessToast(
        language === "am" ? "የክፍያ ማረጋገጫ ተያይዟል" : "Payment Proof Attached",
        "Screenshot ready for admin verification"
      );
    }
  };

  const handleCameraSnapProof = async () => {
    const uri = await takePhotoWithCamera();
    if (uri) {
      setScreenshotProof(uri);
      showSuccessToast(
        language === "am" ? "የደረሰኝ ፎቶ ተነስቷል" : "Receipt Photo Captured",
        "Ready for payment verification"
      );
    }
  };

  const handleCopyAccount = (acc: string) => {
    setCopiedAccount(true);
    showSuccessToast(
      language === "am" ? "የሂሳብ ቁጥር ተቀድቷል" : "Account Number Copied",
      "Transfer ETB " + totalAmount.toLocaleString()
    );
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleOpenGoogleMaps = (locationName: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName + ", Ethiopia")}`;
    Linking.openURL(url);
  };

  const handleConfirmEscrow = () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }

    if (paymentMethod !== "cash") {
      const cleanRef = transactionRef.trim();
      if (!cleanRef || cleanRef.length < 3) {
        showErrorToast(
          language === "am" ? "የግብይት ቁጥር ያስፈልጋል" : "Transaction Reference Required",
          language === "am"
            ? "እባክዎ ከቴሌብር ወይም ንግድ ባንክ የደረሰዎትን የማረጋገጫ ቁጥር ያስገቡ"
            : "Please enter your SMS transaction reference code"
        );
        return;
      }

      if (!screenshotProof) {
        showErrorToast(
          language === "am" ? "የደረሰኝ ስክሪንሽት ያስፈልጋል" : "Screenshot Proof Required",
          language === "am"
            ? "እባክዎ የክፍያዎን ደረሰኝ ስክሪንሽት ወይም ፎቶ ያያይዙ"
            : "Please upload or snap a photo of your transfer confirmation receipt."
        );
        return;
      }
    }

    const finalRef = paymentMethod === "cash" ? "CASH-HUB" : transactionRef.trim();
    const finalProof = paymentMethod === "cash" ? undefined : (screenshotProof || undefined);

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
      screenshotUrl: finalProof,
    });

    setConfirmedRef(finalRef);
    setConfirmedScreenshot(finalProof || null);
    setCreatedOrderPin(order.secretPin);

    showSuccessToast(
      language === "am" ? "የክፍያ ማረጋገጫ ተልኳል!" : "Payment Sent for Verification!",
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
  const currentAccountName = paymentMethod === "telebirr" ? "ESTUD SAFETRADE (Telebirr Merchant)" : "ESTUD TECHNOLOGIES PLC (CBE)";

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
          duration={300}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Header Row */}
          <View style={styles.headerBar}>
            {viewMode === "checkout" && !createdOrderPin ? (
              <TouchableOpacity
                onPress={() => setViewMode("detail")}
                style={[styles.backBtn, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
              >
                <ArrowLeft size={16} color={colors.textPrimary} />
                <Text style={[styles.backBtnText, { color: colors.textPrimary }]}>
                  {language === "am" ? "ተመለስ" : "Back"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {createdOrderPin ? (
            /* Order Placed & Verification Pending View */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.successScroll}>
              <Animatable.View animation="zoomIn" duration={450} style={styles.successIconCircle}>
                <CheckCircle2 size={46} color="#10B981" />
              </Animatable.View>

              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                {language === "am" ? "ክፍያዎ ወደ ኤስክሮው ገብቷል!" : "Funds Locked in Safe Protection!"}
              </Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                {language === "am"
                  ? `የ ETB ${totalAmount.toLocaleString()} ክፍያዎ በሴፍ ትሬድ ኤስክሮው ተቆልፏል። የካምፓስ አስተዳዳሪው ማረጋገጫ ቁጥር (${confirmedRef}) አረጋግጧል።`
                  : `Your transfer of ETB ${totalAmount.toLocaleString()} is held securely. Transaction reference (${confirmedRef}) has been delivered to the campus admin desk.`}
              </Text>

              {/* Verified Reference Banner */}
              <View style={[styles.refBanner, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                <Text style={[styles.refLabel, { color: colors.textSecondary }]}>
                  {language === "am" ? "የባንክ/ቴሌብር ማረጋገጫ ቁጥር" : "Transaction Reference"}
                </Text>
                <Text style={[styles.refCodeText, { color: colors.primary }]}>{confirmedRef}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>Pending Hub Handover</Text>
                </View>
              </View>

              {/* Secret Inspection PIN Box - Immutable */}
              <View style={[styles.pinBox, { backgroundColor: "rgba(37, 99, 235, 0.12)", borderColor: colors.primary }]}>
                <View style={styles.pinHeader}>
                  <Lock size={15} color={colors.primary} />
                  <Text style={[styles.pinHeaderTitle, { color: colors.primary }]}>
                    {language === "am" ? "የመፈተሻ ፒን (የማይለወጥ)" : "Fixed Inspection PIN"}
                  </Text>
                </View>
                <Text style={[styles.pinCode, { color: colors.textPrimary }]}>{createdOrderPin}</Text>

                <View style={styles.pinExpireBadge}>
                  <Clock size={12} color="#F59E0B" />
                  <Text style={styles.pinExpireText}>
                    {language === "am"
                      ? "የደህንነት ማስታወሻ: ለ 48 ሰዓታት የሚቆይ"
                      : "Security Proof: Valid for 48 Hours"}
                  </Text>
                </View>

                <Text style={styles.pinWarning}>
                  {language === "am"
                    ? "ዕቃውን በአካል በካምፓስ ዴስክ ፈትሸው ካላረጋገጡ በስተቀር ይህን ፒን ለማንም ሰው አያጋሩ!"
                    : "Do NOT share this code until you physically test and inspect your item at the campus hub!"}
                </Text>
              </View>

              {/* Screenshot Delivered Proof Summary */}
              {confirmedScreenshot && (
                <View style={[styles.confirmedScreenshotCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                  <View style={styles.confirmedScreenshotHeader}>
                    <ShieldCheck size={14} color="#10B981" />
                    <Text style={[styles.confirmedScreenshotTitle, { color: colors.textPrimary }]}>
                      {language === "am" ? "የክፍያ ማረጋገጫ ሰነድ" : "Payment Proof Uploaded"}
                    </Text>
                  </View>
                  <Image source={{ uri: confirmedScreenshot }} style={styles.confirmedScreenshotImage} resizeMode="cover" />
                </View>
              )}

              {/* Action Button */}
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
          ) : viewMode === "detail" ? (
            /* VIEW 1: Formal Product Detail Overview */
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
                  <Text style={styles.escrowBadgeTopText}>100% SafeTrade Protection</Text>
                </View>
              </View>

              {/* Title & Price Section */}
              <View style={styles.titleSection}>
                <View style={styles.tagsRow}>
                  <View style={[styles.tagPill, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <Text style={[styles.tagPillText, { color: colors.primary }]}>
                      {selectedProduct.condition}
                    </Text>
                  </View>
                  {selectedProduct.category && (
                    <View style={[styles.tagPill, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                      <Text style={[styles.tagPillText, { color: colors.textSecondary }]}>
                        {selectedProduct.category.toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.productTitle, { color: colors.textPrimary }]}>
                  {selectedProduct.title}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={[styles.priceText, { color: colors.primary }]}>
                    ETB {selectedProduct.price.toLocaleString()}
                  </Text>
                  {selectedProduct.originalPrice && (
                    <Text style={[styles.origPriceText, { color: colors.textMuted }]}>
                      ETB {selectedProduct.originalPrice.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>

              {/* Verified Seller Profile Card */}
              <View style={[styles.sellerCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                <View style={styles.sellerLeft}>
                  <View style={[styles.sellerAvatar, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
                    <Text style={[styles.sellerAvatarText, { color: colors.primary }]}>
                      {(selectedProduct.sellerName || "ST").slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <Text style={[styles.sellerName, { color: colors.textPrimary }]}>
                        {selectedProduct.sellerName || "Verified Student Seller"}
                      </Text>
                      <ShieldCheck size={13} color="#10B981" />
                    </View>
                    <TouchableOpacity
                      onPress={() => handleOpenGoogleMaps(selectedProduct.location)}
                      style={styles.locationMeta}
                      activeOpacity={0.7}
                    >
                      <MapPin size={11} color={colors.primary} />
                      <Text style={[styles.locationMetaText, { color: colors.primary }]}>
                        {selectedProduct.location}
                      </Text>
                      <Navigation size={10} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.trustScorePill}>
                  <Star size={11} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.trustScoreText}>
                    {selectedProduct.sellerTrust || 99}% Trust
                  </Text>
                </View>
              </View>

              {/* Item Specifications & Overview Card */}
              <View style={[styles.specsCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
                  {language === "am" ? "የዕቃው መግለጫና ሁኔታ" : "Item Specifications"}
                </Text>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Condition:</Text>
                  <Text style={[styles.specValue, { color: colors.textPrimary }]}>{selectedProduct.condition}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Location:</Text>
                  <Text style={[styles.specValue, { color: colors.textPrimary }]}>{selectedProduct.location}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, { color: colors.textSecondary }]}>Inspection Desk:</Text>
                  <Text style={[styles.specValue, { color: "#10B981" }]}>Campus Intermediary Hub</Text>
                </View>
              </View>

              {/* SafeTrade Buyer Protection Guarantee */}
              <View style={[styles.guaranteeBox, { backgroundColor: "rgba(16, 185, 129, 0.08)", borderColor: "rgba(16, 185, 129, 0.25)" }]}>
                <ShieldCheck size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.guaranteeTitle, { color: "#10B981" }]}>
                    {language === "am" ? "የሴፍ ትሬድ የገዢ ጥበቃ" : "100% SafeTrade Buyer Protection"}
                  </Text>
                  <Text style={[styles.guaranteeSub, { color: colors.textSecondary }]}>
                    {language === "am"
                      ? "ገንዘብዎ በኢስቱድ ደህንነቱ ተጠብቆ ይቆያል። እቃውን በካምፓስ ዴስክ ፈትሸው እስኪያረጋግጡ ድረስ ለሻጩ አይለቀቅም።"
                      : "Your money stays safe with Estud. The seller is only paid after you physically inspect and accept the item at the campus hub."}
                  </Text>
                </View>
              </View>

              {/* Primary Action Button */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  onPress={() => toggleFavorite(selectedProduct.id)}
                  style={[styles.favBtn, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}
                >
                  <Heart
                    size={20}
                    color={isFav ? "#EF4444" : colors.textMuted}
                    fill={isFav ? "#EF4444" : "transparent"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleProceedToCheckout}
                  activeOpacity={0.88}
                  style={[styles.buyBtn, { backgroundColor: colors.primary }]}
                >
                  <ShieldCheck size={18} color="#FFFFFF" />
                  <Text style={styles.buyBtnText}>
                    {language === "am" ? "በሴፍ ትሬድ ጥበቃ ግዛ" : "Buy with SafeTrade Protection"}
                  </Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            /* VIEW 2: SafeTrade Checkout */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.checkoutHeader}>
                <Text style={[styles.checkoutTitle, { color: colors.textPrimary }]}>
                  {language === "am" ? "የተጠበቀ ክፍያ ማረጋገጫ" : "SafeTrade Secure Checkout"}
                </Text>
                <Text style={[styles.checkoutSub, { color: colors.textSecondary }]}>
                  {selectedProduct.title} &bull; ETB {itemPrice.toLocaleString()}
                </Text>
              </View>

              {/* Handover Method Picker */}
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Choose Handover Method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  onPress={() => setCollectionMethod("hub")}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: collectionMethod === "hub" ? colors.primaryLight : colors.cardElevated,
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
                      backgroundColor: collectionMethod === "runner" ? colors.primaryLight : colors.cardElevated,
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

              {/* Professional Payment Method Selector */}
              <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>Select Payment Channel</Text>
              <View style={styles.payOptionsCol}>
                {/* Option 1: Telebirr */}
                <TouchableOpacity
                  onPress={() => setPaymentMethod("telebirr")}
                  activeOpacity={0.8}
                  style={[
                    styles.payOptionCard,
                    {
                      backgroundColor: paymentMethod === "telebirr" ? "rgba(0, 120, 212, 0.12)" : colors.cardElevated,
                      borderColor: paymentMethod === "telebirr" ? "#0078D4" : colors.border,
                    },
                  ]}
                >
                  <View style={styles.payOptionLeft}>
                    <View style={[styles.radioCircle, paymentMethod === "telebirr" && { borderColor: "#0078D4" }]}>
                      {paymentMethod === "telebirr" && <View style={[styles.radioDot, { backgroundColor: "#0078D4" }]} />}
                    </View>
                    <TelebirrLogo size={24} showText={false} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.payOptionTitle, { color: colors.textPrimary }]}>Telebirr SuperApp</Text>
                      <Text style={[styles.payOptionSub, { color: colors.textSecondary }]}>Official Estud Verified Merchant</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Option 2: CBE */}
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cbe")}
                  activeOpacity={0.8}
                  style={[
                    styles.payOptionCard,
                    {
                      backgroundColor: paymentMethod === "cbe" ? "rgba(88, 19, 106, 0.16)" : colors.cardElevated,
                      borderColor: paymentMethod === "cbe" ? "#8B2F9E" : colors.border,
                    },
                  ]}
                >
                  <View style={styles.payOptionLeft}>
                    <View style={[styles.radioCircle, paymentMethod === "cbe" && { borderColor: "#8B2F9E" }]}>
                      {paymentMethod === "cbe" && <View style={[styles.radioDot, { backgroundColor: "#8B2F9E" }]} />}
                    </View>
                    <CbeLogo size={24} showText={false} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.payOptionTitle, { color: colors.textPrimary }]}>Commercial Bank of Ethiopia (CBE)</Text>
                      <Text style={[styles.payOptionSub, { color: colors.textSecondary }]}>Direct Account / CBE Birr</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Option 3: Cash at Desk */}
                <TouchableOpacity
                  onPress={() => setPaymentMethod("cash")}
                  activeOpacity={0.8}
                  style={[
                    styles.payOptionCard,
                    {
                      backgroundColor: paymentMethod === "cash" ? "rgba(16, 185, 129, 0.12)" : colors.cardElevated,
                      borderColor: paymentMethod === "cash" ? "#10B981" : colors.border,
                    },
                  ]}
                >
                  <View style={styles.payOptionLeft}>
                    <View style={[styles.radioCircle, paymentMethod === "cash" && { borderColor: "#10B981" }]}>
                      {paymentMethod === "cash" && <View style={[styles.radioDot, { backgroundColor: "#10B981" }]} />}
                    </View>
                    <CashDeskLogo size={24} showText={false} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.payOptionTitle, { color: colors.textPrimary }]}>Cash at Campus Desk</Text>
                      <Text style={[styles.payOptionSub, { color: colors.textSecondary }]}>Pay upon physical item inspection</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Transfer Details Card */}
              {paymentMethod !== "cash" ? (
                <View style={[styles.accountCard, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                  <View style={styles.accountCardHeader}>
                    <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>
                      {paymentMethod === "telebirr" ? "Telebirr Merchant Code" : "CBE Secure Account"}:
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleCopyAccount(currentAccountNumber)}
                      style={[styles.copyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                      {copiedAccount ? <Check size={11} color="#10B981" /> : <Copy size={11} color={colors.primary} />}
                      <Text style={[styles.copyBtnText, { color: copiedAccount ? "#10B981" : colors.primary }]}>
                        {copiedAccount ? "Copied" : "Copy"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.accountNumberText, { color: colors.textPrimary }]}>
                    {currentAccountNumber}
                  </Text>
                  <Text style={[styles.accountNameText, { color: colors.textSecondary }]}>
                    {currentAccountName}
                  </Text>

                  {/* Transaction Reference Input */}
                  <View style={styles.refInputGroup}>
                    <Text style={[styles.refInputLabel, { color: colors.textPrimary }]}>
                      Reference Code *
                    </Text>
                    <TextInput
                      value={transactionRef}
                      onChangeText={setTransactionRef}
                      placeholder={paymentMethod === "telebirr" ? "e.g. 7GA829104" : "e.g. CBE-84920194"}
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
                  </View>

                  {/* Payment Receipt Proof */}
                  <View style={styles.proofUploadBox}>
                    <View style={styles.proofHeaderRow}>
                      <Text style={[styles.refInputLabel, { color: colors.textPrimary }]}>
                        Receipt Screenshot *
                      </Text>
                      <View style={styles.verifiedTagPill}>
                        <ShieldCheck size={11} color="#10B981" />
                        <Text style={styles.verifiedTagPillText}>Payment Proof</Text>
                      </View>
                    </View>

                    {screenshotProof ? (
                      <View style={[styles.proofPreviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Image source={{ uri: screenshotProof }} style={styles.proofThumb} />
                        <View style={styles.proofMetaInfo}>
                          <View style={styles.proofAttachedBadge}>
                            <CheckCircle2 size={12} color="#10B981" />
                            <Text style={styles.proofAttachedBadgeText}>Screenshot Attached</Text>
                          </View>
                          <View style={styles.proofActionsRow}>
                            <TouchableOpacity onPress={handlePickProofFromDevice} style={styles.proofActionPill}>
                              <Upload size={11} color={colors.primary} />
                              <Text style={[styles.proofActionPillText, { color: colors.primary }]}>Device</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCameraSnapProof} style={styles.proofActionPill}>
                              <Camera size={11} color={colors.primary} />
                              <Text style={[styles.proofActionPillText, { color: colors.primary }]}>Camera</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.proofEmptyCard, { borderColor: colors.border }]}>
                        <View style={styles.proofButtonsRow}>
                          <TouchableOpacity
                            onPress={handlePickProofFromDevice}
                            style={[styles.proofBtnPrimary, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                          >
                            <Upload size={13} color={colors.primary} />
                            <Text style={[styles.proofBtnPrimaryText, { color: colors.primary }]}>Pick Screenshot</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleCameraSnapProof}
                            style={[styles.proofBtnSecondary, { borderColor: colors.border, backgroundColor: colors.card }]}
                          >
                            <Camera size={13} color={colors.textPrimary} />
                            <Text style={[styles.proofBtnSecondaryText, { color: colors.textPrimary }]}>Camera</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={[styles.cashNoticeBox, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                  <Info size={16} color="#10B981" />
                  <Text style={[styles.cashNoticeText, { color: colors.textSecondary }]}>
                    No advance payment required. Bring ETB {totalAmount.toLocaleString()} to the campus intermediary desk when physically inspecting the item.
                  </Text>
                </View>
              )}

              {/* Clean Pricing Breakdown */}
              <View style={[styles.breakdownBox, { backgroundColor: colors.cardElevated, borderColor: colors.border }]}>
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Price:</Text>
                  <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>ETB {itemPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Buyer Protection (5%):</Text>
                  <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>+ETB {escrowFee.toLocaleString()}</Text>
                </View>
                {collectionMethod === "runner" && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>Runner Delivery:</Text>
                    <Text style={[styles.breakdownVal, { color: colors.textPrimary }]}>+ETB {runnerFee}</Text>
                  </View>
                )}
                <View style={[styles.breakdownRow, styles.breakdownTotal, { borderTopColor: colors.border }]}>
                  <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>Total:</Text>
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
                  Pay ETB {totalAmount.toLocaleString()} (SafeTrade Protected)
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
    backgroundColor: "rgba(7, 13, 30, 0.85)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "92%",
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  backBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageWrapper: {
    width: "100%",
    height: 190,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 12,
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
    backgroundColor: "rgba(16, 185, 129, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  escrowBadgeTopText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  titleSection: {
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  priceText: {
    fontSize: 22,
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
    marginBottom: 12,
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
  specsCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  specValue: {
    fontSize: 11,
    fontWeight: "700",
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  guaranteeTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 2,
  },
  guaranteeSub: {
    fontSize: 10,
    lineHeight: 14,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  buyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 16,
  },
  buyBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  checkoutHeader: {
    marginBottom: 14,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  checkoutSub: {
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 11,
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
  payOptionsCol: {
    gap: 8,
    marginBottom: 12,
  },
  payOptionCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  payOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  payOptionTitle: {
    fontSize: 12,
    fontWeight: "800",
  },
  payOptionSub: {
    fontSize: 10,
    marginTop: 1,
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
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  accountNameText: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 8,
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
    fontSize: 13,
    fontFamily: "monospace",
    fontWeight: "700",
  },
  cashNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  cashNoticeText: {
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
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
    fontSize: 16,
    fontWeight: "900",
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
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
    width: 68,
    height: 68,
    borderRadius: 34,
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
  pinExpireBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginVertical: 4,
  },
  pinExpireText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#D97706",
  },
  confirmedScreenshotCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 14,
  },
  confirmedScreenshotHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  confirmedScreenshotTitle: {
    fontSize: 11,
    fontWeight: "800",
  },
  confirmedScreenshotImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  proofUploadBox: {
    marginTop: 12,
  },
  proofHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  verifiedTagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedTagPillText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#10B981",
  },
  proofPreviewCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    gap: 10,
    alignItems: "center",
  },
  proofThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  proofMetaInfo: {
    flex: 1,
    gap: 4,
  },
  proofAttachedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  proofAttachedBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#10B981",
  },
  proofActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  proofActionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: "rgba(29, 107, 243, 0.08)",
  },
  proofActionPillText: {
    fontSize: 10,
    fontWeight: "800",
  },
  proofEmptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 12,
    gap: 8,
  },
  proofButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  proofBtnPrimary: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  proofBtnPrimaryText: {
    fontSize: 11,
    fontWeight: "800",
  },
  proofBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  proofBtnSecondaryText: {
    fontSize: 11,
    fontWeight: "700",
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
