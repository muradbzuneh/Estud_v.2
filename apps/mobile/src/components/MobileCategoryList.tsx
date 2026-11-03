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
import { useApp } from "../context/AppContext";

export interface MobileCategory {
  id: string;
  nameKey: "catAll" | "catLaptops" | "catPhones" | "catBooks" | "catGear" | "catDorm" | "catMore";
  icon: LucideIcon;
}

export const CATEGORIES: MobileCategory[] = [
  { id: "all", nameKey: "catAll", icon: LayoutGrid },
  { id: "laptops", nameKey: "catLaptops", icon: Laptop },
  { id: "phones", nameKey: "catPhones", icon: Smartphone },
  { id: "books", nameKey: "catBooks", icon: BookOpen },
  { id: "fashion", nameKey: "catGear", icon: Shirt },
  { id: "sports", nameKey: "catDorm", icon: Dumbbell },
  { id: "more", nameKey: "catMore", icon: MoreHorizontal },
];

interface MobileCategoryListProps {
  selectedId: string;
  onSelectCategory: (id: string) => void;
}

export function MobileCategoryList({
  selectedId,
  onSelectCategory,
}: MobileCategoryListProps) {
  const { colors, t } = useApp();

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
          const categoryName = t[cat.nameKey];

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
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  isSelected && styles.iconBoxSelected,
                ]}
              >
                <Icon
                  size={20}
                  color={isSelected ? colors.primary : colors.textSecondary}
                  strokeWidth={isSelected ? 2.4 : 1.8}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  { color: isSelected ? colors.primary : colors.textSecondary },
                  isSelected && styles.categoryTextSelected,
                ]}
                numberOfLines={1}
              >
                {categoryName}
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
    borderWidth: 1.5,
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
    borderWidth: 2,
    shadowColor: "#1D6BF3",
    shadowOpacity: 0.15,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryTextSelected: {
    fontWeight: "800",
  },
});
