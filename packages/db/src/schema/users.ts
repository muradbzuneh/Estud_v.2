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
 * Educational Institutions (Universities & Colleges in Ethiopia)
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
 * Specific Campuses within an Institution
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
 * Physical Delivery Locations & Hubs
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
 * Better Auth: User table
 */
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    phoneNumber: text("phone_number").unique(), // Ethiopian phone number
    role: userRoleEnum("role").default("student").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_users_email").on(table.email),
    index("idx_users_phone").on(table.phoneNumber),
    index("idx_users_role").on(table.role),
  ]
);

/**
 * Better Auth: Session table
 */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
    index("idx_sessions_token").on(table.token),
  ]
);

/**
 * Better Auth: Account table (Google OAuth & Credential Provider)
 */
export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(), // 'google' or 'credential'
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"), // Hashed password for email/password credentials
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_accounts_user_id").on(table.userId),
    index("idx_accounts_provider").on(table.providerId, table.accountId),
  ]
);

/**
 * Better Auth: Verification table (Email verification & password reset tokens)
 */
export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_verifications_identifier").on(table.identifier),
  ]
);

/**
 * Student / User Extended Profile
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
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

export const permissions = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: userRoleEnum("role").notNull(),
  permission: text("permission").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
