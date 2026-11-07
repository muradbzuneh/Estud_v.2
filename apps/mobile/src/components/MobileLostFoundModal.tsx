import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  X,
  Search,
  PlusCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Phone,
  Sparkles,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { showSuccessToast, showInfoToast } from "../utils/toast";

interface MobileLostFoundModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Item {
  id: string;
  type: "LOST" | "FOUND";
  title: string;
  category: string;
  campus: string;
  location: string;
  date: string;
  description: string;
  status: "OPEN" | "CLAIM_SUBMITTED" | "VERIFIED_RECOVERED";
  imageUrl?: string;
}

const INITIAL_MOBILE_ITEMS: Item[] = [
  {
    id: "m-lf-1",
    type: "FOUND",
    title: "AAU Student ID Card (Dawit K.)",
    category: "Student ID Cards",
    campus: "AAU 4 Kilo (Science)",
    location: "Courtyard Benches outside Biology",
    date: "Today, 10:30 AM",
    description: "Turned over to Safe Hub Gate 1. ID card matches College of Natural Sciences.",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "m-lf-2",
    type: "LOST",
    title: "Casio FX-991EX ClassWiz Calculator",
    category: "Calculators & Tech",
    campus: "AAU 5 Kilo (AAiT)",
    location: "Lecture Hall 302 / 3rd Floor",
    date: "Yesterday, 3:15 PM",
    description: "Lost during exam. Has a yellow periodic table sticker on the back cover.",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "m-lf-3",
    type: "FOUND",
    title: "Dorm Room Keys with Red Leather Tag",
    category: "Dorm Keys",
    campus: "AAU 6 Kilo (Main Campus)",
    location: "Kennedy Library walkway",
    date: "Nov 04, 2026",
    description: "Pair of brass keys on a red circular tag held at Gate 1 office.",
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80",
  },
];

