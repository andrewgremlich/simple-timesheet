import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Formats a date string without shifting the calendar day due to local timezone.
 * Common issue: storing midnight UTC (e.g., 2025-09-21T00:00:00.000Z) renders as previous day
 * in a negative offset timezone (e.g., US) when using new Date(date).
 *
 * Strategy:
 * 1. If the input is a plain date (YYYY-MM-DD), construct a local Date(y, m-1, d) which is safe.
 * 2. Otherwise parse the Date, but format using its UTC year/month/day so midnight UTC stays same day.
 */
export function formatDate(date: string | Date | null | undefined) {
	if (!date) return "";
	if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
		const [y, m, d] = date.split("-").map(Number);
		return format(new Date(y, m - 1, d), "MMM d, yyyy");
	}
	const d = typeof date === "string" ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return "";
	// Normalize to UTC date (ignore time component) to avoid timezone day rollback
	const utcDate = new Date(
		Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
	);
	return format(utcDate, "MMM d, yyyy");
}
