import {
  type CountryCode,
  formatIncompletePhoneNumber,
  getExampleNumber,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

const LOCALE_TO_COUNTRY: Record<string, CountryCode> = {
  en: "US",
  ko: "KR",
  ja: "JP",
  "zh-CN": "CN",
  "zh-TW": "TW",
  es: "ES",
  fr: "FR",
  de: "DE",
  pt: "BR",
  it: "IT",
  ru: "RU",
  ar: "SA",
  hi: "IN",
  nl: "NL",
  pl: "PL",
  tr: "TR",
  vi: "VN",
  th: "TH",
  id: "ID",
  sv: "SE",
};

export function getCountryFromLocale(locale: string): CountryCode {
  return LOCALE_TO_COUNTRY[locale] || "US";
}

export function getPhonePlaceholder(locale: string): string {
  const country = getCountryFromLocale(locale);
  const example = getExampleNumber(country, examples);
  if (example) {
    return example.formatInternational();
  }
  return "+1 234 567 8900";
}

export function validatePhone(phone: string, locale?: string): boolean {
  if (!phone || phone.trim() === "") {
    return false;
  }

  const country = locale ? getCountryFromLocale(locale) : undefined;

  try {
    return isValidPhoneNumber(phone, country);
  } catch {
    return false;
  }
}

export function formatPhone(phone: string, locale?: string): string {
  const country = locale ? getCountryFromLocale(locale) : undefined;
  const parsed = safeParsePhone(phone, country);
  return (
    parsed?.formatInternational() ?? formatIncompletePhoneNumber(phone, country)
  );
}

export function normalizePhone(phone: string, locale?: string): string {
  const country = locale ? getCountryFromLocale(locale) : undefined;
  const parsed = safeParsePhone(phone, country);
  return parsed?.isValid() ? parsed.format("E.164") : phone;
}

function safeParsePhone(phone: string, country?: CountryCode) {
  try {
    return parsePhoneNumber(phone, country);
  } catch {
    return null;
  }
}
