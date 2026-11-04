import { router, protectedProcedure, adminProcedure } from "../../core/trpc";
import { DisputesService } from "./disputes.service";
import {
  raiseDisputeSchema,
  adminResolveDisputeSchema,
  adminListDisputesFilterSchema,
} from "./disputes.schema";

export const disputesRouter = router({
  raiseDispute: protectedProcedure
    .input(raiseDisputeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new DisputesService(ctx.db);
      return service.raiseDispute(ctx.user.id, input);
    }),

  adminResolve: adminProcedure
    .input(adminResolveDisputeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new DisputesService(ctx.db);
      return service.adminResolve(ctx.user.id, input);
    }),

  adminListDisputes: adminProcedure
    .input(adminListDisputesFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new DisputesService(ctx.db);
      return service.adminListDisputes(input);
    }),
});

