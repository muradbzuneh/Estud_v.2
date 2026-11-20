import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Tag,
  Repeat,
  Sparkles,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Loader2,
  Clock,
} from "lucide-react-native";
import { useApp, ETHIOPIAN_CAMPUSES } from "../context/AppContext";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";
import { pickImageFromDevice, takePhotoWithCamera } from "../utils/imagePicker";

const SAMPLE_PHOTO_PRESETS = [
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
];

const CATEGORY_OPTIONS = [
  { id: "laptops", label: "Laptops" },
  { id: "phones", label: "Phones" },
  { id: "books", label: "Books" },
  { id: "fashion", label: "Fashion" },
  { id: "sports", label: "Dorm" },
];

const CONDITION_OPTIONS = [
  "Brand New",
  "Like New",
  "Good",
  "Fair",
];

export function SellScreen() {
  const { isAuthenticated, setAuthModalVisible, addProduct, currentCampus, setActiveTab, colors, t, language } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("laptops");
  const [campus, setCampus] = useState(currentCampus);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[1]);
  const [price, setPrice] = useState("");
  const [isBarterOpen, setIsBarterOpen] = useState(false);
  const [barterPreference, setBarterPreference] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submittedProduct, setSubmittedProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const buyerEscrowFee = Math.round(numericPrice * 0.05);
  const isDark = colors.mode === "dark";

  // Pick photo from device gallery (files/photos)
  const handlePickFromDevice = async () => {
    if (photos.length >= 5) {
      showErrorToast(
        language === "am" ? "የፎቶ ገደብ" : "Photo Limit",
        "You can upload up to 5 photos max."
      );
      return;
    }
    const uri = await pickImageFromDevice();
    if (uri) {
      setPhotos([...photos, uri]);
      showSuccessToast(
        language === "am" ? "ፎቶ ከመሳሪያዎ ተጨምሯል" : "Photo Added from Device",
        `Listing now has ${photos.length + 1} photos`
      );
    }
  };

  // Capture photo with device camera
  const handleCameraSnap = async () => {
    if (photos.length >= 5) {
      showErrorToast(
        language === "am" ? "የፎቶ ገደብ" : "Photo Limit",
        "You can upload up to 5 photos max."
      );
      return;
    }
    const uri = await takePhotoWithCamera();
    if (uri) {
      setPhotos([...photos, uri]);
      showSuccessToast(
        language === "am" ? "ካሜራ ፎቶ ተጨምሯል" : "Camera Photo Captured",
        `Listing now has ${photos.length + 1} photos`
      );
    }
  };

  // Quick preset sample photo
  const handleAddSamplePreset = () => {
    if (photos.length >= 5) {
      showErrorToast(
        language === "am" ? "የፎቶ ገደብ" : "Photo Limit",
        "You can upload up to 5 photos max."
      );
      return;
    }
    const nextPhoto = SAMPLE_PHOTO_PRESETS[photos.length % SAMPLE_PHOTO_PRESETS.length];
    setPhotos([...photos, nextPhoto]);
    showSuccessToast(
      language === "am" ? "የሙከራ ፎቶ ተጨምሯል" : "Sample Photo Added",
      `Listing has ${photos.length + 1} photos`
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setAuthModalVisible(true);
      return;
    }
    if (photos.length === 0) {
      showErrorToast(
        language === "am" ? "ፎቶ ያስፈልጋል" : "Photo Required",
        language === "am"
          ? "እባክዎ ከመሳሪያዎ ወይም በካሜራ ቢያንስ 1 የዕቃዎን ፎቶ ያያይዙ"
          : "Please upload at least one photo of your item from your device or camera."
      );
      return;
    }
    if (!title.trim() || title.trim().length < 3) {
      showErrorToast(
        language === "am" ? "የዕቃው ስም ይጎድላል" : "Missing Title",
        language === "am"
          ? "እባክዎ ትክክለኛ የዕቃ ስም ያስገቡ (ቢያንስ 3 ፊደላት)"
          : "Please enter a descriptive item title (at least 3 characters)"
      );
      return;
    }
    if (numericPrice <= 0) {
      showErrorToast(
        language === "am" ? "ዋጋ ያስገቡ" : "Invalid Price",
        "Please enter a valid asking price in ETB"
      );
      return;
    }

    setIsSubmitting(true);

    const newProd = {
      title: title.trim(),
      category,
      condition,
      price: numericPrice,
      originalPrice: Math.round(numericPrice * 1.25),
      location: campus,
      imageUrl: photos[0],
      badge: "New" as const,
    };

    try {
      await addProduct(newProd);
      setSubmittedProduct(newProd);
    } catch {
      // Handled in addProduct
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setPrice("");
    setPhotos([]);
    setBarterPreference("");
    setIsBarterOpen(false);
    setSubmittedProduct(null);
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.authRequiredContainer, { backgroundColor: colors.background }]}>
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[styles.authRequiredCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.authIconCircle, { backgroundColor: colors.primaryLight }]}>
            <ShieldCheck size={38} color={colors.primary} />
          </View>
          <Text style={[styles.authRequiredTitle, { color: colors.textPrimary }]}>
            {language === "am" ? "የተረጋገጠ የተማሪ መለያ ያስፈልጋል" : "Verified Student Account Required"}
          </Text>
          <Text style={[styles.authRequiredSub, { color: colors.textSecondary }]}>
            {language === "am"
              ? "የካምፓስ ገበያውን ደህንነትና የኤስክሮው ዋስትና ለመጠበቅ ዕቃዎችን ለመሸጥና ለመለጠፍ የተረጋገጠ የተማሪ መለያ መግባት አለበት።"
              : "To protect student escrow funds and ensure safety, you must sign in with a verified student account to list items."}
          </Text>
          <TouchableOpacity
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.88}
            style={[styles.actionBtnPrimary, { backgroundColor: colors.primary, marginTop: 16 }]}
          >
            <Text style={styles.actionBtnPrimaryText}>
              {language === "am" ? "ይግቡ ወይም ይመዝገቡ" : "Sign In to List Items"}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }

  if (submittedProduct) {
    return (
      <ScrollView contentContainerStyle={[styles.successContainer, { backgroundColor: colors.background }]}>
        <Animatable.View animation="zoomIn" duration={450} style={[styles.successIconCircle, { backgroundColor: "#FE9901" + "20" }]}>
          <Clock size={48} color="#FE9901" />
        </Animatable.View>
        <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
          {language === "am" ? "ለአድሚን ግምገማ ቀርቧል!" : "Submitted for Admin Review!"}
        </Text>
        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
          {language === "am"
            ? `ዕቃዎ "${submittedProduct.title}" ወደ አድሚን ግምገማ ገብቷል። ጥራቱና ዋጋው ተረጋግጦ ሲፈቀድ በ${campus} ገበያ ላይ ወዲያውኑ ይታያል።`
            : `Your item "${submittedProduct.title}" is queued for Admin review. Once approved, it will appear live across ${campus}.`}
        </Text>

        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[styles.liveSummaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Image source={{ uri: submittedProduct.imageUrl }} style={styles.liveSummaryImage} />
          <View style={styles.liveSummaryInfo}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#FE9901" }} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#FE9901", textTransform: "uppercase" }}>
                Pending Admin Approval
              </Text>
            </View>
            <Text style={[styles.liveSummaryTitle, { color: colors.textPrimary }]}>{submittedProduct.title}</Text>
            <Text style={[styles.liveSummaryPrice, { color: colors.primary }]}>
              ETB {submittedProduct.price.toLocaleString()}
            </Text>
            <View style={styles.sellerFeeHighlight}>
              <Text style={styles.sellerFeeHighlightText}>0% Seller Fee - 100% Payout Upon Escrow Release</Text>
            </View>
          </View>
        </Animatable.View>

        <TouchableOpacity
          onPress={() => {
            handleResetForm();
            setActiveTab("home");
          }}
          activeOpacity={0.88}
          style={[styles.actionBtnPrimary, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.actionBtnPrimaryText}>
            {language === "am" ? "ወደ መነሻ ገጽ ተመለስ" : "Return to Home Feed"}
          </Text>
          <ArrowRight size={15} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetForm}
          activeOpacity={0.8}
          style={[styles.actionBtnSecondary, { backgroundColor: isDark ? colors.cardElevated : "#F1F5F9" }]}
        >
          <Text style={[styles.actionBtnSecondaryText, { color: colors.textSecondary }]}>
            {language === "am" ? "ሌላ ዕቃ ለመሸጥ ይለጥፉ" : "List Another Item"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>{t.sellTitle}</Text>
      <Text style={[styles.screenSubtitle, { color: colors.textSecondary }]}>{t.sellSubtitle}</Text>

      {/* Step 1: Photos */}
      <Animatable.View
        animation="fadeInUp"
        duration={450}
        style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.stepBadgeText, { color: colors.primary }]}>1</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t.step1Photo} ({photos.length}/5)
          </Text>
        </View>

        {photos.length === 0 ? (
          <View style={[styles.photoEmptyDropZone, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
            <View style={[styles.photoEmptyIconCircle, { backgroundColor: colors.primaryLight }]}>
              <Upload size={22} color={colors.primary} />
            </View>
            <Text style={[styles.photoEmptyTitle, { color: colors.textPrimary }]}>
              {language === "am" ? "የዕቃ ፎቶ ያያይዙ" : "Upload Photos"}
            </Text>
            <Text style={[styles.photoEmptySub, { color: colors.textSecondary }]}>
              {language === "am" ? "1 እስከ 5 ፎቶዎች" : "1 to 5 photos"}
            </Text>
            <View style={styles.uploadActionsRow}>
              <TouchableOpacity
                onPress={handlePickFromDevice}
                activeOpacity={0.85}
                style={[styles.uploadActionButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
              >
                <Upload size={14} color={colors.primary} />
                <Text style={[styles.uploadActionText, { color: colors.primary }]}>
                  {language === "am" ? "መሳሪያ" : "Device"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCameraSnap}
                activeOpacity={0.85}
                style={[styles.uploadActionButton, { backgroundColor: isDark ? colors.cardElevated : "#F1F5F9", borderColor: colors.border }]}
              >
                <Camera size={14} color={colors.textPrimary} />
                <Text style={[styles.uploadActionText, { color: colors.textPrimary }]}>
                  {language === "am" ? "ካሜራ" : "Camera"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {photos.map((uri, idx) => (
                <View key={idx} style={[styles.photoThumbWrapper, { borderColor: colors.border }]}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  <TouchableOpacity
                    onPress={() => handleRemovePhoto(idx)}
                    style={styles.removePhotoBtn}
                  >
                    <Trash2 size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                  {idx === 0 && (
                    <View style={styles.primaryCoverBadge}>
                      <Text style={styles.primaryCoverBadgeText}>Cover</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            {photos.length < 5 && (
              <View style={styles.uploadActionsRow}>
                <TouchableOpacity
                  onPress={handlePickFromDevice}
                  activeOpacity={0.85}
                  style={[styles.uploadActionButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
                >
                  <Upload size={14} color={colors.primary} />
                  <Text style={[styles.uploadActionText, { color: colors.primary }]}>
                    {language === "am" ? "መሳሪያ" : "Device"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCameraSnap}
                  activeOpacity={0.85}
                  style={[styles.uploadActionButton, { backgroundColor: isDark ? colors.cardElevated : "#F1F5F9", borderColor: colors.border }]}
                >
                  <Camera size={14} color={colors.textPrimary} />
                  <Text style={[styles.uploadActionText, { color: colors.textPrimary }]}>
                    {language === "am" ? "ካሜራ" : "Camera"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </Animatable.View>

      {/* Step 2: Item Details */}
      <Animatable.View
        animation="fadeInUp"
        duration={500}
        style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.stepBadgeText, { color: colors.primary }]}>2</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t.step2Specs}</Text>
        </View>

        {/* Title */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.itemTitleLabel}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={language === "am" ? "ለምሳሌ፡ ላፕቶፕ ወይም መጽሐፍ" : "e.g. Dell Laptop or Textbook"}
          placeholderTextColor={colors.textMuted}
          style={[styles.inputField, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
        />

        {/* Category */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.categoryLabel}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRowScroll}>
          {CATEGORY_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[
                styles.chipPill,
                {
                  backgroundColor: category === c.id ? colors.primaryLight : colors.inputBg,
                  borderColor: category === c.id ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipPillText,
                  { color: category === c.id ? colors.primary : colors.textSecondary },
                  category === c.id && { fontWeight: "800" },
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Campus Hub */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.campusHubLabel}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRowScroll}>
          {ETHIOPIAN_CAMPUSES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCampus(c)}
              style={[
                styles.chipPill,
                {
                  backgroundColor: campus === c ? colors.primaryLight : colors.inputBg,
                  borderColor: campus === c ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipPillText,
                  { color: campus === c ? colors.primary : colors.textSecondary },
                  campus === c && { fontWeight: "800" },
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Condition */}
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.conditionLabel}</Text>
        <View style={styles.conditionRow}>
          {CONDITION_OPTIONS.map((cond) => (
            <TouchableOpacity
              key={cond}
              onPress={() => setCondition(cond)}
              style={[
                styles.conditionChip,
                {
                  backgroundColor: condition === cond ? colors.primaryLight : colors.inputBg,
                  borderColor: condition === cond ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.conditionChipText,
                  { color: condition === cond ? colors.primary : colors.textSecondary },
                  condition === cond && { fontWeight: "800" },
                ]}
              >
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animatable.View>

      {/* Step 3: Pricing */}
      <Animatable.View
        animation="fadeInUp"
        duration={550}
        style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.stepBadgeText, { color: colors.primary }]}>3</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t.step3Pricing}</Text>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{t.askingPriceLabel}</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="2500"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          style={[styles.priceInputField, { backgroundColor: colors.inputBg, borderColor: colors.primary, color: colors.primary }]}
        />

        {/* Clean Payout Box */}
        <View style={[styles.payoutBox, { backgroundColor: isDark ? colors.cardElevated : "#F8FAFC", borderColor: colors.border }]}>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, { color: colors.textSecondary }]}>{t.guaranteedPayoutLabel}</Text>
            <Text style={[styles.payoutHighlightValue, { color: colors.accent }]}>ETB {numericPrice.toLocaleString()}</Text>
          </View>
          <Text style={{ fontSize: 11, color: "#10B981", fontWeight: "700", marginTop: 4 }}>
            ✓ 0% Seller Fee &bull; 100% Payout
          </Text>
        </View>
      </Animatable.View>

      {/* Step 4: Barter Option */}
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        style={[styles.cardSection, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.barterHeaderRow}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
              <Text style={[styles.stepBadgeText, { color: colors.primary }]}>4</Text>
            </View>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t.step4Barter}</Text>
              <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>{t.barterToggleLabel}</Text>
            </View>
          </View>
          <Switch
            value={isBarterOpen}
            onValueChange={setIsBarterOpen}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isBarterOpen ? colors.primary : "#CBD5E1"}
          />
        </View>

        {isBarterOpen && (
          <View style={styles.barterInputBox}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {language === "am" ? "የልውውጥ ምርጫ (አማራጭ)" : "Trade Item (Optional)"}
            </Text>
            <TextInput
              value={barterPreference}
              onChangeText={setBarterPreference}
              placeholder={language === "am" ? "ለምሳሌ፡ iPad ወይም ስልክ" : "e.g. iPad, iPhone, or Calculator"}
              placeholderTextColor={colors.textMuted}
              style={[styles.inputField, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]}
            />
          </View>
        )}
      </Animatable.View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.88}
        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
      >
        <ShieldCheck size={18} color="#FFFFFF" />
        <Text style={styles.submitBtnText}>{t.submitListingBtn}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  feeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
  },
  feeBannerText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B45309",
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 17,
  },
  cardSection: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
  },
  sectionSub: {
    fontSize: 10,
    marginTop: 2,
    maxWidth: "88%",
  },
  photosScroll: {
    flexDirection: "row",
  },
  photoThumbWrapper: {
    position: "relative",
    width: 78,
    height: 78,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 10,
    borderWidth: 1,
  },
  primaryCoverBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryCoverBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  photoEmptyDropZone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  photoEmptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  photoEmptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  photoEmptySub: {
    fontSize: 11,
    marginBottom: 12,
  },
  uploadActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  uploadActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  uploadActionText: {
    fontSize: 12,
    fontWeight: "800",
  },
  photoThumb: {
    width: "100%",
    height: "100%",
  },
  removePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoBtn: {
    width: 78,
    height: 78,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 8,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  priceInputField: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "900",
  },
  chipRowScroll: {
    flexDirection: "row",
    marginBottom: 6,
  },
  chipPill: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  chipPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  conditionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  conditionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  conditionChipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  payoutBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    gap: 6,
  },
  payoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payoutLabel: {
    fontSize: 11,
  },
  payoutValue: {
    fontSize: 11,
    fontWeight: "700",
  },
  payoutHighlightRow: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
  },
  payoutHighlightLabel: {
    fontSize: 12,
    fontWeight: "800",
  },
  payoutHighlightValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#10B981", // Green payout
  },
  barterHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barterInputBox: {
    marginTop: 10,
  },
  submitBtn: {
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
    marginTop: 8,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  successContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  successSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 20,
  },
  liveSummaryBox: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  liveSummaryImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  liveSummaryInfo: {
    flex: 1,
  },
  liveSummaryTitle: {
    fontSize: 13,
    fontWeight: "800",
  },
  liveSummaryPrice: {
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  sellerFeeHighlight: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  sellerFeeHighlightText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#059669",
  },
  actionBtnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 10,
  },
  actionBtnPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  actionBtnSecondary: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: "center",
  },
  actionBtnSecondaryText: {
    fontSize: 13,
    fontWeight: "700",
  },
  authRequiredContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    justifyContent: "center",
  },
  authRequiredCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  authIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  authRequiredTitle: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  authRequiredSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 16,
  },
});
