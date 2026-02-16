import "server-only";

import enMessages from "../../messages/en.json";
import koMessages from "../../messages/ko.json";

export type Messages = typeof koMessages;

export function getMessages(locale: string): Messages {
  return locale === "en" ? enMessages : koMessages;
}
