import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  LayoutGrid,
  BookOpen,
  Laptop,
  Smartphone,
  Shirt,
  Dumbbell,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react-native";

export interface MobileCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const CATEGORIES: MobileCategory[] = [
  { id: "all", name: "All Items", icon: LayoutGrid },
  { id: "laptops", name: "Laptops", icon: Laptop },
  { id: "phones", name: "Phones", icon: Smartphone },
  { id: "books", name: "Books", icon: BookOpen },
  { id: "fashion", name: "Gear", icon: Shirt },
  { id: "sports", name: "Dorm", icon: Dumbbell },
  { id: "more", name: "More", icon: MoreHorizontal },
];

interface MobileCategoryListProps {
  selectedId: string;
  onSelectCategory: (id: string) => void;
}

export function MobileCategoryList({
  selectedId,
  onSelectCategory,
}: MobileCategoryListProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedId === cat.id;

          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.75}
              style={styles.categoryItem}
            >
              <View
                style={[
                  styles.iconBox,
                  isSelected && styles.iconBoxSelected,
                ]}
              >
                <Icon
                  size={20}
                  color={isSelected ? "#1D6BF3" : "#64748B"}
                  strokeWidth={isSelected ? 2.4 : 1.8}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryItem: {
    alignItems: "center",
    width: 64,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconBoxSelected: {
    backgroundColor: "#EFF6FF", // Light blue tint
    borderColor: "#1D6BF3",
    borderWidth: 2,
    shadowColor: "#1D6BF3",
    shadowOpacity: 0.15,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
});
