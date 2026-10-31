import { TRPCError } from "@trpc/server";
import {
  payments,
  paymentEvidence,
  orders,
  commissionRecords,
  sellerPayouts,
  deliveries,
  orderTimeline,
  eq,
  desc,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  submitPaymentEvidenceSchema,
  adminVerifyPaymentSchema,
  adminExecutePayoutSchema,
} from "./finance.schema";

export class FinanceService {
  constructor(private db: EstudDatabase) {}

  async submitEvidence(uploaderId: string, input: z.infer<typeof submitPaymentEvidenceSchema>) {
    const payment = await this.db.query.payments.findFirst({
      where: eq(payments.id, input.paymentId),
    });

    if (!payment) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found." });
    }

    // 1. Insert evidence
    const [evidence] = await this.db
      .insert(paymentEvidence)
      .values({
        paymentId: payment.id,
        uploaderId,
        bankTransactionReference: input.bankTransactionReference,
        senderAccountOrPhone: input.senderAccountOrPhone,
        screenshotUrl: input.screenshotUrl,
        notes: input.notes,
        verificationStatus: "PENDING",
      })
      .returning();

    // 2. Set payment to SUBMITTED
    await this.db
      .update(payments)
      .set({
        channel: input.channel,
        status: "SUBMITTED",
      })
      .where(eq(payments.id, payment.id));

    // 3. Set order status to PAYMENT_SUBMITTED
    if (payment.orderId) {
      await this.db
        .update(orders)
        .set({ status: "PAYMENT_SUBMITTED" })
        .where(eq(orders.id, payment.orderId));

      await this.db.insert(orderTimeline).values({
        orderId: payment.orderId,
        status: "PAYMENT_SUBMITTED",
        actorId: uploaderId,
        notes: `Buyer submitted ${input.channel} proof with reference: ${input.bankTransactionReference}`,
      });
    }

    await recordAuditLog({
      db: this.db,
      actorId: uploaderId,
      action: "PAYMENT_EVIDENCE_SUBMITTED",
      targetType: "payment",
      targetId: payment.id,
      metadata: { channel: input.channel, bankTransactionReference: input.bankTransactionReference },
    });

    return evidence;
  }

  async adminVerify(adminId: string, input: z.infer<typeof adminVerifyPaymentSchema>) {
    const payment = await this.db.query.payments.findFirst({
      where: eq(payments.id, input.paymentId),
      with: { order: true },
    });

    if (!payment) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found." });
    }

    if (!input.verified) {
      await this.db
        .update(payments)
        .set({ status: "REJECTED" })
        .where(eq(payments.id, payment.id));

      await this.db
        .update(paymentEvidence)
        .set({
          verificationStatus: "REJECTED",
          verifiedByAdminId: adminId,
          verifiedAt: new Date(),
          rejectionReason: input.rejectionReason || "Payment receipt could not be verified.",
        })
        .where(eq(paymentEvidence.paymentId, payment.id));

      return { status: "REJECTED" };
    }

    // 1. Confirm payment
    await this.db
      .update(payments)
      .set({
        status: "VERIFIED",
        confirmedByAdminId: adminId,
        confirmedAt: new Date(),
      })
      .where(eq(payments.id, payment.id));

    await this.db
      .update(paymentEvidence)
      .set({
        verificationStatus: "VERIFIED",
        verifiedByAdminId: adminId,
        verifiedAt: new Date(),
      })
      .where(eq(paymentEvidence.paymentId, payment.id));

    // 2. Accrue 5% commission & schedule delivery
    if (payment.order) {
      await this.db.insert(commissionRecords).values({
        orderId: payment.order.id,
        itemApprovedValue: payment.order.itemValue,
        commissionRate: "0.0500",
        commissionEarned: payment.order.commissionAmount,
        status: "ACCRUED",
      });

      await this.db
        .update(orders)
        .set({ status: "IN_DELIVERY" })
        .where(eq(orders.id, payment.order.id));

      const trackingNumber = `EST-DEL-${Date.now().toString(36).toUpperCase()}`;
      const handoverPin = Math.floor(1000 + Math.random() * 9000).toString();

      await this.db.insert(deliveries).values({
        orderId: payment.order.id,
        trackingNumber,
        status: "SCHEDULED",
        recipientHandoverCode: handoverPin,
      });

      await this.db.insert(orderTimeline).values({
        orderId: payment.order.id,
        status: "IN_DELIVERY",
        actorId: adminId,
        notes: "Payment confirmed by admin. Delivery code generated.",
      });

      await recordAuditLog({
        db: this.db,
        actorId: adminId,
        action: "PAYMENT_VERIFIED",
        targetType: "payment",
        targetId: payment.id,
        metadata: { orderId: payment.order.id, amount: payment.amount },
      });
    }

    return { status: "VERIFIED" };
  }

  async adminExecutePayout(adminId: string, input: z.infer<typeof adminExecutePayoutSchema>) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, input.orderId),
    });

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
    }

    if (order.status !== "COMPLETED" && order.status !== "DELIVERED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Payout can only be executed for delivered orders.",
      });
    }

    const payoutReference = `EST-PO-${Date.now().toString(36).toUpperCase()}`;

    // 1. Issue payout record for 100% of approved item value
    const [payout] = await this.db
      .insert(sellerPayouts)
      .values({
        orderId: order.id,
        sellerId: order.sellerId,
        payoutReference,
        payableAmount: order.itemValue, // 100% item value without deductions
        payoutChannel: input.payoutChannel,
        sellerAccountNumber: input.sellerAccountNumber,
        sellerAccountName: input.sellerAccountName,
        status: "COMPLETED",
        processedByAdminId: adminId,
        payoutProofUrl: input.payoutProofUrl,
        notes: input.notes,
        processedAt: new Date(),
      })
      .returning();

    // 2. Earn commission
    await this.db
      .update(commissionRecords)
      .set({ status: "EARNED" })
      .where(eq(commissionRecords.orderId, order.id));

    // 3. Complete order
    await this.db
      .update(orders)
      .set({
        status: "COMPLETED",
        completedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "SELLER_PAYOUT_COMPLETED",
      targetType: "payout",
      targetId: payout.id,
      metadata: { payableAmount: order.itemValue, sellerId: order.sellerId },
    });

    return payout;
  }

  async getFinancialSummary() {
    const pendingPayments = await this.db.query.payments.findMany({
      where: eq(payments.status, "SUBMITTED"),
      with: { evidence: true, order: true },
      orderBy: [desc(payments.createdAt)],
    });

    const pendingPayouts = await this.db.query.orders.findMany({
      where: eq(orders.status, "DELIVERED"),
      with: {
        seller: { with: { profile: true } },
        product: true,
      },
    });

    return { pendingPayments, pendingPayouts };
  }
}
