import { neon, Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleServerless } from "drizzle-orm/neon-serverless";
import * as schema from "./schema/index";

// Configure resilient fetch wrapper for Neon Serverless queries
// Handles Neon compute idle cold-starts and transient connection timeouts
if (!neonConfig.fetchFunction) {
  neonConfig.fetchFunction = async (input: any, init?: any) => {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fetch(input, init);
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        const causeCode = err?.cause?.code || err?.code;
        const causeName = err?.cause?.name || err?.name;

        const isTimeout =
          causeName === "ConnectTimeoutError" ||
          causeCode === "UND_ERR_CONNECT_TIMEOUT" ||
          causeCode === "UND_ERR_SOCKET" ||
          errMsg.includes("fetch failed") ||
          errMsg.includes("timeout") ||
          errMsg.includes("terminated") ||
          errMsg.includes("aborted") ||
          errMsg.includes("ECONNRESET") ||
          causeCode === "ETIMEDOUT" ||
          causeCode === "ECONNRESET";

        if (attempt < maxRetries && isTimeout) {
          console.warn(
            `[Neon DB] Connection timed out on attempt ${attempt + 1}/${maxRetries} (Neon compute cold-start). Retrying...`
          );
          // Wait 1.5s for Neon compute instance to finish waking up
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  };
}

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
    console.warn(
      "[Estud DB] Warning: DATABASE_URL is not defined. Using fallback client for build-time compilation."
    );
    const fallbackSql = neon("postgresql://build_dummy:build_dummy@ep-dummy.neon.tech/dummy");
    return drizzleHttp(fallbackSql, { schema });
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
    console.warn(
      "[Estud DB] Warning: DATABASE_URL is not defined. Using fallback client for build-time compilation."
    );
    const pool = new Pool({ connectionString: "postgresql://build_dummy:build_dummy@ep-dummy.neon.tech/dummy" });
    return drizzleServerless(pool, { schema });
  }
  const pool = new Pool({ connectionString: url });
  const db = drizzleServerless(pool, { schema });
  if (!connectionString) {
    cachedPoolDb = db;
  }
  return db;
}
