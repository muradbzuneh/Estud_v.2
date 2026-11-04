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

export const adminListProductsFilterSchema = z.object({
  tab: z.enum(["ALL", "PENDING_REVIEW", "ARCHIVED", "PUBLISHED"]).default("ALL"),
  status: z
    .enum([
      "DRAFT",
      "PENDING_VALUATION",
      "VALUED",
      "APPROVED",
      "REJECTED",
      "SOLD",
      "PAUSED",
      "ARCHIVED",
    ])
    .optional(),
  categoryId: z.string().uuid().optional(),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["newest", "oldest", "price_asc", "price_desc"]).default("newest"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const adminUpdateProductStatusSchema = z.object({
  productId: z.string().uuid(),
  status: z.enum([
    "DRAFT",
    "PENDING_VALUATION",
    "VALUED",
    "APPROVED",
    "REJECTED",
    "SOLD",
    "PAUSED",
    "ARCHIVED",
  ]),
  notes: z.string().optional(),
});

export const adminBulkProductActionSchema = z.object({
  productIds: z.array(z.string().uuid()).min(1),
  action: z.enum(["APPROVE", "REJECT", "ARCHIVE", "DELETE"]),
  reason: z.string().optional(),
});

export const adminCreateCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  iconName: z.string().optional(),
  parentId: z.string().uuid().optional(),
  displayOrder: z.number().int().default(0),
});

export const adminUpdateCategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  iconName: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const adminListEducationalFilterSchema = z.object({
  search: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const adminModerateEducationalSchema = z.object({
  materialId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional(),
});


