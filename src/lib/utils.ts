import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: "text-green-600 bg-green-100",
    B: "text-blue-600 bg-blue-100",
    C: "text-yellow-600 bg-yellow-100",
    D: "text-orange-600 bg-orange-100",
    F: "text-red-600 bg-red-100",
  };
  return colors[grade] || "text-gray-600 bg-gray-100";
}

export function getAttendanceColor(status: string): string {
  const colors: Record<string, string> = {
    present: "text-green-600 bg-green-100",
    absent: "text-red-600 bg-red-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-green-600 bg-green-100",
    inactive: "text-gray-600 bg-gray-100",
    paid: "text-green-600 bg-green-100",
    unpaid: "text-red-600 bg-red-100",
    draft: "text-yellow-600 bg-yellow-100",
    published: "text-blue-600 bg-blue-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
}
