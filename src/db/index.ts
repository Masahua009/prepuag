import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | undefined;
let dbInstance: ReturnType<typeof drizzle> | undefined;

if (databaseUrl) {
  const globalForDb = globalThis as typeof globalThis & {
    __arenaNextJsPostgresqlPool?: Pool;
  };

  pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  dbInstance = drizzle(pool);
}

// Export a proxy that only works when DATABASE_URL is available
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!dbInstance) {
      throw new Error("DATABASE_URL is not configured. This app uses static JSON data — no DB needed.");
    }
    return (dbInstance as any)[prop];
  },
});

export { pool };
