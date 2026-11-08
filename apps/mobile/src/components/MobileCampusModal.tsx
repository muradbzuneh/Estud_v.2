import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { MapPin, Check, X, Building2, Navigation, ExternalLink, ShieldCheck } from "lucide-react-native";
import { ETHIOPIAN_CAMPUSES, useApp } from "../context/AppContext";

interface MobileCampusModalProps {
  visible: boolean;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
  onClose: () => void;
}

export function MobileCampusModal({
  visible,
  selectedCampus,
  onSelectCampus,
  onClose,
}: MobileCampusModalProps) {
  const { colors, language } = useApp();
  const isDark = colors.mode === "dark";

  const openGoogleMaps = (campus: string) => {
    const query = encodeURIComponent(`${campus} Ethiopia`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={300}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                <Building2 size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {language === "am" ? "የካምፓስ ማዕከል ይምረጡ" : "Select Campus Hub"}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {language === "am" ? "በአቅራቢያዎ ያሉ የተረጋገጡ የተማሪ ዕቃዎችን ይመልከቱ" : "Browse verified student listings near you"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" }]}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Campus List */}
          <ScrollView style={styles.campusList} showsVerticalScrollIndicator={false}>
            {ETHIOPIAN_CAMPUSES.map((campus) => {
              const isSelected = selectedCampus === campus;
              return (
                <TouchableOpacity
                  key={campus}
                  onPress={() => {
                    onSelectCampus(campus);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.campusItem,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : (isDark ? "#293548" : "#F8FAFC"),
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={styles.campusItemLeft}>
                    <MapPin
                      size={16}
                      color={isSelected ? colors.primary : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.campusName,
                        { color: isSelected ? colors.primary : colors.textPrimary },
                        isSelected && { fontWeight: "800" },
                      ]}
                    >
                      {campus}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkPill, { backgroundColor: colors.primaryLight }]}>
                      <Check size={14} color={colors.primary} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active Hub SafeTrade & Google Maps Action */}
          <View style={[styles.mapFooter, { borderTopColor: colors.border, backgroundColor: isDark ? "#081324" : "#F8FAFC" }]}>
            <View style={styles.mapFooterHeader}>
              <View style={styles.hubStatusRow}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={[styles.hubStatusText, { color: colors.textSecondary }]}>
                  {selectedCampus} SafeTrade Inspection Gate Active
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => openGoogleMaps(selectedCampus)}
              activeOpacity={0.85}
              style={[styles.mapButton, { backgroundColor: colors.primary }]}
            >
              <Navigation size={14} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>
                {language === "am" ? "በ Google Maps ይክፈቱ" : "Open Hub in Google Maps"}
              </Text>
              <ExternalLink size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.65)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: "75%",
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
  },
  campusList: {
    marginTop: 12,
  },
  campusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
  },
  campusItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  campusName: {
    fontSize: 13,
    fontWeight: "600",
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  mapFooter: {
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderRadius: 16,
  },
  mapFooterHeader: {
    marginBottom: 8,
  },
  hubStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hubStatusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 11,
    borderRadius: 12,
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
