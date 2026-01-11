import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = [
  "en",
  "ko",
  "ja",
  "zh-CN",
  "zh-TW",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "ru",
  "ar",
  "hi",
  "nl",
  "pl",
  "tr",
  "vi",
  "th",
  "id",
  "sv",
] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: SupportedLocale = "en";

function isSupported(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

function parseAcceptLanguage(header: string): SupportedLocale {
  const languages = header
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
      return {
        code: code.trim().toLowerCase(),
        q: qValue ? Number.parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (isSupported(code)) {
      return code;
    }
    if (code.startsWith("zh-hans") || code === "zh-cn") {
      return "zh-CN";
    }
    if (code.startsWith("zh-hant") || code === "zh-tw" || code === "zh-hk") {
      return "zh-TW";
    }
    const base = code.split("-")[0];
    if (isSupported(base)) {
      return base;
    }
  }

  return DEFAULT_LOCALE;
}

async function getLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");

  if (localeCookie?.value && isSupported(localeCookie.value)) {
    return localeCookie.value;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  return parseAcceptLanguage(acceptLanguage);
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
