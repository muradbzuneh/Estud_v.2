import { router, protectedProcedure, adminProcedure } from "../../core/trpc";
import { FinanceService } from "./finance.service";
import {
  submitPaymentEvidenceSchema,
  adminVerifyPaymentSchema,
  adminExecutePayoutSchema,
  adminListPaymentsFilterSchema,
  adminListPayoutsFilterSchema,
} from "./finance.schema";

export const financeRouter = router({
  submitEvidence: protectedProcedure
    .input(submitPaymentEvidenceSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FinanceService(ctx.db);
      return service.submitEvidence(ctx.user.id, input);
    }),

  adminVerify: adminProcedure
    .input(adminVerifyPaymentSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FinanceService(ctx.db);
      return service.adminVerify(ctx.user.id, input);
    }),

  adminExecutePayout: adminProcedure
    .input(adminExecutePayoutSchema)
    .mutation(async ({ ctx, input }) => {
      const service = new FinanceService(ctx.db);
      return service.adminExecutePayout(ctx.user.id, input);
    }),

  getFinancialSummary: adminProcedure.query(async ({ ctx }) => {
    const service = new FinanceService(ctx.db);
    return service.getFinancialSummary();
  }),

  adminListPayments: adminProcedure
    .input(adminListPaymentsFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new FinanceService(ctx.db);
      return service.adminListPayments(input);
    }),

  adminListPayouts: adminProcedure
    .input(adminListPayoutsFilterSchema)
    .query(async ({ ctx, input }) => {
      const service = new FinanceService(ctx.db);
      return service.adminListPayouts(input);
    }),
});


