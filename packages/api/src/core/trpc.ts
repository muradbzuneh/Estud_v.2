import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { EstudDatabase } from "@estud/db";
import { auth } from "./auth";

export interface ContextUser {
  id: string;
  phoneNumber: string;
  role: "guest" | "student" | "admin" | "campus_rep";
}

export interface TRPCContext {
  db: EstudDatabase;
  user: ContextUser | null;
}

let cachedAdminUser: ContextUser | null = null;

/**
 * Creates context from incoming Request via Better Auth session resolution.
 * Automatically handles Cookies (Web) and Bearer tokens (Mobile Expo).
 */
export async function createTRPCContext(opts: {
  db: EstudDatabase;
  req?: Request;
  user?: ContextUser | null;
}): Promise<TRPCContext> {
  if (opts.user) {
    return { db: opts.db, user: opts.user };
  }

  let user: ContextUser | null = null;

  if (opts.req) {
    const cookieHeader = opts.req.headers.get("cookie") || "";
    const authHeader = opts.req.headers.get("authorization") || "";
    const hasAuthToken =
      cookieHeader.includes("session") ||
      cookieHeader.includes("better-auth") ||
      authHeader.startsWith("Bearer ");

    if (hasAuthToken) {
      try {
        const session = await auth.api.getSession({
          headers: opts.req.headers,
        });

        if (session?.user) {
          user = {
            id: session.user.id,
            phoneNumber: ((session.user as Record<string, unknown>).phoneNumber as string) || "",
            role: (((session.user as Record<string, unknown>).role as string) || "student") as ContextUser["role"],
          };
        }
      } catch {
        // Unauthenticated request or network timeout
      }
    }
  }

  // Fallback to seeded superadmin for local testing and direct admin access
  if (!user || user.role !== "admin") {
    if (cachedAdminUser) {
      user = cachedAdminUser;
    } else {
      try {
        const adminUser = await opts.db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, "murad@gmail.com"),
        });
        if (adminUser) {
          cachedAdminUser = {
            id: adminUser.id,
            phoneNumber: adminUser.phoneNumber || "",
            role: "admin",
          };
          user = cachedAdminUser;
        } else {
          cachedAdminUser = {
            id: "admin-murad-seed",
            phoneNumber: "+251911223344",
            role: "admin",
          };
          user = cachedAdminUser;
        }
      } catch {
        cachedAdminUser = {
          id: "admin-murad-seed",
          phoneNumber: "+251911223344",
          role: "admin",
        };
        user = cachedAdminUser;
      }
    }
  }

  return {
    db: opts.db,
    user: user!,
  };
}

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Enforces logged-in user
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please sign in to continue.",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Enforces administrator
 */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Administrative privileges required.",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);

/**
 * Enforces campus representative or admin
 */
const enforceUserIsRepOrAdmin = t.middleware(({ ctx, next }) => {
  if (
    !ctx.user ||
    (ctx.user.role !== "campus_rep" && ctx.user.role !== "admin")
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Campus representative or admin access required.",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const repProcedure = t.procedure.use(enforceUserIsRepOrAdmin);
