import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, type TRPCContext } from "@estud/api";
import { createHttpClient } from "@estud/db";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async (): Promise<TRPCContext> => {
      const db = createHttpClient();
      // Auth user context can be extracted from session / bearer token
      return {
        db,
        user: null, // Populated via session middleware
      };
    },
  });

export { handler as GET, handler as POST };
