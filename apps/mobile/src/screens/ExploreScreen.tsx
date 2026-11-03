import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
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
    colors,
    t,
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

  const isDark = colors.mode === "dark";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Banner with Animation */}
      <Animatable.View animation="fadeInDown" duration={450} style={styles.topBanner}>
        <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>{t.exploreTitle}</Text>
        <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>
          {t.exploreSubtitle}
        </Text>

        {/* Campus Location Switcher Bar */}
        <TouchableOpacity
          onPress={() => setCampusModalVisible(true)}
          style={[
            styles.campusBar,
            {
              backgroundColor: isDark ? "rgba(29, 107, 243, 0.15)" : "#EFF6FF",
              borderColor: isDark ? colors.primary : "#BFDBFE",
            },
          ]}
        >
          <View style={styles.campusBarLeft}>
            <MapPin size={13} color={colors.primary} />
            <Text style={[styles.campusBarText, { color: colors.primary }]}>
              {t.filterByCampus} {currentCampus}
            </Text>
          </View>
          <Text style={[styles.changeText, { color: colors.primary }]}>{t.change}</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Search Input */}
      <MobileSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setCampusModalVisible(true)}
      />

      {/* Category Horizontal Filter */}
      <MobileCategoryList
        selectedId={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Sort Pills Row */}
      <View style={styles.sortRow}>
        <View style={[styles.countBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.countText, { color: colors.textSecondary }]}>
            {sortedProducts.length} {t.itemsCount}
          </Text>
        </View>

        <View style={styles.sortOptions}>
          <TouchableOpacity
            onPress={() => setSortBy("featured")}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortBy === "featured" ? colors.primaryLight : colors.card,
                borderColor: sortBy === "featured" ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                { color: sortBy === "featured" ? colors.primary : colors.textSecondary },
                sortBy === "featured" && { fontWeight: "800" },
              ]}
            >
              {t.sortFeatured}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("price_asc")}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortBy === "price_asc" ? colors.primaryLight : colors.card,
                borderColor: sortBy === "price_asc" ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                { color: sortBy === "price_asc" ? colors.primary : colors.textSecondary },
                sortBy === "price_asc" && { fontWeight: "800" },
              ]}
            >
              {t.sortLowestPrice}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy("rating")}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortBy === "rating" ? colors.primaryLight : colors.card,
                borderColor: sortBy === "rating" ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortChipText,
                { color: sortBy === "rating" ? colors.primary : colors.textSecondary },
                sortBy === "rating" && { fontWeight: "800" },
              ]}
            >
              {t.sortTopRated}
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
        title={t.exploreTitle}
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
    letterSpacing: -0.4,
  },
  bannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10,
  },
  campusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
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
  },
  changeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  countBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sortOptions: {
    flexDirection: "row",
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
