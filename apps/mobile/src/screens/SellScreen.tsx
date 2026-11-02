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
  Alert,
} from "react-native";
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
  const { addProduct, currentCampus, setActiveTab, setSelectedProduct } = useApp();

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

  const handleAddPhoto = () => {
    if (photos.length >= 5) {
      Alert.alert("Photo Limit", "You can upload up to 5 photos max.");
      return;
    }
    const nextPhoto = SAMPLE_PHOTO_PRESETS[photos.length % SAMPLE_PHOTO_PRESETS.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    if (photos.length === 1) {
      Alert.alert("At Least 1 Photo", "Your listing must have at least one photo.");
      return;
    }
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a descriptive item title.");
      return;
    }
    if (numericPrice <= 0) {
      Alert.alert("Missing Price", "Please enter a valid asking price in ETB.");
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
      <ScrollView contentContainerStyle={styles.successContainer}>
        <View style={styles.successIconCircle}>
          <CheckCircle2 size={52} color="#10B981" />
        </View>
        <Text style={styles.successTitle}>Listing Published Live!</Text>
        <Text style={styles.successSubtitle}>
          Your item "{submittedProduct.title}" is now visible to students across {campus}.
        </Text>

        <View style={styles.liveSummaryBox}>
          <Image source={{ uri: submittedProduct.imageUrl }} style={styles.liveSummaryImage} />
          <View style={styles.liveSummaryInfo}>
            <Text style={styles.liveSummaryTitle}>{submittedProduct.title}</Text>
            <Text style={styles.liveSummaryPrice}>ETB {submittedProduct.price.toLocaleString()}</Text>
            <View style={styles.sellerFeeHighlight}>
              <Text style={styles.sellerFeeHighlightText}>0% Seller Fee - 100% Payout Guaranteed</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleResetForm();
            setActiveTab("home");
          }}
          activeOpacity={0.88}
          style={styles.actionBtnPrimary}
        >
          <Text style={styles.actionBtnPrimaryText}>Return to Home Feed</Text>
          <ArrowRight size={15} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetForm}
          activeOpacity={0.8}
          style={styles.actionBtnSecondary}
        >
          <Text style={styles.actionBtnSecondaryText}>List Another Item</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* 0% Fee Banner */}
      <View style={styles.feeBanner}>
        <Sparkles size={16} color="#B45309" />
        <Text style={styles.feeBannerText}>
          0% Seller Fee &bull; 100% Cash to You via Campus SafeTrade Escrow
        </Text>
      </View>

      <Text style={styles.screenTitle}>List an Item for Sale / Exchange</Text>
      <Text style={styles.screenSubtitle}>
        Sell directly to fellow students across Ethiopian universities with safe escrow handover.
      </Text>

      {/* Step 1: Photos */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
          <Text style={styles.sectionTitle}>Upload Photos ({photos.length}/5)</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoThumbWrapper}>
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
            <TouchableOpacity onPress={handleAddPhoto} style={styles.addPhotoBtn}>
              <Camera size={20} color="#1D6BF3" />
              <Text style={styles.addPhotoText}>+ Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Step 2: Item Details */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
          <Text style={styles.sectionTitle}>Item Specifications</Text>
        </View>

        {/* Title */}
        <Text style={styles.fieldLabel}>Item Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Dell Inspiron 15 (16GB RAM) or Organic Chemistry 8th Ed"
          placeholderTextColor="#94A3B8"
          style={styles.inputField}
        />

        {/* Category */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRowScroll}>
          {CATEGORY_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[styles.chipPill, category === c.id && styles.chipPillActive]}
            >
              <Text style={[styles.chipPillText, category === c.id && styles.chipPillTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Campus Hub */}
        <Text style={styles.fieldLabel}>Campus Hub *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRowScroll}>
          {ETHIOPIAN_CAMPUSES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCampus(c)}
              style={[styles.chipPill, campus === c && styles.chipPillActive]}
            >
              <Text style={[styles.chipPillText, campus === c && styles.chipPillTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Condition */}
        <Text style={styles.fieldLabel}>Condition Grade *</Text>
        <View style={styles.conditionRow}>
          {CONDITION_OPTIONS.map((cond) => (
            <TouchableOpacity
              key={cond}
              onPress={() => setCondition(cond)}
              style={[styles.conditionChip, condition === cond && styles.conditionChipActive]}
            >
              <Text style={[styles.conditionChipText, condition === cond && styles.conditionChipTextActive]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Step 3: Pricing & Guaranteed Payout Calculator */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
          <Text style={styles.sectionTitle}>Pricing & Guaranteed Payout</Text>
        </View>

        <Text style={styles.fieldLabel}>Asking Price (ETB) *</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 2500"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          style={styles.priceInputField}
        />

        {/* Live Guaranteed Payout Box */}
        <View style={styles.payoutBox}>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Your Asking Price:</Text>
            <Text style={styles.payoutValue}>ETB {numericPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Seller Platform Fee (0%):</Text>
            <Text style={[styles.payoutValue, { color: "#10B981" }]}>ETB 0 (FREE)</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Buyer Escrow Protection Fee (+5%):</Text>
            <Text style={styles.payoutValue}>+ETB {buyerEscrowFee.toLocaleString()} (Paid by buyer)</Text>
          </View>
          <View style={[styles.payoutRow, styles.payoutHighlightRow]}>
            <Text style={styles.payoutHighlightLabel}>Your Guaranteed Payout at Campus Desk:</Text>
            <Text style={styles.payoutHighlightValue}>ETB {numericPrice.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Step 4: Barter / Exchange Option */}
      <View style={styles.cardSection}>
        <View style={styles.barterHeaderRow}>
          <View style={styles.sectionHeader}>
            <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>4</Text></View>
            <View>
              <Text style={styles.sectionTitle}>Open for Item Exchange / Barter?</Text>
              <Text style={styles.sectionSub}>Allow students to offer another item with cash balance.</Text>
            </View>
          </View>
          <Switch
            value={isBarterOpen}
            onValueChange={setIsBarterOpen}
            trackColor={{ false: "#CBD5E1", true: "#BFDBFE" }}
            thumbColor={isBarterOpen ? "#1D6BF3" : "#F1F5F9"}
          />
        </View>

        {isBarterOpen && (
          <View style={styles.barterInputBox}>
            <Text style={styles.fieldLabel}>What would you exchange this for? (Optional)</Text>
            <TextInput
              value={barterPreference}
              onChangeText={setBarterPreference}
              placeholder="e.g. Willing to trade for iPad 9th Gen or iPhone 11"
              placeholderTextColor="#94A3B8"
              style={styles.inputField}
            />
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.88}
        style={styles.submitBtn}
      >
        <ShieldCheck size={18} color="#FFFFFF" />
        <Text style={styles.submitBtnText}>Submit Listing for Campus Review</Text>
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
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    marginBottom: 16,
    lineHeight: 17,
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D6BF3",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  sectionSub: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
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
    borderColor: "#E2E8F0",
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
    borderColor: "#1D6BF3",
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1D6BF3",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 8,
  },
  inputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
  },
  priceInputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#1D6BF3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#1D6BF3",
  },
  chipRowScroll: {
    flexDirection: "row",
    marginBottom: 6,
  },
  chipPill: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  chipPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  chipPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  chipPillTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
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
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  conditionChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  conditionChipText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  conditionChipTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  payoutBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#64748B",
  },
  payoutValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
  },
  payoutHighlightRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    marginTop: 4,
  },
  payoutHighlightLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
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
    backgroundColor: "#1D6BF3",
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
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
    color: "#0F172A",
  },
  successSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 20,
  },
  liveSummaryBox: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
    color: "#0F172A",
  },
  liveSummaryPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1D6BF3",
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
    backgroundColor: "#1D6BF3",
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
    backgroundColor: "#F1F5F9",
  },
  actionBtnSecondaryText: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },
});
