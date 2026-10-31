import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";
import {
  productConditionEnum,
  productStatusEnum,
  listingApprovalStatusEnum,
} from "./enums";
import { users, locations, institutions, campuses } from "./users";

/**
 * 7. Product Categories
 */
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    iconName: text("icon_name"),
    parentId: uuid("parent_id"),
    isActive: boolean("is_active").default(true).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_categories_slug").on(table.slug),
    index("idx_categories_parent_id").on(table.parentId),
  ]
);

/**
 * 8. Products
 */
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sellerId: text("seller_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    condition: productConditionEnum("condition").notNull(),
    isExchangeEligible: boolean("is_exchange_eligible").default(false).notNull(),
    isEducationalMaterial: boolean("is_educational_material")
      .default(false)
      .notNull(),
    status: productStatusEnum("status").default("DRAFT").notNull(),

    // Financial calculations (ETB)
    proposedPrice: numeric("proposed_price", { precision: 12, scale: 2 }).notNull(),
    approvedItemValue: numeric("approved_item_value", {
      precision: 12,
      scale: 2,
    }),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 })
      .default("0.0500")
      .notNull(), // standard 5%
    commissionAmount: numeric("commission_amount", {
      precision: 12,
      scale: 2,
    }), // approvedItemValue * 0.05
    publishedPrice: numeric("published_price", { precision: 12, scale: 2 }), // approvedItemValue + commissionAmount

    locationId: uuid("location_id").references(() => locations.id, {
      onDelete: "set null",
    }),
    institutionId: uuid("institution_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    campusId: uuid("campus_id").references(() => campuses.id, {
      onDelete: "set null",
    }),
    viewCount: integer("view_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_products_seller_id").on(table.sellerId),
    index("idx_products_category_id").on(table.categoryId),
    index("idx_products_status").on(table.status),
    index("idx_products_published_price").on(table.publishedPrice),
    index("idx_products_condition").on(table.condition),
    index("idx_products_created_at").on(table.createdAt),
    index("idx_products_exchange_eligible").on(table.isExchangeEligible),
  ]
);

/**
 * 9. Product Images
 */
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    imageUrl: text("image_url").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_images_product_id").on(table.productId),
  ]
);

/**
 * 10. Product Attributes & Specifications
 */
export const productAttributes = pgTable(
  "product_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(), // e.g. "Brand", "Model", "Storage Capacity", "Color"
    value: text("value").notNull(), // e.g. "HP", "Pavilion 15", "512GB SSD", "Silver"
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_attributes_product_id").on(table.productId),
  ]
);

/**
 * 11. Listing Submissions (Review Lifecycle)
 */
export const listingSubmissions = pgTable(
  "listing_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    submittedByUserId: text("submitted_by_user_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    submissionNotes: text("submission_notes"),
    status: listingApprovalStatusEnum("status").default("PENDING").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_listing_submissions_product_id").on(table.productId),
    index("idx_listing_submissions_status").on(table.status),
  ]
);

/**
 * 12. Valuations
 */
export const valuations = pgTable(
  "valuations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    adminId: text("admin_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    proposedPrice: numeric("proposed_price", { precision: 12, scale: 2 }).notNull(),
    approvedValue: numeric("approved_value", { precision: 12, scale: 2 }).notNull(),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 4 })
      .default("0.0500")
      .notNull(),
    commissionAmount: numeric("commission_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    finalPrice: numeric("final_price", { precision: 12, scale: 2 }).notNull(), // approvedValue + commissionAmount
    adminNotes: text("admin_notes"),
    sellerConfirmed: boolean("seller_confirmed").default(false).notNull(),
    sellerConfirmedAt: timestamp("seller_confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_valuations_product_id").on(table.productId),
    index("idx_valuations_admin_id").on(table.adminId),
  ]
);

/**
 * 13. Listing Approvals (Administrative Decision Record)
 */
export const listingApprovals = pgTable(
  "listing_approvals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    adminId: text("admin_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    status: listingApprovalStatusEnum("status").notNull(),
    feedbackMessage: text("feedback_message"),
    approvedAt: timestamp("approved_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_listing_approvals_product_id").on(table.productId),
    index("idx_listing_approvals_admin_id").on(table.adminId),
  ]
);

/**
 * 14. Physical Educational Materials Listing Details
 */
export const educationalMaterials = pgTable(
  "educational_materials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    materialTitle: text("material_title").notNull(),
    author: text("author"),
    edition: text("edition"),
    fieldOfStudy: text("field_of_study"), // Medicine, Engineering, Law, etc.
    academicLevel: text("academic_level"), // 1st Year, 2nd Year, High School
    isbn: text("isbn"),
    ownershipEvidenceUrl: text("ownership_evidence_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_edu_materials_field").on(table.fieldOfStudy),
    index("idx_edu_materials_product_id").on(table.productId),
  ]
);

/**
 * 15. Product Abuse / Inappropriate Listing Reports
 */
export const productReports = pgTable(
  "product_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    reporterId: text("reporter_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    reason: text("reason").notNull(),
    details: text("details"),
    isResolved: boolean("is_resolved").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_reports_product_id").on(table.productId),
    index("idx_product_reports_resolved").on(table.isResolved),
  ]
);
