import { z } from "zod";

export const listLostFoundSchema = z.object({
  type: z.enum(["LOST", "FOUND"]).optional(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  category: z.string().optional(),
  limit: z.number().default(20),
});

export const createLostFoundReportSchema = z.object({
  type: z.enum(["LOST", "FOUND"]),
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  approximateDate: z.string(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const submitRecoveryClaimSchema = z.object({
  reportId: z.string().uuid(),
  privateProofDescription: z.string().min(10, "Describe private ownership proof in detail"),
  proofAttachmentUrl: z.string().url().optional(),
});

export const adminReviewClaimSchema = z.object({
  claimId: z.string().uuid(),
  accept: z.boolean(),
  reviewNotes: z.string().optional(),
});

export const adminListLostFoundFilterSchema = z.object({
  type: z.enum(["ALL", "LOST", "FOUND"]).default("ALL"),
  status: z.enum(["ALL", "OPEN", "CLAIM_SUBMITTED", "VERIFIED_RECOVERED", "CLOSED"]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

