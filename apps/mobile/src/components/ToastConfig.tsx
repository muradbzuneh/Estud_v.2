import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckCircle2, AlertCircle, Info, Sparkles } from "lucide-react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={[styles.iconWrapper, styles.successIconWrapper]}>
        <CheckCircle2 size={18} color="#10B981" />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.titleText}>{text1}</Text>}
        {text2 && <Text style={styles.subtitleText}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={[styles.iconWrapper, styles.errorIconWrapper]}>
        <AlertCircle size={18} color="#EF4444" />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.titleText}>{text1}</Text>}
        {text2 && <Text style={styles.subtitleText}>{text2}</Text>}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={[styles.iconWrapper, styles.infoIconWrapper]}>
        <Info size={18} color="#1D6BF3" />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.titleText}>{text1}</Text>}
        {text2 && <Text style={styles.subtitleText}>{text2}</Text>}
      </View>
    </View>
  ),

  update: ({ text1, text2 }: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.updateToast]}>
      <View style={[styles.iconWrapper, styles.updateIconWrapper]}>
        <Sparkles size={18} color="#F59E0B" />
      </View>
      <View style={styles.textContainer}>
        {text1 && <Text style={styles.titleText}>{text1}</Text>}
        {text2 && <Text style={styles.subtitleText}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "92%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1528",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
    gap: 12,
  },
  successToast: {
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  errorToast: {
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  infoToast: {
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  updateToast: {
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconWrapper: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  errorIconWrapper: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  infoIconWrapper: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  updateIconWrapper: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  subtitleText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
    lineHeight: 15,
  },
});
