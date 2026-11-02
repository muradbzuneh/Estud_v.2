import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MapPin, Check, X, Building2 } from "lucide-react-native";
import { ETHIOPIAN_CAMPUSES } from "../context/AppContext";

interface MobileCampusModalProps {
  visible: boolean;
  selectedCampus: string;
  onSelectCampus: (campus: string) => void;
  onClose: () => void;
}

export function MobileCampusModal({
  visible,
  selectedCampus,
  onSelectCampus,
  onClose,
}: MobileCampusModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Building2 size={18} color="#1D6BF3" />
              </View>
              <View>
                <Text style={styles.title}>Select Campus Hub</Text>
                <Text style={styles.subtitle}>
                  Browse verified student listings near you
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Campus List */}
          <ScrollView style={styles.campusList} showsVerticalScrollIndicator={false}>
            {ETHIOPIAN_CAMPUSES.map((campus) => {
              const isSelected = selectedCampus === campus;
              return (
                <TouchableOpacity
                  key={campus}
                  onPress={() => {
                    onSelectCampus(campus);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.campusItem,
                    isSelected && styles.campusItemSelected,
                  ]}
                >
                  <View style={styles.campusItemLeft}>
                    <MapPin
                      size={16}
                      color={isSelected ? "#1D6BF3" : "#94A3B8"}
                    />
                    <Text
                      style={[
                        styles.campusName,
                        isSelected && styles.campusNameSelected,
                      ]}
                    >
                      {campus}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkPill}>
                      <Check size={14} color="#1D6BF3" strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(7, 13, 30, 0.65)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
  },
  campusList: {
    marginTop: 12,
  },
  campusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  campusItemSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D6BF3",
  },
  campusItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  campusName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  campusNameSelected: {
    color: "#1D6BF3",
    fontWeight: "800",
  },
  checkPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
});
