import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { useApp } from "../context/AppContext";

interface MobileSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export function MobileSearchBar({
  value,
  onChangeText,
  onSubmit,
  onFilterPress,
  placeholder,
}: MobileSearchBarProps) {
  const { colors, t } = useApp();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
          },
        ]}
      >
        <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder || t.searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.textPrimary }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <TouchableOpacity
          onPress={onFilterPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <SlidersHorizontal size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    paddingVertical: 0,
  },
  filterButton: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 6,
  },
});
