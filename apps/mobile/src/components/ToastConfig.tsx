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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: "#070D1E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    gap: 12,
  },
  successToast: {
    borderColor: "#A7F3D0",
  },
  errorToast: {
    borderColor: "#FECACA",
  },
  infoToast: {
    borderColor: "#BFDBFE",
  },
  updateToast: {
    borderColor: "#FDE68A",
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconWrapper: {
    backgroundColor: "#ECFDF5",
  },
  errorIconWrapper: {
    backgroundColor: "#FEF2F2",
  },
  infoIconWrapper: {
    backgroundColor: "#EFF6FF",
  },
  updateIconWrapper: {
    backgroundColor: "#FEF3C7",
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitleText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 15,
  },
});
