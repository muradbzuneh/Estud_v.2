import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../core/trpc";
import { users, profiles, institutions, campuses, eq } from "@estud/db";
import { TRPCError } from "@trpc/server";

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
});