export function MobileLostFoundModal({ visible, onClose }: MobileLostFoundModalProps) {
  const { colors, currentCampus, language } = useApp();
  const [activeTab, setActiveTab] = useState<"ALL" | "FOUND" | "LOST">("ALL");
  const [isReporting, setIsReporting] = useState(false);
  const [reportType, setReportType] = useState<"LOST" | "FOUND">("FOUND");
  const [items, setItems] = useState<Item[]>(INITIAL_MOBILE_ITEMS);

  // Form inputs
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Student ID Cards");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSecretMark, setFormSecretMark] = useState("");

  // Claim modal state
  const [claimingItem, setClaimingItem] = useState<Item | null>(null);
  const [claimProof, setClaimProof] = useState("");

  if (!visible) return null;

  const isDark = colors.mode === "dark";

  const handleReportSubmit = () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      showInfoToast("Please fill title and description", "All fields are required");
      return;
    }

    const newItem: Item = {
      id: "lf-" + Date.now(),
      type: reportType,
      title: formTitle,
      category: formCategory,
      campus: currentCampus.split("(")[0].trim(),
      location: formLocation || "Campus Hub",
      date: "Just now",
      description: formDescription,
      status: "OPEN",
    };

    setItems([newItem, ...items]);
    setIsReporting(false);
    setFormTitle("");
    setFormLocation("");
    setFormDescription("");
    setFormSecretMark("");

    showSuccessToast(
      language === "am" ? "የጠፋ/የተገኘ ሪፖርት ተልኳል!" : "Report Filed with Campus Desk!",
      `Case logged for ${newItem.campus} Safe Hub`
    );
  };

  const handleClaimSubmit = () => {
    if (!claimProof.trim() || !claimingItem) return;

    setItems((prev) =>
      prev.map((i) =>
        i.id === claimingItem.id ? { ...i, status: "CLAIM_SUBMITTED" } : i
      )
    );
    setClaimingItem(null);
    setClaimProof("");

    showSuccessToast(
      language === "am" ? "የባለቤትነት ማረጋገጫ ተልኳል" : "Claim Proof Submitted!",
      "Campus rep will verify your private proof at the gate"
    );
  };

  const filteredItems = items.filter(
    (i) => activeTab === "ALL" || i.type === activeTab
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={300}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconCircle, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5" }]}>
                <Sparkles size={20} color="#10B981" />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {language === "am" ? "የካምፓስ የጠፉና የተገኙ ዕቃዎች" : "Campus Lost & Found Desk"}
                </Text>
                <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
                  {currentCampus} Hub &bull; Verified SafeTrade
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" }]}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Subheader Action Bar */}
          <View style={styles.navRow}>
            <View style={[styles.tabBar, { backgroundColor: isDark ? "#0A1628" : "#F1F5F9" }]}>
              {(["ALL", "FOUND", "LOST"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => {
                    setIsReporting(false);
                    setActiveTab(tab);
                  }}
                  style={[
                    styles.tabItem,
                    activeTab === tab && !isReporting && [styles.tabItemActive, { backgroundColor: colors.card }],
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === tab && !isReporting ? colors.primary : colors.textMuted },
                    ]}
                  >
                    {tab === "ALL" ? "All" : tab === "FOUND" ? "Found" : "Lost"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setIsReporting(!isReporting)}
              style={[styles.reportBtn, { backgroundColor: isReporting ? "#EF4444" : "#10B981" }]}
            >
              <PlusCircle size={14} color="#FFFFFF" />
              <Text style={styles.reportBtnText}>
                {isReporting ? "Cancel" : "Report"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            {isReporting ? (
              /* Report Form */
              <View style={styles.formContainer}>
                <Text style={[styles.formHeader, { color: colors.textPrimary }]}>
                  File a Lost or Found Campus Notice
                </Text>

                {/* Type Switcher */}
                <View style={styles.typeSwitchRow}>
                  <TouchableOpacity
                    onPress={() => setReportType("FOUND")}
                    style={[
                      styles.typeSwitchBtn,
                      reportType === "FOUND" && { backgroundColor: "#10B981" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeSwitchText,
                        { color: reportType === "FOUND" ? "#FFFFFF" : colors.textSecondary },
                      ]}
                    >
                      I Found an Item
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setReportType("LOST")}
                    style={[
                      styles.typeSwitchBtn,
                      reportType === "LOST" && { backgroundColor: "#F59E0B" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeSwitchText,
                        { color: reportType === "LOST" ? "#FFFFFF" : colors.textSecondary },
                      ]}
                    >
                      I Lost an Item
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Item Title *</Text>
                  <TextInput
                    placeholder="e.g. AAU Student ID Card (Dawit K.), Casio Calculator"
                    placeholderTextColor={colors.textMuted}
                    value={formTitle}
                    onChangeText={setFormTitle}
                    style={[styles.input, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: colors.border }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
                  <TextInput
                    placeholder="Student ID / Tech / Keys / Books"
                    placeholderTextColor={colors.textMuted}
                    value={formCategory}
                    onChangeText={setFormCategory}
                    style={[styles.input, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: colors.border }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Where found / last seen *</Text>
                  <TextInput
                    placeholder="e.g. Science Library 2nd floor, Gate 1 benches"
                    placeholderTextColor={colors.textMuted}
                    value={formLocation}
                    onChangeText={setFormLocation}
                    style={[styles.input, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: colors.border }]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>Description *</Text>
                  <TextInput
                    placeholder="Color, condition, stickers or distinctive markings..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={3}
                    value={formDescription}
                    onChangeText={setFormDescription}
                    style={[styles.textArea, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: colors.border }]}
                  />
                </View>

                {reportType === "FOUND" && (
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: "#F59E0B" }]}>Secret Ownership Verification Mark</Text>
                    <TextInput
                      placeholder="e.g. Initials on back cover (only verified by desk rep)"
                      placeholderTextColor={colors.textMuted}
                      value={formSecretMark}
                      onChangeText={setFormSecretMark}
                      style={[styles.input, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: "#F59E0B" }]}
                    />
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleReportSubmit}
                  style={[styles.submitBtn, { backgroundColor: reportType === "FOUND" ? "#10B981" : "#F59E0B" }]}
                >
                  <Text style={styles.submitBtnText}>Submit to Campus Safe Hub</Text>
                </TouchableOpacity>
              </View>
            ) : claimingItem ? (
              /* Claim Proof Form */
              <View style={styles.formContainer}>
                <Text style={[styles.formHeader, { color: colors.textPrimary }]}>
                  Claim: {claimingItem.title}
                </Text>
                <Text style={[styles.formSub, { color: colors.textSecondary }]}>
                  Held at: {claimingItem.campus} ({claimingItem.location})
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.textSecondary }]}>
                    Private Ownership Proof *
                  </Text>
                  <TextInput
                    placeholder="State details only the owner knows (e.g. Student ID number, sticker pattern, phone wallpaper, password)..."
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={4}
                    value={claimProof}
                    onChangeText={setClaimProof}
                    style={[styles.textArea, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", color: colors.textPrimary, borderColor: colors.border }]}
                  />
                </View>

                <View style={styles.formActionsRow}>
                  <TouchableOpacity
                    onPress={() => setClaimingItem(null)}
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleClaimSubmit}
                    style={[styles.submitClaimBtn, { backgroundColor: "#10B981" }]}
                  >
                    <Text style={styles.submitBtnText}>Submit Claim Proof</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Item List */
              <View style={styles.itemsList}>
                {filteredItems.map((item) => (
                  <View
                    key={item.id}
                    style={[styles.itemCard, { backgroundColor: isDark ? "#0A1628" : "#F8FAFC", borderColor: colors.border }]}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemBadges}>
                        <View
                          style={[
                            styles.typeBadge,
                            { backgroundColor: item.type === "FOUND" ? "#10B981" : "#F59E0B" },
                          ]}
                        >
                          <Text style={styles.typeBadgeText}>{item.type}</Text>
                        </View>
                        <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                          {item.category}
                        </Text>
                      </View>

                      {item.status === "CLAIM_SUBMITTED" ? (
                        <View style={styles.claimPendingBadge}>
                          <Text style={styles.claimPendingText}>Claim Pending</Text>
                        </View>
                      ) : (
                        <View style={styles.activeHubBadge}>
                          <Text style={styles.activeHubText}>Active Hub</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>{item.description}</Text>

                    <View style={styles.locationRow}>
                      <MapPin size={12} color="#10B981" />
                      <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                        {item.campus} &bull; {item.location}
                      </Text>
                    </View>

                    <View style={styles.bottomRow}>
                      <View style={styles.dateRow}>
                        <Clock size={11} color={colors.textMuted} />
                        <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.date}</Text>
                      </View>

                      {item.type === "FOUND" ? (
                        <TouchableOpacity
                          onPress={() => setClaimingItem(item)}
                          style={styles.claimBtn}
                        >
                          <ShieldCheck size={12} color="#FFFFFF" />
                          <Text style={styles.claimBtnText}>Claim Item</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            showSuccessToast(
                              "Desk Alert Sent!",
                              "Campus rep notified that you may have found this item"
                            )
                          }
                          style={[styles.claimBtn, { backgroundColor: "#F59E0B" }]}
                        >
                          <Phone size={12} color="#FFFFFF" />
                          <Text style={styles.claimBtnText}>I Found This</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    maxHeight: "88%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  subTitle: {
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 12,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 3,
    flex: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 11,
  },
  tabItemActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 11,
    fontWeight: "800",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  reportBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  scroll: {
    maxHeight: 460,
  },
  itemsList: {
    gap: 12,
    paddingBottom: 16,
  },
  itemCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
  },
  claimPendingBadge: {
    backgroundColor: "rgba(168, 85, 247, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  claimPendingText: {
    color: "#A855F7",
    fontSize: 9,
    fontWeight: "700",
  },
  activeHubBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeHubText: {
    color: "#10B981",
    fontSize: 9,
    fontWeight: "700",
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3,
  },
  itemDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 10,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.2)",
    paddingTop: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 10,
  },
  claimBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  claimBtnText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  formContainer: {
    paddingVertical: 6,
    gap: 10,
  },
  formHeader: {
    fontSize: 14,
    fontWeight: "800",
  },
  formSub: {
    fontSize: 11,
  },
  typeSwitchRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.2)",
  },
  typeSwitchText: {
    fontSize: 11,
    fontWeight: "800",
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
  },
  input: {
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    textAlignVertical: "top",
  },
  submitBtn: {
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  formActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 11,
    fontWeight: "700",
  },
  submitClaimBtn: {
    flex: 2,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
