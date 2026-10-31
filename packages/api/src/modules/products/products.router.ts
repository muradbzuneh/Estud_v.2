import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../core/trpc";
import { ProductsService } from "./products.service";
import {
  listProductsFilterSchema,
  submitListingSchema,
  adminValuationSchema,
  adminApproveSchema,
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
});
