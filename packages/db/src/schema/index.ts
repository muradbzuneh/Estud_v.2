import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Initial connection verification table
 */
export const systemHealthChecks = pgTable("system_health_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  status: text("status").notNull(),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
});
