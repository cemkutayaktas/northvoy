/**
 * Regenerates public/sitemap.xml from the live route data so the sitemap can
 * never drift from what is actually prerendered. Run via `npm run sitemap`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MAJORS } from "../src/lib/matching";
import { COUNTRY_GUIDES } from "../src/lib/countryGuides";
import { BLOG_POSTS } from "../src/lib/blogPosts";
import { majorToSlug } from "../src/lib/majorSlugs";
import { allCombos } from "../src/lib/majorCountry";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://northvoy.com";
const today = new Date().toISOString().slice(0, 10);

interface Entry { loc: string; priority: string; changefreq: string }
const e = (loc: string, priority: string, changefreq = "monthly"): Entry => ({ loc, priority, changefreq });

const entries: Entry[] = [
  e("/", "1.0", "weekly"),
  e("/questionnaire", "0.9"), e("/questionnaire/quick", "0.9"), e("/questionnaire/detailed", "0.9"),
  e("/majors", "0.9"), e("/countries", "0.8"), e("/scholarships", "0.8"),
  e("/blog", "0.8", "weekly"), e("/compare", "0.7"), e("/turkiye", "0.7"),
  e("/about", "0.6"),
  // NOTE: /tracker, /account, /auth and /reset-password are intentionally absent —
  // robots.txt disallows them, so listing them here would send contradictory signals.
  ...MAJORS.map(m => e(`/majors/${majorToSlug(m)}`, "0.8")),
  ...COUNTRY_GUIDES.map(g => e(`/countries/${g.slug}`, "0.8")),
  ...BLOG_POSTS.map(p => e(`/blog/${p.slug}`, "0.7")),
  // Programmatic study-abroad pages
  ...allCombos().map(c => e(`/majors/${c.majorSlug}/${c.countrySlug}`, "0.7")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(({ loc, priority, changefreq }) => {
  const u = SITE + loc;
  return `  <url>
    <loc>${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${["en", "tr", "de", "x-default"].map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${u}"/>`).join("\n")}
  </url>`;
}).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, "public/sitemap.xml"), xml, "utf8");
console.log(`sitemap: ${entries.length} URLs written`);
