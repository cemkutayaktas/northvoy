import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Briefcase, GraduationCap } from "lucide-react";
import { MAJORS } from "@/lib/matching";
import { SALARY_DATA, GROWTH_COLOR, salaryChipText } from "@/lib/salaryData";
import { majorToSlug } from "@/lib/majorSlugs";
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
  "Electrical & Electronics Engineering": "⚡",
  "Artificial Intelligence & Robotics": "🤖",
  "Biotechnology & Genetic Engineering": "🧬",
  "Dentistry & Oral Health": "🦷",
  "Veterinary Medicine & Animal Sciences": "🐾",
  "Music & Performing Arts": "🎵",
  "Sports Science & Physiotherapy": "🏃",
  "Hospitality & Tourism Management": "🏨",
  "Aerospace & Aeronautical Engineering": "🚀",
  "Physics & Astronomy": "🔭",
};

export default function Majors() {
  const { t } = useLang();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}
        className="pt-24 pb-16 px-4"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              {t("majorPages.pageTitle")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("majorPages.pageTitle")}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {t("majorPages.pageSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MAJORS.map((major, i) => {
            const salary = SALARY_DATA[major];
            const slug = majorToSlug(major);
            return (
              <motion.div
                key={major}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col"
              >
                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + name */}
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl leading-none shrink-0">{MAJOR_ICONS[major] ?? "🎓"}</span>
                    <h2 className="text-sm font-semibold text-foreground leading-snug">{major}</h2>
                  </div>

                  {/* Salary chip */}
                  {salary && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {salaryChipText(salary)}
                      </span>
                      <span className={`text-xs font-semibold ${GROWTH_COLOR[salary.growthLabel]}`}>
                        {salary.growthLabel}
                      </span>
                    </div>
                  )}

                  {/* Top 2 careers */}
                  {salary && (
                    <ul className="space-y-1 mb-4 flex-1">
                      {salary.topRoles.slice(0, 2).map(role => (
                        <li key={role} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Briefcase className="w-3 h-3 shrink-0 text-primary/60" />
                          {role}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA */}
                  <Link
                    href={`/majors/${slug}`}
                    className="mt-auto inline-flex items-center justify-center gap-1 w-full py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {t("majorPages.exploreBtn")}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA bar */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-border bg-muted/40 p-8 text-center">
          <p className="text-muted-foreground mb-4 text-sm">{t("majorPages.takeQuizCta")}</p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {t("majorPages.takeQuiz")}
          </Link>
        </div>
      </section>
    </div>
  );
}
