import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react-native";
import { useApp } from "../context/AppContext";

interface MobileHeroCardProps {
  onExplorePress?: () => void;
  onSellPress?: () => void;
}

export function MobileHeroCard({ onExplorePress, onSellPress }: MobileHeroCardProps) {
  const { width } = useWindowDimensions();
  const { colors, t, language } = useApp();
  const isCompact = width < 380;
  const isDark = colors.mode === "dark";

  return (
    <Animatable.View
      animation="fadeIn"
      duration={600}
      style={[styles.outerContainer, { backgroundColor: colors.heroNavy }]}
    >
      <ImageBackground
        source={require("../../assets/hero.jpg")}
        style={[
          styles.heroBackground,
          {
            paddingHorizontal: isCompact ? 16 : 20,
            paddingVertical: isCompact ? 22 : 28,
          },
        ]}
        resizeMode="cover"
      >
        {/* Layered Estud Vignette Overlays */}
        <View style={[styles.overlayNavy, { backgroundColor: isDark ? "rgba(5, 22, 46, 0.85)" : "rgba(7, 36, 72, 0.72)" }]} />
        <View style={[styles.overlayGradient, { backgroundColor: isDark ? "rgba(7, 13, 30, 0.92)" : "rgba(7, 13, 30, 0.82)" }]} />

        <View style={styles.contentContainer}>
          {/* Top Row: Student Marketplace Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <GraduationCap size={14} color="#FBBF24" />
              <Text style={styles.badgeText}>{t.heroBadge}</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{t.heroLiveCampus}</Text>
            </View>
          </View>

          {/* Headline with Luminous Gold Highlight */}
          <Text
            style={[
              styles.heading,
              {
                fontSize: isCompact ? 24 : 28,
                lineHeight: isCompact ? 30 : 35,
              },
            ]}
          >
            {t.heroTitle1}{"\n"}
            {t.heroTitle2}{"\n"}
            <Text style={styles.headingAccent}>{t.heroTitleAccent}</Text>
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: isCompact ? 11 : 12,
                lineHeight: isCompact ? 16 : 18,
              },
            ]}
          >
            {t.heroSubtitle}
          </Text>

          {/* 3D Student Backpack Showcase Feature Container with subtle animation */}
          <Animatable.View
            animation="zoomIn"
            delay={200}
            duration={500}
            style={styles.showcaseRow}
          >
            <View style={styles.showcaseImageCard}>
              <Image
                source={require("../../assets/student-backpack-3d.jpg")}
                style={styles.showcaseImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.showcaseTextCol}>
              <View style={styles.featureItem}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={styles.featureText}>{t.heroFeature1}</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle2 size={14} color="#FBBF24" />
                <Text style={styles.featureText}>{t.heroFeature2}</Text>
              </View>
              <View style={styles.featureItem}>
                <Sparkles size={14} color="#60A5FA" />
                <Text style={styles.featureText}>{t.heroFeature3}</Text>
              </View>
            </View>
          </Animatable.View>

          {/* Dual Action CTA Buttons (Full width responsive) */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              onPress={onExplorePress}
              activeOpacity={0.88}
              style={[styles.primaryButton, { flex: isCompact ? 1 : 1.2 }]}
            >
              <Text style={styles.primaryButtonText}>{t.heroExploreBtn}</Text>
              <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSellPress}
              activeOpacity={0.85}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Text style={styles.secondaryButtonText}>{t.heroSellBtn}</Text>
              <View style={styles.zeroFeePill}>
                <Text style={styles.zeroFeeText}>0% Fee</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#070D1E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 16,
  },
  heroBackground: {
    width: "100%",
    position: "relative",
  },
  overlayNavy: {
    ...StyleSheet.absoluteFill,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFill,
  },
  contentContainer: {
    position: "relative",
    zIndex: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16, 185, 129, 0.16)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  liveText: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "700",
  },
  heading: {
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  headingAccent: {
    color: "#FBBF24", // Golden Yellow Accent
  },
  subtitle: {
    color: "#CBD5E1",
    marginTop: 8,
    marginBottom: 16,
    maxWidth: "96%",
  },
  showcaseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    borderRadius: 18,
    padding: 10,
    marginBottom: 18,
    gap: 12,
  },
  showcaseImageCard: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  showcaseImage: {
    width: "100%",
    height: "100%",
  },
  showcaseTextCol: {
    flex: 1,
    gap: 5,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    color: "#F1F5F9",
    fontSize: 11,
    fontWeight: "600",
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryButton: {
    backgroundColor: "#1D6BF3", // Electric Cobalt Blue
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 24,
    gap: 6,
    shadowColor: "#1D6BF3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 24,
    gap: 6,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  zeroFeePill: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  zeroFeeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
});
