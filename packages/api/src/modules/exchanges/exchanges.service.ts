import { TRPCError } from "@trpc/server";
import {
  exchanges,
  exchangeItems,
  products,
  eq,
  or,
  desc,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type { proposeExchangeSchema, respondExchangeSchema } from "./exchanges.schema";

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
}
