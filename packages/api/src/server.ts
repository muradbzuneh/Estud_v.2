import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";
import { createTRPCContext } from "./core/trpc";
import { auth } from "./core/auth";
import { createHttpClient } from "@estud/db";

const port = Number(process.env.PORT) || 4000;

function addCorsHeaders(response: Response): Response {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PATCH"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, x-trpc-source, Cookie"
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

console.log(`[Estud API] Server starting on port ${port}...`);

export default {
  port,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // 1. Preflight CORS
    if (req.method === "OPTIONS") {
      const res = new Response(null, { status: 204 });
      return addCorsHeaders(res);
    }

    // 2. Health check route for Heroku dyno monitoring
    if (url.pathname === "/" || url.pathname === "/health") {
      const res = new Response(
        JSON.stringify({
          status: "healthy",
          service: "Estud Backend API Server",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
      return addCorsHeaders(res);
    }

    // 3. Better Auth API handler (/api/auth/*)
    if (url.pathname.startsWith("/api/auth")) {
      try {
        const authRes = await auth.handler(req);
        return addCorsHeaders(authRes);
      } catch (err: any) {
        console.error("[Auth API] Server error:", err);
        const errRes = new Response(
          JSON.stringify({ error: { message: err?.message || "Auth failed" } }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
        return addCorsHeaders(errRes);
      }
    }

    // 4. tRPC API handler (/api/trpc/*)
    if (url.pathname.startsWith("/api/trpc")) {
      try {
        const trpcRes = await fetchRequestHandler({
          endpoint: "/api/trpc",
          req,
          router: appRouter,
          createContext: async () => {
            const db = createHttpClient();
            return createTRPCContext({ db, req });
          },
        });
        return addCorsHeaders(trpcRes);
      } catch (err: any) {
        console.error("[tRPC API] Server error:", err);
        const errRes = new Response(
          JSON.stringify({ error: { message: err?.message || "tRPC error" } }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
        return addCorsHeaders(errRes);
      }
    }

    // 404 Fallback
    const notFoundRes = new Response(
      JSON.stringify({ error: "Route not found", path: url.pathname }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
    return addCorsHeaders(notFoundRes);
  },
};
