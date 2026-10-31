import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { EstudDatabase } from "@estud/db";

export interface ContextUser {
  id: string;
  phoneNumber: string;
  role: "guest" | "student" | "admin" | "campus_rep";
}

export interface TRPCContext {
  db: EstudDatabase;
  user: ContextUser | null;
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
 * Reusable middleware that enforces users are logged in
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to perform this action.",
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
 * Reusable middleware that enforces user is an administrator
 */
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Administrative privileges are required for this action.",
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
 * Reusable middleware that enforces user is a campus representative or administrator
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
