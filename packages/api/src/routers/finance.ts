import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
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
  sql,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const financeRouter = router({
  /**
   * Buyer submits payment evidence (SRS FR-PAY-04, FR-PAY-06)
   */
  submitPaymentEvidence: protectedProcedure
    .input(
      z.object({
        paymentId: z.string().uuid(),
        channel: z.enum([
          "TELEBIRR",
          "CBE_BIRR",
          "CBE_TRANSFER",
          "AWASH_BIRR",
          "BOA_TRANSFER",
          "OTHER_BANK",
        ]),
        bankTransactionReference: z.string().min(4),
        senderAccountOrPhone: z.string().optional(),
        screenshotUrl: z.string().url(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.query.payments.findFirst({
        where: eq(payments.id, input.paymentId),
      });

      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found." });
      }

      // 1. Insert payment evidence
      const [evidence] = await ctx.db
        .insert(paymentEvidence)
        .values({
          paymentId: payment.id,
          uploaderId: ctx.user.id,
          bankTransactionReference: input.bankTransactionReference,
          senderAccountOrPhone: input.senderAccountOrPhone,
          screenshotUrl: input.screenshotUrl,
          notes: input.notes,
          verificationStatus: "PENDING",
        })
        .returning();

      // 2. Update payment status to SUBMITTED
      await ctx.db
        .update(payments)
        .set({
          channel: input.channel,
          status: "SUBMITTED",
        })
        .where(eq(payments.id, payment.id));

      // 3. Update order status if orderId exists
      if (payment.orderId) {
        await ctx.db
          .update(orders)
          .set({ status: "PAYMENT_SUBMITTED" })
          .where(eq(orders.id, payment.orderId));

        await ctx.db.insert(orderTimeline).values({
          orderId: payment.orderId,
          status: "PAYMENT_SUBMITTED",
          actorId: ctx.user.id,
          notes: `Buyer submitted ${input.channel} transfer evidence with ref: ${input.bankTransactionReference}`,
        });
      }

      return evidence;
    }),

  /**
   * Admin verifies actual incoming funds (SRS FR-PAY-05, FR-FIN-01 to 05)
   */
  adminVerifyPayment: adminProcedure
    .input(
      z.object({
        paymentId: z.string().uuid(),
        verified: z.boolean(),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.db.query.payments.findFirst({
        where: eq(payments.id, input.paymentId),
        with: {
          order: true,
        },
      });

      if (!payment) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found." });
      }

      if (!input.verified) {
        // Mark rejected
        await ctx.db
          .update(payments)
          .set({ status: "REJECTED" })
          .where(eq(payments.id, payment.id));

        await ctx.db
          .update(paymentEvidence)
          .set({
            verificationStatus: "REJECTED",
            verifiedByAdminId: ctx.user.id,
            verifiedAt: new Date(),
            rejectionReason: input.rejectionReason || "Payment receipt could not be verified.",
          })
          .where(eq(paymentEvidence.paymentId, payment.id));

        return { status: "REJECTED" };
      }

      // 1. Mark payment verified
      await ctx.db
        .update(payments)
        .set({
          status: "VERIFIED",
          confirmedByAdminId: ctx.user.id,
          confirmedAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      await ctx.db
        .update(paymentEvidence)
        .set({
          verificationStatus: "VERIFIED",
          verifiedByAdminId: ctx.user.id,
          verifiedAt: new Date(),
        })
        .where(eq(paymentEvidence.paymentId, payment.id));

      if (payment.order) {
        // 2. Accrue 5% commission record
        await ctx.db.insert(commissionRecords).values({
          orderId: payment.order.id,
          itemApprovedValue: payment.order.itemValue,
          commissionRate: "0.0500",
          commissionEarned: payment.order.commissionAmount,
          status: "ACCRUED",
        });

        // 3. Advance order to IN_DELIVERY
        await ctx.db
          .update(orders)
          .set({ status: "IN_DELIVERY" })
          .where(eq(orders.id, payment.order.id));

        // 4. Create pending delivery logistics record
        const trackingNumber = `EST-DEL-${Date.now().toString(36).toUpperCase()}`;
        const handoverPin = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit verification code

        await ctx.db.insert(deliveries).values({
          orderId: payment.order.id,
          trackingNumber,
          status: "SCHEDULED",
          recipientHandoverCode: handoverPin,
        });

        // 5. Timeline
        await ctx.db.insert(orderTimeline).values({
          orderId: payment.order.id,
          status: "IN_DELIVERY",
          actorId: ctx.user.id,
          notes: "Admin confirmed payment. Order moved to delivery phase.",
        });
      }

      return { status: "VERIFIED" };
    }),

  /**
   * Admin executes seller payout (SRS FR-FIN-07, FR-FIN-08, 5.2)
   * Formula:
   * Seller receives 100% of approved item value
   * Commission remains with Estud
   */
  adminExecutePayout: adminProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        payoutChannel: z.enum(["TELEBIRR", "CBE_BIRR", "CBE_TRANSFER", "AWASH_BIRR", "BOA_TRANSFER", "OTHER_BANK"]),
        sellerAccountNumber: z.string().min(5),
        sellerAccountName: z.string().min(3),
        payoutProofUrl: z.string().url().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.orderId),
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      if (order.status !== "COMPLETED" && order.status !== "DELIVERED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payout can only be executed for delivered/completed orders.",
        });
      }

      const payoutReference = `EST-PO-${Date.now().toString(36).toUpperCase()}`;

      // 1. Create seller payout record for 100% of item value
      const [payout] = await ctx.db
        .insert(sellerPayouts)
        .values({
          orderId: order.id,
          sellerId: order.sellerId,
          payoutReference,
          payableAmount: order.itemValue, // 100% of item value, no deductions
          payoutChannel: input.payoutChannel,
          sellerAccountNumber: input.sellerAccountNumber,
          sellerAccountName: input.sellerAccountName,
          status: "COMPLETED",
          processedByAdminId: ctx.user.id,
          payoutProofUrl: input.payoutProofUrl,
          notes: input.notes,
          processedAt: new Date(),
        })
        .returning();

      // 2. Mark commission as earned
      await ctx.db
        .update(commissionRecords)
        .set({ status: "EARNED" })
        .where(eq(commissionRecords.orderId, order.id));

      // 3. Mark order as COMPLETED
      await ctx.db
        .update(orders)
        .set({
          status: "COMPLETED",
          completedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      return payout;
    }),

  /**
   * Admin Financial Metrics & Reconciliation (SRS FR-FIN-11)
   */
  getFinancialSummary: adminProcedure.query(async ({ ctx }) => {
    const pendingPayments = await ctx.db.query.payments.findMany({
      where: eq(payments.status, "SUBMITTED"),
      with: {
        evidence: true,
        order: true,
      },
      orderBy: [desc(payments.createdAt)],
    });

    const pendingPayouts = await ctx.db.query.orders.findMany({
      where: eq(orders.status, "DELIVERED"),
      with: {
        seller: {
          with: { profile: true },
        },
        product: true,
      },
    });

    return {
      pendingPayments,
      pendingPayouts,
    };
  }),
});
