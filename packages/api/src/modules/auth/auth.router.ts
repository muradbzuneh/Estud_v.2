import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../../core/trpc";
import { users, profiles, institutions, campuses, eq, and, or, ilike, desc, sql } from "@estud/db";
import { TRPCError } from "@trpc/server";
import { recordAuditLog } from "../../core/audit";
import {
  adminCreateInstitutionSchema,
  adminCreateCampusSchema,
  adminListUsersFilterSchema,
  adminUpdateUserRoleSchema,
  adminToggleUserActiveSchema,
} from "./auth.schema";

export const authRouter = router({
  /**
   * Get logged-in user with their profile and university info
   */
  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
      with: {
        profile: {
          with: {
            institution: true,
            campus: true,
            defaultLocation: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
    }

    return user;
  }),

  /**
   * Update student profile
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(2),
        avatarUrl: z.string().url().optional(),
        bio: z.string().max(500).optional(),
        preferredCity: z.string().optional(),
        institutionId: z.string().uuid().optional(),
        campusId: z.string().uuid().optional(),
        defaultLocationId: z.string().uuid().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .insert(profiles)
        .values({
          userId: ctx.user.id,
          fullName: input.fullName,
          avatarUrl: input.avatarUrl,
          bio: input.bio,
          preferredCity: input.preferredCity,
          institutionId: input.institutionId,
          campusId: input.campusId,
          defaultLocationId: input.defaultLocationId,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: {
            fullName: input.fullName,
            avatarUrl: input.avatarUrl,
            bio: input.bio,
            preferredCity: input.preferredCity,
            institutionId: input.institutionId,
            campusId: input.campusId,
            defaultLocationId: input.defaultLocationId,
            updatedAt: new Date(),
          },
        })
        .returning();

      return updated;
    }),

  /**
   * Link or update verified Ethiopian phone number (+251)
   */
  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z
          .string()
          .regex(/^(\+251|0)?[97]\d{8}$/, "Enter a valid Ethiopian phone number"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let phone = input.phoneNumber.replace(/\D/g, "");
      if (phone.startsWith("0")) phone = `+251${phone.substring(1)}`;
      else if (phone.startsWith("251")) phone = `+${phone}`;
      else phone = `+251${phone}`;

      await ctx.db
        .update(users)
        .set({ phoneNumber: phone })
        .where(eq(users.id, ctx.user.id));

      return { phoneNumber: phone };
    }),

  /**
   * Public reference data: Ethiopian Universities
   */
  listInstitutions: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.institutions.findMany({
      orderBy: (inst, { asc }) => [asc(inst.name)],
      with: { campuses: true },
    });
  }),

  /**
   * Public campuses by university
   */
  listCampuses: publicProcedure
    .input(z.object({ institutionId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.campuses.findMany({
        where: eq(campuses.institutionId, input.institutionId),
      });
    }),

  adminCreateInstitution: adminProcedure
    .input(adminCreateInstitutionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const [inst] = await ctx.db
          .insert(institutions)
          .values({
            name: input.name,
            shortCode: input.shortCode.toUpperCase(),
            city: input.city,
            region: input.region,
          })
          .returning();
        return inst;
      } catch (err: any) {
        if (err?.code === "23505" || err?.message?.includes("unique")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Institution with code "${input.shortCode.toUpperCase()}" already exists.`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err?.message || "Failed to create institution.",
        });
      }
    }),

  adminCreateCampus: adminProcedure
    .input(adminCreateCampusSchema)
    .mutation(async ({ ctx, input }) => {
      const [camp] = await ctx.db
        .insert(campuses)
        .values({
          institutionId: input.institutionId,
          name: input.name,
          details: input.details,
        })
        .returning();
      return camp;
    }),

  adminListUsers: adminProcedure
    .input(adminListUsersFilterSchema)
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input.role !== "ALL") {
        conditions.push(eq(users.role, input.role as any));
      }
      if (input.search && input.search.trim().length > 0) {
        const q = `%${input.search.trim()}%`;
        conditions.push(or(ilike(users.name, q), ilike(users.email, q)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const offset = (input.page - 1) * input.pageSize;

      const [items, totalRes] = await Promise.all([
        ctx.db.query.users.findMany({
          where: whereClause,
          limit: input.pageSize,
          offset,
          orderBy: [desc(users.createdAt)],
          with: {
            profile: {
              with: {
                institution: true,
                campus: true,
              },
            },
          },
        }),
        ctx.db
          .select({ count: sql<number>`count(*)::int` })
          .from(users)
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
    }),

  adminUpdateUserRole: adminProcedure
    .input(adminUpdateUserRoleSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning();

      await recordAuditLog({
        db: ctx.db,
        actorId: ctx.user.id,
        action: `USER_ROLE_UPDATED_TO_${input.role.toUpperCase()}`,
        targetType: "user",
        targetId: input.userId,
        metadata: { newRole: input.role },
      });

      return updated;
    }),

  adminToggleUserActive: adminProcedure
    .input(adminToggleUserActiveSchema)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning();

      await recordAuditLog({
        db: ctx.db,
        actorId: ctx.user.id,
        action: input.isActive ? "USER_ACCOUNT_ACTIVATED" : "USER_ACCOUNT_SUSPENDED",
        targetType: "user",
        targetId: input.userId,
        metadata: { reason: input.reason },
      });

      return updated;
    }),
});
