import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  orders,
  orderItems,
  orderTimeline,
  products,
  payments,
  eq,
  and,
  desc,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const ordersRouter = router({
  /**
   * Buyer submits purchase request (SRS FR-ORD-01 to 05)
   */
  createPurchaseRequest: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        deliveryFee: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product || product.status !== "APPROVED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product is not available for purchase.",
        });
      }

      if (product.sellerId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot purchase your own listing.",
        });
      }

      if (!product.approvedItemValue || !product.commissionAmount) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Product valuation data is incomplete.",
        });
      }

      const itemValue = Number(product.approvedItemValue);
      const commissionAmount = Number(product.commissionAmount);
      const deliveryFee = input.deliveryFee;
      const totalAmount = itemValue + commissionAmount + deliveryFee;

      const orderNumber = `EST-ORD-${Date.now().toString(36).toUpperCase()}`;

      // 1. Create order
      const [newOrder] = await ctx.db
        .insert(orders)
        .values({
          orderNumber,
          buyerId: ctx.user.id,
          sellerId: product.sellerId,
          productId: product.id,
          status: "REQUESTED",
          itemValue: itemValue.toFixed(2),
          commissionRate: "0.0500",
          commissionAmount: commissionAmount.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
        })
        .returning();

      // 2. Create order item
      await ctx.db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: product.id,
        quantity: 1,
        unitItemValue: itemValue.toFixed(2),
        unitCommissionAmount: commissionAmount.toFixed(2),
        totalPrice: totalAmount.toFixed(2),
      });

      // 3. Record timeline
      await ctx.db.insert(orderTimeline).values({
        orderId: newOrder.id,
        status: "REQUESTED",
        actorId: ctx.user.id,
        notes: "Buyer submitted purchase request.",
      });

      return newOrder;
    }),

  /**
   * Seller accepts or rejects the purchase request (SRS FR-ORD-04)
   */
  sellerRespond: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        accept: z.boolean(),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.orderId),
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      if (order.sellerId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the seller can respond to this request.",
        });
      }

      if (order.status !== "REQUESTED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order is no longer awaiting seller response.",
        });
      }

      if (input.accept) {
        // Seller accepts -> Transition to PAYMENT_PENDING and create Payment record
        await ctx.db
          .update(orders)
          .set({
            status: "PAYMENT_PENDING",
            sellerAcceptedAt: new Date(),
          })
          .where(eq(orders.id, order.id));

        // Create pending payment record
        const paymentReference = `EST-PAY-${Date.now().toString(36).toUpperCase()}`;
        await ctx.db.insert(payments).values({
          orderId: order.id,
          paymentReference,
          amount: order.totalAmount,
          channel: "TELEBIRR", // Default channel, user can change upon upload
          status: "PENDING",
          receivingAccountNumber: "0911000000 / CBE 1000222333444", // Official Estud receiving accounts
        });

        // Timeline
        await ctx.db.insert(orderTimeline).values({
          orderId: order.id,
          status: "PAYMENT_PENDING",
          actorId: ctx.user.id,
          notes: "Seller accepted order. Awaiting buyer payment.",
        });

        return { status: "PAYMENT_PENDING" };
      } else {
        // Seller rejects
        await ctx.db
          .update(orders)
          .set({
            status: "SELLER_REJECTED",
            sellerRejectedAt: new Date(),
            rejectionReason: input.rejectionReason,
          })
          .where(eq(orders.id, order.id));

        await ctx.db.insert(orderTimeline).values({
          orderId: order.id,
          status: "SELLER_REJECTED",
          actorId: ctx.user.id,
          notes: `Seller declined order: ${input.rejectionReason || "No reason given."}`,
        });

        return { status: "SELLER_REJECTED" };
      }
    }),

  /**
   * Get orders for the logged-in buyer
   */
  getBuyerOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.orders.findMany({
      where: eq(orders.buyerId, ctx.user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        product: {
          with: {
            images: true,
          },
        },
        payments: true,
        delivery: true,
      },
    });
  }),

  /**
   * Get orders for the logged-in seller
   */
  getSellerOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.orders.findMany({
      where: eq(orders.sellerId, ctx.user.id),
      orderBy: [desc(orders.createdAt)],
      with: {
        product: {
          with: {
            images: true,
          },
        },
        payments: true,
        payout: true,
        delivery: true,
      },
    });
  }),

  /**
   * Get specific order details
   */
  getById: protectedProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.orderId),
        with: {
          product: {
            with: {
              images: true,
            },
          },
          buyer: {
            with: {
              profile: true,
            },
          },
          seller: {
            with: {
              profile: true,
            },
          },
          payments: {
            with: {
              evidence: true,
            },
          },
          payout: true,
          delivery: true,
          timeline: true,
          dispute: true,
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
      }

      // Only buyer, seller, or admin can inspect this order
      if (
        order.buyerId !== ctx.user.id &&
        order.sellerId !== ctx.user.id &&
        ctx.user.role !== "admin"
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
      }

      return order;
    }),
});
