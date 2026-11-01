import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";
import { GraduationCap, ArrowRight } from "lucide-react-native";

interface MobileHeroCardProps {
  onExplorePress?: () => void;
  onSellPress?: () => void;
}

export function MobileHeroCard({ onExplorePress, onSellPress }: MobileHeroCardProps) {
  return (
    <ImageBackground
      source={require("../../assets/school-supplies-bg.jpg")}
      style={styles.cardContainer}
      imageStyle={{ borderRadius: 24 }}
      resizeMode="cover"
    >
      {/* Dark Vignette Overlay */}
      <View style={styles.overlay} />

      {/* Main Content Layout */}
      <View style={styles.innerContent}>
        {/* Left Text Column */}
        <View style={styles.textColumn}>
          {/* Badge */}
          <View style={styles.badgeRow}>
            <GraduationCap size={13} color="#FBBF24" />
            <Text style={styles.badgeText}>Student Marketplace</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>
            Buy, Sell and{"\n"}Exchange with{"\n"}
            <Text style={styles.headingHighlight}>Confidence.</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            A trusted marketplace for students to find great deals on educational and everyday items.
          </Text>

          {/* Dual Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onExplorePress}
              activeOpacity={0.85}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Explore Marketplace</Text>
              <ArrowRight size={13} color="#0F172A" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSellPress}
              activeOpacity={0.85}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Start Selling</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Student 3D Backpack Image */}
        <View style={styles.imageColumn}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../assets/student-backpack-3d.jpg")}
              style={styles.studentImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: "#0D2B52",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    position: "relative",
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10, 25, 47, 0.4)",
  },
  innerContent: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  textColumn: {
    flex: 1.4,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heading: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  headingHighlight: {
    color: "#FBBF24",
  },
  subtitle: {
    fontSize: 11,
    color: "#E2E8F0",
    lineHeight: 15,
    marginTop: 6,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "column",
    gap: 6,
  },
  primaryButton: {
    backgroundColor: "#F59E0B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  primaryButtonText: {
    color: "#0F172A",
    fontSize: 11,
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  imageColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: 120,
    height: 140,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  studentImage: {
    width: "100%",
    height: "100%",
  },
});
