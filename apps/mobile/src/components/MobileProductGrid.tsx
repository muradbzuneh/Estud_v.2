import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { MobileProductCard, MobileProductItem } from "./MobileProductCard";

export const SAMPLE_MOBILE_PRODUCTS: MobileProductItem[] = [
  {
    id: "prod-1",
    title: "Laptop i5 11th Gen",
    category: "laptops",
    condition: "Used • Like New",
    price: 18000,
    originalPrice: 22000,
    rating: 4.8,
    reviewCount: 120,
    badge: "Best Seller",
    location: "Addis Ababa (4 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-2",
    title: "Wireless Earbuds",
    category: "phones",
    condition: "New • Sealed",
    price: 2500,
    originalPrice: 3500,
    rating: 4.7,
    reviewCount: 95,
    badge: "Popular",
    location: "Addis Ababa (AAiT)",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-3",
    title: "Calculus Textbook",
    category: "books",
    condition: "Used • Good",
    price: 600,
    originalPrice: 900,
    rating: 4.9,
    reviewCount: 64,
    badge: "New",
    location: "Hawassa University",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-4",
    title: "School Backpack",
    category: "fashion",
    condition: "New • Waterproof",
    price: 1200,
    originalPrice: 1500,
    rating: 4.6,
    reviewCount: 78,
    badge: "20% OFF",
    location: "Mekelle University",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-5",
    title: "Gym Dumbbells Set (20KG)",
    category: "sports",
    condition: "Used • Like New",
    price: 2100,
    originalPrice: 2800,
    rating: 4.8,
    reviewCount: 35,
    badge: "Popular",
    location: "ASTU (Adama)",
    imageUrl: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "prod-6",
    title: "Casio fx-991EX Calculator",
    category: "laptops",
    condition: "Used • Like New",
    price: 2800,
    originalPrice: 3200,
    rating: 4.9,
    reviewCount: 142,
    badge: "Best Seller",
    location: "AAU (4 Kilo)",
    imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=80",
  },
];

interface MobileProductGridProps {
  products?: MobileProductItem[];
  onProductPress?: (id: string) => void;
  onViewAllPress?: () => void;
}

export function MobileProductGrid({
  products = SAMPLE_MOBILE_PRODUCTS,
  onProductPress,
  onViewAllPress,
}: MobileProductGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>Featured for Students</Text>
        </View>

        <TouchableOpacity
          onPress={onViewAllPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={14} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* 2-Column Grid */}
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
              onFavoritePress={() => toggleFavorite(item.id)}
              onOrderPress={() => onProductPress?.(item.id)}
            />
          </View>
        ))}
      </View>
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
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#F59E0B",
  },
  sectionTitle: {
    fontSize: 15,
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
    color: "#059669",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
  },
});
