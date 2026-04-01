import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAJORS, MAJOR_DATA } from "@/lib/matching";
import { tContent } from "@/lib/i18n";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SplitSquareHorizontal, X, CheckCircle2, Briefcase, Zap,
  Globe, DollarSign, Route, Search, RotateCcw,
} from "lucide-react";

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

const COST_COLOR: Record<string, string> = {
  "Low": "text-green-600",
  "Low–Moderate": "text-green-600",
  "Moderate": "text-amber-600",
  "Moderate–High": "text-amber-600",
  "High": "text-red-500",
};

const COL_COLORS = [
  { bg: "from-blue-500/10 to-sky-400/5", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", header: "bg-blue-50 dark:bg-blue-950/30" },
  { bg: "from-purple-500/10 to-pink-400/5", border: "border-purple-200", badge: "bg-purple-100 text-purple-700", header: "bg-purple-50 dark:bg-purple-950/30" },
  { bg: "from-amber-400/10 to-orange-300/5", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", header: "bg-amber-50 dark:bg-amber-950/30" },
];

const MAX_SELECTIONS = 3;

export default function Compare() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = MAJORS.filter(m =>
    tContent(lang, "majors", m).toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (major: string) => {
    if (selected.includes(major)) {
      setSelected(prev => prev.filter(m => m !== major));
    } else if (selected.length < MAX_SELECTIONS) {
      setSelected(prev => [...prev, major]);
    }
  };

  const canCompare = selected.length >= 2;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <SplitSquareHorizontal className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">{t("compare.pageTitle")}</h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            {t("compare.pageDesc")}
          </p>
        </motion.div>

        {/* Selection bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("compare.searchPlaceholder")}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium shrink-0">
            {selected.length}/{MAX_SELECTIONS} {t("compare.selectedLabel")}
          </span>
          {selected.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSelected([])}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> {t("compare.clearBtn")}
            </Button>
          )}
        </div>

        {/* Selected pills */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mb-5 flex flex-wrap gap-2"
            >
              {selected.map((m, i) => (
                <motion.span key={m} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border", COL_COLORS[i].badge, COL_COLORS[i].border)}
                >
                  {MAJOR_ICONS[m]} {tContent(lang, "majors", m)}
                  <button onClick={() => toggle(m)} className="ml-0.5 hover:opacity-70 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Major grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-10">
          {filtered.map(major => {
            const isSelected = selected.includes(major);
            const selIdx = selected.indexOf(major);
            const isDisabled = !isSelected && selected.length >= MAX_SELECTIONS;
            const col = isSelected ? COL_COLORS[selIdx] : null;
            return (
              <button
                key={major}
                onClick={() => toggle(major)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-medium transition-all",
                  isSelected
                    ? cn("border-2", col!.border, `bg-gradient-to-br ${col!.bg}`)
                    : isDisabled
                      ? "border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
                      : "border-border bg-background hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm cursor-pointer"
                )}
              >
                <span className="text-xl shrink-0">{MAJOR_ICONS[major]}</span>
                <span className="leading-tight">{tContent(lang, "majors", major)}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 ml-auto shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Comparison table */}
        <AnimatePresence>
          {canCompare && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("compare.comparisonLabel")}</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <div className="overflow-x-auto">
                <div className={cn("grid gap-4 min-w-[560px]", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
                  {selected.map((major, i) => {
                    const data = MAJOR_DATA[major as keyof typeof MAJOR_DATA];
                    const col = COL_COLORS[i];
                    return (
                      <motion.div key={major} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className={cn("border-2 overflow-hidden", col.border)}>
                          {/* Card header */}
                          <div className={cn("px-5 py-4 border-b", col.header, col.border)}>
                            <div className="text-3xl mb-2">{MAJOR_ICONS[major]}</div>
                            <h3 className="font-display font-bold text-sm leading-snug">{tContent(lang, "majors", major)}</h3>
                            <span className={cn("text-xs font-semibold mt-1 inline-block", COST_COLOR[data.studyCostLabel] ?? "text-amber-600")}>
                              <DollarSign className="inline w-3 h-3 -mt-0.5" /> {data.studyCostLabel}
                            </span>
                          </div>

                          <div className="p-5 space-y-5">
                            {/* Skills */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-2">
                                <Zap className="w-3 h-3" /> {t("compare.keySkills")}
                              </div>
                              <ul className="space-y-1">
                                {data.skills.slice(0, 5).map((s, j) => (
                                  <li key={j} className="text-xs flex items-start gap-1.5 text-foreground/80">
                                    <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />{s}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Careers */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 mb-2">
                                <Briefcase className="w-3 h-3" /> {t("compare.careers")}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {data.careers.slice(0, 6).map((c, j) => (
                                  <span key={j} className="text-[10px] bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">{c}</span>
                                ))}
                              </div>
                            </div>

                            {/* Countries */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-sky-600 mb-2">
                                <Globe className="w-3 h-3" /> {t("compare.topCountries")}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {data.countries.slice(0, 4).map(c => (
                                  <span key={c.name} className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                                    {c.flag} {c.name.split(" ")[c.name.split(" ").length - 1]}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Pathways */}
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-2">
                                <Route className="w-3 h-3" /> {t("compare.careerPaths")}
                              </div>
                              <ul className="space-y-1">
                                {data.pathways.map((p, j) => (
                                  <li key={j} className="text-xs flex items-start gap-1.5 text-foreground/80">
                                    <span className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />{p.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!canCompare && (
          <div className="text-center py-16 text-muted-foreground">
            <SplitSquareHorizontal className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{t("compare.selectPrompt")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
