/**
 * Programmatic "study <major> in <country>" landing pages.
 *
 * A combination only becomes a page when we hold enough data to say something
 * genuinely useful about it: a country guide (tuition, living costs, visa
 * rules, highlights) AND a real list of universities teaching that major in
 * that country. Combinations without both are skipped rather than shipped as
 * thin pages.
 */
import { MAJORS, MAJOR_DATA, type Major } from "@/lib/matching";
import { UNIVERSITIES_BY_COUNTRY } from "@/lib/universities";
import { COUNTRY_GUIDES, type CountryGuide } from "@/lib/countryGuides";
import { SALARY_DATA, type SalaryEntry } from "@/lib/salaryData";
import { getQSRank } from "@/lib/qsRankings";
import { getUniversityInfo } from "@/lib/universityDetails";
import { majorToSlug } from "@/lib/majorSlugs";

export interface ComboUniversity {
  name: string;
  qsRank: number | null;
  city?: string;
  website?: string;
  tuitionIntl?: string;
  acceptanceRate?: string;
  ielts?: string;
}

export interface MajorCountryCombo {
  major: Major;
  majorSlug: string;
  country: CountryGuide;
  universities: ComboUniversity[];
  salary?: SalaryEntry;
}

/** Countries we can write a full guide for (have tuition/visa/cost context). */
const GUIDE_BY_NAME = new Map(COUNTRY_GUIDES.map(g => [g.name, g]));

export function getCombo(majorSlug: string, countrySlug: string): MajorCountryCombo | null {
  const major = MAJORS.find(m => majorToSlug(m) === majorSlug);
  if (!major) return null;
  const country = COUNTRY_GUIDES.find(g => g.slug === countrySlug);
  if (!country) return null;

  const names = UNIVERSITIES_BY_COUNTRY[major]?.[country.name];
  if (!names || names.length === 0) return null;

  return {
    major,
    majorSlug,
    country,
    salary: SALARY_DATA[major],
    universities: names.map(name => {
      const info = getUniversityInfo(name);
      return {
        name,
        qsRank: getQSRank(name),
        city: info?.city,
        website: info?.website,
        tuitionIntl: info?.tuitionIntl ?? info?.tuitionNonEU,
        acceptanceRate: info?.acceptanceRate,
        ielts: info?.ielts,
      };
    }),
  };
}

/** Every combination that clears the data bar, for prerendering and sitemaps. */
export function allCombos(): { majorSlug: string; countrySlug: string; major: Major; country: CountryGuide }[] {
  const out: { majorSlug: string; countrySlug: string; major: Major; country: CountryGuide }[] = [];
  for (const major of MAJORS) {
    const byCountry = UNIVERSITIES_BY_COUNTRY[major];
    if (!byCountry) continue;
    for (const countryName of Object.keys(byCountry)) {
      const guide = GUIDE_BY_NAME.get(countryName);
      if (!guide) continue;
      if (!byCountry[countryName]?.length) continue;
      out.push({ majorSlug: majorToSlug(major), countrySlug: guide.slug, major, country: guide });
    }
  }
  return out;
}

/** Countries available for one major — used to cross-link from the major page. */
export function countriesForMajor(major: Major): CountryGuide[] {
  const byCountry = UNIVERSITIES_BY_COUNTRY[major];
  if (!byCountry) return [];
  return COUNTRY_GUIDES.filter(g => (byCountry[g.name]?.length ?? 0) > 0);
}

/** Majors available for one country — used to cross-link from the country page. */
export function majorsForCountry(country: CountryGuide): Major[] {
  return MAJORS.filter(m => (UNIVERSITIES_BY_COUNTRY[m]?.[country.name]?.length ?? 0) > 0);
}

export { MAJOR_DATA };
