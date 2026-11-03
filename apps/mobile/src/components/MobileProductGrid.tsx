import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { ChevronRight } from "lucide-react-native";
import { MobileProductCard, MobileProductItem } from "./MobileProductCard";
import { useApp } from "../context/AppContext";

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
  title,
}: MobileProductGridProps) {
  const { colors, t } = useApp();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.accentBar, { backgroundColor: colors.accent }]} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {title || t.featuredTitle}
          </Text>
        </View>

        {onViewAllPress && (
          <TouchableOpacity
            onPress={onViewAllPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>{t.viewAll}</Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State */}
      {products.length === 0 ? (
        <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No matching student listings found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Try adjusting your search query or campus filter.
          </Text>
        </View>
      ) : (
        /* 2-Column Responsive Grid with Motion */
        <View style={styles.grid}>
          {products.map((item, index) => (
            <Animatable.View
              key={item.id}
              animation="fadeInUp"
              duration={400}
              delay={Math.min(index * 70, 350)}
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
            </Animatable.View>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
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
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 11,
    textAlign: "center",
  },
});
