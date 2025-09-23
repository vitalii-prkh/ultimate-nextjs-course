import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {DEV_ICONS_MAP} from "@/refs/dev-icons-map";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevIconClassName(techName: string) {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  return `${DEV_ICONS_MAP[normalizedTech] || "devicon-devicon-plain"} colored`;
}
