import { z } from "zod";

export const listProductsFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).optional(),
  isExchangeEligible: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.number().default(0),
});

export const submitListingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
  proposedPrice: z.number().positive(),
  isExchangeEligible: z.boolean().default(false),
  isEducationalMaterial: z.boolean().default(false),
  locationId: z.string().uuid().optional(),
  institutionId: z.string().uuid().optional(),
  campusId: z.string().uuid().optional(),
  images: z.array(z.string().url()).min(1),
  attributes: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),
  educationalDetails: z
    .object({
      materialTitle: z.string(),
      author: z.string().optional(),
      edition: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      academicLevel: z.string().optional(),
      isbn: z.string().optional(),
      ownershipEvidenceUrl: z.string().url().optional(),
    })
    .optional(),
});

export const adminValuationSchema = z.object({
  productId: z.string().uuid(),
  approvedValue: z.number().positive(),
  adminNotes: z.string().optional(),
});

export const adminApproveSchema = z.object({
  productId: z.string().uuid(),
  feedbackMessage: z.string().optional(),
});
