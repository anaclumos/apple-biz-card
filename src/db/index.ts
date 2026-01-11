import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env";
import { defaultPlaces, visitors } from "./schema";

export const db = drizzle(env.DATABASE_URL, {
  schema: { visitors, defaultPlaces },
});
