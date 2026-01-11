import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { defaultPlaces, visitors } from "./schema";

const schema = { visitors, defaultPlaces };

let _db: NodePgDatabase<typeof schema> | null = null;
let _pool: Pool | null = null;

export function getDb() {
  if (!_db) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    _db = drizzle(_pool, { schema });
  }
  return _db;
}
