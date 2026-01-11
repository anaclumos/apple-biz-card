import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { defaultPlaces } from "@/db/schema";

// SECURITY: This module is server-only. Date checks use server time - client cannot bypass.

const TIMEZONE = "Asia/Seoul";

function getServerDateString(): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export async function getDefaultPlaceForToday(): Promise<string | undefined> {
  const serverDate = getServerDateString();

  const db = getDb();
  const result = await db
    .select({ place: defaultPlaces.place })
    .from(defaultPlaces)
    .where(eq(defaultPlaces.eventDate, serverDate))
    .limit(1);

  return result[0]?.place;
}
