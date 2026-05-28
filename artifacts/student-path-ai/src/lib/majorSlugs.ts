import { MAJORS } from "@/lib/matching";

export function majorToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToMajor(slug: string): string | undefined {
  return MAJORS.find(m => majorToSlug(m) === slug);
}

// Pre-built map for O(1) lookup
export const MAJOR_SLUGS: Record<string, string> = Object.fromEntries(
  MAJORS.map(m => [m, majorToSlug(m)])
);
