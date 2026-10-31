import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { orderStatusEnum, exchangeStatusEnum } from "./enums";
import { users } from "./users";
import { products } from "./products";

/**
 * 16. Orders (Intermediary Purchase Transaction)
 */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull().unique(), // e.g. EST-ORD-2026-0001
    buyerId: uuid("buyer_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    sellerId: uuid("seller_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    status: orderStatusEnum("status").default("REQUESTED").notNull(),

    // Financial Breakdown in ETB
    itemValue: numeric("item_value", { precision: 12, scale: 2 }).notNull(), // Seller payout baseline
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 })
      .default("0.0500")
      .notNull(),
    commissionAmount: numeric("commission_amount", {
      precision: 12,
      scale: 2,
    }).notNull(), // Estud 5% fee
    deliveryFee: numeric("delivery_fee", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(), // itemValue + commissionAmount + deliveryFee

    sellerAcceptedAt: timestamp("seller_accepted_at", { withTimezone: true }),
    sellerRejectedAt: timestamp("seller_rejected_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),

    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    completedAt: timestamp("completed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_orders_order_number").on(table.orderNumber),
    index("idx_orders_buyer_id").on(table.buyerId),
    index("idx_orders_seller_id").on(table.sellerId),
    index("idx_orders_product_id").on(table.productId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_created_at").on(table.createdAt),
  ]
);

/**
 * 17. Order Items (Entity 14 in SRS)
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitItemValue: numeric("unit_item_value", { precision: 12, scale: 2 }).notNull(),
    unitCommissionAmount: numeric("unit_commission_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_order_items_order_id").on(table.orderId),
  ]
);

/**
 * 18. Order Timeline (Audit trail for order state changes)
 */
export const orderTimeline = pgTable(
  "order_timeline",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .references(() => orders.id, { onDelete: "cascade" })
      .notNull(),
    status: orderStatusEnum("status").notNull(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_order_timeline_order_id").on(table.orderId),
  ]
);

/**
 * 19. Exchange Proposals (Entity 15 in SRS)
 */
export const exchanges = pgTable(
  "exchanges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    exchangeNumber: text("exchange_number").notNull().unique(), // e.g. EST-EX-2026-0001
    requesterId: uuid("requester_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    receiverId: uuid("receiver_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    offeredProductId: uuid("offered_product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    requestedProductId: uuid("requested_product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    status: exchangeStatusEnum("status").default("PROPOSED").notNull(),

    // Valuation & Cash Difference
    offeredItemApprovedValue: numeric("offered_item_approved_value", {
      precision: 12,
      scale: 2,
    }),
    requestedItemApprovedValue: numeric("requested_item_approved_value", {
      precision: 12,
      scale: 2,
    }),
    cashDifference: numeric("cash_difference", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    cashPayerId: uuid("cash_payer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    estudFee: numeric("estud_fee", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),

    requesterHandoverConfirmed: boolean("requester_handover_confirmed")
      .default(false)
      .notNull(),
    receiverHandoverConfirmed: boolean("receiver_handover_confirmed")
      .default(false)
      .notNull(),

    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_exchanges_exchange_number").on(table.exchangeNumber),
    index("idx_exchanges_requester_id").on(table.requesterId),
    index("idx_exchanges_receiver_id").on(table.receiverId),
    index("idx_exchanges_status").on(table.status),
  ]
);

/**
 * 20. Exchange Items (Entity 16 in SRS)
 */
export const exchangeItems = pgTable(
  "exchange_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    exchangeId: uuid("exchange_id")
      .references(() => exchanges.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "restrict" })
      .notNull(),
    role: text("role").notNull(), // 'OFFERED' or 'REQUESTED'
    agreedValue: numeric("agreed_value", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_exchange_items_exchange_id").on(table.exchangeId),
  ]
);
