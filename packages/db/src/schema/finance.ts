import {
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import {
  paymentChannelEnum,
  paymentStatusEnum,
  evidenceVerificationStatusEnum,
  commissionStatusEnum,
  payoutStatusEnum,
  refundStatusEnum,
} from "./enums";
import { users } from "./users";
import { orders, exchanges } from "./orders";

/**
 * 21. Payments (Entity 17 in SRS)
 */
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    exchangeId: uuid("exchange_id").references(() => exchanges.id, {
      onDelete: "restrict",
    }),
    paymentReference: text("payment_reference").notNull().unique(), // e.g. EST-PAY-2026-0001
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    channel: paymentChannelEnum("channel").notNull(), // TELEBIRR, CBE_BIRR, CBE_TRANSFER, etc.
    status: paymentStatusEnum("status").default("PENDING").notNull(),
    receivingAccountNumber: text("receiving_account_number").notNull(), // Official Estud Bank/Telebirr Account

    confirmedByAdminId: text("confirmed_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_payments_reference").on(table.paymentReference),
    index("idx_payments_order_id").on(table.orderId),
    index("idx_payments_status").on(table.status),
    index("idx_payments_channel").on(table.channel),
  ]
);

/**
 * 22. Payment Evidence (Entity 18 in SRS)
 */
export const paymentEvidence = pgTable(
  "payment_evidence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    paymentId: uuid("payment_id")
      .references(() => payments.id, { onDelete: "cascade" })
      .notNull(),
    uploaderId: text("uploader_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    bankTransactionReference: text("bank_transaction_reference").notNull(), // SMS txn ID or CBE reference
    senderAccountOrPhone: text("sender_account_or_phone"),
    screenshotUrl: text("screenshot_url").notNull(), // Private secure storage
    notes: text("notes"),

    verificationStatus: evidenceVerificationStatusEnum("verification_status")
      .default("PENDING")
      .notNull(),
    verifiedByAdminId: text("verified_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_payment_evidence_payment_id").on(table.paymentId),
    index("idx_payment_evidence_status").on(table.verificationStatus),
    index("idx_payment_evidence_bank_ref").on(table.bankTransactionReference),
  ]
);

/**
 * 23. Commission Records (Entity 19 in SRS)
 */
export const commissionRecords = pgTable(
  "commission_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    exchangeId: uuid("exchange_id").references(() => exchanges.id, {
      onDelete: "restrict",
    }),
    itemApprovedValue: numeric("item_approved_value", {
      precision: 12,
      scale: 2,
    }).notNull(),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 })
      .default("0.0500")
      .notNull(), // 5%
    commissionEarned: numeric("commission_earned", {
      precision: 12,
      scale: 2,
    }).notNull(),
    status: commissionStatusEnum("status").default("ACCRUED").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_commission_order_id").on(table.orderId),
    index("idx_commission_status").on(table.status),
  ]
);

/**
 * 24. Seller Payouts (Entity 20 in SRS)
 */
export const sellerPayouts = pgTable(
  "seller_payouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "restrict" })
      .notNull()
      .unique(),
    sellerId: text("seller_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    payoutReference: text("payout_reference").notNull().unique(), // EST-PO-2026-0001
    payableAmount: numeric("payable_amount", {
      precision: 12,
      scale: 2,
    }).notNull(), // 100% of approved item value
    payoutChannel: paymentChannelEnum("payout_channel").notNull(),
    sellerAccountNumber: text("seller_account_number").notNull(),
    sellerAccountName: text("seller_account_name").notNull(),
    status: payoutStatusEnum("status").default("PENDING").notNull(),

    processedByAdminId: text("processed_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    payoutProofUrl: text("payout_proof_url"),
    notes: text("notes"),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_payouts_reference").on(table.payoutReference),
    index("idx_payouts_seller_id").on(table.sellerId),
    index("idx_payouts_status").on(table.status),
  ]
);

/**
 * 25. Refunds (Entity 21 in SRS)
 */
export const refunds = pgTable(
  "refunds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "restrict",
    }),
    exchangeId: uuid("exchange_id").references(() => exchanges.id, {
      onDelete: "restrict",
    }),
    paymentId: uuid("payment_id")
      .references(() => payments.id, { onDelete: "restrict" })
      .notNull(),
    buyerId: text("buyer_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    reason: text("reason").notNull(),
    refundChannel: paymentChannelEnum("refund_channel").notNull(),
    refundReference: text("refund_reference"),
    proofUrl: text("proof_url"),
    status: refundStatusEnum("status").default("INITIATED").notNull(),
    approvedByAdminId: text("approved_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_refunds_order_id").on(table.orderId),
    index("idx_refunds_payment_id").on(table.paymentId),
    index("idx_refunds_status").on(table.status),
  ]
);
