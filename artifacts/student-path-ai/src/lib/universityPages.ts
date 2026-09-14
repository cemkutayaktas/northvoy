/**
 * University detail pages.
 *
 * UNIVERSITY_DETAILS holds rich, hand-curated data for 41 institutions
 * (tuition, acceptance rate, English requirements, strengths). Those are the
 * only ones that get a page — the ~500 other university names that appear in
 * major lists have nothing beyond a name and would be thin pages.
 */
import { UNIVERSITY_DETAILS, getUniversityInfo, type UniversityInfo } from "@/lib/universityDetails";
import { UNIVERSITIES_BY_COUNTRY } from "@/lib/universities";
import { MAJORS, type Major } from "@/lib/matching";
import { COUNTRY_GUIDES, type CountryGuide } from "@/lib/countryGuides";
import { getQSRank } from "@/lib/qsRankings";
import { majorToSlug } from "@/lib/majorSlugs";

export function universityToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")  // strip accents
    .replace(/[&,.()'’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const UNIVERSITY_NAMES = Object.keys(UNIVERSITY_DETAILS);

const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  UNIVERSITY_NAMES.map(n => [universityToSlug(n), n]),
);

export function slugToUniversity(slug: string): string | undefined {
  return SLUG_TO_NAME[slug];
}

/** Majors taught at a university, resolved across name variants. */
const MAJOR_INDEX: Record<string, Major[]> = (() => {
  const idx: Record<string, Set<Major>> = {};
  for (const major of MAJORS) {
    for (const names of Object.values(UNIVERSITIES_BY_COUNTRY[major] ?? {})) {
      for (const raw of names as string[]) {
        const info = getUniversityInfo(raw);
        if (!info) continue;
        const canonical = UNIVERSITY_NAMES.find(n => UNIVERSITY_DETAILS[n] === info);
        if (canonical) (idx[canonical] ??= new Set()).add(major);
      }
    }
  }
  return Object.fromEntries(Object.entries(idx).map(([k, v]) => [k, [...v]]));
})();

export interface UniversityPage {
  name: string;
  slug: string;
  info: UniversityInfo;
  qsRank: number | null;
  majors: Major[];
  /** Country guide for this university's country, when one exists. */
  countryGuide?: CountryGuide;
}

export function getUniversityPage(slug: string): UniversityPage | null {
  const name = slugToUniversity(slug);
  if (!name) return null;
  const info = UNIVERSITY_DETAILS[name];
  return {
    name,
    slug,
    info,
    qsRank: getQSRank(name),
    majors: MAJOR_INDEX[name] ?? [],
    countryGuide: COUNTRY_GUIDES.find(g => g.name === info.country),
  };
}

/** All university pages, best-ranked first (unranked last). */
export function allUniversityPages(): UniversityPage[] {
  return UNIVERSITY_NAMES
    .map(n => getUniversityPage(universityToSlug(n))!)
    .sort((a, b) => (a.qsRank ?? 9999) - (b.qsRank ?? 9999));
}

/** Universities in a given country — used to cross-link from country guides. */
export function universitiesInCountry(countryName: string): UniversityPage[] {
  return allUniversityPages().filter(u => u.info.country === countryName);
}

export { majorToSlug };
