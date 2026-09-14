import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, Search, Sparkles, Users } from "lucide-react";
import { allUniversityPages } from "@/lib/universityPages";
import { getRankLabel } from "@/lib/qsRankings";
import { useLang } from "@/contexts/LanguageContext";
import { FloatingOrbs } from "@/components/visual/FloatingOrbs";
import { cn } from "@/lib/utils";

const fill = (s: string, v: Record<string, string | number>) =>
  Object.entries(v).reduce((a, [k, val]) => a.split(`{${k}}`).join(String(val)), s);

export default function Universities() {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");

  const pages = useMemo(() => allUniversityPages(), []);
  const countries = useMemo(
    () => [...new Set(pages.map(p => p.info.country))].sort(),
    [pages],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return pages.filter(p => {
      if (country && p.info.country !== country) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        p.info.city.toLowerCase().includes(needle) ||
        p.info.country.toLowerCase().includes(needle) ||
        p.info.strengths.some(s => s.toLowerCase().includes(needle))
      );
    });
  }, [pages, q, country]);

  // ItemList structured data for rich results / AI engines
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "universities-itemlist-jsonld";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "University guides on NorthVoy",
      numberOfItems: pages.length,
      itemListElement: pages.map((p, i) => ({
        "@type": "ListItem", position: i + 1, name: p.name,
        url: `https://northvoy.com/universities/${p.slug}`,
      })),
    });
    document.head.appendChild(el);
    return () => { document.getElementById("universities-itemlist-jsonld")?.remove(); };
  }, [pages]);

  return (
    <div className="min-h-screen">
      <div className="relative pt-28 pb-14 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)" }}>
        <FloatingOrbs intensity="bold" />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" /> {t("universities.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white mb-4">{t("universities.indexTitle")}</h1>
          <p className="text-base text-white/70 max-w-2xl mx-auto">{t("universities.indexSubtitle")}</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-7">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={q} onChange={e => setQ(e.target.value)}
              placeholder={t("universities.searchPlaceholder")}
              aria-label={t("universities.searchPlaceholder")}
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={country} onChange={e => setCountry(e.target.value)}
            aria-label={t("universities.allCountries")}
            className="h-11 px-3 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 transition-colors sm:w-56"
          >
            <option value="">{t("universities.allCountries")}</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex items-center text-sm text-muted-foreground sm:px-2 shrink-0">
            {fill(t("universities.countTemplate"), { count: filtered.length })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-14">{t("universities.noResults")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p.slug}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}>
                <Link href={`/universities/${p.slug}`}
                  className="block h-full rounded-2xl border border-border bg-card p-5 card-tilt-hover hover:border-primary/40">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-display font-bold text-sm leading-snug">{p.name}</h2>
                    {p.qsRank != null && (
                      <span className={cn(
                        "shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border",
                        p.qsRank <= 50
                          ? "bg-amber-400/15 text-amber-600 dark:text-amber-300 border-amber-400/25"
                          : "bg-primary/10 text-primary border-primary/20",
                      )}>
                        QS {getRankLabel(p.qsRank)}
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />{p.info.city}, {p.info.country}
                  </p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" />{p.majors.length} majors</span>
                    {p.info.totalStudents && <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" />{p.info.totalStudents}</span>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
