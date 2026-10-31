import { router, protectedProcedure, adminProcedure, repProcedure } from "../../core/trpc";
import { LogisticsService } from "./logistics.service";
import {
  assignRepSchema,
  updateProgressSchema,
  confirmHandoverSchema,
} from "./logistics.schema";

export const logisticsRouter = router({
  assignRep: adminProcedure
    .input(assignRepSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LogisticsService(ctx.db);
      return service.assignRep(ctx.user.id, input);
    }),

  updateProgress: repProcedure
    .input(updateProgressSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LogisticsService(ctx.db);
      return service.updateProgress(input);
    }),

  confirmHandover: protectedProcedure
    .input(confirmHandoverSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new LogisticsService(ctx.db);
      return service.confirmHandover(ctx.user.id, input);
    }),

  getMyAssignedDeliveries: repProcedure.query(async ({ ctx }) => {
    const service = new LogisticsService(ctx.db);
    return service.getMyAssignedDeliveries(ctx.user.id);
  }),
});
