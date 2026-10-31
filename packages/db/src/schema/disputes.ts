import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { disputeReasonEnum, disputeStatusEnum } from "./enums";
import { users } from "./users";
import { orders, exchanges } from "./orders";

/**
 * 28. Transaction Disputes (Entity 24 in SRS)
 */
export const transactionDisputes = pgTable(
  "transaction_disputes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    exchangeId: uuid("exchange_id").references(() => exchanges.id, {
      onDelete: "restrict",
    }),
    disputeNumber: text("dispute_number").notNull().unique(), // e.g. EST-DSP-2026-0001
    raisedById: uuid("raised_by_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    reason: disputeReasonEnum("reason").notNull(),
    description: text("description").notNull(),
    status: disputeStatusEnum("status").default("OPEN").notNull(),

    adminResolutionSummary: text("admin_resolution_summary"),
    resolvedByAdminId: uuid("resolved_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_disputes_dispute_number").on(table.disputeNumber),
    index("idx_disputes_order_id").on(table.orderId),
    index("idx_disputes_raised_by").on(table.raisedById),
    index("idx_disputes_status").on(table.status),
  ]
);

/**
 * Dispute Supporting Evidence
 */
export const disputeEvidence = pgTable(
  "dispute_evidence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    disputeId: uuid("dispute_id")
      .references(() => transactionDisputes.id, { onDelete: "cascade" })
      .notNull(),
    uploadedById: uuid("uploaded_by_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    fileUrl: text("file_url").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_dispute_evidence_dispute_id").on(table.disputeId),
  ]
);
