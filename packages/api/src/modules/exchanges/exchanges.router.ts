import { router, protectedProcedure, adminProcedure } from "../../core/trpc";
import { ExchangesService } from "./exchanges.service";
import {
  proposeExchangeSchema,
  respondExchangeSchema,
  adminListExchangesFilterSchema,
  adminModerateExchangeSchema,
} from "./exchanges.schema";

export const exchangesRouter = router({
  propose: protectedProcedure
    .input(proposeExchangeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExchangesService(ctx.db);
      return service.propose(ctx.user.id, input);
    }),

  respond: protectedProcedure
    .input(respondExchangeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExchangesService(ctx.db);
      return service.respond(ctx.user.id, input);
    }),

  listMyExchanges: protectedProcedure.query(async ({ ctx }) => {
    const service = new ExchangesService(ctx.db);
    return service.listMyExchanges(ctx.user.id);
  }),

  adminList: adminProcedure
    .input(adminListExchangesFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new ExchangesService(ctx.db);
      return service.adminList(input);
    }),

  adminModerate: adminProcedure
    .input(adminModerateExchangeSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new ExchangesService(ctx.db);
      return service.adminModerate(ctx.user.id, input);
    }),
});
