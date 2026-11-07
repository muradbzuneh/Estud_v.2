import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import * as schema from "./schema/index";

export type EstudDatabase = ReturnType<typeof drizzleHttp<typeof schema>>;
export type EstudPoolDatabase = ReturnType<typeof drizzleServerless<typeof schema>>;

let cachedHttpDb: EstudDatabase | null = null;
let cachedPoolDb: EstudPoolDatabase | null = null;

/**
 * HTTP Client: Best for serverless / edge API routes and fast queries
 * Cached singleton to avoid reconnect latency on high-frequency tRPC requests
 */
export function createHttpClient(connectionString?: string): EstudDatabase {
  if (!connectionString && cachedHttpDb) {
    return cachedHttpDb;
  }
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined.");
  }
  const sql = neon(url);
  const db = drizzleHttp(sql, { schema });
  if (!connectionString) {
    cachedHttpDb = db;
  }
  return db;
}

/**
 * WebSocket Pool Client: Best for transactions and interactive workflows
 */
export function createPoolClient(connectionString?: string): EstudPoolDatabase {
  if (!connectionString && cachedPoolDb) {
    return cachedPoolDb;
  }
  const url = connectionString || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined.");
  }
  const pool = new Pool({ connectionString: url });
  const db = drizzleServerless(pool, { schema });
  if (!connectionString) {
    cachedPoolDb = db;
  }
  return db;
}
