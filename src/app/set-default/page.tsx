"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateToString, getTodayString, stringToDate } from "@/lib/date";
import { cn } from "@/lib/utils";

export default function SetDefaultPage() {
  const t = useTranslations("setDefault");
  const tDate = useTranslations();

  const formSchema = useMemo(
    () =>
      z.object({
        password: z.string().min(1, t("passwordError")),
        eventDate: z.string().min(1, t("dateError")),
        place: z.string().min(1, t("placeError")),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      eventDate: getTodayString(),
      place: "",
    },
  });

  const [isLoading, setIsLoading] = useQueryState(
    "loading",
    parseAsBoolean.withDefault(false)
  );

  function formatDateForDisplay(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    return tDate("dateFormat", { year, month, day });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/set-default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("genericError"));
      }

      toast.success(t("success"));
      form.reset({
        password: "",
        eventDate: getTodayString(),
        place: "",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("genericError"));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 font-sans text-foreground-light">
      <Card className="w-full max-w-md shadow-2xl shadow-black/50">
        <CardHeader>
          <CardTitle className="text-foreground-light">{t("title")}</CardTitle>
          <CardDescription className="text-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("dateLabel")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            variant="outline"
                          >
                            {field.value ? (
                              formatDateForDisplay(field.value)
                            ) : (
                              <span>{t("datePlaceholder")}</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          mode="single"
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(dateToString(date));
                            }
                          }}
                          selected={
                            field.value ? stringToDate(field.value) : undefined
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("placeLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("placePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("passwordPlaceholder")}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
