import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  CheckCircle2, Briefcase, Globe, Lightbulb, ArrowLeft, BookOpen,
} from "lucide-react";
import { MAJOR_DATA } from "@/lib/matching";
import { SALARY_DATA, GROWTH_COLOR, fmtK } from "@/lib/salaryData";
import { UNIVERSITIES_BY_COUNTRY } from "@/lib/universities";
import { slugToMajor } from "@/lib/majorSlugs";
import { useLang } from "@/contexts/LanguageContext";

const MAJOR_ICONS: Record<string, string> = {
  "Computer Science & Software Engineering": "💻",
  "Business Administration & Management": "📊",
  "Medicine & Health Sciences": "⚕️",
  "Creative Arts & Graphic Design": "🎨",
  "Environmental Science & Sustainability": "🌿",
  "Psychology & Social Sciences": "🧠",
  "Law & Political Science": "⚖️",
  "Mechanical & Civil Engineering": "⚙️",
  "Data Science & Statistics": "📈",
  "Education & Teaching": "📚",
  "Finance & Economics": "💰",
  "Architecture & Urban Design": "🏛️",
  "Pharmacy & Biomedical Sciences": "🔬",
  "Communication & Media Studies": "📡",
  "International Relations & Global Affairs": "🌍",
  "Cybersecurity & Network Engineering": "🛡️",
  "Game Design & Interactive Media": "🎮",
  "Nursing & Allied Health": "🏥",
  "Marketing & Advertising": "📣",
  "Linguistics & Translation": "🗣️",
};

const COUNTRY_FLAGS: Record<string, string> = {
  "United States": "🇺🇸", "Germany": "🇩🇪", "United Kingdom": "🇬🇧",
  "Canada": "🇨🇦", "Netherlands": "🇳🇱", "Sweden": "🇸🇪",
  "Switzerland": "🇨🇭", "Australia": "🇦🇺", "France": "🇫🇷",
  "Japan": "🇯🇵", "Singapore": "🇸🇬", "Turkey": "🇹🇷",
};

export default function MajorDetail() {
  const { t } = useLang();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const major = slugToMajor(slug);

  useEffect(() => {
    if (major) {
      document.title = `${major} — NorthVoy`;
    }
  }, [major]);

  if (!major) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">{t("majorPages.notFound")}</p>
        <Link href="/majors" className="text-primary underline text-sm">
          {t("majorPages.backToMajors")}
        </Link>
      </div>
    );
  }

  const data = MAJOR_DATA[major as keyof typeof MAJOR_DATA];
  const salary = SALARY_DATA[major];
  const uniByCountry = UNIVERSITIES_BY_COUNTRY[major] ?? {};

  // Top 3 countries from data that also have universities
  const topCountries = data.countries
    .filter(c => uniByCountry[c.name])
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* A. Hero */}
      <section
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}
        className="pt-24 pb-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Nav links */}
            <div className="flex items-center gap-3 mb-8">
              <Link href="/majors" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> {t("majorPages.allMajors")}
              </Link>
            </div>

            {/* Icon + title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
              <span style={{ fontSize: 64 }} className="leading-none">{MAJOR_ICONS[major] ?? "🎓"}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">{major}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  {salary && (
                    <>
                      <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-slate-200 font-medium">
                        {fmtK(salary.avgSalaryUSD[0])}–{fmtK(salary.avgSalaryUSD[1])} / yr
                      </span>
                      <span className={`text-sm font-semibold ${GROWTH_COLOR[salary.growthLabel]}`}>
                        +{salary.jobGrowthPct}% {t("majorPages.jobGrowth")}
                      </span>
                    </>
                  )}
                  <span className={`text-sm font-semibold ${data.studyCostColor}`}>
                    {t("majorPages.studyCost")}: {data.studyCostLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/questionnaire"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t("majorPages.takeQuiz")}
              </Link>
              <Link
                href="/majors"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 text-slate-200 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t("majorPages.allMajors")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* B. Overview Grid */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Key Skills */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {t("majorPages.keySkills")}
            </h2>
            <ul className="space-y-2">
              {data.skills.map(skill => (
                <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-primary/70" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Career Paths */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-base mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {t("majorPages.careerPaths")}
            </h2>
            <ul className="space-y-2">
              {data.careers.map(career => (
                <li key={career} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                  {career}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* C. Salary & Job Market */}
        {salary && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-base mb-5">{t("majorPages.salaryMarket")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("majorPages.salaryRange")}</p>
                <p className="text-lg font-bold text-foreground">
                  {fmtK(salary.avgSalaryUSD[0])} – {fmtK(salary.avgSalaryUSD[1])} per year
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("majorPages.jobGrowth")}</p>
                <p className={`text-lg font-bold ${GROWTH_COLOR[salary.growthLabel]}`}>
                  +{salary.jobGrowthPct}% over 10 years
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t("majorPages.topRoles")}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {salary.topRoles.map(role => (
                    <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* D. Top Universities */}
        {topCountries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              {t("majorPages.topUniversities")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {topCountries.map(c => {
                const unis = (uniByCountry[c.name] ?? []).slice(0, 3);
                return (
                  <div key={c.name} className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      {COUNTRY_FLAGS[c.name] ?? c.flag} {c.name}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {unis.map(u => (
                        <span key={u} className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* E. Career Pathways */}
        {data.pathways.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}
          >
            <h2 className="font-semibold text-base mb-4">{t("majorPages.pathways")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.pathways.map(pathway => (
                <div key={pathway.name} className="rounded-2xl border border-border bg-card p-5">
                  <p className="font-semibold text-sm text-foreground mb-1">{pathway.name}</p>
                  {pathway.description && (
                    <p className="text-xs text-muted-foreground mb-3">{pathway.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {pathway.roles.slice(0, 3).map(role => (
                      <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* F. 12-Month Plan Preview */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <h2 className="font-semibold text-base mb-5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            {t("majorPages.planPreview")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            {[data.twelveMonthPlan.q1, data.twelveMonthPlan.q2].map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{q.title}</p>
                <ul className="space-y-1">
                  {q.focus.map((item, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="mt-0.5 text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
          >
            {t("majorPages.planCta")} →
          </Link>
        </motion.section>

        {/* G. Mini Project */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.35 }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
        >
          <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            {t("majorPages.miniProject")}
          </h2>
          <p className="text-sm text-muted-foreground">{data.miniProject}</p>
        </motion.section>

        {/* H. Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.4 }}
        >
          <div
            style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}
            className="rounded-2xl p-8 text-center"
          >
            <h2 className="text-xl font-bold text-white mb-4">{t("majorPages.readyTitle")}</h2>
            <Link
              href="/questionnaire"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("majorPages.takeQuiz")}
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
