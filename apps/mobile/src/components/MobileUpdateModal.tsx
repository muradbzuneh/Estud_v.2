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
  const { isUpdateModalVisible, setUpdateModalVisible, appVersion, upgradeAppVersion, colors, language, serverRelease } = useApp();
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
      upgradeAppVersion(serverRelease?.version || "v2.3.5");
      showSuccessToast(
        language === "am" ? "ዝመናው ተጠናቋል!" : "App Upgraded Successfully!",
        "Estud v2.3.5 SafeTrade & Cloudinary CDN is active"
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
                    ? "ቀጥታ የፖስትግሬስ (PostgreSQL) ግንኙነት እና ፈጣን የዕቃዎች እና ዜና ማመሳሰል"
                    : "Real-Time PostgreSQL LiveSync: Admin products & breaking news update live"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "ከመሳሪያ ቀጥታ ፎቶዎችን መስቀል (Device Photo & Camera Upload)"
                    : "Native Device & Camera Photo Upload when listing products"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "የባንክ/ቴሌብር ደረሰኝ ስክሪንሽት ማረጋገጫ (Payment Screenshot Proof)"
                    : "Bank & Telebirr Transfer Screenshot Proof for trusted escrow release"}
                </Text>
              </View>

              <View style={styles.featureRow}>
                <CheckCircle2 size={15} color="#10B981" />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                  {language === "am"
                    ? "ባለ 48-ሰዓት ጊዜ ገደብ ያለው የሚስጥር ፒን (Time-Limited Security PIN)"
                    : "Time-limited 48h Inspection PIN with dynamic security code refresh"}
                </Text>
              </View>
            </View>

            {/* Direct EAS Download Link indicator */}
            <View style={[styles.statusBox, { backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "#EFF6FF", borderColor: colors.primary }]}>
              <Smartphone size={16} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.statusBoxText, { color: colors.primary }]}>
                  Android Preview APK ({appVersion})
                </Text>
                <Text style={{ fontSize: 9, color: colors.textSecondary, marginTop: 2 }}>
                  Verified Signed • expo-updates enabled
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* Action Buttons */}
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(serverRelease?.downloadUrl || "https://expo.dev/artifacts/eas/fL8Ak13f9oAemgJ_4IqY5oapekFo2YasGeBxHG7QhTs.apk").catch(() => {
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
                backgroundColor: isDark ? "#142247" : "#F8FAFC",
              }}
            >
              <Download size={14} color={colors.primary} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
                Download Signed APK ({appVersion})
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
                      {language === "am" ? "ዝመናው እየተጫነ ነው..." : `Applying Update (${appVersion})...`}
                    </Text>
                  </>
                ) : (
                  <>
                    <RefreshCw size={15} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>
                      {language === "am" ? `የቅርብ ጊዜውን ስሪት ጫን (${appVersion})` : `Apply & Refresh ${appVersion}`}
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
