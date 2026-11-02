import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { MobileProductCard, MobileProductItem } from "./MobileProductCard";

interface MobileProductGridProps {
  products: MobileProductItem[];
  favorites?: Record<string, boolean>;
  onProductPress?: (id: string) => void;
  onFavoritePress?: (id: string) => void;
  onViewAllPress?: () => void;
  title?: string;
}

export function MobileProductGrid({
  products,
  favorites = {},
  onProductPress,
  onFavoritePress,
  onViewAllPress,
  title = "Featured Student Listings",
}: MobileProductGridProps) {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {onViewAllPress && (
          <TouchableOpacity
            onPress={onViewAllPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color="#1D6BF3" />
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matching student listings found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search query or campus filter.</Text>
        </View>
      ) : (
        /* 2-Column Responsive Grid */
        <View style={styles.grid}>
          {products.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.gridItem,
                index % 2 === 0 ? { paddingRight: 6 } : { paddingLeft: 6 },
              ]}
            >
              <MobileProductCard
                product={item}
                isFavorite={!!favorites[item.id]}
                onPress={() => onProductPress?.(item.id)}
                onFavoritePress={() => onFavoritePress?.(item.id)}
                onOrderPress={() => onProductPress?.(item.id)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accentBar: {
    width: 3.5,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#F59E0B", // Luminous Gold / Yellow
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D6BF3",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },
});
