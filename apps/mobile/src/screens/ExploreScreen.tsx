import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SlidersHorizontal, ArrowUpDown, MapPin } from "lucide-react-native";
import { useApp } from "../context/AppContext";
import { MobileSearchBar } from "../components/MobileSearchBar";
import { MobileCategoryList } from "../components/MobileCategoryList";
import { MobileProductGrid } from "../components/MobileProductGrid";

export function ExploreScreen() {
  const {
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    currentCampus,
    setCampusModalVisible,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "rating">("featured");

  // Filter products
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "more" ||
      item.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.bannerTitle}>Explore Campus Listings</Text>
        <Text style={styles.bannerSubtitle}>
          Verified university gear, laptops, and study materials
        </Text>

        {/* Campus Location Switcher Bar */}
        <TouchableOpacity
          onPress={() => setCampusModalVisible(true)}
          style={styles.campusBar}
        >
          <View style={styles.campusBarLeft}>
            <MapPin size={13} color="#1D6BF3" />
            <Text style={styles.campusBarText}>Filtered by: {currentCampus}</Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <MobileSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setCampusModalVisible(true)}
        placeholder="Search textbooks, laptops, phones..."
      />

      {/* Category Horizontal Filter */}
      <MobileCategoryList
        selectedId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Sort Pills Row */}
      <View style={styles.sortRow}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{sortedProducts.length} items</Text>
        </View>

        <View style={styles.sortOptions}>
          <TouchableOpacity
            onPress={() => setSortBy("featured")}
            style={[styles.sortChip, sortBy === "featured" && styles.sortChipActive]}
          >
            <Text style={[styles.sortChipText, sortBy === "featured" && styles.sortChipTextActive]}>
              Featured
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("price_asc")}
            style={[styles.sortChip, sortBy === "price_asc" && styles.sortChipActive]}
          >
            <Text style={[styles.sortChipText, sortBy === "price_asc" && styles.sortChipTextActive]}>
              Lowest Price
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("rating")}
            style={[styles.sortChip, sortBy === "rating" && styles.sortChipActive]}
          >
            <Text style={[styles.sortChipText, sortBy === "rating" && styles.sortChipTextActive]}>
              Top Rated
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Grid */}
      <MobileProductGrid
        products={sortedProducts}
        favorites={favorites}
        onProductPress={(id) => {
          const item = products.find((p) => p.id === id);
          if (item) setSelectedProduct(item);
        }}
        onFavoritePress={toggleFavorite}
        title="All Available Listings"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  topBanner: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 10,
  },
  campusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  campusBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  campusBarText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D6BF3",
  },
  changeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D6BF3",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sortChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  sortChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  sortChipTextActive: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
});
