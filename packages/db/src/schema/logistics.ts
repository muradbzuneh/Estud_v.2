import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { deliveryStatusEnum } from "./enums";
import { users, locations, campuses } from "./users";
import { orders, exchanges } from "./orders";

/**
 * 26. Deliveries (Entity 22 in SRS)
 */
export const deliveries = pgTable(
  "deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    exchangeId: uuid("exchange_id").references(() => exchanges.id, {
      onDelete: "restrict",
    }),
    trackingNumber: text("tracking_number").notNull().unique(), // e.g. EST-DEL-2026-0001
    status: deliveryStatusEnum("status").default("SCHEDULED").notNull(),

    assignedRepId: uuid("assigned_rep_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // Physical Locations / Campus Hubs
    pickupLocationId: uuid("pickup_location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    pickupCampusId: uuid("pickup_campus_id").references(() => campuses.id, {
      onDelete: "set null",
    }),
    dropoffLocationId: uuid("dropoff_location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    dropoffCampusId: uuid("dropoff_campus_id").references(() => campuses.id, {
      onDelete: "set null",
    }),

    recipientHandoverCode: text("recipient_handover_code"), // Secure 4-6 digit PIN for verification
    deliveryNotes: text("delivery_notes"),
    failureReason: text("failure_reason"),

    pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_deliveries_tracking").on(table.trackingNumber),
    index("idx_deliveries_order_id").on(table.orderId),
    index("idx_deliveries_status").on(table.status),
    index("idx_deliveries_assigned_rep").on(table.assignedRepId),
  ]
);

/**
 * 27. Delivery Assignments (Entity 23 in SRS)
 */
export const deliveryAssignments = pgTable(
  "delivery_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    deliveryId: uuid("delivery_id")
      .references(() => deliveries.id, { onDelete: "cascade" })
      .notNull(),
    assignedAgentId: uuid("assigned_agent_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    assignedByAdminId: uuid("assigned_by_admin_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    status: text("status").default("ASSIGNED").notNull(), // ASSIGNED, ACCEPTED, DECLINED, COMPLETED
    instructions: text("instructions"),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_delivery_assignments_delivery_id").on(table.deliveryId),
    index("idx_delivery_assignments_agent_id").on(table.assignedAgentId),
  ]
);
