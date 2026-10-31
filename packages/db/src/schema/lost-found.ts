import {
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  index,
} from "drizzle-orm/pg-core";
import {
  lostFoundTypeEnum,
  lostFoundStatusEnum,
  recoveryClaimStatusEnum,
} from "./enums";
import { users, locations, institutions, campuses } from "./users";

/**
 * 29. Lost and Found Reports (Entity 25 in SRS)
 */
export const lostFoundReports = pgTable(
  "lost_found_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportNumber: text("report_number").notNull().unique(), // e.g. EST-LF-2026-0001
    reporterId: text("reporter_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    type: lostFoundTypeEnum("type").notNull(), // LOST or FOUND
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    approximateDate: date("approximate_date").notNull(),

    institutionId: uuid("institution_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    campusId: uuid("campus_id").references(() => campuses.id, {
      onDelete: "set null",
    }),
    locationId: uuid("location_id").references(() => locations.id, {
      onDelete: "set null",
    }),

    status: lostFoundStatusEnum("status").default("OPEN").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_lost_found_report_number").on(table.reportNumber),
    index("idx_lost_found_type").on(table.type),
    index("idx_lost_found_reporter_id").on(table.reporterId),
    index("idx_lost_found_status").on(table.status),
    index("idx_lost_found_institution").on(table.institutionId),
  ]
);

/**
 * Public Lost & Found Photos
 */
export const lostFoundImages = pgTable(
  "lost_found_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .references(() => lostFoundReports.id, { onDelete: "cascade" })
      .notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_lf_images_report_id").on(table.reportId),
  ]
);

/**
 * 30. Recovery Claims (Entity 26 in SRS)
 */
export const recoveryClaims = pgTable(
  "recovery_claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .references(() => lostFoundReports.id, { onDelete: "cascade" })
      .notNull(),
    claimantId: text("claimant_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),

    // Private verification details (protected per SRS FR-LF-08 & 5.6.4)
    privateProofDescription: text("private_proof_description").notNull(),
    proofAttachmentUrl: text("proof_attachment_url"),

    status: recoveryClaimStatusEnum("status").default("PENDING").notNull(),
    reviewedByAdminId: text("reviewed_by_admin_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    reviewNotes: text("review_notes"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_claims_report_id").on(table.reportId),
    index("idx_claims_claimant_id").on(table.claimantId),
    index("idx_claims_status").on(table.status),
  ]
);
