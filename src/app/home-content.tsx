"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";
import { CalendarIcon, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { withAppleLogo } from "@/lib/apple-logo";
import { getCountryFromLocale } from "@/lib/phone";
import { cn } from "@/lib/utils";

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function stringToDate(str: string): Date {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const KAKAOTALK_REGEX = /(?:iphone|ipad|android).* kakaotalk/i;
const LINE_REGEX = /(?:iphone|ipad|android).* line\//i;
const INAPP_REGEX =
  /inapp|naver|snapchat|wirtschaftswoche|thunderbird|instagram|everytimeapp|whatsapp|electron|wadiz|aliapp|zumapp|kakaostory|band|twitter|daumapps|daumdevice\/mobile|fb_iab|fb4a|fban|fbios|fbss|trill/i;
const ANDROID_REGEX = /android/i;
const IOS_REGEX = /i(?:phone|pad)/i;
const URL_SCHEME_REGEX = /^(https?):\/\/(.*)$/;
const HTTP_REGEX = /^http/;

function isIOS(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return IOS_REGEX.test(navigator.userAgent);
}

function getInAppBrowserRedirectUrl(): string | null {
  const ua = navigator.userAgent;
  const href = location.href;

  if (KAKAOTALK_REGEX.test(ua)) {
    return `kakaotalk://web/openExternal?url=${encodeURIComponent(href)}`;
  }
  if (LINE_REGEX.test(ua)) {
    return `${href}${href.includes("?") ? "&" : "?"}openExternalBrowser=1`;
  }
  if (INAPP_REGEX.test(ua)) {
    if (ANDROID_REGEX.test(ua)) {
      return href.replace(
        URL_SCHEME_REGEX,
        "intent://$2#Intent;scheme=$1;package=com.android.chrome;end"
      );
    }
    if (IOS_REGEX.test(ua)) {
      return href.replace(HTTP_REGEX, "googlechrome");
    }
  }
  return null;
}

const queryParsers = {
  name: parseAsString.withDefault(""),
  phone: parseAsString.withDefault(""),
  place: parseAsString.withDefault(""),
  date: parseAsString.withDefault(""),
  inAppDialog: parseAsBoolean.withDefault(false),
  dateDrawer: parseAsBoolean.withDefault(false),
};

interface HomeContentInnerProps {
  defaultPlace?: string;
}

function HomeContentInner({ defaultPlace }: HomeContentInnerProps) {
  const t = useTranslations("home");
  const tDate = useTranslations();
  const locale = useLocale();
  const defaultCountry = getCountryFromLocale(locale);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("nameError")),
        phone: z
          .string()
          .min(1, t("phoneError"))
          .transform((value, ctx) => {
            try {
              const phoneNumber = parsePhoneNumberWithError(value, {
                defaultCountry,
              });
              if (!phoneNumber.isValid()) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("phoneError"),
                });
                return z.NEVER;
              }
              return phoneNumber.format("E.164");
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: t("phoneError"),
              });
              return z.NEVER;
            }
          }),
        meetingPlace: z.string().min(1, t("placeError")),
        meetingDate: z.string().min(1, t("dateError")),
      }),
    [t, defaultCountry]
  );

  const [queryParams, setQueryParams] = useQueryStates(queryParsers, {
    shallow: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: queryParams.name,
      phone: queryParams.phone,
      meetingPlace: queryParams.place || defaultPlace || "",
      meetingDate: queryParams.date || getTodayString(),
    },
  });

  const syncToUrl = () => {
    const values = form.getValues();
    setQueryParams({
      name: values.name || null,
      phone: values.phone || null,
      place: values.meetingPlace || null,
      date: values.meetingDate || null,
    });
  };

  useEffect(() => {
    const redirectUrl = getInAppBrowserRedirectUrl();
    if (redirectUrl) {
      location.href = redirectUrl;
      setTimeout(() => setQueryParams({ inAppDialog: true }), 1000);
    }
  }, [setQueryParams]);

  useEffect(() => {
    const values = form.getValues();
    if (!values.meetingPlace) {
      form.setFocus("meetingPlace");
    } else if (!values.name) {
      form.setFocus("name");
    } else if (!values.phone) {
      form.setFocus("phone");
    }
  }, [form]);

  function formatDateForDisplay(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    return tDate("dateFormat", { year, month, day });
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const passDownloadForm = document.createElement("form");
    passDownloadForm.method = "POST";
    passDownloadForm.action = "/api/pass";
    passDownloadForm.style.display = "none";

    const fields = {
      name: data.name,
      phone: data.phone,
      meetingPlace: data.meetingPlace,
      meetingDate: data.meetingDate,
    };

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      passDownloadForm.appendChild(input);
    }

    document.body.appendChild(passDownloadForm);
    passDownloadForm.submit();
    document.body.removeChild(passDownloadForm);

    setTimeout(() => {
      setIsLoading(false);
      form.reset();
      setShowSuccessDrawer(true);
    }, 1000);
  }

  function handleOpenWallet() {
    if (isIOS()) {
      window.location.href = "shoebox://";
    }
    setShowSuccessDrawer(false);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 pb-32 sm:py-12">
      <div className="mx-auto max-w-lg space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="font-bold text-4xl text-foreground-light tracking-tight">
              {t("title")}
            </h1>
            <p className="font-medium text-foreground text-lg opacity-90">
              {t("description")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="meetingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateLabel")}</FormLabel>
                  <Drawer
                    onOpenChange={(open) =>
                      setQueryParams({ dateDrawer: open })
                    }
                    open={queryParams.dateDrawer}
                  >
                    <DrawerTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "h-14 w-full justify-start rounded-xl font-normal text-lg",
                            field.value && "bg-secondary"
                          )}
                          variant="outline"
                        >
                          <CalendarIcon className="mr-3 size-5" />
                          <span className="flex-1 text-left">
                            {field.value
                              ? formatDateForDisplay(field.value)
                              : t("datePicker")}
                          </span>
                          {field.value && (
                            <Check className="size-5 text-primary" />
                          )}
                        </Button>
                      </FormControl>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>{t("dateLabel")}</DrawerTitle>
                      </DrawerHeader>
                      <div className="flex justify-center p-4 pb-8">
                        <Calendar
                          autoFocus
                          className="rounded-xl"
                          mode="single"
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(dateToString(date));
                              setQueryParams({
                                dateDrawer: false,
                                date: dateToString(date),
                              });
                            }
                          }}
                          selected={
                            field.value ? stringToDate(field.value) : undefined
                          }
                        />
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetingPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("placeLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        className={cn(
                          "h-14 rounded-xl text-lg",
                          field.value && "bg-secondary pr-12"
                        )}
                        onBlur={() => {
                          field.onBlur();
                          syncToUrl();
                        }}
                        placeholder={t("placePlaceholder")}
                      />
                      {field.value && (
                        <Check className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-primary" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nameLabel")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        autoComplete="name"
                        className={cn(
                          "h-14 rounded-xl text-lg",
                          field.value && "bg-secondary pr-12"
                        )}
                        onBlur={() => {
                          field.onBlur();
                          syncToUrl();
                        }}
                        placeholder={t("namePlaceholder")}
                      />
                      {field.value && (
                        <Check className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-primary" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phoneLabel")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      defaultCountry={defaultCountry}
                      filled={!!field.value}
                      international
                      onBlur={() => {
                        field.onBlur();
                        syncToUrl();
                      }}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="fixed right-0 bottom-0 left-0 bg-gradient-to-t from-background via-background to-transparent p-6 pt-12 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <div className="mx-auto flex max-w-lg flex-col gap-3">
                <Button
                  className="h-14 w-full rounded-xl text-lg active:scale-[0.98]"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? t("submitLoading") : t("submitButton")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <Dialog
        onOpenChange={(open) => setQueryParams({ inAppDialog: open })}
        open={queryParams.inAppDialog}
      >
        <DialogContent className="border-border bg-card sm:rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-foreground-light text-xl">
              {t("inAppBrowserTitle")}
            </DialogTitle>
            <DialogDescription className="text-base text-foreground">
              {t("inAppBrowserNotSupported")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Drawer onOpenChange={setShowSuccessDrawer} open={showSuccessDrawer}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl">
              {t("successDrawerTitle")}
            </DrawerTitle>
            <p className="text-foreground">
              {withAppleLogo(t("successDrawerDescription"))}
            </p>
          </DrawerHeader>
          <div className="flex flex-col gap-3 p-6 pt-2">
            {isIOS() && (
              <Button
                className="h-14 w-full rounded-xl text-lg"
                onClick={handleOpenWallet}
              >
                {withAppleLogo(t("successDrawerOpen"))}
              </Button>
            )}
            <Button
              className="h-14 w-full rounded-xl text-lg"
              onClick={() => setShowSuccessDrawer(false)}
              variant={isIOS() ? "outline" : "default"}
            >
              {t("successDrawerDone")}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

export interface HomeContentProps {
  defaultPlace?: string;
}

export function HomeContent({ defaultPlace }: HomeContentProps) {
  return (
    <Suspense>
      <HomeContentInner defaultPlace={defaultPlace} />
    </Suspense>
  );
}
