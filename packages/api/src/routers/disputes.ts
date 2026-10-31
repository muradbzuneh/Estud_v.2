import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import {
  transactionDisputes,
  disputeEvidence,
  orders,
  refunds,
  orderTimeline,
  eq,
  desc,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const disputesRouter = router({
  /**
   * User reports transaction problem (SRS FR-DSP-01, FR-DSP-02)
   */
  raiseDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid().optional(),
        exchangeId: z.string().uuid().optional(),
        reason: z.enum([
          "DAMAGED_ITEM",
          "WRONG_ITEM",
          "MISSING_ITEM",
          "UNDELIVERED",
          "FRAUD_SUSPECTED",
          "OTHER",
        ]),
        description: z.string().min(10),
        evidenceUrls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const disputeNumber = `EST-DSP-${Date.now().toString(36).toUpperCase()}`;

      // 1. Create dispute
      const [dispute] = await ctx.db
        .insert(transactionDisputes)
        .values({
          disputeNumber,
          orderId: input.orderId,
          exchangeId: input.exchangeId,
          raisedById: ctx.user.id,
          reason: input.reason,
          description: input.description,
          status: "OPEN",
        })
        .returning();

      // 2. Attach evidence
      if (input.evidenceUrls && input.evidenceUrls.length > 0) {
        await ctx.db.insert(disputeEvidence).values(
          input.evidenceUrls.map((url) => ({
            disputeId: dispute.id,
            uploadedById: ctx.user.id,
            fileUrl: url,
          }))
        );
      }

      // 3. Mark order as DISPUTED (pauses seller payouts per FR-DSP-05)
      if (input.orderId) {
        await ctx.db
          .update(orders)
          .set({ status: "DISPUTED" })
          .where(eq(orders.id, input.orderId));

        await ctx.db.insert(orderTimeline).values({
          orderId: input.orderId,
          status: "DISPUTED",
          actorId: ctx.user.id,
          notes: `Dispute opened (${input.reason}): ${input.description}`,
        });
      }

      return dispute;
    }),

  /**
   * Admin resolves dispute (SRS FR-DSP-04, FR-DSP-06, FR-DSP-07)
   */
  adminResolve: adminProcedure
    .input(
      z.object({
        disputeId: z.string().uuid(),
        status: z.enum([
          "RESOLVED_REFUND",
          "RESOLVED_REPLACEMENT",
          "RESOLVED_SELLER_FAVOR",
          "CLOSED",
        ]),
        summary: z.string().min(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const dispute = await ctx.db.query.transactionDisputes.findFirst({
        where: eq(transactionDisputes.id, input.disputeId),
        with: { order: true },
      });

      if (!dispute) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Dispute not found." });
      }

      // 1. Update dispute
      await ctx.db
        .update(transactionDisputes)
        .set({
          status: input.status,
          adminResolutionSummary: input.summary,
          resolvedByAdminId: ctx.user.id,
          resolvedAt: new Date(),
        })
        .where(eq(transactionDisputes.id, dispute.id));

      // 2. Adjust order status based on resolution
      if (dispute.order) {
        if (input.status === "RESOLVED_REFUND") {
          await ctx.db
            .update(orders)
            .set({ status: "REFUNDED" })
            .where(eq(orders.id, dispute.order.id));

          await ctx.db.insert(orderTimeline).values({
            orderId: dispute.order.id,
            status: "REFUNDED",
            actorId: ctx.user.id,
            notes: `Dispute resolved in buyer favor. Refund approved: ${input.summary}`,
          });
        } else if (input.status === "RESOLVED_SELLER_FAVOR") {
          await ctx.db
            .update(orders)
            .set({ status: "DELIVERED" })
            .where(eq(orders.id, dispute.order.id));

          await ctx.db.insert(orderTimeline).values({
            orderId: dispute.order.id,
            status: "DELIVERED",
            actorId: ctx.user.id,
            notes: `Dispute cleared in seller favor. Payout unpaused: ${input.summary}`,
          });
        }
      }

      return { success: true };
    }),
});
