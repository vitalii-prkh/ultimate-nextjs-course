import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {DEV_ICONS_MAP, DEV_DESC_MAP} from "@/refs/dev-icons-map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevIconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  return `${DEV_ICONS_MAP[normalizedTech] || "devicon-devicon-plain"} colored`;
}

export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  return (
    DEV_DESC_MAP[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}

export function getTimeStamp(createdAt: Date | string) {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);

  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
}

export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }

  return number.toString();
}
