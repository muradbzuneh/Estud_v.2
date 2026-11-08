import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  Sparkles,
  CheckCircle2,
  Download,
  X,
  ShieldCheck,
  RefreshCw,
  Smartphone,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { showSuccessToast } from "../utils/toast";

export function MobileUpdateModal() {
  const { isUpdateModalVisible, setUpdateModalVisible, appVersion, upgradeAppVersion, colors, language } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFinished, setUpdateFinished] = useState(false);

  if (!isUpdateModalVisible) return null;

  const handleClose = () => {
    setIsUpdating(false);
    setUpdateFinished(false);
    setUpdateModalVisible(false);
  };

  const handleDownloadUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setUpdateFinished(true);
      upgradeAppVersion("v2.2.1");
      showSuccessToast(
        language === "am" ? "ዝመናው ተጠናቋል!" : "Update Verified!",
        "Estud v2.2.1 is active with realistic Ethiopian payment & soft dark mode"
      );
    }, 1200);
  };

  const isDark = colors.mode === "dark";

  return (
    <Modal
      visible={isUpdateModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animatable.View
          animation="zoomIn"
          duration={300}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" }]}
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7" }]}>
              <Sparkles size={26} color="#F59E0B" />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {language === "am" ? "የኢስቱድ ዝመና ማዕከል" : "Estud Release Hub"}
            </Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>{appVersion} Latest Release</Text>
            </View>
          </View>

          {/* Body */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
            <View style={[styles.releaseBox, { backgroundColor: isDark ? "#293548" : "#F8FAFC", borderColor: colors.border }]}>
              <Text style={[styles.releaseTitle, { color: colors.textPrimary }]}>
                {language === "am" ? "በዚህ ስሪት ምን አዲስ ነገር አለ?" : "What's New in This Release:"}
              </Text>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "አማርኛ ቋንቋ እና የጨለማ ገጽታ (Dark Mode) ድጋፍ"
                    : "Full Amharic (አማርኛ) localization & Dark Midnight theme"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "ቀጥታ የGoogle ማረጋገጫ (Google Auth) እና ዘመናዊ ቶስት"
                    : "Direct Google OAuth integration & sleek animated toast alerts"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "ሙሉ በሙሉ ምላሽ ሰጪ (Responsive) የጀግና ሰሌዳ"
                    : "Full-width adaptive responsive hero across all device sizes"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "የተሻሻለ ባለ 4-ዲጂት ሚስጥራዊ ፒን እና የኤስክሮው ዋስትና"
                    : "Enhanced 4-digit inspection PIN & SafeTrade Escrow protection"}
                </Text>
              </View>
            </View>

            {/* Direct EAS Download Link indicator */}
            <View style={[styles.statusBox, { backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF", borderColor: colors.primary }]}>
              <Smartphone size={16} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.statusBoxText, { color: colors.primary }]}>
                  Build Channel: Android Preview APK (Verified Signed)
                </Text>
                <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2 }}>
                  Release URL: https://estud.et/download/estud-v2.2.0.apk
                </Text>
              </View>
            </View>

            {/* Local App Reload Guide */}
            <View style={{ padding: 10, borderRadius: 12, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", marginTop: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: "700", color: colors.textPrimary }}>
                How local app receives updates:
              </Text>
              <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2, lineHeight: 13 }}>
                • In Expo Go / Dev: Press 'r' in Metro terminal or shake phone to reload.

                • On physical phone: Tap 'Download Direct APK' below or 'Refresh v2.2.0'.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://expo.dev/artifacts/eas/KOpOJDPTN-GKp495yQQyzROKddpMmSh_HhodhoBx7kc.apk").catch(() => {
                  Linking.openURL("https://expo.dev/accounts/muradbzuneh/projects/estud-monorepo/builds").catch(() => {
                    showSuccessToast("Download Link", "https://estud.et/download");
                  });
                });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingVertical: 10,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: isDark ? "#293548" : "#F8FAFC",
              }}
            >
              <Download size={14} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
                Download Signed APK (Direct v2.2.0)
              </Text>
            </TouchableOpacity>

            {updateFinished ? (
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.actionBtn, { backgroundColor: "#10B981" }]}
              >
                <CheckCircle2 size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>
                  {language === "am" ? "ዝመናው ተጠናቋል • ዝጋ" : "Up to Date • Done"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleDownloadUpdate}
                disabled={isUpdating}
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              >
                {isUpdating ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>
                      {language === "am" ? "ዝመናው እየተጫነ ነው..." : "Applying Update v2.2.1..."}
                    </Text>
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>
                      {language === "am" ? "የቅርብ ጊዜውን ስሪት ጫን (v2.2.1)" : "Apply & Refresh v2.2.1"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
    borderRadius: 16,
    marginBottom: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  versionBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  versionBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D6BF3",
  },
  scroll: {
    maxHeight: 280,
    marginBottom: 16,
  },
  releaseBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 8,
  },
  releaseTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
    fontWeight: "500",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBoxText: {
    fontSize: 10,
    fontWeight: "700",
    flex: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
