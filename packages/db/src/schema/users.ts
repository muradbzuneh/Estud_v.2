import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

/**
 * 1. Educational Institutions (Universities & Colleges in Ethiopia)
 */
export const institutions = pgTable(
  "institutions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    shortCode: text("short_code").notNull().unique(), // e.g. AAU, ASTU, HU
    city: text("city").notNull(),
    region: text("region"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_institutions_city").on(table.city),
    index("idx_institutions_short_code").on(table.shortCode),
  ]
);

/**
 * 2. Specific Campuses within an Institution
 */
export const campuses = pgTable(
  "campuses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    institutionId: uuid("institution_id")
      .references(() => institutions.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(), // e.g. "4 Kilo Campus", "5 Kilo (AAiT)"
    details: text("details"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_campuses_institution_id").on(table.institutionId),
  ]
);

/**
 * 3. Physical Locations & Delivery Hubs
 */
export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    city: text("city").notNull(),
    subcity: text("subcity"),
    zone: text("zone"),
    specificHubOrGate: text("specific_hub_or_gate"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_locations_city_subcity").on(table.city, table.subcity),
  ]
);

/**
 * 4. User Accounts
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phoneNumber: text("phone_number").notNull().unique(), // +251 9... / +251 7...
    email: text("email").unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").default("student").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_users_phone").on(table.phoneNumber),
    index("idx_users_role").on(table.role),
    index("idx_users_created_at").on(table.createdAt),
  ]
);

/**
 * 5. User Profiles
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    fullName: text("full_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    preferredCity: text("preferred_city"),
    institutionId: uuid("institution_id").references(() => institutions.id, {
      onDelete: "set null",
    }),
    campusId: uuid("campus_id").references(() => campuses.id, {
      onDelete: "set null",
    }),
    defaultLocationId: uuid("default_location_id").references(
      () => locations.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_profiles_user_id").on(table.userId),
    index("idx_profiles_institution_campus").on(table.institutionId, table.campusId),
  ]
);

/**
 * 6. Roles & Permissions (Explicit RBAC Table)
 */
export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: userRoleEnum("role").notNull(),
  permission: text("permission").notNull(), // e.g. "products:approve", "payments:verify", "payouts:issue"
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
