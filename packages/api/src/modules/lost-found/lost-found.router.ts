import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../core/trpc";
import { LostFoundService } from "./lost-found.service";
import {
  listLostFoundSchema,
  createLostFoundReportSchema,
  submitRecoveryClaimSchema,
  adminReviewClaimSchema,
  adminListLostFoundFilterSchema,
  adminAnnounceFoundSchema,
  adminUpdateLostFoundStatusSchema,
} from "./lost-found.schema";

export const lostFoundRouter = router({
  list: publicProcedure
    .input(listLostFoundSchema)
    .query(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.list(input);
    }),

  createReport: protectedProcedure
    .input(createLostFoundReportSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.createReport(ctx.user.id, input);
    }),

  submitClaim: protectedProcedure
    .input(submitRecoveryClaimSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.submitClaim(ctx.user.id, input);
    }),

  adminReviewClaim: adminProcedure
    .input(adminReviewClaimSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.adminReviewClaim(ctx.user.id, input);
    }),

  adminAnnounceFound: adminProcedure
    .input(adminAnnounceFoundSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.adminAnnounceFound(ctx.user.id, input);
    }),

  adminUpdateStatus: adminProcedure
    .input(adminUpdateLostFoundStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.adminUpdateStatus(ctx.user.id, input);
    }),

  adminList: adminProcedure
    .input(adminListLostFoundFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new LostFoundService(ctx.db);
      return service.adminList(input);
    }),
});

