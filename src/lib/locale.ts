import { resolveAcceptLanguage } from "resolve-accept-language";

export type SupportedLocale =
  | "en"
  | "ko"
  | "ja"
  | "zh-CN"
  | "zh-TW"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "ru"
  | "ar"
  | "hi"
  | "nl"
  | "pl"
  | "tr"
  | "vi"
  | "th"
  | "id"
  | "sv";

const SUPPORTED_LOCALES = [
  "en-US",
  "ko-KR",
  "ja-JP",
  "zh-CN",
  "zh-TW",
  "es-ES",
  "fr-FR",
  "de-DE",
  "pt-BR",
  "it-IT",
  "ru-RU",
  "ar-SA",
  "hi-IN",
  "nl-NL",
  "pl-PL",
  "tr-TR",
  "vi-VN",
  "th-TH",
  "id-ID",
  "sv-SE",
] as const;

const DEFAULT_LOCALE = "en-US";

const LOCALE_TO_LANGUAGE: Record<string, SupportedLocale> = {
  "en-US": "en",
  "ko-KR": "ko",
  "ja-JP": "ja",
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
  "pt-BR": "pt",
  "it-IT": "it",
  "ru-RU": "ru",
  "ar-SA": "ar",
  "hi-IN": "hi",
  "nl-NL": "nl",
  "pl-PL": "pl",
  "tr-TR": "tr",
  "vi-VN": "vi",
  "th-TH": "th",
  "id-ID": "id",
  "sv-SE": "sv",
};

export function getLocaleFromAcceptLanguage(
  acceptLanguage: string
): SupportedLocale {
  const resolved = resolveAcceptLanguage(
    acceptLanguage,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE
  );
  return LOCALE_TO_LANGUAGE[resolved];
}
