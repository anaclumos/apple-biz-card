"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type ComponentProps,
  type ElementRef,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import PhoneInputPrimitive, {
  type Country,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const BaseInputComponent = forwardRef<
  HTMLInputElement,
  ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "h-14 rounded-s-none rounded-e-xl text-lg",
      "group-data-[filled]/phone:bg-secondary",
      className
    )}
    {...props}
    ref={ref}
  />
));
BaseInputComponent.displayName = "BaseInputComponent";

interface PhoneInputProps extends ComponentProps<typeof PhoneInputPrimitive> {
  filled?: boolean;
}

const PhoneInput = forwardRef<
  ElementRef<typeof PhoneInputPrimitive>,
  PhoneInputProps
>(({ className, onChange, filled, ...props }, ref) => {
  return (
    <div
      className="group/phone relative flex flex-1"
      data-filled={filled || undefined}
    >
      <PhoneInputPrimitive
        className={cn("flex flex-1", className)}
        countrySelectComponent={CountrySelect}
        flagComponent={FlagComponent}
        inputComponent={BaseInputComponent}
        onChange={(value) => onChange?.(value || "")}
        ref={ref}
        {...props}
      />
      {filled && (
        <Check className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-primary" />
      )}
    </div>
  );
});
PhoneInput.displayName = "PhoneInput";

interface CountrySelectOption {
  label: string;
  value: Country;
}

interface CountrySelectProps {
  disabled?: boolean;
  value: Country;
  onChange: (value: Country) => void;
  options: CountrySelectOption[];
}

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = useCallback(
    (country: Country) => {
      onChange(country);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const filteredOptions = useMemo(() => {
    if (!search) {
      return options;
    }
    const lowerSearch = search.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            "flex h-14 items-center gap-2 rounded-s-xl border border-input border-r-0 bg-input px-4 text-sm outline-none transition-[color,box-shadow]",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "group-data-[filled]/phone:bg-secondary",
            disabled && "hidden"
          )}
          disabled={disabled}
          type="button"
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown className="-mr-1 size-4 opacity-50" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{t("selectCountry")}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-12 rounded-xl pl-9"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchCountry")}
              value={search}
            />
          </div>
          <ScrollArea className="h-[50vh]">
            <div className="flex flex-col gap-1 pr-4">
              {filteredOptions
                .filter((x) => x.value)
                .map((option) => (
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                      "hover:bg-muted active:bg-accent",
                      option.value === value && "bg-muted"
                    )}
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    type="button"
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 text-base">{option.label}</span>
                    <span className="text-muted-foreground text-sm">
                      +{getCountryCallingCode(option.value)}
                    </span>
                    {option.value === value && (
                      <Check className="size-5 text-primary" />
                    )}
                  </button>
                ))}
              {filteredOptions.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  {t("noCountryFound")}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: {
  country: Country;
  countryName: string;
}) => {
  const Flag = flags[country];

  return (
    <span className="flag-container relative block aspect-[3/2] h-5 overflow-hidden rounded bg-muted">
      {Flag && (
        <span className="absolute inset-0">
          <Flag title={countryName} />
        </span>
      )}
    </span>
  );
};

export { PhoneInput };
