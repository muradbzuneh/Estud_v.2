import { TRPCError } from "@trpc/server";
import {
  exchanges,
  exchangeItems,
  products,
  users,
  eq,
  or,
  and,
  desc,
  sql,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  proposeExchangeSchema,
  respondExchangeSchema,
  adminListExchangesFilterSchema,
  adminModerateExchangeSchema,
} from "./exchanges.schema";

export class ExchangesService {
  constructor(private db: EstudDatabase) {}

  async propose(requesterId: string, input: z.infer<typeof proposeExchangeSchema>) {
    const offeredProduct = await this.db.query.products.findFirst({
      where: eq(products.id, input.offeredProductId),
    });

    const requestedProduct = await this.db.query.products.findFirst({
      where: eq(products.id, input.requestedProductId),
    });

    if (!offeredProduct || !requestedProduct) {
      throw new TRPCError({ code: "NOT_FOUND", message: "One or both products not found." });
    }

    if (offeredProduct.sellerId !== requesterId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You can only offer items you own." });
    }

    if (!requestedProduct.isExchangeEligible) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The requested item is not open for exchange.",
      });
    }

    const exchangeNumber = `EST-EX-${Date.now().toString(36).toUpperCase()}`;

    const offeredVal = Number(offeredProduct.approvedItemValue || offeredProduct.proposedPrice);
    const requestedVal = Number(requestedProduct.approvedItemValue || requestedProduct.proposedPrice);
    const cashDiff = requestedVal - offeredVal;

    const [proposal] = await this.db
      .insert(exchanges)
      .values({
        exchangeNumber,
        requesterId,
        receiverId: requestedProduct.sellerId,
        offeredProductId: offeredProduct.id,
        requestedProductId: requestedProduct.id,
        offeredItemApprovedValue: offeredVal.toFixed(2),
        requestedItemApprovedValue: requestedVal.toFixed(2),
        cashDifference: Math.abs(cashDiff).toFixed(2),
        cashPayerId: cashDiff > 0 ? requesterId : cashDiff < 0 ? requestedProduct.sellerId : null,
        status: "PROPOSED",
      })
      .returning();

    await this.db.insert(exchangeItems).values([
      {
        exchangeId: proposal.id,
        productId: offeredProduct.id,
        role: "OFFERED",
        agreedValue: offeredVal.toFixed(2),
      },
      {
        exchangeId: proposal.id,
        productId: requestedProduct.id,
        role: "REQUESTED",
        agreedValue: requestedVal.toFixed(2),
      },
    ]);

    await recordAuditLog({
      db: this.db,
      actorId: requesterId,
      action: "EXCHANGE_PROPOSED",
      targetType: "order",
      targetId: proposal.id,
      metadata: { cashDiff, offeredVal, requestedVal },
    });

    return proposal;
  }

  async respond(receiverId: string, input: z.infer<typeof respondExchangeSchema>) {
    const exchange = await this.db.query.exchanges.findFirst({
      where: eq(exchanges.id, input.exchangeId),
    });

    if (!exchange) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Exchange not found." });
    }

    if (exchange.receiverId !== receiverId) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only the receiver can respond." });
    }

    const newStatus = input.accept ? "ACCEPTED" : "REJECTED";

    await this.db
      .update(exchanges)
      .set({ status: newStatus })
      .where(eq(exchanges.id, exchange.id));

    return { status: newStatus };
  }

  async listMyExchanges(userId: string) {
    return this.db.query.exchanges.findMany({
      where: or(
        eq(exchanges.requesterId, userId),
        eq(exchanges.receiverId, userId)
      ),
      orderBy: [desc(exchanges.createdAt)],
      with: {
        offeredProduct: { with: { images: true } },
        requestedProduct: { with: { images: true } },
      },
    });
  }

  async adminList(input: z.infer<typeof adminListExchangesFilterSchema>) {
    try {
      const conditions = [];

      if (input.status !== "ALL") {
        conditions.push(eq(exchanges.status, input.status as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.pageSize;

      const [items, totalRes] = await Promise.all([
        this.db.query.exchanges.findMany({
          where: whereClause,
          limit: input.pageSize,
          offset,
          orderBy: [desc(exchanges.createdAt)],
          with: {
            requester: { with: { profile: true } },
            receiver: { with: { profile: true } },
            offeredProduct: { with: { images: true } },
            requestedProduct: { with: { images: true } },
          },
        }),
        this.db
          .select({ count: sql<number>`count(*)::int` })
          .from(exchanges)
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
    } catch (err) {
      console.warn("Fallback for exchanges.adminList:", err);
      return {
        items: [],
        total: 0,
        page: input.page,
        pageSize: input.pageSize,
        totalPages: 1,
      };
    }
  }

  async adminModerate(adminId: string, input: z.infer<typeof adminModerateExchangeSchema>) {
    const exchange = await this.db.query.exchanges.findFirst({
      where: eq(exchanges.id, input.exchangeId),
    });

    if (!exchange) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Exchange proposal not found." });
    }

    const [updated] = await this.db
      .update(exchanges)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(exchanges.id, input.exchangeId))
      .returning();

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: `EXCHANGE_MODERATED_${input.status}`,
      targetType: "order",
      targetId: input.exchangeId,
      metadata: { newStatus: input.status, notes: input.notes },
    });

    return updated;
  }
}
