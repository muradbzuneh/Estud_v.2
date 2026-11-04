import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../../core/trpc";
import { OrdersService } from "./orders.service";
import {
  createPurchaseRequestSchema,
  checkoutWithEscrowSchema,
  sellerRespondOrderSchema,
  adminListOrdersFilterSchema,
  adminUpdateOrderStatusSchema,
} from "./orders.schema";

export const ordersRouter = router({
  checkoutWithEscrow: protectedProcedure
    .input(checkoutWithEscrowSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.checkoutWithEscrow(ctx.user.id, input);
    }),

  createPurchaseRequest: protectedProcedure
    .input(createPurchaseRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.createPurchaseRequest(ctx.user.id, input);
    }),

  sellerRespond: protectedProcedure
    .input(sellerRespondOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.sellerRespond(ctx.user.id, input);
    }),

  getBuyerOrders: protectedProcedure.query(async ({ ctx }) => {
    const service = new OrdersService(ctx.db);
    return service.getBuyerOrders(ctx.user.id);
  }),

  getSellerOrders: protectedProcedure.query(async ({ ctx }) => {
    const service = new OrdersService(ctx.db);
    return service.getSellerOrders(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.getById(ctx.user.id, ctx.user.role, input.orderId);
    }),

  adminListOrders: adminProcedure
    .input(adminListOrdersFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.adminListOrders(input);
    }),

  adminUpdateOrderStatus: adminProcedure
    .input(adminUpdateOrderStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new OrdersService(ctx.db);
      return service.adminUpdateOrderStatus(ctx.user.id, input);
    }),
});

