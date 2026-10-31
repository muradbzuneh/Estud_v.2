import { z } from "zod";
import { router, protectedProcedure, adminProcedure, repProcedure } from "../trpc";
import {
  deliveries,
  deliveryAssignments,
  orders,
  orderTimeline,
  eq,
  desc,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const logisticsRouter = router({
  /**
   * Admin assigns delivery to a Campus Representative (SRS FR-DEL-03, FR-DEL-08)
   */
  assignRep: adminProcedure
    .input(
      z.object({
        deliveryId: z.string().uuid(),
        agentId: z.string().uuid(),
        instructions: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Assign to delivery
      await ctx.db
        .update(deliveries)
        .set({
          assignedRepId: input.agentId,
          status: "ASSIGNED",
        })
        .where(eq(deliveries.id, input.deliveryId));

      // 2. Create assignment record
      const [assignment] = await ctx.db
        .insert(deliveryAssignments)
        .values({
          deliveryId: input.deliveryId,
          assignedAgentId: input.agentId,
          assignedByAdminId: ctx.user.id,
          instructions: input.instructions,
          status: "ASSIGNED",
        })
        .returning();

      return assignment;
    }),

  /**
   * Campus Representative updates delivery progress (SRS FR-DEL-04)
   */
  updateProgress: repProcedure
    .input(
      z.object({
        deliveryId: z.string().uuid(),
        status: z.enum([
          "PICKED_UP",
          "IN_TRANSIT",
          "READY_FOR_PICKUP",
          "FAILED",
        ]),
        notes: z.string().optional(),
        failureReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Record<string, unknown> = {
        status: input.status,
        deliveryNotes: input.notes,
      };

      if (input.status === "PICKED_UP") {
        updateData.pickedUpAt = new Date();
      } else if (input.status === "FAILED") {
        updateData.failedAt = new Date();
        updateData.failureReason = input.failureReason;
      }

      await ctx.db
        .update(deliveries)
        .set(updateData)
        .where(eq(deliveries.id, input.deliveryId));

      return { status: input.status };
    }),

  /**
   * Delivery handover confirmation with secure PIN (SRS FR-DEL-05, FR-DEL-07)
   */
  confirmHandover: protectedProcedure
    .input(
      z.object({
        deliveryId: z.string().uuid(),
        handoverPin: z.string().length(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.query.deliveries.findFirst({
        where: eq(deliveries.id, input.deliveryId),
        with: { order: true },
      });

      if (!delivery) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Delivery not found." });
      }

      // Verify PIN
      if (delivery.recipientHandoverCode !== input.handoverPin) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid handover PIN. Please verify with the recipient.",
        });
      }

      // 1. Mark delivery delivered
      await ctx.db
        .update(deliveries)
        .set({
          status: "DELIVERED",
          deliveredAt: new Date(),
        })
        .where(eq(deliveries.id, delivery.id));

      // 2. Mark order as DELIVERED
      if (delivery.orderId) {
        await ctx.db
          .update(orders)
          .set({ status: "DELIVERED" })
          .where(eq(orders.id, delivery.orderId));

        await ctx.db.insert(orderTimeline).values({
          orderId: delivery.orderId,
          status: "DELIVERED",
          actorId: ctx.user.id,
          notes: "Physical delivery confirmed with PIN. Ready for seller payout.",
        });
      }

      return { success: true };
    }),

  /**
   * Get deliveries assigned to the logged-in campus representative
   */
  getMyAssignedDeliveries: repProcedure.query(async ({ ctx }) => {
    return ctx.db.query.deliveries.findMany({
      where: eq(deliveries.assignedRepId, ctx.user.id),
      orderBy: [desc(deliveries.createdAt)],
      with: {
        order: {
          with: {
            product: true,
            buyer: { with: { profile: true } },
            seller: { with: { profile: true } },
          },
        },
        pickupLocation: true,
        dropoffLocation: true,
      },
    });
  }),
});
