"use client";

import {
  Add01Icon,
  Alert,
  AlertCircle,
  ArrowUpDown,
  Calendar01Icon,
  Cancel,
  CheckmarkCircle01Icon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  InformationCircleIcon,
  LoaderCircle,
  MinusSignIcon,
  MoreHorizontal,
  Search01Icon,
  SidebarLeftIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";

import { cn } from "@/lib/utils";

type IconComponentProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "icon"
>;

function createIconComponent(icon: IconSvgElement) {
  function IconComponent({ className, size, ...props }: IconComponentProps) {
    return (
      <HugeiconsIcon
        className={cn("shrink-0", className)}
        color="currentColor"
        icon={icon}
        size={size ?? 24}
        strokeWidth={1.5}
        {...props}
      />
    );
  }
  return IconComponent;
}

export const PlusIcon = createIconComponent(Add01Icon);
export const TriangleAlertIcon = createIconComponent(Alert);
export const AlertCircleIcon = createIconComponent(AlertCircle);
export const ChevronsUpDownIcon = createIconComponent(ArrowUpDown);
export const CalendarIcon = createIconComponent(Calendar01Icon);
export const XIcon = createIconComponent(Cancel);
export const CircleCheckIcon = createIconComponent(CheckmarkCircle01Icon);
export const ChevronDownIcon = createIconComponent(ChevronDown);
export const ChevronLeftIcon = createIconComponent(ChevronLeft);
export const ChevronRightIcon = createIconComponent(ChevronRight);
export const ChevronUpIcon = createIconComponent(ChevronUp);
export const InfoIcon = createIconComponent(InformationCircleIcon);
export const LoaderCircleIcon = createIconComponent(LoaderCircle);
export const MinusIcon = createIconComponent(MinusSignIcon);
export const MoreHorizontalIcon = createIconComponent(MoreHorizontal);
export const SearchIcon = createIconComponent(Search01Icon);
export const PanelLeftIcon = createIconComponent(SidebarLeftIcon);
export const CheckIcon = createIconComponent(Tick02Icon);

interface IconProps
  extends Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> {
  icon: IconSvgElement;
}

function Icon({ icon, className, size, ...props }: IconProps) {
  return (
    <HugeiconsIcon
      className={cn("shrink-0", className)}
      color="currentColor"
      icon={icon}
      size={size ?? 24}
      strokeWidth={1.5}
      {...props}
    />
  );
}

export { Icon, type IconProps };
