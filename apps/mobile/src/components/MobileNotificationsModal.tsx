import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  Bell,
  X,
  CheckCheck,
  ShieldCheck,
  ShieldAlert,
  Radio,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react-native";
import { useApp } from "../context/AppContext";

export function MobileNotificationsModal() {
  const {
    isNotificationsModalVisible,
    setNotificationsModalVisible,
    notifications,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    colors,
    language,
    setActiveTab,
  } = useApp();

  if (!isNotificationsModalVisible) return null;

  const handleClose = () => {
    setNotificationsModalVisible(false);
  };

  const isDark = colors.mode === "dark";

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "escrow":
        return <ShieldCheck size={18} color="#F59E0B" />;
      case "admin":
        return <ShieldAlert size={18} color="#3B82F6" />;
      case "broadcast":
        return <Radio size={18} color="#10B981" />;
      default:
        return <Bell size={18} color={colors.primary} />;
    }
  };

  const getNotificationBadgeBg = (type: string) => {
    switch (type) {
      case "escrow":
        return isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7";
      case "admin":
        return isDark ? "rgba(59, 130, 246, 0.15)" : "#DBEAFE";
      case "broadcast":
        return isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5";
      default:
        return isDark ? "rgba(30, 41, 59, 0.5)" : "#F1F5F9";
    }
  };

  return (
    <Modal
      visible={isNotificationsModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animatable.View
          animation="fadeInUp"
          duration={250}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.bellCircle, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5" }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {language === "am" ? "ማሳወቂያዎች" : "Notifications"}
                  </Text>
                  {unreadNotificationsCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{unreadNotificationsCount} new</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                  {language === "am" ? "የቅርብ ጊዜ ዝመናዎች እና የክፍያ ማንቂያዎች" : "Recent orders, alerts & campus updates"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9" }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Action: Mark All Read */}
          {notifications.length > 0 && unreadNotificationsCount > 0 && (
            <View style={[styles.actionBar, { borderBottomColor: colors.border }]}>
              <Text style={[styles.actionNotice, { color: colors.textMuted }]}>
                {unreadNotificationsCount} unread message{unreadNotificationsCount > 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                onPress={markAllNotificationsAsRead}
                activeOpacity={0.7}
                style={styles.markAllBtn}
              >
                <CheckCheck size={14} color={colors.primary} />
                <Text style={[styles.markAllText, { color: colors.primary }]}>
                  {language === "am" ? "ሁሉንም አንብብ" : "Mark all as read"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" }]}>
                  <Bell size={28} color={colors.textMuted} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                  {language === "am" ? "ምንም ማሳወቂያ የለም" : "No Notifications Yet"}
                </Text>
                <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                  {language === "am"
                    ? "አዲስ የትዕዛዝ ወይም የካምፓስ ዜና ሲኖር እዚህ ያዩታል"
                    : "You're all caught up! New order and campus alerts will show here."}
                </Text>
              </View>
            ) : (
              notifications.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (item.orderNumber) {
                      handleClose();
                      setActiveTab("activity");
                    }
                  }}
                  style={[
                    styles.notificationItem,
                    {
                      backgroundColor: !item.read
                        ? (isDark ? "rgba(16, 185, 129, 0.08)" : "#F0FDF4")
                        : (isDark ? "rgba(255, 255, 255, 0.02)" : "#FFFFFF"),
                      borderColor: !item.read
                        ? (isDark ? "rgba(16, 185, 129, 0.3)" : "#BBF7D0")
                        : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: getNotificationBadgeBg(item.type) }]}>
                    {getNotificationIcon(item.type)}
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notifHeaderRow}>
                      <Text
                        style={[
                          styles.notifTitle,
                          {
                            color: colors.textPrimary,
                            fontWeight: !item.read ? "700" : "600",
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
                    </View>

                    <Text style={[styles.notifMessage, { color: colors.textSecondary }]}>
                      {item.message}
                    </Text>

                    <View style={styles.notifFooter}>
                      <View style={styles.timeRow}>
                        <Clock size={11} color={colors.textMuted} />
                        <Text style={[styles.notifTime, { color: colors.textMuted }]}>
                          {item.time}
                        </Text>
                      </View>

                      {item.orderNumber && (
                        <View style={styles.orderLinkPill}>
                          <Text style={[styles.orderLinkText, { color: colors.primary }]}>
                            {item.orderNumber}
                          </Text>
                          <ArrowRight size={11} color={colors.primary} />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: "82%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bellCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  unreadBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  actionNotice: {
    fontSize: 12,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 14,
    gap: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptySub: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notifHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifTitle: {
    fontSize: 14,
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 6,
  },
  notifMessage: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  notifFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  notifTime: {
    fontSize: 11,
  },
  orderLinkPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  orderLinkText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
