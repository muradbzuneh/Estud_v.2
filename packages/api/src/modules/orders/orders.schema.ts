import { z } from "zod";

export const createPurchaseRequestSchema = z.object({
  productId: z.string().uuid(),
  deliveryFee: z.number().default(0),
});

export const checkoutWithEscrowSchema = z.object({
  productId: z.string(),
  deliveryMethod: z.enum(["hub", "runner"]).default("hub"),
  deliveryFee: z.number().default(0),
  channel: z.enum([
    "TELEBIRR",
    "CBE_BIRR",
    "CBE_TRANSFER",
    "AWASH_BIRR",
    "BOA_TRANSFER",
    "OTHER_BANK",
  ]).default("TELEBIRR"),
  bankTransactionReference: z.string().min(3, "Valid transaction code is required"),
  screenshotUrl: z.string().optional(),
  senderAccountOrPhone: z.string().optional(),
  notes: z.string().optional(),
});

export const sellerRespondOrderSchema = z.object({
  orderId: z.string().uuid(),
  accept: z.boolean(),
  rejectionReason: z.string().optional(),
});

export const orderStatuses = [
  "REQUESTED",
  "SELLER_ACCEPTED",
  "SELLER_REJECTED",
  "PAYMENT_PENDING",
  "PAYMENT_SUBMITTED",
  "PAYMENT_VERIFIED",
  "IN_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
  "REFUNDED",
] as const;

export const adminListOrdersFilterSchema = z.object({
  status: z.enum(["ALL", ...orderStatuses]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const adminUpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(orderStatuses),
  notes: z.string().optional(),
});

