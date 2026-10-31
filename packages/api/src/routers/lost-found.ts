import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import {
  lostFoundReports,
  lostFoundImages,
  recoveryClaims,
  eq,
  desc,
} from "@estud/db";
import { TRPCError } from "@trpc/server";

export const lostFoundRouter = router({
  /**
   * Public feed of Lost & Found items (SRS FR-LF-01 to 04)
   */
  list: publicProcedure
    .input(
      z.object({
        type: z.enum(["LOST", "FOUND"]).optional(),
        institutionId: z.string().uuid().optional(),
        campusId: z.string().uuid().optional(),
        category: z.string().optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.lostFoundReports.findMany({
        where: eq(lostFoundReports.status, "OPEN"),
        limit: input.limit,
        orderBy: [desc(lostFoundReports.createdAt)],
        with: {
          images: true,
          institution: true,
          campus: true,
          location: true,
        },
      });
    }),

  /**
   * User creates Lost or Found report
   */
  createReport: protectedProcedure
    .input(
      z.object({
        type: z.enum(["LOST", "FOUND"]),
        title: z.string().min(3),
        description: z.string().min(10),
        category: z.string().min(2),
        approximateDate: z.string(), // YYYY-MM-DD
        institutionId: z.string().uuid().optional(),
        campusId: z.string().uuid().optional(),
        locationId: z.string().uuid().optional(),
        imageUrls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reportNumber = `EST-LF-${Date.now().toString(36).toUpperCase()}`;

      const [report] = await ctx.db
        .insert(lostFoundReports)
        .values({
          reportNumber,
          reporterId: ctx.user.id,
          type: input.type,
          title: input.title,
          description: input.description,
          category: input.category,
          approximateDate: input.approximateDate,
          institutionId: input.institutionId,
          campusId: input.campusId,
          locationId: input.locationId,
          status: "OPEN",
        })
        .returning();

      if (input.imageUrls && input.imageUrls.length > 0) {
        await ctx.db.insert(lostFoundImages).values(
          input.imageUrls.map((url) => ({
            reportId: report.id,
            imageUrl: url,
          }))
        );
      }

      return report;
    }),

  /**
   * User submits ownership recovery claim (SRS FR-LF-05, FR-LF-08: private proof)
   */
  submitClaim: protectedProcedure
    .input(
      z.object({
        reportId: z.string().uuid(),
        privateProofDescription: z.string().min(10), // e.g. Serial number, scratch mark, secret contents
        proofAttachmentUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [claim] = await ctx.db
        .insert(recoveryClaims)
        .values({
          reportId: input.reportId,
          claimantId: ctx.user.id,
          privateProofDescription: input.privateProofDescription,
          proofAttachmentUrl: input.proofAttachmentUrl,
          status: "PENDING",
        })
        .returning();

      await ctx.db
        .update(lostFoundReports)
        .set({ status: "CLAIM_SUBMITTED" })
        .where(eq(lostFoundReports.id, input.reportId));

      return claim;
    }),

  /**
   * Admin reviews private proof and coordinates recovery (SRS FR-LF-06)
   */
  adminReviewClaim: adminProcedure
    .input(
      z.object({
        claimId: z.string().uuid(),
        accept: z.boolean(),
        reviewNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const claim = await ctx.db.query.recoveryClaims.findFirst({
        where: eq(recoveryClaims.id, input.claimId),
      });

      if (!claim) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Claim not found." });
      }

      const status = input.accept ? "ACCEPTED" : "REJECTED";

      await ctx.db
        .update(recoveryClaims)
        .set({
          status,
          reviewedByAdminId: ctx.user.id,
          reviewNotes: input.reviewNotes,
          reviewedAt: new Date(),
        })
        .where(eq(recoveryClaims.id, claim.id));

      if (input.accept) {
        await ctx.db
          .update(lostFoundReports)
          .set({ status: "VERIFIED_RECOVERED" })
          .where(eq(lostFoundReports.id, claim.reportId));
      }

      return { status };
    }),
});
