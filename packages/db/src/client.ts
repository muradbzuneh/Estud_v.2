import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import * as schema from "./schema/index.js";

/**
 * HTTP Client: Best for serverless / edge API routes and fast queries
 */
export function createHttpClient(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined.");
  }
  const sql = neon(url);
  return drizzleHttp(sql, { schema });
}

/**
 * WebSocket Pool Client: Best for transactions and interactive workflows
 */
export function createPoolClient(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined.");
  }
  const pool = new Pool({ connectionString: url });
  return drizzleServerless(pool, { schema });
}

export type EstudDatabase = ReturnType<typeof createHttpClient>;
