import type { CountryCode } from "libphonenumber-js";
import { CODE_TO_COUNTRY } from "@/lib/locales";

export function getCountryFromLocale(locale: string): CountryCode {
  return CODE_TO_COUNTRY[locale] || "US";
}
