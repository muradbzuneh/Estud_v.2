import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  exchanges,
  exchangeItems,
  products,
  eq,
  or,
  desc,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const exchangesRouter = router({
  /**
   * User submits exchange proposal (SRS FR-EX-01, FR-EX-02)
   */
  propose: protectedProcedure
    .input(
      z.object({
        offeredProductId: z.string().uuid(),
        requestedProductId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const offeredProduct = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.offeredProductId),
      });

      const requestedProduct = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.requestedProductId),
      });

      if (!offeredProduct || !requestedProduct) {
        throw new TRPCError({ code: "NOT_FOUND", message: "One or both products not found." });
      }

      if (offeredProduct.sellerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only offer items you own." });
      }

      if (!requestedProduct.isExchangeEligible) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The requested item is not open for exchange.",
        });
      }

      const exchangeNumber = `EST-EX-${Date.now().toString(36).toUpperCase()}`;

      // Calculate cash difference if approved values exist
      const offeredVal = Number(offeredProduct.approvedItemValue || offeredProduct.proposedPrice);
      const requestedVal = Number(requestedProduct.approvedItemValue || requestedProduct.proposedPrice);
      const cashDiff = requestedVal - offeredVal;

      const [proposal] = await ctx.db
        .insert(exchanges)
        .values({
          exchangeNumber,
          requesterId: ctx.user.id,
          receiverId: requestedProduct.sellerId,
          offeredProductId: offeredProduct.id,
          requestedProductId: requestedProduct.id,
          offeredItemApprovedValue: offeredVal.toFixed(2),
          requestedItemApprovedValue: requestedVal.toFixed(2),
          cashDifference: Math.abs(cashDiff).toFixed(2),
          cashPayerId: cashDiff > 0 ? ctx.user.id : cashDiff < 0 ? requestedProduct.sellerId : null,
          status: "PROPOSED",
        })
        .returning();

      // Create exchange items
      await ctx.db.insert(exchangeItems).values([
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

      return proposal;
    }),

  /**
   * Receiver accepts or declines exchange
   */
  respond: protectedProcedure
    .input(
      z.object({
        exchangeId: z.string().uuid(),
        accept: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exchange = await ctx.db.query.exchanges.findFirst({
        where: eq(exchanges.id, input.exchangeId),
      });

      if (!exchange) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Exchange not found." });
      }

      if (exchange.receiverId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the receiver can respond." });
      }

      const newStatus = input.accept ? "ACCEPTED" : "REJECTED";

      await ctx.db
        .update(exchanges)
        .set({ status: newStatus })
        .where(eq(exchanges.id, exchange.id));

      return { status: newStatus };
    }),

  /**
   * List logged-in user's active exchanges
   */
  listMyExchanges: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.exchanges.findMany({
      where: or(
        eq(exchanges.requesterId, ctx.user.id),
        eq(exchanges.receiverId, ctx.user.id)
      ),
      orderBy: [desc(exchanges.createdAt)],
      with: {
        offeredProduct: {
          with: { images: true },
        },
        requestedProduct: {
          with: { images: true },
        },
      },
    });
  }),
});
