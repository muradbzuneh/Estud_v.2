import { TRPCError } from "@trpc/server";
import {
  lostFoundReports,
  lostFoundImages,
  recoveryClaims,
  eq,
  and,
  desc,
  sql,
  type EstudDatabase,
} from "@estud/db";
import { recordAuditLog } from "../../core/audit";
import type { z } from "zod";
import type {
  listLostFoundSchema,
  createLostFoundReportSchema,
  submitRecoveryClaimSchema,
  adminReviewClaimSchema,
  adminListLostFoundFilterSchema,
} from "./lost-found.schema";

export class LostFoundService {
  constructor(private db: EstudDatabase) {}

  async list(input: z.infer<typeof listLostFoundSchema>) {
    return this.db.query.lostFoundReports.findMany({
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
  }

  async createReport(reporterId: string, input: z.infer<typeof createLostFoundReportSchema>) {
    const reportNumber = `EST-LF-${Date.now().toString(36).toUpperCase()}`;

    const [report] = await this.db
      .insert(lostFoundReports)
      .values({
        reportNumber,
        reporterId,
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
      await this.db.insert(lostFoundImages).values(
        input.imageUrls.map((url) => ({
          reportId: report.id,
          imageUrl: url,
        }))
      );
    }

    await recordAuditLog({
      db: this.db,
      actorId: reporterId,
      action: "LOST_FOUND_REPORTED",
      targetType: "product",
      targetId: report.id,
      metadata: { type: input.type, title: input.title },
    });

    return report;
  }

  async submitClaim(claimantId: string, input: z.infer<typeof submitRecoveryClaimSchema>) {
    const [claim] = await this.db
      .insert(recoveryClaims)
      .values({
        reportId: input.reportId,
        claimantId,
        privateProofDescription: input.privateProofDescription,
        proofAttachmentUrl: input.proofAttachmentUrl,
        status: "PENDING",
      })
      .returning();

    await this.db
      .update(lostFoundReports)
      .set({ status: "CLAIM_SUBMITTED" })
      .where(eq(lostFoundReports.id, input.reportId));

    return claim;
  }

  async adminReviewClaim(adminId: string, input: z.infer<typeof adminReviewClaimSchema>) {
    const claim = await this.db.query.recoveryClaims.findFirst({
      where: eq(recoveryClaims.id, input.claimId),
    });

    if (!claim) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Claim not found." });
    }

    const status = input.accept ? "ACCEPTED" : "REJECTED";

    await this.db
      .update(recoveryClaims)
      .set({
        status,
        reviewedByAdminId: adminId,
        reviewNotes: input.reviewNotes,
        reviewedAt: new Date(),
      })
      .where(eq(recoveryClaims.id, claim.id));

    if (input.accept) {
      await this.db
        .update(lostFoundReports)
        .set({ status: "VERIFIED_RECOVERED" })
        .where(eq(lostFoundReports.id, claim.reportId));
    }

    await recordAuditLog({
      db: this.db,
      actorId: adminId,
      action: "RECOVERY_CLAIM_REVIEWED",
      targetType: "product",
      targetId: claim.id,
      metadata: { status },
    });

    return { status };
  }

  /**
   * Admin: List all campus Lost & Found items and submitted recovery claims
   */
  async adminList(input: z.infer<typeof adminListLostFoundFilterSchema>) {
    const conditions = [];

    if (input.type !== "ALL") {
      conditions.push(eq(lostFoundReports.type, input.type as any));
    }
    if (input.status !== "ALL") {
      conditions.push(eq(lostFoundReports.status, input.status as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (input.page - 1) * input.pageSize;

    const [items, totalRes] = await Promise.all([
      this.db.query.lostFoundReports.findMany({
        where: whereClause,
        limit: input.pageSize,
        offset,
        orderBy: [desc(lostFoundReports.createdAt)],
        with: {
          reporter: { with: { profile: true } },
          images: true,
          claims: { with: { claimant: { with: { profile: true } } } },
          institution: true,
          campus: true,
        },
      }),
      this.db
        .select({ count: sql<number>`count(*)::int` })
        .from(lostFoundReports)
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
}
