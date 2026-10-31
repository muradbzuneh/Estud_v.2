import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

/**
 * 31. Administrative Audit Logs (Entity 29 in SRS)
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(), // e.g. "VALUATION_APPROVED", "PAYMENT_CONFIRMED", "SELLER_PAYOUT_INITIATED"
    targetType: text("target_type").notNull(), // "product", "order", "payment", "payout", "dispute"
    targetId: text("target_id").notNull(),
    metadata: jsonb("metadata"), // Previous values, new values, IP, notes
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_logs_actor_id").on(table.actorId),
    index("idx_audit_logs_target").on(table.targetType, table.targetId),
    index("idx_audit_logs_created_at").on(table.createdAt),
  ]
);

/**
 * 32. User Notifications (Entity 28 in SRS)
 */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    type: text("type").notNull(), // "ORDER", "PAYMENT", "DELIVERY", "VALUATION", "LOST_FOUND"
    isRead: boolean("is_read").default(false).notNull(),
    data: jsonb("data"), // Associated IDs, routes
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_notifications_user_id").on(table.userId),
    index("idx_notifications_is_read").on(table.isRead),
    index("idx_notifications_created_at").on(table.createdAt),
  ]
);
