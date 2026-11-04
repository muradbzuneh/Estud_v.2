import { TRPCError } from "@trpc/server";
import {
  orders,
  orderItems,
  orderTimeline,
  products,
  payments,
  paymentEvidence,
  eq,
  and,
  desc,
  sql,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  createPurchaseRequestSchema,
  checkoutWithEscrowSchema,
  sellerRespondOrderSchema,
  adminListOrdersFilterSchema,
  adminUpdateOrderStatusSchema,
} from "./orders.schema";

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

  async checkoutWithEscrow(buyerId: string, input: z.infer<typeof checkoutWithEscrowSchema>) {
    // 1. Find product
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, input.productId),
    });

    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found.",
      });
    }

    const itemValue = Number(product.approvedItemValue || product.proposedPrice || 0);
    const commissionAmount = Number((itemValue * 0.05).toFixed(2));
    const deliveryFee = input.deliveryFee || 0;
    const totalAmount = itemValue + commissionAmount + deliveryFee;

    const orderNumber = `EST-ORD-${Date.now().toString(36).toUpperCase()}`;

    // 2. Create order in PAYMENT_SUBMITTED status
    const [newOrder] = await this.db
      .insert(orders)
      .values({
        orderNumber,
        buyerId,
        sellerId: product.sellerId,
        productId: product.id,
        status: "PAYMENT_SUBMITTED",
        itemValue: itemValue.toFixed(2),
        commissionRate: "0.0500",
        commissionAmount: commissionAmount.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      })
      .returning();

    // 3. Create order item
    await this.db.insert(orderItems).values({
      orderId: newOrder.id,
      productId: product.id,
      quantity: 1,
      unitItemValue: itemValue.toFixed(2),
      unitCommissionAmount: commissionAmount.toFixed(2),
      totalPrice: totalAmount.toFixed(2),
    });

    // 4. Create payment record in SUBMITTED status
    const paymentReference = `EST-PAY-${Date.now().toString(36).toUpperCase()}`;
    const receivingAccount =
      input.channel === "TELEBIRR"
        ? "0911 234 567 (Telebirr Merchant)"
        : input.channel.includes("CBE")
        ? "1000 4589 1234 5 (CBE Trust)"
        : "0132 0984 6543 00 (Awash Bank)";

    const [payment] = await this.db
      .insert(payments)
      .values({
        orderId: newOrder.id,
        paymentReference,
        amount: totalAmount.toFixed(2),
        channel: input.channel,
        status: "SUBMITTED",
        receivingAccountNumber: receivingAccount,
      })
      .returning();

    // 5. Create payment evidence (screenshot + transaction reference)
    await this.db.insert(paymentEvidence).values({
      paymentId: payment.id,
      uploaderId: buyerId,
      bankTransactionReference: input.bankTransactionReference,
      senderAccountOrPhone: input.senderAccountOrPhone || "Web Student Checkout",
      screenshotUrl: input.screenshotUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
      notes: input.notes || `Direct Escrow Checkout (${input.deliveryMethod === "runner" ? "Student Runner" : "Campus Hub Pickup"})`,
      verificationStatus: "PENDING",
    });

    // 6. Record order timeline
    await this.db.insert(orderTimeline).values({
      orderId: newOrder.id,
      status: "PAYMENT_SUBMITTED",
      actorId: buyerId,
      notes: `Buyer submitted ${input.channel} proof with ref ${input.bankTransactionReference}. Escrow funds locked pending admin verification.`,
    });

    await recordAuditLog({
      db: this.db,
      actorId: buyerId,
      action: "ESCROW_PAYMENT_SUBMITTED",
      targetType: "payment",
      targetId: payment.id,
      metadata: {
        orderId: newOrder.id,
        totalAmount,
        channel: input.channel,
        bankRef: input.bankTransactionReference,
      },
    });

    return {
      success: true,
      order: newOrder,
      payment,
      orderNumber,
    };
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

  /**
   * Admin: List all marketplace orders with filters & pagination
   */
  async adminListOrders(input: z.infer<typeof adminListOrdersFilterSchema>) {
    const conditions = [];

    if (input.status !== "ALL") {
      conditions.push(eq(orders.status, input.status as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (input.page - 1) * input.pageSize;

    const [items, totalRes] = await Promise.all([
      this.db.query.orders.findMany({
        where: whereClause,
        limit: input.pageSize,
        offset,
        orderBy: [desc(orders.createdAt)],
        with: {
          product: { with: { images: true } },
          buyer: { with: { profile: true } },
          seller: { with: { profile: true } },
          payments: true,
          delivery: true,
        },
      }),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
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

  /**
   * Admin: Override or update order state
   */
  async adminUpdateOrderStatus(adminId: string, input: z.infer<typeof adminUpdateOrderStatusSchema>) {
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.id, input.orderId),
    });

    if (!order) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
    }

    await this.db
      .update(orders)
      .set({
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, input.orderId));

    await this.db.insert(orderTimeline).values({
      orderId: input.orderId,
      status: input.status,
      actorId: adminId,
      notes: input.notes || `Order status updated by admin to ${input.status}`,
    });

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: `ORDER_STATUS_${input.status}`,
      targetType: "order",
      targetId: input.orderId,
      metadata: { previousStatus: order.status, newStatus: input.status, notes: input.notes },
    });

    return { success: true, status: input.status };
  }
}
