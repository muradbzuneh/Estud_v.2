import { TRPCError } from "@trpc/server";
import {
  orders,
  orderItems,
  orderTimeline,
  products,
  payments,
  eq,
  desc,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type { createPurchaseRequestSchema, sellerRespondOrderSchema } from "./orders.schema";

export class OrdersService {
  constructor(private db: EstudDatabase) {}

  async createPurchaseRequest(buyerId: string, input: z.infer<typeof createPurchaseRequestSchema>) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });

    if (!product || product.status !== "APPROVED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Product is not available for purchase.",
      });
    }

    if (product.sellerId === buyerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot purchase your own listing.",
      });
    }

    const itemValue = Number(product.approvedItemValue || product.proposedPrice);
    const commissionAmount = Number(product.commissionAmount || (itemValue * 0.05).toFixed(2));
    const deliveryFee = input.deliveryFee;
    const totalAmount = itemValue + commissionAmount + deliveryFee;

    const orderNumber = `EST-ORD-${Date.now().toString(36).toUpperCase()}`;

    // 1. Create order
    const [newOrder] = await this.db
      .insert(orders)
      .values({
        orderNumber,
        buyerId,
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
    await this.db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: product.id,
      quantity: 1,
      unitItemValue: itemValue.toFixed(2),
      unitCommissionAmount: commissionAmount.toFixed(2),
      totalPrice: totalAmount.toFixed(2),
    });

    // 3. Record timeline
    await this.db.insert(orderTimeline).values({
      orderId: newOrder.id,
      status: "REQUESTED",
      actorId: buyerId,
      notes: "Buyer initiated purchase request.",
    });

    await recordAuditLog({
      db: this.db,
      actorId: buyerId,
      action: "PURCHASE_REQUESTED",
      targetType: "order",
      targetId: newOrder.id,
      metadata: { totalAmount, itemValue, commissionAmount },
    });

    return newOrder;
  }

  async sellerRespond(sellerId: string, input: z.infer<typeof sellerRespondOrderSchema>) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, input.orderId),
    });

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
    }

    if (order.sellerId !== sellerId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only the designated seller can respond.",
      });
    }

    if (order.status !== "REQUESTED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Order is no longer awaiting response.",
      });
    }

    if (input.accept) {
      await this.db
        .update(orders)
        .set({
          status: "PAYMENT_PENDING",
          sellerAcceptedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      const paymentReference = `EST-PAY-${Date.now().toString(36).toUpperCase()}`;
      await this.db.insert(payments).values({
        orderId: order.id,
        paymentReference,
        amount: order.totalAmount,
        channel: "TELEBIRR",
        status: "PENDING",
        receivingAccountNumber: "0911000000 / CBE 1000222333444",
      });

      await this.db.insert(orderTimeline).values({
        orderId: order.id,
        status: "PAYMENT_PENDING",
        actorId: sellerId,
        notes: "Seller accepted purchase. Awaiting buyer payment.",
      });

      return { status: "PAYMENT_PENDING" };
    } else {
      await this.db
        .update(orders)
        .set({
          status: "SELLER_REJECTED",
          sellerRejectedAt: new Date(),
          rejectionReason: input.rejectionReason,
        })
        .where(eq(orders.id, order.id));

      await this.db.insert(orderTimeline).values({
        orderId: order.id,
        status: "SELLER_REJECTED",
        actorId: sellerId,
        notes: `Seller declined: ${input.rejectionReason || "No reason specified."}`,
      });

      return { status: "SELLER_REJECTED" };
    }
  }

  async getBuyerOrders(buyerId: string) {
    return this.db.query.orders.findMany({
      where: eq(orders.buyerId, buyerId),
      orderBy: [desc(orders.createdAt)],
      with: {
        product: { with: { images: true } },
        payments: true,
        delivery: true,
      },
    });
  }

  async getSellerOrders(sellerId: string) {
    return this.db.query.orders.findMany({
      where: eq(orders.sellerId, sellerId),
      orderBy: [desc(orders.createdAt)],
      with: {
        product: { with: { images: true } },
        payments: true,
        payout: true,
        delivery: true,
      },
    });
  }

  async getById(userId: string, userRole: string, orderId: string) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        product: { with: { images: true } },
        buyer: { with: { profile: true } },
        seller: { with: { profile: true } },
        payments: { with: { evidence: true } },
        payout: true,
        delivery: true,
        timeline: true,
        dispute: true,
      },
    });

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
    }

    if (order.buyerId !== userId && order.sellerId !== userId && userRole !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
    }

    return order;
  }
}
