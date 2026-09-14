import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, CalendarDays, CheckCircle2, ExternalLink,
  GraduationCap, Languages, MapPin, Sparkles, Users, Wallet,
} from "lucide-react";
import { getUniversityPage } from "@/lib/universityPages";
import { getRankLabel } from "@/lib/qsRankings";
import { majorToSlug } from "@/lib/majorSlugs";
import { useLang } from "@/contexts/LanguageContext";
import { FloatingOrbs } from "@/components/visual/FloatingOrbs";
import NotFound from "@/pages/not-found";

const fill = (s: string, v: Record<string, string | number>) =>
  Object.entries(v).reduce((a, [k, val]) => a.split(`{${k}}`).join(String(val)), s);

function Fact({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: typeof Users; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="flex items-center gap-2 text-xl font-display font-bold mb-4">
        <Icon className="w-5 h-5 text-primary shrink-0" />{title}
      </h2>
      {children}
    </section>
  );
}

export default function UniversityDetail() {
  const { t, lang } = useLang();
  const params = useParams<{ slug: string }>();
  const page = getUniversityPage(params.slug ?? "");

  useEffect(() => {
    if (page) document.title = `${page.name} — ${t("universities.badge")} | NorthVoy`;
  }, [page, lang, t]);

  if (!page) return <NotFound />;
  const { name, info, qsRank, majors, countryGuide } = page;

  const tuition = [
    info.tuitionDomestic && { label: t("universities.tuitionDomestic"), value: info.tuitionDomestic },
    info.tuitionIntl && { label: t("universities.tuitionIntl"), value: info.tuitionIntl },
    info.tuitionEU && { label: t("universities.tuitionEU"), value: info.tuitionEU },
    info.tuitionNonEU && { label: t("universities.tuitionNonEU"), value: info.tuitionNonEU },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen">
      <div className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}>
        <FloatingOrbs intensity="bold" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mb-5">
              <Link href="/universities" className="hover:text-white transition-colors">{t("universities.indexTitle")}</Link>
              <span>/</span><span className="text-white/80">{name}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> {t("universities.badge")}
              </span>
              {qsRank != null && (
                <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/25">
                  QS {getRankLabel(qsRank)}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white mb-3 leading-tight">{name}</h1>
            <p className="flex items-center gap-1.5 text-white/60 text-sm mb-4">
              <MapPin className="w-4 h-4" />{info.city}, {info.country}
            </p>
            <p className="text-base text-white/70 max-w-2xl leading-relaxed">{info.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key facts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {qsRank != null && <Fact label={t("universities.qsRank")} value={`#${qsRank}`} icon={GraduationCap} />}
          <Fact label={t("universities.founded")} value={String(info.founded)} icon={CalendarDays} />
          <Fact label={t("universities.type")} value={info.type} icon={Building2} />
          {info.totalStudents && <Fact label={t("universities.students")} value={info.totalStudents} icon={Users} />}
          {info.acceptanceRate && <Fact label={t("universities.acceptance")} value={info.acceptanceRate} icon={CheckCircle2} />}
        </div>

        {tuition.length > 0 && (
          <Section title={t("universities.tuitionTitle")} icon={Wallet}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tuition.map(x => (
                <div key={x.label} className="rounded-xl border border-border bg-card p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{x.label}</div>
                  <div className="font-semibold text-sm">{x.value}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {(info.ielts || info.toefl) && (
          <Section title={t("universities.englishTitle")} icon={Languages}>
            <div className="flex flex-wrap gap-3">
              {info.ielts && (
                <div className="rounded-xl border border-border bg-card px-5 py-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">IELTS</div>
                  <div className="font-bold">{info.ielts}</div>
                </div>
              )}
              {info.toefl && (
                <div className="rounded-xl border border-border bg-card px-5 py-3">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">TOEFL</div>
                  <div className="font-bold">{info.toefl}</div>
                </div>
              )}
            </div>
          </Section>
        )}

        <Section title={t("universities.strengthsTitle")} icon={Sparkles}>
          {info.notableFor && <p className="text-sm text-muted-foreground leading-relaxed mb-4">{info.notableFor}</p>}
          <div className="flex flex-wrap gap-2">
            {info.strengths.map(s => (
              <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 font-medium">{s}</span>
            ))}
          </div>
        </Section>

        {/* Majors — the main internal-linking surface */}
        {majors.length > 0 && (
          <Section title={t("universities.majorsTitle")} icon={GraduationCap}>
            <p className="text-sm text-muted-foreground mb-4">{t("universities.majorsIntro")}</p>
            <div className="flex flex-wrap gap-2">
              {majors.map(m => (
                <Link key={m} href={countryGuide ? `/majors/${majorToSlug(m)}/${countryGuide.slug}` : `/majors/${majorToSlug(m)}`}
                  className="text-sm px-3.5 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:text-primary transition-colors">
                  {m}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {countryGuide && (
          <Section title={fill(t("universities.countryTitle"), { country: info.country })} icon={MapPin}>
            <ul className="space-y-2 mb-4">
              {countryGuide.highlights.slice(0, 4).map(h => (
                <li key={h} className="flex gap-2.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{h}</span>
                </li>
              ))}
            </ul>
            <Link href={`/countries/${countryGuide.slug}`} className="text-sm font-semibold text-primary hover:underline">
              {countryGuide.flag} {fill(t("majorCountry.backToCountry"), { country: info.country })} →
            </Link>
          </Section>
        )}

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-7 text-center mb-8">
          <h2 className="font-display font-bold text-lg mb-2">{t("universities.ctaTitle")}</h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">{t("universities.ctaText")}</p>
          <Link href="/questionnaire"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
            {t("universities.ctaButton")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
          <Link href="/universities" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t("universities.backToUniversities")}
          </Link>
          <a href={info.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            {t("universities.officialSite")} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
