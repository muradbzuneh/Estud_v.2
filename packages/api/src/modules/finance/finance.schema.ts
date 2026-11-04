import { z } from "zod";

export const paymentChannels = [
  "TELEBIRR",
  "CBE_BIRR",
  "CBE_TRANSFER",
  "AWASH_BIRR",
  "BOA_TRANSFER",
  "OTHER_BANK",
] as const;

export const submitPaymentEvidenceSchema = z.object({
  paymentId: z.string().uuid(),
  channel: z.enum(paymentChannels),
  bankTransactionReference: z.string().min(4, "Enter valid transaction code"),
  senderAccountOrPhone: z.string().optional(),
  screenshotUrl: z.string().url("Valid screenshot URL required"),
  notes: z.string().optional(),
});

export const adminVerifyPaymentSchema = z.object({
  paymentId: z.string().uuid(),
  verified: z.boolean(),
  rejectionReason: z.string().optional(),
});

export const adminExecutePayoutSchema = z.object({
  orderId: z.string().uuid(),
  payoutChannel: z.enum(paymentChannels),
  sellerAccountNumber: z.string().min(5, "Account number required"),
  sellerAccountName: z.string().min(3, "Account name required"),
  payoutProofUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export const adminListPaymentsFilterSchema = z.object({
  status: z.enum(["ALL", "PENDING", "SUBMITTED", "VERIFIED", "REJECTED", "REFUNDED"]).default("ALL"),
  channel: z.enum(paymentChannels).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

