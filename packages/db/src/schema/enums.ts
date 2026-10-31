import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "guest",
  "student",
  "admin",
  "campus_rep",
]);

export const productConditionEnum = pgEnum("product_condition", [
  "NEW",
  "LIKE_NEW",
  "GOOD",
  "FAIR",
]);

export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "PENDING_VALUATION",
  "VALUED",
  "APPROVED",
  "REJECTED",
  "SOLD",
  "PAUSED",
  "ARCHIVED",
]);

export const listingApprovalStatusEnum = pgEnum("listing_approval_status", [
  "PENDING",
  "APPROVED",
  "CHANGES_REQUESTED",
  "REJECTED",
]);

export const orderStatusEnum = pgEnum("order_status", [
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
]);

export const paymentChannelEnum = pgEnum("payment_channel", [
  "TELEBIRR",
  "CBE_BIRR",
  "CBE_TRANSFER",
  "AWASH_BIRR",
  "BOA_TRANSFER",
  "OTHER_BANK",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
  "REFUNDED",
]);

export const evidenceVerificationStatusEnum = pgEnum(
  "evidence_verification_status",
  ["PENDING", "VERIFIED", "REJECTED"]
);

export const commissionStatusEnum = pgEnum("commission_status", [
  "ACCRUED",
  "EARNED",
  "REVERSED",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "PAUSED_DISPUTE",
]);

export const refundStatusEnum = pgEnum("refund_status", [
  "INITIATED",
  "COMPLETED",
  "REJECTED",
]);

export const exchangeStatusEnum = pgEnum("exchange_status", [
  "PROPOSED",
  "ACCEPTED",
  "REJECTED",
  "PAYMENT_PENDING",
  "FEE_CONFIRMED",
  "HANDOVER_SCHEDULED",
  "HANDOVER_COMPLETED",
  "COMPLETED",
  "CANCELLED",
  "DISPUTED",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "SCHEDULED",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "FAILED",
  "RETURNED",
]);

export const disputeReasonEnum = pgEnum("dispute_reason", [
  "DAMAGED_ITEM",
  "WRONG_ITEM",
  "MISSING_ITEM",
  "UNDELIVERED",
  "FRAUD_SUSPECTED",
  "OTHER",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "OPEN",
  "UNDER_REVIEW",
  "RESOLVED_REFUND",
  "RESOLVED_REPLACEMENT",
  "RESOLVED_SELLER_FAVOR",
  "CLOSED",
]);

export const lostFoundTypeEnum = pgEnum("lost_found_type", ["LOST", "FOUND"]);

export const lostFoundStatusEnum = pgEnum("lost_found_status", [
  "OPEN",
  "CLAIM_SUBMITTED",
  "VERIFIED_RECOVERED",
  "CLOSED",
]);

export const recoveryClaimStatusEnum = pgEnum("recovery_claim_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);
