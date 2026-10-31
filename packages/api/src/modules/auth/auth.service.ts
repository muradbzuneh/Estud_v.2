import { users, profiles, eq, type EstudDatabase } from "@estud/db";
import type { z } from "zod";
import type { updateProfileSchema } from "./auth.schema";

export class AuthService {
  constructor(private db: EstudDatabase) {}

  async getProfile(userId: string) {
    return this.db.query.users.findFirst({
      where: eq(users.id, userId),
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
  }

  async updateProfile(userId: string, input: z.infer<typeof updateProfileSchema>) {
    const [updated] = await this.db
      .insert(profiles)
      .values({
        userId,
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
  }
}
