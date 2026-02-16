import { resolveAcceptLanguage } from "resolve-accept-language";
import {
  BCP47_LOCALES,
  BCP47_TO_CODE,
  DEFAULT_BCP47,
  type SupportedLocale,
} from "@/lib/locales";

export type { SupportedLocale } from "@/lib/locales";

export function getLocaleFromAcceptLanguage(
  acceptLanguage: string
): SupportedLocale {
  const resolved = resolveAcceptLanguage(
    acceptLanguage,
    BCP47_LOCALES,
    DEFAULT_BCP47
  );
  return BCP47_TO_CODE[resolved];
}
