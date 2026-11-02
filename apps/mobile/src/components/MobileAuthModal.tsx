import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react-native";
import { useApp, ETHIOPIAN_CAMPUSES } from "../context/AppContext";

export function MobileAuthModal() {
  const { isAuthModalVisible, setAuthModalVisible, login } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState(ETHIOPIAN_CAMPUSES[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalVisible) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setAuthModalVisible(false);
  };

  const handleSubmit = () => {
    if (mode === "signup" && !name.trim()) {
      Alert.alert("Missing Name", "Please enter your full student name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your university email or phone number.");
      return;
    }
    if (!password.trim() || password.length < 4) {
      Alert.alert("Password Too Short", "Please enter at least 4 characters.");
      return;
    }

    login(name || "Student Trader", email, campus);
    setIsSuccess(true);
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string, demoCampus: string) => {
    login(demoName, demoEmail, demoCampus);
    setIsSuccess(true);
  };

  return (
    <Modal
      visible={isAuthModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Close Button */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#64748B" />
          </TouchableOpacity>

          {isSuccess ? (
            <View style={styles.successBox}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={44} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Welcome to Estud!</Text>
              <Text style={styles.successSubtitle}>
                You are authenticated as a verified Ethiopian student trader. SafeTrade Escrow protection is active.
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Enter Student Marketplace</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {/* Brand Header */}
              <View style={styles.header}>
                <View style={styles.brandIconWrapper}>
                  <GraduationCap size={28} color="#1D6BF3" />
                </View>
                <Text style={styles.brandTitle}>
                  {mode === "signin" ? "Sign In to Estud" : "Create Student Account"}
                </Text>
                <Text style={styles.brandSubtitle}>
                  {mode === "signin"
                    ? "Access your campus escrow listings & pickup PINs"
                    : "Join thousands of students trading securely across Ethiopia"}
                </Text>
              </View>

              {/* Mode Toggle (Sign In vs Sign Up) */}
              <View style={styles.tabToggle}>
                <TouchableOpacity
                  onPress={() => setMode("signin")}
                  style={[styles.toggleBtn, mode === "signin" && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleBtnText, mode === "signin" && styles.toggleBtnTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setMode("signup")}
                  style={[styles.toggleBtn, mode === "signup" && styles.toggleBtnActive]}
                >
                  <Text style={[styles.toggleBtnText, mode === "signup" && styles.toggleBtnTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Quick 1-Tap Demo Student Login for Quick Testing on Mobile */}
              <View style={styles.quickLoginBox}>
                <View style={styles.quickLoginHeader}>
                  <Sparkles size={13} color="#F59E0B" />
                  <Text style={styles.quickLoginTitle}>Quick 1-Tap Student Demo</Text>
                </View>
                <View style={styles.quickLoginRow}>
                  <TouchableOpacity
                    onPress={() => handleQuickDemoLogin("Murad Bezuneh", "murad.b@student.aau.edu.et", "AAU 4 Kilo (Science)")}
                    style={styles.quickPill}
                  >
                    <Text style={styles.quickPillText}>Murad (AAU 4 Kilo)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleQuickDemoLogin("Yohannes M.", "yohannes@student.aait.edu.et", "AAiT 5 Kilo (Technology)")}
                    style={styles.quickPill}
                  >
                    <Text style={styles.quickPillText}>Yohannes (AAiT)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Form Fields */}
              {mode === "signup" && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Student Name</Text>
                  <View style={styles.inputWrapper}>
                    <User size={16} color="#94A3B8" />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. Alazar Tadesse"
                      placeholderTextColor="#94A3B8"
                      style={styles.input}
                    />
                  </View>
                </View>
              )}

              {mode === "signup" && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>University Campus</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.campusPickerScroll}>
                    {ETHIOPIAN_CAMPUSES.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => setCampus(c)}
                        style={[styles.campusChip, campus === c && styles.campusChipActive]}
                      >
                        <Text style={[styles.campusChipText, campus === c && styles.campusChipTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Student Email or Phone</Text>
                <View style={styles.inputWrapper}>
                  <Mail size={16} color="#94A3B8" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="student@aau.edu.et or 0912..."
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Lock size={16} color="#94A3B8" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={16} color="#64748B" />
                    ) : (
                      <Eye size={16} color="#64748B" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.88}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>
                  {mode === "signin" ? "Sign In to Campus Hub" : "Create Verified Account"}
                </Text>
              </TouchableOpacity>

              {/* SafeTrade Escrow Protection Guarantee */}
              <View style={styles.securityRow}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={styles.securityText}>
                  Protected by Estud SafeTrade Escrow & Campus Intermediary
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.72)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  brandIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 12,
  },
  tabToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  toggleBtnTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  quickLoginBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },
  quickLoginHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  quickLoginTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B45309",
  },
  quickLoginRow: {
    flexDirection: "row",
    gap: 8,
  },
  quickPill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F59E0B",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  quickPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B45309",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
    paddingVertical: 0,
  },
  campusPickerScroll: {
    flexDirection: "row",
  },
  campusChip: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  campusChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  campusChipText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  campusChipTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  submitBtn: {
    backgroundColor: "#1D6BF3", // Electric Cobalt Blue
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },
  securityText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },
  successBox: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  successSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#1D6BF3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
