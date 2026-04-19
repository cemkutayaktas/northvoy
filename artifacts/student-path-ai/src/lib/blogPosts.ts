export type BlogCategory = "guidance" | "countries" | "rankings" | "applications";

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  guidance:     "bg-blue-500/15 text-blue-400 border-blue-500/20",
  countries:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rankings:     "bg-violet-500/15 text-violet-400 border-violet-500/20",
  applications: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export const CATEGORY_I18N_KEY: Record<BlogCategory, string> = {
  guidance:     "blog.categoryGuidance",
  countries:    "blog.categoryCountries",
  rankings:     "blog.categoryRankings",
  applications: "blog.categoryApplications",
};

export interface BlogPost {
  slug: string;
  titleKey: string;
  excerptKey: string;
  bodyKey: string;
  publishedAt: string;
  readingMinutes: number;
  category: BlogCategory;
  ogImageAlt: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-a-university-major",
    titleKey: "blog.post1Title",
    excerptKey: "blog.post1Excerpt",
    bodyKey: "blog.post1Body",
    publishedAt: "2026-03-15",
    readingMinutes: 5,
    category: "guidance",
    ogImageAlt: "Student choosing a university major",
  },
  {
    slug: "best-countries-for-international-students",
    titleKey: "blog.post2Title",
    excerptKey: "blog.post2Excerpt",
    bodyKey: "blog.post2Body",
    publishedAt: "2026-03-22",
    readingMinutes: 7,
    category: "countries",
    ogImageAlt: "World map with study destinations",
  },
  {
    slug: "what-is-qs-rankings",
    titleKey: "blog.post3Title",
    excerptKey: "blog.post3Excerpt",
    bodyKey: "blog.post3Body",
    publishedAt: "2026-04-01",
    readingMinutes: 4,
    category: "rankings",
    ogImageAlt: "University rankings chart",
  },
  {
    slug: "how-to-write-a-university-application",
    titleKey: "blog.post4Title",
    excerptKey: "blog.post4Excerpt",
    bodyKey: "blog.post4Body",
    publishedAt: "2026-04-10",
    readingMinutes: 6,
    category: "applications",
    ogImageAlt: "Student writing a university application",
  },
];
