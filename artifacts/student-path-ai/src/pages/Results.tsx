import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  getResults, getProfile, getHiddenMatch, getWhyNot, getAnswers,
  clearData, MatchResult, ProfileType, HiddenMatch, WhyNotEntry,
} from "@/lib/store";
import { calculateResults, getProfileType } from "@/lib/matching";
import { generatePDF } from "@/lib/pdf";
import { UNIVERSITIES_BY_COUNTRY } from "@/lib/universities";
import { getQSRank } from "@/lib/qsRankings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Trophy, RefreshCw, BookMarked, CheckCircle2, Lightbulb,
  Briefcase, GraduationCap, ArrowRight, Zap, Star,
  Map, TrendingUp, User, Globe, School, Sparkles,
  SplitSquareHorizontal, CalendarDays, Compass,
  ChevronDown, ChevronUp, XCircle, BadgeCheck, AlertCircle,
  Share2, Check, FlaskConical, Route, Download, UserCircle, Save, Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { tContent } from "@/lib/i18n";
import { useAccount } from "@/contexts/AccountContext";
import { UniversityDrawer } from "@/components/UniversityDrawer";

// ─── Color palettes ───────────────────────────────────────────────────────────
const PROFILE_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  blue:   { bg: "from-blue-500/10 to-sky-400/5",    text: "text-blue-600",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700"   },
  purple: { bg: "from-purple-500/10 to-pink-400/5", text: "text-purple-600", border: "border-purple-200", badge: "bg-purple-100 text-purple-700"},
  amber:  { bg: "from-amber-400/10 to-orange-300/5",text: "text-amber-600",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700"  },
  green:  { bg: "from-green-500/10 to-teal-400/5",  text: "text-green-600",  border: "border-green-200",  badge: "bg-green-100 text-green-700"  },
  teal:   { bg: "from-teal-500/10 to-cyan-400/5",   text: "text-teal-600",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-700"    },
  indigo: { bg: "from-indigo-500/10 to-blue-400/5", text: "text-indigo-600", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
};

const CONFIDENCE_CONFIG = {
  "Strong Match":     { bg: "bg-green-100",  text: "text-green-700",  icon: BadgeCheck,   border: "border-green-200"  },
  "Good Match":       { bg: "bg-blue-100",   text: "text-blue-700",   icon: Star,         border: "border-blue-200"   },
  "Exploratory Match":{ bg: "bg-amber-100",  text: "text-amber-700",  icon: Compass,      border: "border-amber-200"  },
};

const RANK_CONFIG = [
  { labelKey: "results.rank.best",   color: "bg-primary",         borderCls: "border-primary/40 shadow-lg shadow-primary/10" },
  { labelKey: "results.rank.strong", color: "bg-secondary",        borderCls: "border-border/60" },
  { labelKey: "results.rank.good",   color: "bg-muted-foreground", borderCls: "border-border/40" },
];

// ─── Small helpers ─────────────────────────────────────────────────────────────
function SectionHead({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color?: string }) {
  return (
    <div className={cn("flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest", color ?? "text-muted-foreground")}>
      <Icon className="w-3 h-3" />{label}
    </div>
  );
}

function ConfBadge({ level }: { level: MatchResult["confidence"] }) {
  const { t } = useLang();
  const cfg = CONFIDENCE_CONFIG[level];
  const Icon = cfg.icon;
  const label = level === "Strong Match" ? t("results.confidence.strong")
              : level === "Good Match"   ? t("results.confidence.good")
              : t("results.confidence.exploratory");
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", cfg.bg, cfg.text, cfg.border)}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

// ─── QS Badge ─────────────────────────────────────────────────────────────────
function QSBadge({ universityName }: { universityName: string }) {
  const rank = getQSRank(universityName);
  if (!rank) return null;

  const color = rank <= 10 ? "bg-amber-100 text-amber-700 border-amber-200"
    : rank <= 50 ? "bg-violet-100 text-violet-700 border-violet-200"
    : rank <= 100 ? "bg-blue-100 text-blue-700 border-blue-200"
    : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${color} shrink-0`}>
      <Medal className="w-2.5 h-2.5" />
      #{rank}
    </span>
  );
}

// ─── Country Explorer ─────────────────────────────────────────────────────────
function CountryExplorer({ major, countries, onUniversityClick }: { major: string; countries: { name: string; flag: string }[]; onUniversityClick?: (name: string) => void }) {
  const { t } = useLang();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const countryData = UNIVERSITIES_BY_COUNTRY[major] ?? {};
  const availableCountries = countries.filter(c => countryData[c.name]);
  if (availableCountries.length === 0) return null;

  const unis = selectedCountry ? countryData[selectedCountry] ?? [] : [];

  return (
    <div className="border-t border-border/40 px-6 sm:px-8 py-5 bg-sky-50 dark:bg-sky-950/50">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-sky-600 transition-colors w-full"
      >
        <School className="w-4 h-4 text-sky-500" />
        {t("results.sections.exploreByCountry")}
        {open ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>

      {open && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">{t("results.sections.selectCountry")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableCountries.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCountry(c.name === selectedCountry ? null : c.name)}
                className={cn(
                  "text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors font-medium",
                  selectedCountry === c.name
                    ? "bg-sky-500 text-white border-sky-500 shadow-md"
                    : "bg-white dark:bg-sky-950/80 border-sky-200 dark:border-sky-700 text-foreground hover:border-sky-400 hover:text-sky-600 dark:hover:border-sky-500 dark:hover:text-sky-400"
                )}
              >
                {c.flag} {c.name}
              </button>
            ))}
          </div>

          {selectedCountry && unis.length > 0 && (
            <motion.div key={selectedCountry} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-xl border border-sky-200 bg-white dark:bg-sky-950/30 dark:border-sky-800 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-sky-100 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                  <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                    {t("results.sections.topUniversitiesFor")} {major.split(" & ")[0]} {t("results.sections.topUniversitiesIn")} {selectedCountry}
                  </span>
                </div>
                <ul className="divide-y divide-sky-100 dark:divide-sky-800/50">
                  {unis.map((u, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-3 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <button
                        onClick={() => onUniversityClick?.(u)}
                        className="text-sm text-foreground flex-1 text-left hover:text-primary hover:underline transition-colors cursor-pointer"
                      >{u}</button>
                      <QSBadge universityName={u} />
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2 bg-sky-50/50 dark:bg-sky-950/30 border-t border-sky-100 dark:border-sky-800">
                  <p className="text-[10px] text-muted-foreground italic">{t("results.sections.exampleNote")}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Profile Banner ───────────────────────────────────────────────────────────
function ProfileBanner({ profile }: { profile: ProfileType }) {
  const { t, lang } = useLang();
  const c = PROFILE_COLORS[profile.color] ?? PROFILE_COLORS.indigo;
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className={cn("relative rounded-2xl border p-6 sm:p-8 mb-8 bg-gradient-to-br overflow-hidden", c.bg, c.border)}
    >
      <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/20 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0", c.badge)}>{profile.icon}</div>
        <div>
          <div className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1 px-2.5 py-1 rounded-full", c.badge)}>
            <User className="w-3 h-3" />{t("results.sections.yourStudentProfile")}
          </div>
          <h2 className={cn("text-2xl sm:text-3xl font-display font-extrabold", c.text)}>{tContent(lang, "profileTypes", profile.label)}</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">{tContent(lang, "profileTaglines", profile.tagline)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab 1: My Matches ────────────────────────────────────────────────────────
function MajorCard({ result, rank, index, topScore }: { result: MatchResult; rank: typeof RANK_CONFIG[0]; index: number; topScore: number }) {
  const { t, lang } = useLang();
  const [expanded, setExpanded] = useState(index === 0);
  const [pathwayOpen, setPathwayOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const pct = Math.round((result.score / (topScore || 1)) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.12 }}>
      <Card className={cn("relative overflow-hidden border-2 transition-shadow", rank.borderCls)}>
        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", rank.color)} />
        <div className={cn(
          "absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5",
          index === 0 ? "bg-gradient-to-r from-primary to-secondary" : index === 1 ? "bg-secondary" : "bg-muted-foreground"
        )}>
          <Trophy className="w-3 h-3" />{t(rank.labelKey)}
        </div>

        {/* Header */}
        <div className="pl-6 pr-6 pt-6 pb-4 sm:pl-8 sm:pr-8">
          <div className="flex items-start gap-3 pr-28">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5", index === 0 ? "bg-primary/10" : "bg-muted")}>
              <Briefcase className={cn("w-5 h-5", index === 0 ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-display font-bold leading-tight">{tContent(lang, "majors", result.major)}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <ConfBadge level={result.confidence} />
                <span className={cn("text-[10px] font-semibold", result.studyCostColor)}>
                  💰 {t("results.sections.studyCostPrefix")} {result.studyCostLabel}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{result.explanation}</p>
              {/* Visual match bar */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                    className={cn("h-full rounded-full", index === 0 ? "bg-primary" : index === 1 ? "bg-secondary" : "bg-muted-foreground")}
                  />
                </div>
                <span className="text-xs font-bold text-foreground w-10 text-right">{pct}%</span>
              </div>
            </div>
          </div>
          <button onClick={() => setExpanded(e => !e)}
            className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            {expanded
              ? <><ChevronUp className="w-3 h-3" />{t("results.sections.hideDetails")}</>
              : <><ChevronDown className="w-3 h-3" />{t("results.sections.showGuidance")}</>}
          </button>
        </div>

        {/* Expanded */}
        {expanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50">
            {/* 4-col grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              <div className="p-5 sm:p-6">
                <SectionHead icon={CheckCircle2} label={t("results.sections.whyItMatches")} color="text-primary" />
                <ul className="space-y-2">{result.whyItMatches.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/80"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{r}</li>
                ))}</ul>
              </div>
              <div className="p-5 sm:p-6">
                <SectionHead icon={Zap} label={t("results.sections.yourStrengths")} color="text-amber-500" />
                <ul className="space-y-2">{result.userStrengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>{s}
                  </li>
                ))}</ul>
              </div>
              <div className="p-5 sm:p-6 bg-muted/20">
                <SectionHead icon={Lightbulb} label={t("results.sections.skillsToDevelop")} color="text-indigo-500" />
                <ul className="space-y-2">{result.skills.map((sk, i) => (
                  <li key={i} className="text-sm bg-white dark:bg-card border border-border/60 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />{sk}
                  </li>
                ))}</ul>
              </div>
              <div className="p-5 sm:p-6">
                <SectionHead icon={Briefcase} label={t("results.sections.careers")} color="text-green-600" />
                <ul className="space-y-1.5">{result.careers.map((c, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />{c}
                  </li>
                ))}</ul>
              </div>
            </div>

            {/* Pathway Explorer */}
            <div className="border-t border-border/40 px-6 sm:px-8 py-5">
              <button
                onClick={() => setPathwayOpen(o => !o)}
                className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors w-full"
              >
                <Compass className="w-4 h-4 text-primary" />
                {t("results.sections.pathwayExplorerFull")}
                {pathwayOpen ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
              </button>
              {pathwayOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.pathways.map((p, i) => (
                    <div key={i} className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{t("results.sections.pathLabel")} {i + 1}</div>
                      <div className="font-semibold text-sm mb-1">{p.name}</div>
                      <p className="text-xs text-muted-foreground mb-3">{p.description}</p>
                      <div className="flex flex-wrap gap-1">{p.roles.map((r, j) => (
                        <span key={j} className="text-[10px] bg-white dark:bg-card border border-border px-2 py-0.5 rounded-full text-muted-foreground">{r}</span>
                      ))}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Action plan */}
            <div className="border-t border-border/40 px-6 sm:px-8 py-5 bg-gradient-to-r from-primary/5 to-transparent">
              <SectionHead icon={Map} label={t("results.sections.nextStepsLabel")} color="text-primary" />
              <ol className="space-y-3">{result.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/80">
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>{step}
                </li>
              ))}</ol>
            </div>

            {/* Countries & Universities */}
            <div className="border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              <div className="px-6 sm:px-8 py-5">
                <SectionHead icon={Globe} label={t("results.sections.countries")} color="text-sky-600" />
                <div className="flex flex-wrap gap-2">
                  {result.countries.map(c => (
                    <span key={c.name} className="inline-flex items-center gap-1.5 text-xs font-medium bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-full px-3 py-1">
                      {c.flag} {c.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 sm:px-8 py-5">
                <SectionHead icon={School} label={t("results.sections.universities")} color="text-violet-600" />
                <ul className="space-y-1.5">{result.universities.map((u, i) => (
                  <li key={i} className="text-sm flex items-center gap-2 flex-wrap">
                    <GraduationCap className="w-4 h-4 text-violet-400 shrink-0" />
                    <button
                      onClick={() => setSelectedUniversity(u)}
                      className="flex-1 text-left hover:text-primary hover:underline transition-colors cursor-pointer"
                    >{u}</button>
                    <QSBadge universityName={u} />
                  </li>
                ))}</ul>
                <p className="text-[10px] text-muted-foreground mt-3 italic">{t("results.sections.universitiesNote")}</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Medal className="w-2.5 h-2.5" />
                  {t("results.sections.qsNote")}
                </p>
              </div>
            </div>

            {/* Country-Specific University Explorer */}
            <CountryExplorer major={result.major} countries={result.countries} onUniversityClick={setSelectedUniversity} />

            {/* Alternative Route + Mini Project */}
            <div className="border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              <div className="px-6 sm:px-8 py-5 bg-indigo-50/40 dark:bg-indigo-950/20">
                <SectionHead icon={Route} label={t("results.sections.alternativeRoute")} color="text-indigo-600" />
                <p className="text-[10px] text-muted-foreground mb-3 italic">{t("results.sections.alternativeRouteDesc")}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-full px-3 py-1 mb-2">
                  {result.alternativeRoute.major}
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed mt-1">{result.alternativeRoute.reason}</p>
              </div>
              <div className="px-6 sm:px-8 py-5 bg-emerald-50/40 dark:bg-emerald-950/20">
                <SectionHead icon={FlaskConical} label={t("results.sections.miniProject")} color="text-emerald-600" />
                <p className="text-[10px] text-muted-foreground mb-3 italic">{t("results.sections.miniProjectDesc")}</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.miniProject}</p>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
      <UniversityDrawer universityName={selectedUniversity} onClose={() => setSelectedUniversity(null)} />
    </motion.div>
  );
}

// ─── Tab 2: Compare ───────────────────────────────────────────────────────────
const COMPARE_SCHEMES = [
  {
    border:    "border-blue-400/60",
    headerBg:  "bg-gradient-to-br from-blue-600 to-indigo-600",
    badgeBg:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    bullet:    "bg-blue-400",
    rankBg:    "bg-white/20 text-white",
  },
  {
    border:    "border-purple-400/60",
    headerBg:  "bg-gradient-to-br from-purple-600 to-violet-600",
    badgeBg:   "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    bullet:    "bg-purple-400",
    rankBg:    "bg-white/20 text-white",
  },
  {
    border:    "border-amber-400/60",
    headerBg:  "bg-gradient-to-br from-amber-500 to-orange-500",
    badgeBg:   "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    bullet:    "bg-amber-400",
    rankBg:    "bg-white/20 text-white",
  },
] as const;

function CompareTab({ results }: { results: MatchResult[] }) {
  const { t, lang } = useLang();
  const getPct = (r: MatchResult) => parseInt(r.explanation) || 0;

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-bold">{t("results.sections.sideByeSideComparison")}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t("results.sections.topMatchesComparedText")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {results.map((r, i) => {
          const s = COMPARE_SCHEMES[i];
          const pct = getPct(r);
          return (
            <div key={i} className={cn("rounded-2xl border-2 overflow-hidden flex flex-col", s.border)}>
              {/* Coloured header */}
              <div className={cn("p-4 text-white", s.headerBg)}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", s.rankBg)}>#{i + 1}</span>
                  <ConfBadge level={r.confidence} />
                </div>
                <h4 className="font-bold text-sm leading-tight mb-3">{tContent(lang, "majors", r.major)}</h4>
                {/* Match % bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-white/80">{t("results.sections.compareProfileMatch")}</span>
                    <span className="text-sm font-bold">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white/80" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4 bg-card flex-1">
                {/* Why it fits */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{t("results.sections.compareWhyItFits")}</p>
                  <ul className="space-y-1">
                    {r.whyItMatches.slice(0, 3).map((w, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-xs">
                        <span className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", s.bullet)} />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key skills */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{t("results.sections.compareKeySkills")}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.skills.slice(0, 4).map((sk, j) => (
                      <span key={j} className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", s.badgeBg)}>{sk}</span>
                    ))}
                  </div>
                </div>

                {/* Careers */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{t("results.sections.compareCareers")}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.careers.slice(0, 3).map((c, j) => (
                      <span key={j} className="text-[10px] bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Study cost + countries */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{t("results.sections.compareStudyCost")}</p>
                    <span className={cn("text-xs font-semibold", r.studyCostColor)}>{r.studyCostLabel}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">{t("results.sections.compareTopCountries")}</p>
                    <div className="flex gap-0.5 justify-end">
                      {r.countries.slice(0, 3).map((c, j) => (
                        <span key={j} title={c.name} className="text-base leading-none">{c.flag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top universities */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{t("results.sections.compareTopUniversities")}</p>
                  <ul className="space-y-0.5">
                    {r.universities.slice(0, 3).map((u, j) => (
                      <li key={j} className="flex items-start gap-1 text-xs text-muted-foreground">
                        <span className="text-[10px] mt-0.5 shrink-0">🎓</span>{u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 italic">{t("results.sections.allGuidanceOnly")}</p>
    </div>
  );
}

// ─── Tab 3: 12-Month Plan ─────────────────────────────────────────────────────
function TwelveMonthTab({ result }: { result: MatchResult }) {
  const { t, lang } = useLang();
  const plan = result.twelveMonthPlan;
  if (!plan) return null;
  const quarters = [
    { ...plan.q1, color: "border-blue-400", badge: "bg-blue-100 text-blue-700" },
    { ...plan.q2, color: "border-indigo-400", badge: "bg-indigo-100 text-indigo-700" },
    { ...plan.q3, color: "border-purple-400", badge: "bg-purple-100 text-purple-700" },
    { ...plan.q4, color: "border-pink-400", badge: "bg-pink-100 text-pink-700" },
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-bold">{t("results.sections.planNext12Months")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("results.sections.planRoadmapPrefix")} <span className="font-semibold text-primary">{tContent(lang, "majors", result.major)}</span>.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {quarters.map((q, i) => (
          <Card key={i} className={cn("border-l-4 p-6", q.color)}>
            <div className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3", q.badge)}>
              <CalendarDays className="w-3 h-3" />{t("results.sections.quarterLabel")} {i + 1}
            </div>
            <h4 className="font-bold font-display text-sm mb-3">{q.title}</h4>
            <ul className="space-y-2.5">
              {q.focus.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <div className="mt-5 rounded-xl bg-muted/30 border border-border/50 p-4 text-sm text-muted-foreground text-center">
        {t("results.sections.planNote")}
      </div>
    </div>
  );
}

// ─── Tab 4: Explore More ──────────────────────────────────────────────────────
function ExploreTab({ hidden, whyNot }: { hidden: HiddenMatch; whyNot: WhyNotEntry[] }) {
  const { t, lang } = useLang();
  return (
    <div className="space-y-10">
      {/* Hidden Match */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">{t("results.sections.hiddenMatchTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("results.sections.hiddenMatchSub")}</p>
          </div>
        </div>

        <Card className="border-2 border-violet-200 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-400/5 px-6 py-5 border-b border-violet-200/50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{hidden.icon}</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-0.5">{tContent(lang, "hiddenTags", hidden.tag)}</div>
                <h4 className="text-xl font-display font-bold">{tContent(lang, "majors", hidden.major)}</h4>
              </div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <SectionHead icon={Lightbulb} label={t("results.sections.whyMightSurprise")} color="text-violet-600" />
              <p className="text-sm text-foreground/80 leading-relaxed">{tContent(lang, "hiddenReasons", hidden.major)}</p>
            </div>
            <div>
              <SectionHead icon={Zap} label={t("results.sections.keySkillsField")} color="text-violet-600" />
              <ul className="space-y-1.5">
                {hidden.skills.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Why Not */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">{t("results.sections.whyNotFields")}</h3>
            <p className="text-sm text-muted-foreground">{t("results.sections.whyNotSub")}</p>
          </div>
        </div>
        <div className="space-y-4">
          {whyNot.map((entry, i) => (
            <Card key={i} className="p-5 border border-border/60">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{tContent(lang, "majors", entry.major)}</h4>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{tContent(lang, "whyNotReasons", entry.reason)}</p>
                  <div className="flex items-start gap-1.5 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{tContent(lang, "whyNotTips", entry.major)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Locked Overlay ───────────────────────────────────────────────────────────
function LockedOverlay({ message }: { message?: string }) {
  const [, setLocation] = useLocation();
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 dark:bg-background/80 backdrop-blur-sm border border-border/40">
      <div className="text-center px-6 py-8 max-w-xs">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserCircle className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-base mb-1">Create a free account</h3>
        <p className="text-sm text-muted-foreground mb-4">{message ?? "Sign up to unlock all your results and save your progress."}</p>
        <Button size="sm" className="w-full" onClick={() => setLocation("/auth")}>
          Sign up free →
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Results() {
  const [, setLocation] = useLocation();
  const { t, lang } = useLang();
  const { account, saveResult } = useAccount();
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [hidden, setHidden] = useState<HiddenMatch | null>(null);
  const [whyNot, setWhyNot] = useState<WhyNotEntry[] | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get("share");
    if (shareParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(shareParam)));
        const { results: r, hiddenMatch: h, whyNot: w } = calculateResults(decoded);
        const p = getProfileType(decoded);
        setResults(r); setProfile(p); setHidden(h); setWhyNot(w);
        setIsSharedView(true);
        return;
      } catch { /* fall through to localStorage */ }
    }
    const r = getResults(); const p = getProfile();
    const h = getHiddenMatch(); const w = getWhyNot();
    if (!r || r.length === 0) {
      // Fallback: if logged in and has saved results, load from account
      if (account?.savedResult) {
        const { results: ar, profile: ap, hidden: ah, whyNot: aw } = account.savedResult;
        setResults(ar); setProfile(ap); setHidden(ah); setWhyNot(aw);
        return;
      }
      setLocation("/questionnaire"); return;
    }
    setResults(r); setProfile(p); setHidden(h); setWhyNot(w);
  }, [setLocation, account]);

  const handleShare = () => {
    const answers = getAnswers();
    if (!answers) return;
    const encoded = btoa(encodeURIComponent(JSON.stringify(answers)));
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  const handlePDF = () => {
    if (!results || !profile) return;
    setPdfLoading(true);
    setTimeout(() => {
      try {
        generatePDF(results, profile, hidden, whyNot);
      } catch (e) {
        console.error("PDF generation failed:", e);
      }
      setPdfLoading(false);
    }, 50);
  };

  const handleSaveToAccount = () => {
    if (!account || !results || !profile) return;
    const answers = getAnswers();
    if (!answers) return;
    saveResult({
      results,
      profile,
      hidden,
      whyNot,
      answers,
      savedAt: new Date().toISOString(),
    });
    setSavedToAccount(true);
    setTimeout(() => setSavedToAccount(false), 3000);
  };

  if (!results) return null;

  const top = results[0];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">

        {/* Shared view banner */}
        {isSharedView && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-5 py-3 text-sm text-amber-800 dark:text-amber-300">
            <Share2 className="w-4 h-4 shrink-0" />
            <span>{t("results.sections.sharedViewBanner")}</span>
          </div>
        )}

        {/* Page header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 rotate-3">
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
            {t("results.sections.pageTitle")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto">
            {t("results.sections.pageSubtitle")}
          </motion.p>
        </div>

        {/* Profile banner */}
        {profile && <ProfileBanner profile={profile} />}

        {/* Quick Overview — Visual Score Bars */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {results.map((r, i) => {
            const topScore = results[0]?.score ?? 1;
            const pct = Math.round((r.score / topScore) * 100);
            const barColor = i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : "bg-muted-foreground";
            const rankLabel = i === 0 ? t("results.rank.best") : i === 1 ? t("results.rank.strong") : t("results.rank.good");
            const locked = !account && i > 0;
            return (
              <Card key={r.major} className={cn(
                "p-5 border-2 transition-shadow hover:shadow-md relative overflow-hidden",
                i === 0 ? "border-primary/40 shadow-lg shadow-primary/10" : "border-border/60",
                locked && "select-none"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    i === 0 ? "bg-primary/10 text-primary" : i === 1 ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                  )}>
                    #{i + 1} {rankLabel}
                  </span>
                  <span className="text-2xl font-display font-extrabold">{pct}%</span>
                </div>
                <h4 className="font-display font-bold text-sm mb-3 leading-tight">{tContent(lang, "majors", r.major)}</h4>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                    className={cn("h-full rounded-full", barColor)}
                  />
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <ConfBadge level={r.confidence} />
                </div>
                {locked && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                        <UserCircle className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Sign up to unlock</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="matches" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="h-auto p-1 gap-1 flex-wrap justify-center bg-muted border border-border/60">
              <TabsTrigger value="matches" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md">
                <Star className="w-3.5 h-3.5" />{t("results.tabs.matches")}
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md">
                <SplitSquareHorizontal className="w-3.5 h-3.5" />{t("results.tabs.compare")}
              </TabsTrigger>
              <TabsTrigger value="plan" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md">
                <CalendarDays className="w-3.5 h-3.5" />{t("results.tabs.plan")}
              </TabsTrigger>
              <TabsTrigger value="explore" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md">
                <Sparkles className="w-3.5 h-3.5" />{t("results.tabs.explore")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="matches">
            <div className="space-y-5">
              {results.map((r, i) => (
                <div key={r.major} className={cn("relative", !account && i > 0 && "pointer-events-none")}>
                  <div className={cn(!account && i > 0 && "blur-sm select-none")}>
                    <MajorCard result={r} rank={RANK_CONFIG[i]} index={i} topScore={results[0]?.score ?? 1} />
                  </div>
                  {!account && i > 0 && (
                    <LockedOverlay message="Sign up free to see all your matched majors." />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div className="relative">
              <div className={cn(!account && "blur-sm pointer-events-none select-none")}>
                <Card className="p-6 sm:p-8">
                  <CompareTab results={results} />
                </Card>
              </div>
              {!account && <LockedOverlay message="Sign up free to compare your matched majors side by side." />}
            </div>
          </TabsContent>

          <TabsContent value="plan">
            <div className="relative">
              <div className={cn(!account && "blur-sm pointer-events-none select-none")}>
                <Card className="p-6 sm:p-8">
                  {top.twelveMonthPlan ? (
                    <TwelveMonthTab result={top} />
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t("results.sections.planNotAvailable")}</p>
                  )}
                </Card>
              </div>
              {!account && <LockedOverlay message="Sign up free to unlock your personalised 12-month action plan." />}
            </div>
          </TabsContent>

          <TabsContent value="explore">
            <div className="relative">
              <div className={cn(!account && "blur-sm pointer-events-none select-none")}>
                <Card className="p-6 sm:p-8">
                  {hidden && whyNot
                    ? <ExploreTab hidden={hidden} whyNot={whyNot} />
                    : <p className="text-center text-muted-foreground py-8">{t("results.sections.noData")}</p>
                  }
                </Card>
              </div>
              {!account && <LockedOverlay message="Sign up free to explore your hidden match and alternative paths." />}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-3 border-t border-border/40 pt-10 flex-wrap">
          {!isSharedView && (
            <Button variant="outline" size="lg" onClick={() => { clearData(); setLocation("/questionnaire"); }}>
              <RefreshCw className="w-4 h-4 mr-2" />{t("results.retake")}
            </Button>
          )}
          {!isSharedView && (
            <Button variant="outline" size="lg" onClick={handleShare} title={t("results.shareTooltip")}>
              {shareCopied
                ? <><Check className="w-4 h-4 mr-2 text-green-500" />{t("results.shareCopied")}</>
                : <><Share2 className="w-4 h-4 mr-2" />{t("results.shareBtn")}</>}
            </Button>
          )}
          {!isSharedView && account && (
            <Button variant="outline" size="lg" onClick={handleSaveToAccount} title={t("results.sections.saveToAccount")}>
              {savedToAccount
                ? <><Check className="w-4 h-4 mr-2 text-green-500" />{t("results.sections.saved")}</>
                : <><Save className="w-4 h-4 mr-2" />{t("results.sections.saveToAccount")}</>}
            </Button>
          )}
          {!isSharedView && !account && (
            <Button variant="outline" size="lg" onClick={() => setLocation("/auth")} title={t("results.sections.signInToSave")}>
              <UserCircle className="w-4 h-4 mr-2" />{t("results.sections.signInToSave")}
            </Button>
          )}
          <Button size="lg" onClick={handlePDF} disabled={pdfLoading}>
            {pdfLoading
              ? <><Download className="w-4 h-4 mr-2 animate-bounce" />{t("results.sections.generatingPDF")}</>
              : <><Download className="w-4 h-4 mr-2" />{t("results.sections.downloadPDF")}</>}
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">{t("results.disclaimer")}</p>
      </div>
    </div>
  );
}
