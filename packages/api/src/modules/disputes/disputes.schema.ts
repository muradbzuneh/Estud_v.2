import { z } from "zod";

export const disputeReasons = [
  "DAMAGED_ITEM",
  "WRONG_ITEM",
  "MISSING_ITEM",
  "UNDELIVERED",
  "FRAUD_SUSPECTED",
  "OTHER",
] as const;

export const raiseDisputeSchema = z.object({
  orderId: z.string().uuid().optional(),
  exchangeId: z.string().uuid().optional(),
  reason: z.enum(disputeReasons),
  description: z.string().min(10, "Describe the problem clearly"),
  evidenceUrls: z.array(z.string().url()).optional(),
});

export const adminResolveDisputeSchema = z.object({
  disputeId: z.string().uuid(),
  status: z.enum([
    "RESOLVED_REFUND",
    "RESOLVED_REPLACEMENT",
    "RESOLVED_SELLER_FAVOR",
    "CLOSED",
  ]),
  summary: z.string().min(5),
});
