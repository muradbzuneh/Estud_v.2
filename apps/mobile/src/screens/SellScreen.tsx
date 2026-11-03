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
} from "lucide-react-native";
import { useApp, ETHIOPIAN_CAMPUSES } from "../context/AppContext";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";

const SAMPLE_PHOTO_PRESETS = [
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
];

const CATEGORY_OPTIONS = [
  { id: "laptops", label: "Laptops & Electronics" },
  { id: "phones", label: "Phones & Gadgets" },
  { id: "books", label: "Books & Study Materials" },
  { id: "fashion", label: "Fashion & Backpacks" },
  { id: "sports", label: "Dorm & Living" },
];

const CONDITION_OPTIONS = [
  "Brand New • Sealed",
  "Used • Like New",
  "Used • Good Condition",
  "Used • Fair",
];

export function SellScreen() {
  const { addProduct, currentCampus, setActiveTab, colors, t, language } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("laptops");
  const [campus, setCampus] = useState(currentCampus);
  const [condition, setCondition] = useState(CONDITION_OPTIONS[1]);
  const [price, setPrice] = useState("");
  const [isBarterOpen, setIsBarterOpen] = useState(false);
  const [barterPreference, setBarterPreference] = useState("");
  const [photos, setPhotos] = useState<string[]>([SAMPLE_PHOTO_PRESETS[0]]);
  const [submittedProduct, setSubmittedProduct] = useState<any | null>(null);

  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const buyerEscrowFee = Math.round(numericPrice * 0.05);
  const isDark = colors.mode === "dark";

  const handleAddPhoto = () => {
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
      language === "am" ? "ፎቶ ተጨምሯል" : "Photo Added",
      `Listing has ${photos.length + 1} photos`
    );
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length === 1) {
      showErrorToast(
        language === "am" ? "ቢያንስ 1 ፎቶ ያስፈልጋል" : "Photo Required",
        "Your listing must have at least one photo."
      );
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      showErrorToast(
        language === "am" ? "የዕቃው ስም ይጎድላል" : "Missing Title",
        "Please enter a descriptive item title"
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

    addProduct(newProd);
    setSubmittedProduct(newProd);
  };

  const handleResetForm = () => {
    setTitle("");
    setPrice("");
    setBarterPreference("");
    setIsBarterOpen(false);
    setSubmittedProduct(null);
  };

  if (submittedProduct) {
    return (
      <ScrollView contentContainerStyle={[styles.successContainer, { backgroundColor: colors.background }]}>
        <Animatable.View animation="zoomIn" duration={450} style={styles.successIconCircle}>
          <CheckCircle2 size={52} color="#10B981" />
        </Animatable.View>
        <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
          {language === "am" ? "ዕቃው በተሳካ ሁኔታ ተለጥፏል!" : "Listing Published Live!"}
        </Text>
        <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
          {language === "am"
            ? `ዕቃዎ "${submittedProduct.title}" በ${campus} ላሉ ተማሪዎች ክፍት ሆኗል።`
            : `Your item "${submittedProduct.title}" is now visible to students across ${campus}.`}
        </Text>

        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[styles.liveSummaryBox, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Image source={{ uri: submittedProduct.imageUrl }} style={styles.liveSummaryImage} />
          <View style={styles.liveSummaryInfo}>
            <Text style={[styles.liveSummaryTitle, { color: colors.textPrimary }]}>{submittedProduct.title}</Text>
            <Text style={[styles.liveSummaryPrice, { color: colors.primary }]}>
              ETB {submittedProduct.price.toLocaleString()}
            </Text>
            <View style={styles.sellerFeeHighlight}>
              <Text style={styles.sellerFeeHighlightText}>0% Seller Fee - 100% Payout Guaranteed</Text>
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
          style={[styles.actionBtnSecondary, { backgroundColor: isDark ? "#0A1628" : "#F1F5F9" }]}
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
      {/* 0% Fee Banner with Animation */}
      <Animatable.View animation="fadeInDown" duration={400} style={styles.feeBanner}>
        <Sparkles size={16} color="#B45309" />
        <Text style={styles.feeBannerText}>{t.sellBannerText}</Text>
      </Animatable.View>

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
            </View>
          ))}

          {photos.length < 5 && (
            <TouchableOpacity
              onPress={handleAddPhoto}
              style={[
                styles.addPhotoBtn,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.primaryLight,
                },
              ]}
            >
              <Camera size={20} color={colors.primary} />
              <Text style={[styles.addPhotoText, { color: colors.primary }]}>+ Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
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
          placeholder="e.g. Dell Inspiron 15 (16GB RAM) or Organic Chemistry 8th Ed"
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

      {/* Step 3: Pricing & Guaranteed Payout Calculator */}
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
          placeholder="e.g. 2500"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          style={[styles.priceInputField, { backgroundColor: colors.inputBg, borderColor: colors.primary, color: colors.primary }]}
        />

        {/* Live Guaranteed Payout Box */}
        <View style={[styles.payoutBox, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, { color: colors.textSecondary }]}>Your Asking Price:</Text>
            <Text style={[styles.payoutValue, { color: colors.textPrimary }]}>ETB {numericPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, { color: colors.textSecondary }]}>Seller Platform Fee (0%):</Text>
            <Text style={[styles.payoutValue, { color: "#10B981" }]}>ETB 0 (FREE)</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={[styles.payoutLabel, { color: colors.textSecondary }]}>Buyer Escrow Fee (+5%):</Text>
            <Text style={[styles.payoutValue, { color: colors.textSecondary }]}>+ETB {buyerEscrowFee.toLocaleString()}</Text>
          </View>
          <View style={[styles.payoutRow, styles.payoutHighlightRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.payoutHighlightLabel, { color: colors.textPrimary }]}>
              {t.guaranteedPayoutLabel}
            </Text>
            <Text style={styles.payoutHighlightValue}>ETB {numericPrice.toLocaleString()}</Text>
          </View>
        </View>
      </Animatable.View>

      {/* Step 4: Barter / Exchange Option */}
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
              What would you exchange this for? (Optional)
            </Text>
            <TextInput
              value={barterPreference}
              onChangeText={setBarterPreference}
              placeholder="e.g. Willing to trade for iPad 9th Gen or iPhone 11"
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
});
