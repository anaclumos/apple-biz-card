import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { PKPass } from "passkit-generator";
import { db } from "@/db";
import { visitors } from "@/db/schema";
import { getLocaleFromAcceptLanguage } from "@/lib/locale";
import enMessages from "../../../../messages/en.json";
import koMessages from "../../../../messages/ko.json";

type Messages = typeof koMessages;

function getMessages(locale: string): Messages {
  return locale === "en" ? enMessages : koMessages;
}

function decodeBase64(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}

function getPhotoBuffer(size: "" | "@2x" | "@3x"): Buffer {
  return readFileSync(join(process.cwd(), "assets", `photo${size}.png`));
}

function getStripBuffer(size: "" | "@2x" | "@3x"): Buffer {
  return readFileSync(join(process.cwd(), "assets", `strip${size}.png`));
}

function decodeBase64ToPem(
  base64: string,
  type: "CERTIFICATE" | "PRIVATE KEY"
): Buffer {
  const decoded = Buffer.from(base64, "base64").toString("base64");
  const decodedStr = Buffer.from(base64, "base64").toString("utf8");
  if (decodedStr.includes(`-----BEGIN ${type}-----`)) {
    return Buffer.from(decodedStr);
  }
  const pem = `-----BEGIN ${type}-----\n${decoded.match(/.{1,64}/g)?.join("\n")}\n-----END ${type}-----`;
  return Buffer.from(pem);
}

function formatDate(date: Date, messages: Messages): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return messages.dateFormat
    .replace("{year}", String(year))
    .replace("{month}", String(month))
    .replace("{day}", String(day));
}

async function generatePass(
  name: string,
  phone: string,
  meetingPlace: string,
  meetingDateStr: string,
  messages: Messages
): Promise<NextResponse> {
  const serialNumber = `CARD-${randomUUID()}`;
  const meetingDate = new Date(meetingDateStr);

  await db.insert(visitors).values({
    name,
    phone,
    meetingPlace,
    meetingDate,
    serialNumber,
  });

  const certBase64 = process.env.PASS_CERTIFICATE_PEM_BASE64;
  const keyBase64 = process.env.PASS_KEY_PEM_BASE64;
  const wwdrBase64 = process.env.WWDR_CERTIFICATE_PEM_BASE64;
  const passTypeId = process.env.PASS_TYPE_IDENTIFIER;
  const teamId = process.env.TEAM_IDENTIFIER;

  if (!(certBase64 && keyBase64 && wwdrBase64 && passTypeId && teamId)) {
    throw new Error("Missing required environment variables");
  }

  const signerCert = decodeBase64(certBase64);
  const signerKey = decodeBase64(keyBase64);
  const wwdr = decodeBase64ToPem(wwdrBase64, "CERTIFICATE");

  const pass = new PKPass(
    {
      "icon.png": getPhotoBuffer(""),
      "icon@2x.png": getPhotoBuffer("@2x"),
      "icon@3x.png": getPhotoBuffer("@3x"),
      "logo.png": getPhotoBuffer(""),
      "logo@2x.png": getPhotoBuffer("@2x"),
      "logo@3x.png": getPhotoBuffer("@3x"),
      "strip.png": getStripBuffer(""),
      "strip@2x.png": getStripBuffer("@2x"),
      "strip@3x.png": getStripBuffer("@3x"),
    },
    {
      wwdr,
      signerCert,
      signerKey,
      signerKeyPassphrase: process.env.PASS_KEY_PASSPHRASE || undefined,
    },
    {
      formatVersion: 1,
      passTypeIdentifier: passTypeId,
      serialNumber,
      teamIdentifier: teamId,
      organizationName: messages.pass.organizationName,
      description: messages.pass.description,
      logoText: "cho.sh",
      foregroundColor: "rgb(128, 190, 122)",
      backgroundColor: "rgb(29, 37, 27)",
      labelColor: "rgb(128, 190, 122)",
    }
  );

  pass.type = "storeCard";

  pass.secondaryFields.push({
    key: "phone",
    label: messages.pass.phoneLabel,
    value: "+82 10-7332-9837",
  });

  pass.backFields.push(
    {
      key: "email_full",
      label: messages.pass.emailLabel,
      value: "hey@cho.sh",
    },
    {
      key: "phone_full",
      label: messages.pass.phoneLabel,
      value: "+82 10-7332-9837",
    },
    {
      key: "homepage",
      label: messages.pass.homepageLabel,
      value: messages.pass.homepageUrl,
    },
    {
      key: "linkedin",
      label: messages.pass.linkedinLabel,
      value: "linkedin.com/in/anaclumos",
    },
    {
      key: "instagram",
      label: messages.pass.instagramLabel,
      value: "instagram.com/anaclumos",
    },
    {
      key: "kakao",
      label: messages.pass.kakaoLabel,
      value: "https://go.cho.sh/kakao",
    },
    {
      key: "meeting_place_back",
      label: messages.pass.meetingPlaceLabel,
      value: meetingPlace,
    },
    {
      key: "meeting_date_back",
      label: messages.pass.meetingDateLabel,
      value: formatDate(meetingDate, messages),
    },
    {
      key: "updated",
      label: messages.pass.lastUpdatedLabel,
      value: formatDate(new Date(), messages),
    }
  );

  const buffer = pass.getAsBuffer();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": `attachment; filename="BusinessCard.pkpass"; filename*=UTF-8''${encodeURIComponent(`${messages.pass.filename}.pkpass`)}`,
    },
  });
}

export async function POST(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const locale = getLocaleFromAcceptLanguage(acceptLanguage);
  const messages = getMessages(locale);

  try {
    const contentType = request.headers.get("content-type") || "";
    let name: string | null = null;
    let phone: string | null = null;
    let meetingPlace: string | null = null;
    let meetingDateStr: string | null = null;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name;
      phone = body.phone;
      meetingPlace = body.meetingPlace;
      meetingDateStr = body.meetingDate;
    } else {
      const formData = await request.formData();
      name = formData.get("name") as string | null;
      phone = formData.get("phone") as string | null;
      meetingPlace = formData.get("meetingPlace") as string | null;
      meetingDateStr = formData.get("meetingDate") as string | null;
    }

    if (!(name && phone && meetingPlace && meetingDateStr)) {
      return NextResponse.json(
        { error: messages.api.passFieldsError },
        { status: 400 }
      );
    }

    return await generatePass(
      name,
      phone,
      meetingPlace,
      meetingDateStr,
      messages
    );
  } catch {
    return NextResponse.json(
      { error: messages.api.passGenerateError },
      { status: 500 }
    );
  }
}
