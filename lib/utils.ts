import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return format(new Date(date.getTime() + 12 * 60 * 60 * 1000), "MMM d, yyyy");
}
