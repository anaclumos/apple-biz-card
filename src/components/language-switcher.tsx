"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LOCALES } from "@/lib/locales";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useQueryState(
    "langDrawer",
    parseAsBoolean.withDefault(false)
  );

  const currentLang =
    LOCALES.find((lang) => lang.code === locale) || LOCALES[0];

  const selectLanguage = (code: string) => {
    if (code !== locale) {
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not widely supported; direct assignment is standard for locale persistence
      document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; SameSite=Lax`;
      window.location.reload();
    }
    setOpen(false);
  };

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button className="h-11 gap-2 rounded-full px-4" variant="outline">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm">{currentLang.label}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            {t("selectLanguage")}
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[60vh] px-4 pb-8">
          <div className="flex flex-col gap-1 pr-4">
            {LOCALES.map((lang) => (
              <button
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all",
                  "hover:bg-muted active:bg-accent",
                  lang.code === locale && "bg-muted"
                )}
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                type="button"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1 font-medium text-base">
                  {lang.label}
                </span>
                {lang.code === locale && (
                  <Check className="size-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
