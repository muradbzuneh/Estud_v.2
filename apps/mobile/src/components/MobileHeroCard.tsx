import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { GraduationCap, ArrowRight } from "lucide-react-native";

interface MobileHeroCardProps {
  onExplorePress?: () => void;
  onSellPress?: () => void;
}

export function MobileHeroCard({ onExplorePress, onSellPress }: MobileHeroCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Background Soft Blobs */}
      <View style={styles.blobTopRight} />

      {/* Main Content Layout */}
      <View style={styles.innerContent}>
        {/* Left Text Column */}
        <View style={styles.textColumn}>
          {/* Badge */}
          <View style={styles.badgeRow}>
            <GraduationCap size={13} color="#047857" />
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
              <ArrowRight size={13} color="#FFFFFF" />
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

        {/* Right Student Image */}
        <View style={styles.imageColumn}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80",
              }}
              style={styles.studentImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    position: "relative",
    padding: 16,
  },
  blobTopRight: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DCFCE7",
    opacity: 0.6,
  },
  innerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textColumn: {
    flex: 1.4,
    paddingRight: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
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
    color: "#065F46",
  },
  heading: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 22,
    letterSpacing: -0.4,
  },
  headingHighlight: {
    color: "#059669",
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 15,
    marginTop: 6,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "column",
    gap: 6,
  },
  primaryButton: {
    backgroundColor: "#1E293B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: "#334155",
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
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  studentImage: {
    width: "100%",
    height: "100%",
  },
});
