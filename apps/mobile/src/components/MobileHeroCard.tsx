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
import { GraduationCap, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react-native";

interface MobileHeroCardProps {
  onExplorePress?: () => void;
  onSellPress?: () => void;
}

export function MobileHeroCard({ onExplorePress, onSellPress }: MobileHeroCardProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require("../../assets/school-supplies-bg.jpg")}
        style={[
          styles.heroBackground,
          {
            paddingHorizontal: isCompact ? 16 : 20,
            paddingVertical: isCompact ? 22 : 28,
          },
        ]}
        resizeMode="cover"
      >
        {/* Layered Estud Midnight Navy Vignette Overlay */}
        <View style={styles.overlayNavy} />
        <View style={styles.overlayGradient} />

        <View style={styles.contentContainer}>
          {/* Top Row: Student Marketplace Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <GraduationCap size={14} color="#FBBF24" />
              <Text style={styles.badgeText}>Verified Student Marketplace</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Campus Live</Text>
            </View>
          </View>

          {/* Headline with Luminous Gold Highlight */}
          <Text
            style={[
              styles.heading,
              {
                fontSize: isCompact ? 26 : 30,
                lineHeight: isCompact ? 32 : 36,
              },
            ]}
          >
            Buy, Sell and{"\n"}
            Exchange with{"\n"}
            <Text style={styles.headingAccent}>Confidence.</Text>
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: isCompact ? 12 : 13,
                lineHeight: isCompact ? 17 : 19,
              },
            ]}
          >
            Find great deals on educational and campus essentials across Ethiopian universities with 100% SafeTrade Escrow protection.
          </Text>

          {/* 3D Student Backpack Showcase Feature Container */}
          <View style={styles.showcaseRow}>
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
                <Text style={styles.featureText}>SafeTrade Escrow Protection</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle2 size={14} color="#FBBF24" />
                <Text style={styles.featureText}>Campus Intermediary Desks</Text>
              </View>
              <View style={styles.featureItem}>
                <Sparkles size={14} color="#60A5FA" />
                <Text style={styles.featureText}>0% Seller Fee &bull; 100% Cash</Text>
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
              <Text style={styles.primaryButtonText}>Explore Marketplace</Text>
              <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSellPress}
              activeOpacity={0.85}
              style={[styles.secondaryButton, { flex: 1 }]}
            >
              <Text style={styles.secondaryButtonText}>Start Selling</Text>
              <View style={styles.zeroFeePill}>
                <Text style={styles.zeroFeeText}>0% Fee</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    backgroundColor: "#072448",
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
    backgroundColor: "rgba(7, 36, 72, 0.72)",
  },
  overlayGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(7, 13, 30, 0.82)",
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
    letterSpacing: -0.6,
  },
  headingAccent: {
    color: "#FBBF24", // Golden Yellow Accent matching Estud Ribbon
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
    width: 80,
    height: 80,
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
    gap: 6,
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
