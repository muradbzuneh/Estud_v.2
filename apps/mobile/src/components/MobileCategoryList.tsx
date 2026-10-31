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

const CATEGORIES: MobileCategory[] = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "books", name: "Books", icon: BookOpen },
  { id: "laptops", name: "Laptops", icon: Laptop },
  { id: "phones", name: "Phones", icon: Smartphone },
  { id: "fashion", name: "Fashion", icon: Shirt },
  { id: "sports", name: "Sports", icon: Dumbbell },
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
              activeOpacity={0.7}
              style={[
                styles.categoryItem,
                isSelected && styles.categoryItemSelected,
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  isSelected && styles.iconBoxSelected,
                ]}
              >
                <Icon
                  size={20}
                  color={isSelected ? "#059669" : "#64748B"}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
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
    width: 62,
  },
  categoryItemSelected: {},
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
  },
  iconBoxSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  categoryTextSelected: {
    color: "#059669",
    fontWeight: "800",
  },
});
