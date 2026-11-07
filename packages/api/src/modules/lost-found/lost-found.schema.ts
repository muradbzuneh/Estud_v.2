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
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2),
  approximateDate: z.string(),
  campusName: z.string().optional(),
  locationDetail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactTelegram: z.string().optional(),
  privateOwnershipMark: z.string().optional(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  imageUrls: z.array(z.string()).optional(),
});

export const submitRecoveryClaimSchema = z.object({
  reportId: z.string(),
  privateProofDescription: z.string().min(10, "Describe private ownership proof in detail"),
  claimantContact: z.string().optional(),
  proofAttachmentUrl: z.string().optional(),
});

export const adminReviewClaimSchema = z.object({
  claimId: z.string(),
  accept: z.boolean(),
  reviewNotes: z.string().optional(),
});

export const adminAnnounceFoundSchema = z.object({
  reportId: z.string(),
  broadcastTarget: z.enum(["ALL_CAMPUS", "SPECIFIC_USER"]),
  targetUserId: z.string().optional(),
  targetUserContact: z.string().optional(),
  announcementMessage: z.string().min(5, "Announcement message must be at least 5 characters"),
  handoverStation: z.string().min(3, "Handover station is required"),
});

export const adminUpdateLostFoundStatusSchema = z.object({
  reportId: z.string(),
  status: z.enum(["OPEN", "CLAIM_SUBMITTED", "VERIFIED_RECOVERED", "CLOSED"]),
  adminNotes: z.string().optional(),
});

export const adminListLostFoundFilterSchema = z.object({
  type: z.enum(["ALL", "LOST", "FOUND"]).default("ALL"),
  status: z.enum(["ALL", "OPEN", "CLAIM_SUBMITTED", "VERIFIED_RECOVERED", "CLOSED"]).default("ALL"),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

