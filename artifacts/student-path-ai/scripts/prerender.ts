/**
 * Build-time prerenderer.
 *
 * NorthVoy is a client-rendered Vite SPA, so every URL used to serve the same
 * bare index.html: identical <title>, identical description, and an empty
 * <div id="root">. Google eventually renders the JS, but AI answer engines
 * (GPTBot, PerplexityBot, ClaudeBot…) and social unfurlers mostly do not — so
 * 50+ pages of content were invisible to them and Google saw 50+ duplicate titles.
 *
 * This script runs after `vite build` and writes one static HTML file per route
 * with correct metadata, per-page JSON-LD, and the page's real content inside
 * #root. React replaces that content on mount, so users see exactly the same
 * app as before — crawlers just get a readable version first.
 *
 * Run: npx tsx scripts/prerender.ts   (wired into `npm run build`)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MAJORS, MAJOR_DATA } from "../src/lib/matching";
import { SALARY_DATA } from "../src/lib/salaryData";
import { COUNTRY_GUIDES } from "../src/lib/countryGuides";
import { BLOG_POSTS } from "../src/lib/blogPosts";
import { t } from "../src/lib/i18n";
import { allCombos, getCombo } from "../src/lib/majorCountry";
import { allUniversityPages } from "../src/lib/universityPages";
import { majorToSlug } from "../src/lib/majorSlugs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist/public");
const SITE = "https://northvoy.com";

// Mirrors majorToSlug() in src/lib/majorSlugs.ts
const slugify = (name: string) =>
  name.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const list = (items: string[]) => `<ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;

interface Page {
  route: string;
  title: string;
  description: string;
  content: string;
  jsonLd?: unknown;
}

const pages: Page[] = [];

// ─── Major pages (30) ─────────────────────────────────────────────────────────
for (const major of MAJORS) {
  const d = MAJOR_DATA[major];
  const salary = SALARY_DATA[major];
  const money = salary
    ? `Graduates typically earn $${salary.avgSalaryUSD[0].toLocaleString()}–$${salary.avgSalaryUSD[1].toLocaleString()} per year, with projected job growth of ${salary.jobGrowthPct}% (${salary.growthLabel}).`
    : "";
  const unis = [...d.universitiesByBudget[1], ...d.universitiesByBudget[2], ...d.universitiesByBudget[3]];
  const countries = d.countries.map(c => c.name);

  pages.push({
    route: `/majors/${slugify(major)}`,
    title: `${major} — Careers, Salary & Universities | NorthVoy`,
    description:
      `Complete guide to studying ${major}: career paths, salary expectations, top universities worldwide, required skills, and a 12-month action plan. Free guidance for international students.`.slice(0, 300),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${major} — Careers, Salary & Universities`,
      about: { "@type": "Thing", name: major },
      description: `Guide to studying ${major}, including careers, salaries, skills and top universities.`,
      author: { "@type": "Organization", name: "NorthVoy", url: SITE },
      publisher: { "@type": "Organization", name: "NorthVoy", url: SITE },
      inLanguage: "en",
      mainEntityOfPage: `${SITE}/majors/${slugify(major)}`,
    },
    content: `
      <h1>${esc(major)}</h1>
      <p>${esc(`${major} is one of 30+ university majors covered by NorthVoy's free academic guidance platform. ${money}`)}</p>
      <h2>Key skills you will develop</h2>${list(d.skills)}
      <h2>Career paths</h2>${list(d.careers)}
      ${salary ? `<h2>Salary and job outlook</h2><p>${esc(money)}</p><p>Highest-paying roles: ${esc(salary.topRoles.join(", "))}.</p>` : ""}
      <h2>Best countries to study ${esc(major)}</h2>${list(countries)}
      <h2>Top universities</h2>${list(unis)}
      <h2>How to get started</h2>${list(d.nextSteps)}
      <h2>Your first project</h2><p>${esc(d.miniProject)}</p>
      <h2>12-month action plan</h2>
      ${[d.twelveMonthPlan.q1, d.twelveMonthPlan.q2, d.twelveMonthPlan.q3, d.twelveMonthPlan.q4]
        .map(q => `<h3>${esc(q.title)}</h3>${list(q.focus)}`)
        .join("")}
      <p>Study cost: ${esc(d.studyCostLabel)}.</p>
      <p><a href="/questionnaire">Take the free quiz</a> to see whether ${esc(major)} matches your profile.</p>`,
  });
}

// ─── Country pages ────────────────────────────────────────────────────────────
for (const g of COUNTRY_GUIDES) {
  const overview = t("en", g.overviewKey);
  const visa = t("en", g.visaInfoKey);
  pages.push({
    route: `/countries/${g.slug}`,
    title: `Studying in ${g.name} — Tuition, Visas & Universities | NorthVoy`,
    description:
      `Study in ${g.name} as an international student: tuition ${g.avgTuitionRange}, living costs ${g.costOfLivingRange}, visa requirements and top universities.`.slice(0, 300),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Studying in ${g.name}`,
      about: { "@type": "Country", name: g.name },
      author: { "@type": "Organization", name: "NorthVoy", url: SITE },
      publisher: { "@type": "Organization", name: "NorthVoy", url: SITE },
      inLanguage: "en",
      mainEntityOfPage: `${SITE}/countries/${g.slug}`,
    },
    content: `
      <h1>Studying in ${esc(g.name)}</h1>
      <p>${esc(overview)}</p>
      <h2>Costs</h2>
      <p>Average tuition: ${esc(g.avgTuitionRange)}. Cost of living: ${esc(g.costOfLivingRange)}. Currency: ${esc(g.currency)}.</p>
      <h2>Why students choose ${esc(g.name)}</h2>${list(g.highlights)}
      <h2>Visa and student permits</h2><p>${esc(visa)}</p>
      <h2>Top universities by field</h2>
      ${Object.entries(g.topUniversitiesByMajor)
        .map(([m, u]) => `<h3>${esc(m)}</h3>${list((u as string[]) ?? [])}`)
        .join("")}`,
  });
}

// ─── Blog posts ───────────────────────────────────────────────────────────────
for (const p of BLOG_POSTS) {
  const title = t("en", p.titleKey);
  const excerpt = t("en", p.excerptKey);
  const body = t("en", p.bodyKey);
  pages.push({
    route: `/blog/${p.slug}`,
    title: `${title} | NorthVoy`,
    description: excerpt.slice(0, 300),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: excerpt,
      datePublished: p.publishedAt,
      author: { "@type": "Organization", name: "NorthVoy", url: SITE },
      publisher: { "@type": "Organization", name: "NorthVoy", url: SITE },
      inLanguage: "en",
      mainEntityOfPage: `${SITE}/blog/${p.slug}`,
    },
    content: `<article><h1>${esc(title)}</h1><p>${esc(excerpt)}</p>${body}</article>`,
  });
}


// ─── Major x Country landing pages ────────────────────────────────────────────
// Only combinations with BOTH a country guide (tuition/visa/living costs) and a
// real university list are emitted, so every page carries substantive content
// rather than reading as a thin doorway page.
for (const { majorSlug, countrySlug } of allCombos()) {
  const c = getCombo(majorSlug, countrySlug);
  if (!c) continue;
  const { major, country, universities, salary } = c;
  const d = MAJOR_DATA[major];
  const money = salary
    ? `Graduates typically earn $${salary.avgSalaryUSD[0].toLocaleString()}–$${salary.avgSalaryUSD[1].toLocaleString()} per year, with ${salary.jobGrowthPct}% projected job growth (${salary.growthLabel}).`
    : "";

  pages.push({
    route: `/majors/${majorSlug}/${countrySlug}`,
    title: `Study ${major} in ${country.name} — Universities, Tuition & Visas | NorthVoy`,
    description:
      `Study ${major} in ${country.name}: ${universities.length} universities, tuition ${country.avgTuitionRange}, living costs ${country.costOfLivingRange}, visa requirements and career outcomes for international students.`.slice(0, 300),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Study ${major} in ${country.name}`,
      description: `Universities, tuition, living costs, visas and careers for studying ${major} in ${country.name}.`,
      about: [{ "@type": "Thing", name: major }, { "@type": "Country", name: country.name }],
      author: { "@type": "Organization", name: "NorthVoy", url: SITE },
      publisher: { "@type": "Organization", name: "NorthVoy", url: SITE },
      inLanguage: "en",
      mainEntityOfPage: `${SITE}/majors/${majorSlug}/${countrySlug}`,
    },
    content: `
      <nav><a href="/majors">Majors</a> / <a href="/majors/${majorSlug}">${esc(major)}</a> / ${esc(country.name)}</nav>
      <h1>Study ${esc(major)} in ${esc(country.name)}</h1>
      <p>${esc(`Thinking about studying ${major} in ${country.name}? This guide covers the universities that teach it, what the degree costs, living expenses, visa rules and where the career leads. ${money}`)}</p>
      <h2>Where to study ${esc(major)} in ${esc(country.name)}</h2>
      <ul>${universities.map(u => `<li>${esc(u.name)}${u.qsRank ? ` — QS world rank ${u.qsRank}` : ""}${u.city ? `, ${esc(u.city)}` : ""}${u.tuitionIntl ? `. International fee: ${esc(u.tuitionIntl)}` : ""}${u.ielts ? `. IELTS: ${esc(u.ielts)}` : ""}</li>`).join("")}</ul>
      <h2>What it costs</h2>
      <p>Average tuition: ${esc(country.avgTuitionRange)}. Cost of living: ${esc(country.costOfLivingRange)}. Currency: ${esc(country.currency)}.</p>
      ${salary ? `<h2>Salary and outlook</h2><p>${esc(money)}</p><p>Highest-paying roles: ${esc(salary.topRoles.join(", "))}.</p>` : ""}
      <h2>Why ${esc(country.name)}</h2>${list(country.highlights)}
      <h2>Visas and student permits</h2><p>${esc(t("en", country.visaInfoKey))}</p>
      <h2>Skills you will build</h2>${list(d.skills)}
      <h2>Careers after ${esc(major)}</h2>${list(d.careers)}
      <p><a href="/majors/${majorSlug}">All about ${esc(major)}</a> · <a href="/countries/${countrySlug}">Full ${esc(country.name)} guide</a> · <a href="/questionnaire">Take the free quiz</a></p>`,
  });
}


// ─── University pages ─────────────────────────────────────────────────────────
// Only the 41 institutions with curated detail data (tuition, acceptance rate,
// English requirements, strengths). The ~500 other names that appear in major
// lists have nothing beyond a name and would be thin pages.
const uniPages = allUniversityPages();
for (const u of uniPages) {
  const { name, slug, info, qsRank, majors, countryGuide } = u;
  const tuition = [
    info.tuitionDomestic && `Domestic: ${info.tuitionDomestic}`,
    info.tuitionIntl && `International: ${info.tuitionIntl}`,
    info.tuitionEU && `EU: ${info.tuitionEU}`,
    info.tuitionNonEU && `Non-EU: ${info.tuitionNonEU}`,
  ].filter(Boolean) as string[];

  pages.push({
    route: `/universities/${slug}`,
    title: `${name} — Tuition, Entry Requirements & Rankings | NorthVoy`,
    description:
      `${name} in ${info.city}, ${info.country}${qsRank ? ` (QS world rank ${qsRank})` : ""}: tuition, acceptance rate, IELTS and TOEFL requirements, and the ${majors.length} majors it is known for.`.slice(0, 300),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      name,
      description: info.description,
      url: info.website,
      foundingDate: String(info.founded),
      address: { "@type": "PostalAddress", addressLocality: info.city, addressCountry: info.country },
      ...(info.totalStudents ? { numberOfStudents: info.totalStudents } : {}),
      mainEntityOfPage: `${SITE}/universities/${slug}`,
    },
    content: `
      <nav><a href="/universities">University guides</a> / ${esc(name)}</nav>
      <h1>${esc(name)}</h1>
      <p>${esc(`${info.city}, ${info.country}${qsRank ? ` — QS world rank ${qsRank}` : ""}. Founded ${info.founded}. ${info.type} university.`)}</p>
      <p>${esc(info.description)}</p>
      ${tuition.length ? `<h2>Tuition</h2>${list(tuition)}` : ""}
      ${info.ielts || info.toefl ? `<h2>English requirements</h2><ul>${info.ielts ? `<li>IELTS: ${esc(info.ielts)}</li>` : ""}${info.toefl ? `<li>TOEFL: ${esc(info.toefl)}</li>` : ""}</ul>` : ""}
      ${info.acceptanceRate ? `<p>Acceptance rate: ${esc(info.acceptanceRate)}.</p>` : ""}
      ${info.totalStudents ? `<p>Total students: ${esc(info.totalStudents)}.</p>` : ""}
      <h2>Known for</h2>${info.notableFor ? `<p>${esc(info.notableFor)}</p>` : ""}${list(info.strengths)}
      ${majors.length ? `<h2>Majors offered here</h2><ul>${majors.map(m => `<li><a href="${countryGuide ? `/majors/${majorToSlug(m)}/${countryGuide.slug}` : `/majors/${majorToSlug(m)}`}">${esc(m)}</a></li>`).join("")}</ul>` : ""}
      ${countryGuide ? `<h2>Studying in ${esc(info.country)}</h2>${list(countryGuide.highlights.slice(0, 4))}<p><a href="/countries/${countryGuide.slug}">Full ${esc(info.country)} guide</a></p>` : ""}
      <p><a href="${esc(info.website)}">Official site</a> · <a href="/questionnaire">Take the free quiz</a></p>`,
  });
}

pages.push({
  route: "/universities",
  title: "University Guides — Tuition, Entry Requirements & Rankings | NorthVoy",
  description:
    "Compare 41 top universities worldwide: QS rankings, tuition for international students, acceptance rates, IELTS and TOEFL requirements, and the majors each is known for.",
  content: `<h1>University Guides</h1><p>Tuition, entry requirements, acceptance rates and the majors each university is known for.</p><ul>${uniPages.map(u => `<li><a href="/universities/${u.slug}">${esc(u.name)}</a> — ${esc(u.info.city)}, ${esc(u.info.country)}${u.qsRank ? ` (QS ${u.qsRank})` : ""}</li>`).join("")}</ul>`,
});

// ─── Static routes ────────────────────────────────────────────────────────────
const majorLinks = MAJORS.map(m => `<li><a href="/majors/${slugify(m)}">${esc(m)}</a></li>`).join("");
const countryLinks = COUNTRY_GUIDES.map(g => `<li><a href="/countries/${g.slug}">${esc(g.name)}</a></li>`).join("");

pages.push(
  {
    route: "/majors",
    title: "All 30 University Majors — Salaries & Careers | NorthVoy",
    description:
      "Browse all 30 university majors with salary data, job growth, career paths, top universities and 12-month action plans. Free guidance for international students.",
    content: `<h1>Explore University Majors</h1><p>NorthVoy covers 30 university majors with salary data, career paths and top universities worldwide.</p><ul>${majorLinks}</ul>`,
  },
  {
    route: "/countries",
    title: "Best Countries to Study Abroad — Tuition & Visas | NorthVoy",
    description:
      "Compare the best countries to study abroad as an international student: tuition, cost of living, visa rules and top universities.",
    content: `<h1>Country Guides</h1><p>Compare tuition, living costs and visa requirements across top study destinations.</p><ul>${countryLinks}</ul>`,
  },
  {
    route: "/questionnaire",
    title: "Free University Major Quiz — Quick or Detailed | NorthVoy",
    description:
      "Take the free NorthVoy quiz: a quick 9-question match in 5 minutes, or a detailed 24-question analysis for the most accurate university major recommendation.",
    content: `<h1>Choose your path to clarity</h1><p>Two free quizzes match you across 30+ university majors.</p><h2>Quick Quiz</h2><p>9 questions, about 5 minutes. Instant top-3 major matches with career paths and universities.</p><h2>Detailed Analysis</h2><p>24 questions, about 12 minutes. Adds a 16-statement personality profile and real-life scenario questions for higher-confidence results.</p><p><a href="/questionnaire/quick">Start the Quick Quiz</a> or <a href="/questionnaire/detailed">start the Detailed Analysis</a>.</p>`,
  },
  {
    route: "/questionnaire/quick",
    title: "Quick University Major Quiz — 9 Questions, 5 Minutes | NorthVoy",
    description:
      "Answer 9 questions about your interests, strengths and goals to discover which university major fits you best. Free, instant results, no signup required.",
    content: `<h1>Quick Major Quiz</h1><p>Nine questions, about five minutes, and you get your top three university major matches with career paths, universities and a 12-month plan.</p>`,
  },
  {
    route: "/questionnaire/detailed",
    title: "Detailed Major Analysis — 24 Questions | NorthVoy",
    description:
      "Our most accurate free quiz: 24 questions including a 16-statement personality profile and scenario questions, matching you across 30+ university majors.",
    content: `<h1>Detailed Major Analysis</h1><p>Our most accurate assessment. Twenty-four questions including a sixteen-statement personality profile and real-life scenario questions, scored across nine dimensions to match you with the right university major.</p>`,
  },
  {
    route: "/scholarships",
    title: "Scholarship Finder — 20+ International Scholarships | NorthVoy",
    description:
      "Find scholarships matched to your major and destination country. Erasmus, DAAD, Chevening, Fulbright and more, with eligibility, deadlines and award amounts.",
    content: `<h1>Scholarship Finder</h1><p>Discover funding opportunities matched to your major and destination country, including Erasmus Mundus, DAAD, Chevening and Fulbright.</p>`,
  },
  {
    route: "/compare",
    title: "Compare University Majors Side by Side | NorthVoy",
    description:
      "Compare up to 3 university majors side-by-side: skills, career paths, salaries, top countries and study costs. Free comparison tool.",
    content: `<h1>Compare University Majors</h1><p>Compare up to three majors side by side across skills, careers, salaries, countries and study costs.</p>`,
  },
  {
    route: "/blog",
    title: "Blog — University & Study Abroad Guides | NorthVoy",
    description:
      "Guides and insights to help students choose the right university major and navigate studying abroad.",
    content: `<h1>NorthVoy Blog</h1><ul>${BLOG_POSTS.map(p => `<li><a href="/blog/${p.slug}">${esc(t("en", p.titleKey))}</a></li>`).join("")}</ul>`,
  },
  {
    route: "/about",
    title: "About NorthVoy — How Our Major Matching Works",
    description:
      "Learn how NorthVoy's matching engine scores your answers across nine dimensions to recommend university majors, and meet the team behind it.",
    content: `<h1>About NorthVoy</h1><p>NorthVoy is a free academic guidance platform that helps high school students discover their ideal university major through a structured, transparent matching engine scored across nine dimensions.</p>`,
  },
  {
    route: "/turkiye",
    title: "Türkiye Üniversite Rehberi — YKS & Yurt Dışı | NorthVoy",
    description:
      "Türkiye'de ve yurt dışında üniversite eğitimi rehberi: YKS puan türleri, en iyi üniversiteler, burslar ve bölüm seçimi.",
    content: `<h1>Türkiye Üniversite Rehberi</h1><p>YKS puan türleri, Türkiye'nin en iyi üniversiteleri, burslar ve yurt dışında eğitim seçenekleri hakkında kapsamlı rehber.</p>`,
  },
);

// ─── Emit ─────────────────────────────────────────────────────────────────────
const templatePath = path.join(DIST, "index.html");
if (!fs.existsSync(templatePath)) {
  console.error(`prerender: ${templatePath} not found — run \`vite build\` first.`);
  process.exit(1);
}
const template = fs.readFileSync(templatePath, "utf8");

function render(page: Page): string {
  const url = `${SITE}${page.route}`;
  const title = esc(page.title);
  const desc = esc(page.description);
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(url)}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);
  // hreflang alternates should point at this page, not the homepage
  html = html.replace(
    /<link rel="alternate" hreflang="(en|tr|de|x-default)" href="[^"]*"\s*\/?>/g,
    (_m, lang) => `<link rel="alternate" hreflang="${lang}" href="${esc(url)}" />`,
  );

  if (page.jsonLd) {
    html = html.replace(
      "</head>",
      `<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>\n  </head>`,
    );
  }

  // Crawler-readable content. React's createRoot() replaces this on mount,
  // so what users see is unchanged.
  html = html.replace('<div id="root"></div>', `<div id="root">${page.content}</div>`);
  return html;
}

let written = 0;
for (const page of pages) {
  const outDir = path.join(DIST, page.route.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), render(page), "utf8");
  written++;
}

console.log(`prerender: wrote ${written} static pages`);
