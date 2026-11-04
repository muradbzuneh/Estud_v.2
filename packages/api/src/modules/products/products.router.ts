import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../core/trpc";
import { ProductsService } from "./products.service";
import {
  listProductsFilterSchema,
  submitListingSchema,
  adminValuationSchema,
  adminApproveSchema,
  adminListProductsFilterSchema,
  adminUpdateProductStatusSchema,
  adminBulkProductActionSchema,
  adminCreateCategorySchema,
  adminUpdateCategorySchema,
} from "./products.schema";

export const productsRouter = router({
  list: publicProcedure
    .input(listProductsFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.list(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.getById(input.id);
    }),

  submitListing: protectedProcedure
    .input(submitListingSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.submitListing(ctx.user.id, input);
    }),

  adminValuate: adminProcedure
    .input(adminValuationSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminValuate(ctx.user.id, input);
    }),

  adminApproveListing: adminProcedure
    .input(adminApproveSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminApprove(ctx.user.id, input);
    }),

  adminList: adminProcedure
    .input(adminListProductsFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminList(input);
    }),

  adminGetStats: adminProcedure.query(async ({ ctx }) => {
    const service = new ProductsService(ctx.db);
    return service.adminGetStats();
  }),

  adminGetDashboardMetrics: adminProcedure.query(async ({ ctx }) => {
    const service = new ProductsService(ctx.db);
    return service.adminGetDashboardMetrics();
  }),

  adminUpdateStatus: adminProcedure
    .input(adminUpdateProductStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminUpdateStatus(ctx.user.id, input);
    }),

  adminBulkAction: adminProcedure
    .input(adminBulkProductActionSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminBulkAction(ctx.user.id, input);
    }),

  adminListCategories: adminProcedure.query(async ({ ctx }) => {
    const service = new ProductsService(ctx.db);
    return service.adminListCategories();
  }),

  adminCreateCategory: adminProcedure
    .input(adminCreateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminCreateCategory(ctx.user.id, input);
    }),

  adminUpdateCategory: adminProcedure
    .input(adminUpdateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ProductsService(ctx.db);
      return service.adminUpdateCategory(ctx.user.id, input);
    }),
});

