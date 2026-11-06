import { AROMAS, CATEGORIES, ORDER_STATUSES } from "@/lib/types";

export function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function labelFor(
  list: readonly { value: string; label: string }[],
  value: string,
) {
  return list.find((item) => item.value === value)?.label ?? value;
}

export function categoryLabel(value: string) {
  return labelFor(CATEGORIES, value);
}

export function aromaLabel(value: string) {
  return labelFor(AROMAS, value);
}

export function statusLabel(value: string) {
  return labelFor(ORDER_STATUSES, value);
}

export function splitNotes(value: string) {
  return value
    .split(",")
    .map((note) => note.trim())
    .filter(Boolean);
}
