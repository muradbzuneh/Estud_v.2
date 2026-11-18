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
            paddingVertical: isCompact ? 16 : 20,
          },
        ]}
        resizeMode="cover"
      >
        {/* Cinematic Translucent Vignette - ensures hero.jpg is vividly visible while text is crisp */}
        <View
          style={[
            styles.overlayNavy,
            {
              backgroundColor: isDark
                ? "rgba(6, 16, 34, 0.48)"
                : "rgba(8, 24, 52, 0.40)",
            },
          ]}
        />

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

          {/* Main Hero Row: Headline + Trust Badge */}
          <View style={styles.heroMainGrid}>
            <View style={styles.heroTextCol}>
              <Text
                style={[
                  styles.heading,
                  {
                    fontSize: isCompact ? 22 : 26,
                    lineHeight: isCompact ? 28 : 32,
                  },
                ]}
              >
                {t.heroTitle1}{"\n"}
                {t.heroTitle2}{"\n"}
                <Text style={styles.headingAccent}>{t.heroTitleAccent}</Text>
              </Text>

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
            </View>

            {/* Right Side Trust Badge Card - fills the hero space cleanly */}
            <View style={styles.trustBadgeCard}>
              <View style={styles.trustIconCircle}>
                <ShieldCheck size={26} color="#FE9901" />
              </View>
              <Text style={styles.trustBadgeTitle}>SafeTrade</Text>
              <Text style={styles.trustBadgeDesc}>100% Escrow Protection</Text>
              <View style={styles.trustMiniPill}>
                <CheckCircle2 size={10} color="#10B981" />
                <Text style={styles.trustMiniPillText}>0% Seller Fee</Text>
              </View>
            </View>
          </View>

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
    marginTop: 6,
    lineHeight: 16,
  },
  heroMainGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  heroTextCol: {
    flex: 1.35,
  },
  trustBadgeCard: {
    flex: 1,
    backgroundColor: "rgba(10, 25, 58, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(254, 153, 1, 0.40)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  trustIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(254, 153, 1, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  trustBadgeTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  trustBadgeDesc: {
    color: "#94A3B8",
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 6,
  },
  trustMiniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  trustMiniPillText: {
    color: "#6EE7B7",
    fontSize: 9,
    fontWeight: "700",
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
