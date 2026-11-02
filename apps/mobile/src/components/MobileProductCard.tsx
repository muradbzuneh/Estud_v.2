import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Star, MapPin, Heart, ShoppingBag } from "lucide-react-native";

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
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Best Seller":
        return { bg: "#3B82F6", text: "#FFFFFF" };
      case "Popular":
        return { bg: "#F59E0B", text: "#FFFFFF" };
      case "New":
        return { bg: "#10B981", text: "#FFFFFF" };
      case "20% OFF":
        return { bg: "#6366F1", text: "#FFFFFF" };
      default:
        return { bg: "#0F172A", text: "#FFFFFF" };
    }
  };

  const badgeTheme = getBadgeStyle(product.badge);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* Image Container with Badges */}
      <View style={styles.imageContainer}>
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

        <TouchableOpacity
          onPress={onFavoritePress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.heartButton}
        >
          <Heart
            size={14}
            color={isFavorite ? "#EF4444" : "#94A3B8"}
            fill={isFavorite ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.content}>
        {/* Title */}
        <Text numberOfLines={1} style={styles.title}>
          {product.title}
        </Text>

        {/* Condition */}
        <Text style={styles.conditionText}>{product.condition}</Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ETB {product.price.toLocaleString()}
          </Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>
              ETB {product.originalPrice.toLocaleString()}
            </Text>
          )}
        </View>

        {/* Rating & Campus */}
        <View style={styles.metaRow}>
          <View style={styles.ratingBox}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewCount}>({product.reviewCount})</Text>
          </View>

          <TouchableOpacity
            onPress={onOrderPress}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            style={styles.actionButton}
          >
            <ShoppingBag size={12} color="#6C5CE7" />
          </TouchableOpacity>
        </View>

        {/* Location Pin */}
        <View style={styles.locationRow}>
          <MapPin size={10} color="#94A3B8" />
          <Text numberOfLines={1} style={styles.locationText}>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  imageContainer: {
    width: "100%",
    height: 125,
    backgroundColor: "#F1F5F9",
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
    paddingHorizontal: 7,
    paddingVertical: 2,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  conditionText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6C5CE7",
    marginTop: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 6,
  },
  price: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
  originalPrice: {
    fontSize: 9,
    color: "#94A3B8",
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
    color: "#334155",
  },
  reviewCount: {
    fontSize: 9,
    color: "#94A3B8",
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  locationText: {
    fontSize: 9,
    color: "#64748B",
    flex: 1,
  },
});
