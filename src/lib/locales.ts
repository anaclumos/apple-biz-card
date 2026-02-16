import type { CountryCode } from "libphonenumber-js";

/**
 * Single source of truth for all supported locales.
 * To add a new locale: add one entry here, then add the messages JSON file.
 */
export const LOCALES = [
  {
    code: "en",
    bcp47: "en-US",
    country: "US" as CountryCode,
    label: "English",
    flag: "\u{1F1FA}\u{1F1F8}",
  },
  {
    code: "ko",
    bcp47: "ko-KR",
    country: "KR" as CountryCode,
    label: "\uD55C\uAD6D\uC5B4",
    flag: "\u{1F1F0}\u{1F1F7}",
  },
  {
    code: "ja",
    bcp47: "ja-JP",
    country: "JP" as CountryCode,
    label: "\u65E5\u672C\u8A9E",
    flag: "\u{1F1EF}\u{1F1F5}",
  },
  {
    code: "zh-CN",
    bcp47: "zh-CN",
    country: "CN" as CountryCode,
    label: "\u7B80\u4F53\u4E2D\u6587",
    flag: "\u{1F1E8}\u{1F1F3}",
  },
  {
    code: "zh-TW",
    bcp47: "zh-TW",
    country: "TW" as CountryCode,
    label: "\u7E41\u9AD4\u4E2D\u6587",
    flag: "\u{1F1F9}\u{1F1FC}",
  },
  {
    code: "es",
    bcp47: "es-ES",
    country: "ES" as CountryCode,
    label: "Espa\u00F1ol",
    flag: "\u{1F1EA}\u{1F1F8}",
  },
  {
    code: "fr",
    bcp47: "fr-FR",
    country: "FR" as CountryCode,
    label: "Fran\u00E7ais",
    flag: "\u{1F1EB}\u{1F1F7}",
  },
  {
    code: "de",
    bcp47: "de-DE",
    country: "DE" as CountryCode,
    label: "Deutsch",
    flag: "\u{1F1E9}\u{1F1EA}",
  },
  {
    code: "pt",
    bcp47: "pt-BR",
    country: "BR" as CountryCode,
    label: "Portugu\u00EAs",
    flag: "\u{1F1E7}\u{1F1F7}",
  },
  {
    code: "it",
    bcp47: "it-IT",
    country: "IT" as CountryCode,
    label: "Italiano",
    flag: "\u{1F1EE}\u{1F1F9}",
  },
  {
    code: "ru",
    bcp47: "ru-RU",
    country: "RU" as CountryCode,
    label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    flag: "\u{1F1F7}\u{1F1FA}",
  },
  {
    code: "ar",
    bcp47: "ar-SA",
    country: "SA" as CountryCode,
    label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
    flag: "\u{1F1F8}\u{1F1E6}",
  },
  {
    code: "hi",
    bcp47: "hi-IN",
    country: "IN" as CountryCode,
    label: "\u0939\u093F\u0928\u094D\u0926\u0940",
    flag: "\u{1F1EE}\u{1F1F3}",
  },
  {
    code: "nl",
    bcp47: "nl-NL",
    country: "NL" as CountryCode,
    label: "Nederlands",
    flag: "\u{1F1F3}\u{1F1F1}",
  },
  {
    code: "pl",
    bcp47: "pl-PL",
    country: "PL" as CountryCode,
    label: "Polski",
    flag: "\u{1F1F5}\u{1F1F1}",
  },
  {
    code: "tr",
    bcp47: "tr-TR",
    country: "TR" as CountryCode,
    label: "T\u00FCrk\u00E7e",
    flag: "\u{1F1F9}\u{1F1F7}",
  },
  {
    code: "vi",
    bcp47: "vi-VN",
    country: "VN" as CountryCode,
    label: "Ti\u1EBFng Vi\u1EC7t",
    flag: "\u{1F1FB}\u{1F1F3}",
  },
  {
    code: "th",
    bcp47: "th-TH",
    country: "TH" as CountryCode,
    label: "\u0E44\u0E17\u0E22",
    flag: "\u{1F1F9}\u{1F1ED}",
  },
  {
    code: "id",
    bcp47: "id-ID",
    country: "ID" as CountryCode,
    label: "Indonesia",
    flag: "\u{1F1EE}\u{1F1E9}",
  },
  {
    code: "sv",
    bcp47: "sv-SE",
    country: "SE" as CountryCode,
    label: "Svenska",
    flag: "\u{1F1F8}\u{1F1EA}",
  },
] as const;

export type SupportedLocale = (typeof LOCALES)[number]["code"];

export const LOCALE_CODES = LOCALES.map((l) => l.code);

export const BCP47_LOCALES = LOCALES.map((l) => l.bcp47);

export const BCP47_TO_CODE = Object.fromEntries(
  LOCALES.map((l) => [l.bcp47, l.code])
) as Record<string, SupportedLocale>;

export const CODE_TO_COUNTRY = Object.fromEntries(
  LOCALES.map((l) => [l.code, l.country])
) as Record<string, CountryCode>;

export const DEFAULT_LOCALE: SupportedLocale = "en";
export const DEFAULT_BCP47 = "en-US";

export function isSupported(locale: string): locale is SupportedLocale {
  return LOCALE_CODES.includes(locale as SupportedLocale);
}
