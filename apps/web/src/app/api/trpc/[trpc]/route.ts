import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@estud/api";
import { createHttpClient } from "@estud/db";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const db = createHttpClient();
      return createTRPCContext({ db, req });
    },
  });

export { handler as GET, handler as POST };
