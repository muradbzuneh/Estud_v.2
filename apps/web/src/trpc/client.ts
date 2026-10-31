import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@estud/api";

export const trpc = createTRPCReact<AppRouter>();
