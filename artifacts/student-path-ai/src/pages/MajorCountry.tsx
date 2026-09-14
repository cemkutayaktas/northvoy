import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Briefcase, CheckCircle2, ExternalLink,
  GraduationCap, MapPin, Sparkles, Wallet,
} from "lucide-react";
import { MAJOR_DATA } from "@/lib/matching";
import { GROWTH_COLOR, fmtK } from "@/lib/salaryData";
import { getQSRank, getRankLabel } from "@/lib/qsRankings";
import { getCombo, countriesForMajor, majorsForCountry } from "@/lib/majorCountry";
import { majorToSlug } from "@/lib/majorSlugs";
import { useLang } from "@/contexts/LanguageContext";
import { FloatingOrbs } from "@/components/visual/FloatingOrbs";
import NotFound from "@/pages/not-found";

const fill = (s: string, vars: Record<string, string | number>) =>
  Object.entries(vars).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), s);

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Wallet; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-display font-bold mb-4">
        <Icon className="w-5 h-5 text-primary shrink-0" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function MajorCountry() {
  const { t, lang } = useLang();
  const params = useParams<{ slug: string; country: string }>();
  const combo = getCombo(params.slug ?? "", params.country ?? "");

  const major = combo?.major ?? "";
  const countryName = combo?.country.name ?? "";

  useEffect(() => {
    if (!combo) return;
    document.title = `${fill(t("majorCountry.title"), { major, country: countryName })} — NorthVoy`;
  }, [combo, lang, major, countryName, t]);

  if (!combo) return <NotFound />;

  const { country, universities, salary } = combo;
  const data = MAJOR_DATA[combo.major];
  const v = { major, country: countryName };

  const otherCountries = countriesForMajor(combo.major).filter(c => c.slug !== country.slug);
  const otherMajors = majorsForCountry(country).filter(m => m !== combo.major).slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}>
        <FloatingOrbs intensity="bold" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mb-5">
              <Link href="/majors" className="hover:text-white transition-colors">{t("majorCountry.breadcrumbMajors")}</Link>
              <span>/</span>
              <Link href={`/majors/${combo.majorSlug}`} className="hover:text-white transition-colors">{major}</Link>
              <span>/</span>
              <span className="text-white/80">{country.name}</span>
            </nav>

            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> {t("majorCountry.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white mb-4 leading-tight">
              <span className="mr-2">{country.flag}</span>
              {fill(t("majorCountry.title"), v)}
            </h1>
            <p className="text-base text-white/70 max-w-2xl">{t("majorCountry.subtitle")}</p>

            {/* Quick facts */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-7">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{t("majorCountry.tuitionLabel")}</div>
                <div className="text-sm font-bold text-white">{country.avgTuitionRange}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{t("majorCountry.livingLabel")}</div>
                <div className="text-sm font-bold text-white">{country.costOfLivingRange}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{t("majorCountry.universitiesTitle").split(" ")[0]}</div>
                <div className="text-sm font-bold text-white">{universities.length}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-base text-muted-foreground leading-relaxed mb-10">
          {fill(t("majorCountry.introTemplate"), v)}
        </p>

        {/* Universities */}
        <Section title={fill(t("majorCountry.universitiesTitle"), v)} icon={GraduationCap}>
          <p className="text-sm text-muted-foreground mb-5">{fill(t("majorCountry.universitiesIntro"), v)}</p>
          <div className="space-y-3">
            {universities.map((u, i) => {
              const rank = u.qsRank ?? getQSRank(u.name);
              return (
                <motion.div key={u.name}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
                  className="rounded-xl border border-border bg-card p-5 card-tilt-hover">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display font-bold text-base leading-snug">{u.name}</h3>
                    {rank != null && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        QS {getRankLabel(rank)}
                      </span>
                    )}
                  </div>
                  <dl className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
                    {u.city && <div><dt className="inline font-semibold">{t("majorCountry.cityLabel")}: </dt><dd className="inline">{u.city}</dd></div>}
                    {u.tuitionIntl && <div><dt className="inline font-semibold">{t("majorCountry.intlFeeLabel")}: </dt><dd className="inline">{u.tuitionIntl}</dd></div>}
                    {u.acceptanceRate && <div><dt className="inline font-semibold">{t("majorCountry.acceptanceLabel")}: </dt><dd className="inline">{u.acceptanceRate}</dd></div>}
                    {u.ielts && <div><dt className="inline font-semibold">{t("majorCountry.ieltsLabel")}: </dt><dd className="inline">{u.ielts}</dd></div>}
                  </dl>
                  {u.website && (
                    <a href={u.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline">
                      {t("majorCountry.visitSite")} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Costs */}
        <Section title={t("majorCountry.costsTitle")} icon={Wallet}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: t("majorCountry.tuitionLabel"), value: country.avgTuitionRange },
              { label: t("majorCountry.livingLabel"), value: country.costOfLivingRange },
              { label: t("majorCountry.currencyLabel"), value: country.currency },
            ].map(x => (
              <div key={x.label} className="rounded-xl border border-border bg-muted/40 p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{x.label}</div>
                <div className="font-bold text-sm">{x.value}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Salary */}
        {salary && (
          <Section title={t("majorCountry.salaryTitle")} icon={Briefcase}>
            <p className="text-sm text-muted-foreground mb-3">
              {fill(t("majorCountry.salaryTemplate"), {
                low: fmtK(salary.avgSalaryUSD[0]), high: fmtK(salary.avgSalaryUSD[1]), growth: salary.jobGrowthPct,
              })}{" "}
              <span className={`font-semibold ${GROWTH_COLOR[salary.growthLabel]}`}>{salary.growthLabel}</span>
            </p>
            <div className="text-sm">
              <span className="font-semibold">{t("majorCountry.topRolesLabel")}: </span>
              <span className="text-muted-foreground">{salary.topRoles.join(", ")}</span>
            </div>
          </Section>
        )}

        {/* Why this country */}
        <Section title={fill(t("majorCountry.whyTitle"), v)} icon={MapPin}>
          <ul className="space-y-2">
            {country.highlights.map(h => (
              <li key={h} className="flex gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{h}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Visa */}
        <Section title={t("majorCountry.visaTitle")} icon={CheckCircle2}>
          <p className="text-sm text-muted-foreground leading-relaxed">{t(country.visaInfoKey)}</p>
        </Section>

        {/* Skills + careers */}
        <Section title={t("majorCountry.skillsTitle")} icon={Sparkles}>
          <div className="flex flex-wrap gap-2">
            {data.skills.map(s => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 font-medium">{s}</span>
            ))}
          </div>
        </Section>

        <Section title={fill(t("majorCountry.careersTitle"), v)} icon={Briefcase}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.careers.map(c => (
              <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5 text-primary/60 mt-1 shrink-0" />{c}
              </li>
            ))}
          </ul>
        </Section>

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-7 text-center mb-10">
          <h2 className="font-display font-bold text-lg mb-2">{fill(t("majorCountry.ctaTitle"), v)}</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">{fill(t("majorCountry.ctaText"), v)}</p>
          <Link href="/questionnaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
            {t("majorCountry.ctaButton")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cross-links — keeps these pages discoverable and non-orphaned */}
        {otherCountries.length > 0 && (
          <Section title={fill(t("majorCountry.otherCountriesTitle"), v)} icon={GraduationCap}>
            <div className="flex flex-wrap gap-2">
              {otherCountries.map(c => (
                <Link key={c.slug} href={`/majors/${combo.majorSlug}/${c.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors">
                  <span>{c.flag}</span> {c.name}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {otherMajors.length > 0 && (
          <Section title={fill(t("majorCountry.otherMajorsTitle"), v)} icon={GraduationCap}>
            <div className="flex flex-wrap gap-2">
              {otherMajors.map(m => (
                <Link key={m} href={`/majors/${majorToSlug(m)}/${country.slug}`}
                  className="text-sm px-3.5 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors">
                  {m}
                </Link>
              ))}
            </div>
          </Section>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Link href={`/majors/${combo.majorSlug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> {fill(t("majorCountry.backToMajor"), v)}
          </Link>
          <Link href={`/countries/${country.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> {fill(t("majorCountry.backToCountry"), v)}
          </Link>
        </div>
      </div>
    </div>
  );
}
