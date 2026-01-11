import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { defaultPlaces } from "@/db/schema";
import { getLocaleFromAcceptLanguage } from "@/lib/locale";
import enMessages from "../../../../messages/en.json";
import koMessages from "../../../../messages/ko.json";

type Messages = typeof koMessages;

function getMessages(locale: string): Messages {
  return locale === "en" ? enMessages : koMessages;
}

export async function POST(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const locale = getLocaleFromAcceptLanguage(acceptLanguage);
  const messages = getMessages(locale);

  try {
    const body = await request.json();
    const { password, eventDate, place } = body;

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: messages.api.serverError },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
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
