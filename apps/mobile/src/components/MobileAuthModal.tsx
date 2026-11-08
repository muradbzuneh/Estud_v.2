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
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
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
  Phone,
  Building2,
  IdCard,
} from "lucide-react-native";
import { useApp, ETHIOPIAN_CAMPUSES } from "../context/AppContext";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toast";

export function MobileAuthModal() {
  const { isAuthModalVisible, setAuthModalVisible, login, loginWithGoogle, colors, language, t } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState(ETHIOPIAN_CAMPUSES[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAuthModalVisible) return null;

  const handleClose = () => {
    setAuthModalVisible(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      showErrorToast(
        language === "am" ? "የGoogle መግቢያ ስህተት" : "Google Sign-In Failed",
        "Please check your network and try again"
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "signup" && !name.trim()) {
      showErrorToast(
        language === "am" ? "የተማሪ ስም ይጎድላል" : "Missing Name",
        "Please enter your full student name"
      );
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      showErrorToast(
        language === "am" ? "ትክክለኛ ኢሜይል ያስገቡ" : "Invalid Email",
        "Please enter a valid university email address"
      );
      return;
    }
    if (!password.trim() || password.length < 6) {
      showErrorToast(
        language === "am" ? "የይለፍ ቃል አጭር ነው" : "Weak Password",
        "Password must be at least 6 characters"
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(name || "Student Trader", email, campus);
    }, 700);
  };

  const isDark = colors.mode === "dark";

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
        <Animatable.View
          animation="fadeInUp"
          duration={350}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" }]}
          >
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Brand Header */}
            <View style={styles.header}>
              <View style={[styles.brandIconWrapper, { backgroundColor: isDark ? "rgba(29, 107, 243, 0.2)" : "#EFF6FF" }]}>
                <GraduationCap size={28} color={colors.primary} />
              </View>
              <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
                {mode === "signin"
                  ? (language === "am" ? "ወደ ኢስቱድ ይግቡ" : "Sign In to Estud")
                  : (language === "am" ? "የተማሪ መለያ ይክፈቱ" : "Create Student Account")}
              </Text>
              <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
                {mode === "signin"
                  ? (language === "am" ? "የካምፓስ ዕቃዎችን እና የኤስክሮው ፒኖችን ይመልከቱ" : "Access your verified campus escrow listings & pickup PINs")
                  : (language === "am" ? "በኢትዮጵያ ዩኒቨርሲቲዎች ከሚነግዱ በሺዎች የሚቆጠሩ ተማሪዎች ጋር ይቀላቀሉ" : "Join thousands of students trading securely across Ethiopia")}
              </Text>
            </View>

            {/* Mode Toggle (Sign In vs Sign Up) */}
            <View style={[styles.tabToggle, { backgroundColor: isDark ? "#0B1426" : "#F1F5F9" }]}>
              <TouchableOpacity
                onPress={() => setMode("signin")}
                style={[
                  styles.toggleBtn,
                  mode === "signin" && [styles.toggleBtnActive, { backgroundColor: colors.card }],
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    { color: mode === "signin" ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {language === "am" ? "መግቢያ (Sign In)" : "Sign In"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("signup")}
                style={[
                  styles.toggleBtn,
                  mode === "signup" && [styles.toggleBtnActive, { backgroundColor: colors.card }],
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    { color: mode === "signup" ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {language === "am" ? "መመዝገቢያ (Sign Up)" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Authentic Realistic Google OAuth Button */}
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              activeOpacity={0.85}
              style={[
                styles.googleBtn,
                {
                  backgroundColor: isDark ? "#0F203C" : "#FFFFFF",
                  borderColor: isDark ? "rgba(255,255,255,0.18)" : "#E2E8F0",
                },
              ]}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <View style={styles.googleIconCircle}>
                    <Text style={styles.googleG}>G</Text>
                  </View>
                  <Text style={[styles.googleBtnText, { color: colors.textPrimary }]}>
                    {mode === "signin"
                      ? (language === "am" ? "በGoogle መለያ ይቀጥሉ" : "Continue with Google")
                      : (language === "am" ? "በGoogle ይመዝገቡ" : "Sign up with Google")}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                {language === "am" ? "ወይም በኢሜይል" : "or continue with university credentials"}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Form Fields */}
            {mode === "signup" && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  {language === "am" ? "ሙሉ የተማሪ ስም *" : "Full Student Name *"}
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <User size={16} color={colors.textMuted} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Yohannes Mengistu"
                    placeholderTextColor={colors.textMuted}
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>
              </View>
            )}

            {mode === "signup" && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  {language === "am" ? "የተማሪ መታወቂያ ቁጥር (Student ID)" : "Student ID Number"}
                </Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <IdCard size={16} color={colors.textMuted} />
                  <TextInput
                    value={studentId}
                    onChangeText={setStudentId}
                    placeholder="e.g. UGR/4921/14"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="characters"
                    style={[styles.input, { color: colors.textPrimary }]}
                  />
                </View>
              </View>
            )}

            {mode === "signup" && (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  {language === "am" ? "ዩኒቨርሲቲ ካምፓስ *" : "University Campus *"}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.campusPickerScroll}>
                  {ETHIOPIAN_CAMPUSES.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setCampus(c)}
                      style={[
                        styles.campusChip,
                        {
                          backgroundColor: campus === c ? colors.primaryLight : colors.inputBg,
                          borderColor: campus === c ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.campusChipText,
                          {
                            color: campus === c ? colors.primary : colors.textSecondary,
                            fontWeight: campus === c ? "800" : "600",
                          },
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                {language === "am" ? "የዩኒቨርሲቲ ኢሜይል *" : "University Email *"}
              </Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Mail size={16} color={colors.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="student@aau.edu.et"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[styles.input, { color: colors.textPrimary }]}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.passwordHeaderRow}>
                <Text style={[styles.label, { color: colors.textPrimary, marginBottom: 0 }]}>
                  {language === "am" ? "የይለፍ ቃል *" : "Password *"}
                </Text>
                {mode === "signin" && (
                  <TouchableOpacity
                    onPress={() =>
                      showInfoToast(
                        language === "am" ? "የይለፍ ቃል መቀየሪያ" : "Password Reset",
                        "Check your university email for the reset link"
                      )
                    }
                  >
                    <Text style={[styles.forgotText, { color: colors.primary }]}>
                      {language === "am" ? "የይለፍ ቃል ረሱ?" : "Forgot Password?"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border, marginTop: 6 }]}>
                <Lock size={16} color={colors.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { color: colors.textPrimary }]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={16} color={colors.textMuted} />
                  ) : (
                    <Eye size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick One-Tap Demo Access */}
            <View style={{ marginTop: 12, marginBottom: 12, padding: 12, borderRadius: 16, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC", borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: colors.textPrimary, marginBottom: 6 }}>
                ⚡ Fast Demo Sign-In (One-Tap):
              </Text>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <TouchableOpacity
                  onPress={() => {
                    login("Natnael Tsegaye", "natnael@aau.edu.et", "AAU 4 Kilo (Science)");
                    showSuccessToast("Signed in as Student!", "Natnael T. (AAU 4 Kilo)");
                  }}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: isDark ? "#293548" : "#EFF6FF", alignItems: "center", borderWidth: 1, borderColor: colors.primary }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "800", color: colors.primary }}>Student</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    login("Biruk Gate Rep", "rep.4kilo@estud.et", "AAU 4 Kilo (Science)");
                    showSuccessToast("Signed in as Campus Rep!", "Gate 1 Hub Officer");
                  }}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: isDark ? "#293548" : "#ECFDF5", alignItems: "center", borderWidth: 1, borderColor: "#10B981" }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "800", color: "#10B981" }}>Campus Rep</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    login("Murad Admin", "admin@estud.et", "Addis Ababa Central Hub");
                    showSuccessToast("Signed in as Admin!", "Super Admin Privileges");
                  }}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: isDark ? "#293548" : "#FEF3C7", alignItems: "center", borderWidth: 1, borderColor: "#F59E0B" }}
                >
                  <Text style={{ fontSize: 10, fontWeight: "800", color: "#D97706" }}>Super Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.88}
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === "signin"
                    ? (language === "am" ? "ወደ መለያዬ ግባ" : "Sign In to Account")
                    : (language === "am" ? "የተረጋገጠ መለያ ፍጠር" : "Create Verified Account")}
                </Text>
              )}
            </TouchableOpacity>

            {/* SafeTrade Guarantee Strip */}
            <View style={styles.securityRow}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={[styles.securityText, { color: colors.textSecondary }]}>
                {language === "am"
                  ? "የካምፓስ ደላላ እና 100% የኤስክሮው ጥበቃ ያለው"
                  : "Protected by Estud SafeTrade Escrow & Verified Campus ID"}
              </Text>
            </View>
          </ScrollView>
        </Animatable.View>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: "90%",
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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  brandIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 10,
    lineHeight: 17,
  },
  tabToggle: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  googleIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EA4335",
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: "800",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "600",
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },
  passwordHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotText: {
    fontSize: 11,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    paddingVertical: 0,
  },
  campusPickerScroll: {
    flexDirection: "row",
  },
  campusChip: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 6,
  },
  campusChipText: {
    fontSize: 11,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
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
    fontWeight: "500",
  },
});
