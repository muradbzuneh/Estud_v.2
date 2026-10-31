import { TRPCError } from "@trpc/server";
import {
  transactionDisputes,
  disputeEvidence,
  orders,
  orderTimeline,
  eq,
  desc,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type { raiseDisputeSchema, adminResolveDisputeSchema } from "./disputes.schema";

export class DisputesService {
  constructor(private db: EstudDatabase) {}

  async raiseDispute(userId: string, input: z.infer<typeof raiseDisputeSchema>) {
    const disputeNumber = `EST-DSP-${Date.now().toString(36).toUpperCase()}`;

    const [dispute] = await this.db
      .insert(transactionDisputes)
      .values({
        disputeNumber,
        orderId: input.orderId,
        exchangeId: input.exchangeId,
        raisedById: userId,
        reason: input.reason,
        description: input.description,
        status: "OPEN",
      })
      .returning();

    if (input.evidenceUrls && input.evidenceUrls.length > 0) {
      await this.db.insert(disputeEvidence).values(
        input.evidenceUrls.map((url) => ({
          disputeId: dispute.id,
          uploadedById: userId,
          fileUrl: url,
        }))
      );
    }

    // Freeze order payouts
    if (input.orderId) {
      await this.db
        .update(orders)
        .set({ status: "DISPUTED" })
        .where(eq(orders.id, input.orderId));

      await this.db.insert(orderTimeline).values({
        orderId: input.orderId,
        status: "DISPUTED",
        actorId: userId,
        notes: `Dispute opened (${input.reason}): ${input.description}`,
      });
    }

    await recordAuditLog({
      db: this.db,
      actorId: userId,
      action: "DISPUTE_RAISED",
      targetType: "dispute",
      targetId: dispute.id,
      metadata: { reason: input.reason },
    });

    return dispute;
  }

  async adminResolve(adminId: string, input: z.infer<typeof adminResolveDisputeSchema>) {
    const dispute = await this.db.query.transactionDisputes.findFirst({
      where: eq(transactionDisputes.id, input.disputeId),
      with: { order: true },
    });

    if (!dispute) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Dispute not found." });
    }

    await this.db
      .update(transactionDisputes)
      .set({
        status: input.status,
        adminResolutionSummary: input.summary,
        resolvedByAdminId: adminId,
        resolvedAt: new Date(),
      })
      .where(eq(transactionDisputes.id, dispute.id));

    if (dispute.order) {
      if (input.status === "RESOLVED_REFUND") {
        await this.db
          .update(orders)
          .set({ status: "REFUNDED" })
          .where(eq(orders.id, dispute.order.id));

        await this.db.insert(orderTimeline).values({
          orderId: dispute.order.id,
          status: "REFUNDED",
          actorId: adminId,
          notes: `Dispute resolved in buyer favor. Refund approved: ${input.summary}`,
        });
      } else if (input.status === "RESOLVED_SELLER_FAVOR") {
        await this.db
          .update(orders)
          .set({ status: "DELIVERED" })
          .where(eq(orders.id, dispute.order.id));

        await this.db.insert(orderTimeline).values({
          orderId: dispute.order.id,
          status: "DELIVERED",
          actorId: adminId,
          notes: `Dispute cleared in seller favor. Payout unpaused: ${input.summary}`,
        });
      }
    }

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "DISPUTE_RESOLVED",
      targetType: "dispute",
      targetId: dispute.id,
      metadata: { status: input.status, summary: input.summary },
    });

    return { success: true };
  }
}
