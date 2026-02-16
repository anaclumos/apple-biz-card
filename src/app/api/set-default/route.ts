import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { defaultPlaces } from "@/db/schema";
import { env } from "@/env";
import { getLocaleFromAcceptLanguage } from "@/lib/locale";
import { getMessages } from "@/lib/messages.server";

export async function POST(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const locale = getLocaleFromAcceptLanguage(acceptLanguage);
  const messages = getMessages(locale);

  try {
    const body = await request.json();
    const { password, eventDate, place } = body;

    if (password !== env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: messages.api.invalidPassword },
        { status: 401 }
      );
    }

    if (!(eventDate && place)) {
      return NextResponse.json(
        { error: messages.api.missingFields },
        { status: 400 }
      );
    }

    await db
      .insert(defaultPlaces)
      .values({
        eventDate,
        place,
      })
      .onConflictDoUpdate({
        target: defaultPlaces.eventDate,
        set: {
          place,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: messages.api.saveError },
      { status: 500 }
    );
  }
}
