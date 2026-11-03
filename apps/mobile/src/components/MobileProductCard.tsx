import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Star, MapPin, Heart, ShoppingBag, ShieldCheck } from "lucide-react-native";
import { useApp } from "../context/AppContext";

export interface MobileProductItem {
  id: string;
  title: string;
  category?: string;
  condition: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: "Best Seller" | "Popular" | "New" | "20% OFF";
  location: string;
  imageUrl: string;
  description?: string;
  sellerName?: string;
  sellerTrust?: number;
}

interface MobileProductCardProps {
  product: MobileProductItem;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onOrderPress?: () => void;
}

export function MobileProductCard({
  product,
  isFavorite = false,
  onPress,
  onFavoritePress,
  onOrderPress,
}: MobileProductCardProps) {
  const { colors } = useApp();

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Best Seller":
        return { bg: "#1D6BF3", text: "#FFFFFF" };
      case "Popular":
        return { bg: "#F59E0B", text: "#FFFFFF" };
      case "New":
        return { bg: "#10B981", text: "#FFFFFF" };
      case "20% OFF":
        return { bg: "#EF4444", text: "#FFFFFF" };
      default:
        return { bg: "#0F172A", text: "#FFFFFF" };
    }
  };

  const badgeTheme = getBadgeStyle(product.badge);
  const isDark = colors.mode === "dark";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Image Container with Badges */}
      <View style={[styles.imageContainer, { backgroundColor: isDark ? "#08101E" : "#F1F5F9" }]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {product.badge && (
          <View style={[styles.badge, { backgroundColor: badgeTheme.bg }]}>
            <Text style={[styles.badgeText, { color: badgeTheme.text }]}>
              {product.badge}
            </Text>
          </View>
        )}

        {/* Favorite Heart Button */}
        <TouchableOpacity
          onPress={onFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[
            styles.heartButton,
            { backgroundColor: isDark ? "rgba(13, 24, 46, 0.9)" : "rgba(255, 255, 255, 0.92)" },
          ]}
        >
          <Heart
            size={14}
            color={isFavorite ? "#EF4444" : colors.textMuted}
            fill={isFavorite ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.content}>
        {/* Condition & Escrow Badge */}
        <View style={styles.conditionRow}>
          <Text style={[styles.conditionText, { color: colors.textSecondary }]}>{product.condition}</Text>
          <View style={styles.escrowBadge}>
            <ShieldCheck size={10} color="#10B981" />
            <Text style={styles.escrowText}>Escrow</Text>
          </View>
        </View>

        {/* Title */}
        <Text numberOfLines={2} style={[styles.title, { color: colors.textPrimary }]}>
          {product.title}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ETB {product.price.toLocaleString()}
          </Text>
          {product.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>
              ETB {product.originalPrice.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Rating & Action Button */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{product.rating}</Text>
            <Text style={[styles.reviewCount, { color: colors.textMuted }]}>({product.reviewCount})</Text>
          </View>

          <TouchableOpacity
            onPress={onOrderPress || onPress}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={[styles.actionButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
          >
            <ShoppingBag size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Location Pin */}
        <View style={styles.locationRow}>
          <MapPin size={10} color={colors.textMuted} />
          <Text numberOfLines={1} style={[styles.locationText, { color: colors.textMuted }]}>
            {product.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  imageContainer: {
    width: "100%",
    height: 135,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 10,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: "600",
  },
  escrowBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  escrowText: {
    fontSize: 8,
    fontWeight: "800",
    color: "#10B981",
  },
  title: {
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "900",
  },
  originalPrice: {
    fontSize: 9,
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
  },
  reviewCount: {
    fontSize: 9,
  },
  actionButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  locationText: {
    fontSize: 9,
    flex: 1,
  },
});
