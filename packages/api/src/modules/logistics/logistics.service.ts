import { TRPCError } from "@trpc/server";
import {
  deliveries,
  deliveryAssignments,
  orders,
  orderTimeline,
  eq,
  and,
  desc,
  sql,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  assignRepSchema,
  updateProgressSchema,
  confirmHandoverSchema,
  adminListDeliveriesFilterSchema,
} from "./logistics.schema";

export class LogisticsService {
  constructor(private db: EstudDatabase) {}

  async assignRep(adminId: string, input: z.infer<typeof assignRepSchema>) {
    await this.db
      .update(deliveries)
      .set({
        assignedRepId: input.agentId,
        status: "ASSIGNED",
      })
      .where(eq(deliveries.id, input.deliveryId));

    const [assignment] = await this.db
      .insert(deliveryAssignments)
      .values({
        deliveryId: input.deliveryId,
        assignedAgentId: input.agentId,
        assignedByAdminId: adminId,
        instructions: input.instructions,
        status: "ASSIGNED",
      })
      .returning();

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "DELIVERY_ASSIGNED",
      targetType: "order",
      targetId: input.deliveryId,
      metadata: { agentId: input.agentId },
    });

    return assignment;
  }

  async updateProgress(input: z.infer<typeof updateProgressSchema>) {
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

    await this.db
      .update(deliveries)
      .set(updateData)
      .where(eq(deliveries.id, input.deliveryId));

    return { status: input.status };
  }

  async confirmHandover(actorId: string, input: z.infer<typeof confirmHandoverSchema>) {
    const delivery = await this.db.query.deliveries.findFirst({
      where: eq(deliveries.id, input.deliveryId),
      with: { order: true },
    });

    if (!delivery) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Delivery not found." });
    }

    if (delivery.recipientHandoverCode !== input.handoverPin) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid handover PIN. Please verify with the recipient.",
      });
    }

    await this.db
      .update(deliveries)
      .set({
        status: "DELIVERED",
        deliveredAt: new Date(),
      })
      .where(eq(deliveries.id, delivery.id));

    if (delivery.orderId) {
      await this.db
        .update(orders)
        .set({ status: "DELIVERED" })
        .where(eq(orders.id, delivery.orderId));

      await this.db.insert(orderTimeline).values({
        orderId: delivery.orderId,
        status: "DELIVERED",
        actorId,
        notes: "Physical delivery confirmed with PIN. Ready for seller payout.",
      });
    }

    await recordAuditLog({
      db: this.db,
      actorId,
      action: "DELIVERY_CONFIRMED_WITH_PIN",
      targetType: "order",
      targetId: delivery.id,
    });

    return { success: true };
  }

  async getMyAssignedDeliveries(agentId: string) {
    return this.db.query.deliveries.findMany({
      where: eq(deliveries.assignedRepId, agentId),
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
  }

  /**
   * Admin: List all campus deliveries and handover milestones
   */
  async adminListDeliveries(input: z.infer<typeof adminListDeliveriesFilterSchema>) {
    const conditions = [];

    if (input.status !== "ALL") {
      conditions.push(eq(deliveries.status, input.status as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (input.page - 1) * input.pageSize;

    const [items, totalRes] = await Promise.all([
      this.db.query.deliveries.findMany({
        where: whereClause,
        limit: input.pageSize,
        offset,
        orderBy: [desc(deliveries.createdAt)],
        with: {
          assignedRep: { with: { profile: true } },
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
      }),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(deliveries)
        .where(whereClause),
    ]);

    const total = totalRes[0]?.count ?? 0;

    return {
      items,
      total,
      page: input.page,
      pageSize: input.pageSize,
      totalPages: Math.ceil(total / input.pageSize),
    };
  }
}
