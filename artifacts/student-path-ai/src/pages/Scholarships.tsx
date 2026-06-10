import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { useAccount } from "@/contexts/AccountContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap, ExternalLink, Calendar, BookOpen,
  Sparkles, Search, Trophy, Globe, BadgeCheck, Users,
} from "lucide-react";
import { SCHOLARSHIPS, ALL_SCHOLARSHIP_COUNTRIES, type Scholarship } from "@/lib/scholarships";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<Scholarship["type"], string> = {
  full:         "bg-green-100 text-green-700 border-green-200",
  partial:      "bg-blue-100 text-blue-700 border-blue-200",
  living:       "bg-teal-100 text-teal-700 border-teal-200",
  merit:        "bg-violet-100 text-violet-700 border-violet-200",
  "need-based": "bg-amber-100 text-amber-700 border-amber-200",
};

function typeLabel(t: (k: string) => string, type: Scholarship["type"]): string {
  const map: Record<Scholarship["type"], string> = {
    full:         t("scholarships.typeFull"),
    partial:      t("scholarships.typePartial"),
    living:       t("scholarships.typeLiving"),
    merit:        t("scholarships.typeMerit"),
    "need-based": t("scholarships.typeNeedBased"),
  };
  return map[type];
}

function ScholarshipCard({ s, index }: { s: Scholarship; index: number }) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Card className="h-full flex flex-col border border-border/70 hover:border-primary/40 hover:shadow-lg transition-all duration-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-base leading-tight line-clamp-2">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{s.provider}</p>
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0",
              TYPE_COLORS[s.type]
            )}>
              {typeLabel(t, s.type)}
            </span>
          </div>

          {/* Amount chip */}
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Trophy className="w-3 h-3 shrink-0" />
            {s.amount}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-foreground/80">
              <BookOpen className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{s.coverage}</span>
            </div>
            <div className="flex items-start gap-2 text-foreground/80">
              <Users className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{s.eligibility}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs font-medium">{s.deadline}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="text-xs">
                {s.citizenships.length > 0
                  ? s.citizenships.join(", ")
                  : t("scholarships.allNationalities")}
              </span>
            </div>
          </div>

          {/* Countries */}
          <div className="flex flex-wrap gap-1 mt-3">
            {s.countries.slice(0, 4).map(c => (
              <span key={c} className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
            {s.countries.length > 4 && (
              <span className="text-[10px] text-muted-foreground px-1">+{s.countries.length - 4}</span>
            )}
          </div>

          {/* Tags */}
          {s.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {s.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-muted text-muted-foreground border border-border/60 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <Button
            size="sm"
            className="w-full gap-1.5"
            onClick={() => window.open(s.link, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {t("scholarships.applyNow")}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Scholarships() {
  const { t } = useLang();
  const { account } = useAccount();

  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Derive matched scholarships from account's preferred countries + saved result majors
  const matchedScholarships = useMemo(() => {
    const preferredCountries = account?.preferredCountries ?? [];
    const savedMajors = account?.savedResult?.results.map(r => r.major) ?? [];
    if (preferredCountries.length === 0 && savedMajors.length === 0) return [];

    return SCHOLARSHIPS.filter(s => {
      const countryMatch = preferredCountries.length === 0 ||
        s.countries.some(c => preferredCountries.includes(c));
      const majorMatch = s.majors.length === 0 || savedMajors.length === 0 ||
        s.majors.some(m => savedMajors.some(um =>
          um.toLowerCase().includes(m.toLowerCase()) ||
          m.toLowerCase().includes(um.toLowerCase().split(" ")[0])
        ));
      return countryMatch && majorMatch;
    });
  }, [account]);

  const filtered = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      if (countryFilter !== "all" && !s.countries.includes(countryFilter)) return false;
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.tags.some(tag => tag.toLowerCase().includes(q)) ||
          s.countries.some(c => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [countryFilter, typeFilter, search]);

  const types: Array<{ value: Scholarship["type"]; label: string }> = [
    { value: "full", label: t("scholarships.typeFull") },
    { value: "partial", label: t("scholarships.typePartial") },
    { value: "living", label: t("scholarships.typeLiving") },
    { value: "merit", label: t("scholarships.typeMerit") },
    { value: "need-based", label: t("scholarships.typeNeedBased") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center"
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" /> {t("scholarships.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white mb-4">
            {t("scholarships.pageTitle")}
          </h1>
          <p className="text-base text-white/70 max-w-xl mx-auto">
            {t("scholarships.pageSubtitle")}
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-display font-extrabold text-white">{SCHOLARSHIPS.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">{t("scholarships.scholarshipCount")}</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-display font-extrabold text-white">{ALL_SCHOLARSHIP_COUNTRIES.length}</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">{t("nav.countries")}</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Matched section */}
        {matchedScholarships.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <BadgeCheck className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg">{t("scholarships.matchedTitle")}</h2>
                <p className="text-xs text-muted-foreground">{t("scholarships.matchedSubtitle")}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {matchedScholarships.map((s, i) => (
                <ScholarshipCard key={s.id} s={s} index={i} />
              ))}
            </div>
            <div className="border-t border-border/40 mt-10 pt-10">
              <h2 className="font-display font-bold text-lg mb-6">{t("scholarships.allScholarships")}</h2>
            </div>
          </motion.div>
        )}

        {/* No matched state */}
        {matchedScholarships.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">{t("scholarships.noMatchedNote")}</p>
          </motion.div>
        )}

        {/* Filter bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("scholarships.search")}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Country filter */}
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-48 text-sm">
              <SelectValue placeholder={t("scholarships.allCountries")} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border border-border shadow-xl z-[60]">
              <SelectItem value="all">{t("scholarships.allCountries")}</SelectItem>
              {ALL_SCHOLARSHIP_COUNTRIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 text-sm">
              <SelectValue placeholder={t("scholarships.allTypes")} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-900 border border-border shadow-xl z-[60]">
              <SelectItem value="all">{t("scholarships.allTypes")}</SelectItem>
              {types.map(tp => (
                <SelectItem key={tp.value} value={tp.value}>{tp.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Count */}
          <div className="flex items-center text-sm text-muted-foreground self-center sm:ml-auto shrink-0">
            <span className="font-bold text-foreground mr-1">{filtered.length}</span>
            {t("scholarships.scholarshipCount")}
          </div>
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{t("scholarships.noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s, i) => (
              <ScholarshipCard key={s.id} s={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
