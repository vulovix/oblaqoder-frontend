import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export function formatRelativeTime(input: Date | string): string {
  const now = dayjs.utc().local();
  const date = dayjs.utc(input).local();

  const diffInSeconds = now.diff(date, "second");
  const diffInMinutes = now.diff(date, "minute");
  const diffInHours = now.diff(date, "hour");

  if (diffInSeconds < 60) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;

  return date.format("MMM D, YYYY");
}

export function formatDateTime(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${hours}:${minutes} · ${day}.${month}.${year}.`;
}

export function formatDate(dateInput: Date | string, format: "dot" | "long" = "dot"): string {
  const date = new Date(dateInput);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  if (format === "long") {
    const longMonth = date.toLocaleString("default", { month: "long" });
    return `${longMonth} ${parseInt(day)}, ${year}`;
  }

  return `${day}.${month}.${year}.`;
}

export function formaToUTCDate(dateInput: Date | string, format: "dot" | "long" = "dot"): string {
  const date = new Date(dateInput);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getUTCDate());
  const month = pad(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();

  if (format === "long") {
    const longMonth = date.toLocaleString("default", {
      month: "long",
      timeZone: "UTC", // optional but extra-safe
    });
    return `${longMonth} ${parseInt(day)}, ${year}`;
  }

  return `${day}.${month}.${year}.`;
}

export function formatToLocalDate(dateInput: Date | string, format: "dot" | "long" = "dot"): string {
  const date = new Date(dateInput); // still UTC source, but parsed to local

  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate()); // ✅ LOCAL date
  const month = pad(date.getMonth() + 1); // ✅ LOCAL month
  const year = date.getFullYear(); // ✅ LOCAL year

  if (format === "long") {
    const longMonth = date.toLocaleString("default", {
      month: "long",
    });
    return `${longMonth} ${parseInt(day)}, ${year}`;
  }

  return `${day}.${month}.${year}.`;
}

export function getFormattedDate(date = new Date()): string {
  const now = new Date(date);

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = now.getFullYear();

  return `${year}-${month}-${day}`;
}
