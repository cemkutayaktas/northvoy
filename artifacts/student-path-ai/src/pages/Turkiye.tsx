import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TURKISH_UNIVERSITIES, ABROAD_SCHOLARSHIPS, YKS_MAJOR_MAP, YKS_TYPE_INFO,
  type YKSType, type TurkishUniversity, type AbroadScholarship,
} from "@/lib/turkiye";
import {
  GraduationCap, MapPin, ExternalLink, BookOpen,
  Sparkles, ArrowRight, Star, Filter,
  ChevronDown, ChevronUp, FlaskConical,
} from "lucide-react";

// ─── Language-aware labels ────────────────────────────────────────────────────
function useLabels() {
  const { lang } = useLang();
  const tr = lang === "tr";
  const de = lang === "de";
  return {
    heroTitle:      tr ? "Türkiye Rehberi"                  : de ? "Türkei-Hub"                          : "Turkey Hub",
    heroSub:        tr ? "Türkiye'de veya yurt dışında okumayı planlayan öğrenciler için kapsamlı rehber."
                       : de ? "Der umfassende Leitfaden für Studierende in der Türkei oder im Ausland."
                       : "The complete guide for students planning to study in Turkey or abroad.",
    tabTurkey:      tr ? "🇹🇷 Türkiye'de Oku"              : de ? "🇹🇷 In der Türkei studieren"         : "🇹🇷 Study in Turkey",
    tabAbroad:      tr ? "🌍 Yurt Dışında Oku"              : de ? "🌍 Im Ausland studieren"             : "🌍 Study Abroad",
    filterAll:      tr ? "Tüm Puan Türleri"                 : de ? "Alle Typen"                          : "All YKS Types",
    stateUniv:      tr ? "Devlet Üniversitesi"              : de ? "Staatlich"                           : "State University",
    foundUniv:      tr ? "Vakıf Üniversitesi"               : de ? "Stiftungsuniversität"                : "Foundation University",
    strongProgs:    tr ? "Güçlü Programlar"                 : de ? "Starke Programme"                   : "Strong Programs",
    qsRank:         tr ? "QS Sıralaması"                    : de ? "QS-Rang"                             : "QS Rank",
    tuitionLbl:     tr ? "Yıllık Ücret"                     : de ? "Jahresgebühr"                        : "Annual Tuition",
    scholarBadge:   tr ? "Burs İmkânı"                      : de ? "Stipendien verfügbar"                : "Scholarships Available",
    visitSite:      tr ? "Siteyi Ziyaret Et"                : de ? "Website besuchen"                    : "Visit Website",
    langLbl:        tr ? "Eğitim Dili"                      : de ? "Unterrichtssprache"                  : "Instruction Language",
    foundedLbl:     tr ? "Kuruluş"                          : de ? "Gegründet"                           : "Founded",
    allCities:      tr ? "Tüm Şehirler"                     : de ? "Alle Städte"                         : "All Cities",
    shown:          tr ? "gösteriliyor"                      : de ? "angezeigt"                           : "shown",
    univCount:      (n: number) => tr ? `${n} üniversite`   : de ? `${n} Universitäten`                  : `${n} universities`,
    majorMapTitle:  tr ? "Bölüm → YKS Puan Türü"           : de ? "Fach → YKS-Typ"                      : "Major → YKS Type",
    majorMapSub:    tr ? "20 akademik bölümün YKS puan türü gereksinimleri."
                       : de ? "YKS-Anforderungen für alle 20 akademischen Fächer."
                       : "YKS score type requirements for all 20 academic majors.",
    showAll:        tr ? "Tüm bölümleri göster"             : de ? "Alle anzeigen"                       : "Show all majors",
    showLess:       tr ? "Daha az göster"                   : de ? "Weniger anzeigen"                    : "Show less",
    abroadTitle:    tr ? "Yurt Dışı Burs İmkânları"        : de ? "Stipendien für das Ausland"          : "Scholarships for Studying Abroad",
    abroadSub:      tr ? "Uluslararası eğitiminizi destekleyecek finansman seçenekleri."
                       : de ? "Finanzierungsoptionen für Ihr internationales Studium."
                       : "Funding options to support your international education journey.",
    deadline:       tr ? "Başvuru Tarihi"                   : de ? "Bewerbungsfrist"                     : "Application Deadline",
    learnMore:      tr ? "Daha Fazla Bilgi"                 : de ? "Mehr erfahren"                       : "Learn More",
    tipsTitle:      tr ? "Yurt Dışı Başvuru İpuçları"      : de ? "Tipps für Bewerbungen im Ausland"    : "Tips for Applying Abroad",
    tips:           tr ? [
      "Başvuru yapmadan en az 1 yıl önce hazırlığa başlayın — belgeler zaman alır.",
      "TOEFL veya IELTS sınavına girecekseniz en az 3 ay önceden hazırlanmaya başlayın.",
      "Almanya, Hollanda gibi ülkelerdeki devlet üniversiteleri çoğunlukla ücretsiz veya çok düşük ücretlidir.",
      "Erasmus+ için üniversitenizin Uluslararası Ofisi ile iletişime geçin.",
      "Burs reddi kesin değildir — her yıl tekrar başvurmaktan çekinmeyin.",
    ] : de ? [
      "Beginnen Sie mindestens 1 Jahr vor der Bewerbung mit der Vorbereitung.",
      "Viele staatliche Universitäten in Deutschland und den Niederlanden sind kostenlos.",
      "Bereiten Sie sich mindestens 3 Monate vor dem Sprachtest vor.",
      "Wenden Sie sich an das internationale Büro Ihrer Universität für Erasmus+.",
      "Eine Absage ist nicht endgültig — bewerben Sie sich jedes Jahr erneut.",
    ] : [
      "Start preparing at least 1 year before applying — gathering documents takes time.",
      "Many state universities in Germany and the Netherlands are free for international students.",
      "Prepare for TOEFL or IELTS at least 3 months before your test date.",
      "Contact your university's International Office to apply for Erasmus+ exchanges.",
      "A rejection is not final — scholarship pools change, so reapply every year.",
    ],
    ctaTitle:       tr ? "Hangi bölüm sana uygun?"         : de ? "Welches Fach passt zu Ihnen?"        : "Not sure which major suits you?",
    ctaSub:         tr ? "9 soruluk testimizi çözerek ideal akademik yolunu keşfet, ardından doğru üniversiteyi bul."
                       : de ? "Machen Sie unser Quiz, um Ihren akademischen Weg zu entdecken."
                       : "Take our 9-question quiz to find your ideal path, then come back to find the right university.",
    ctaBtn:         tr ? "Testi Başlat"                     : de ? "Quiz starten"                        : "Take the Quiz",
  };
}

// ─── University Card ──────────────────────────────────────────────────────────
function UniversityCard({ uni }: { uni: TurkishUniversity }) {
  const L = useLabels();
  const found = uni.type === "foundation";
  const headerCls = found
    ? "bg-violet-50/70 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800"
    : "bg-sky-50/70 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800";
  const cardBorder = found ? "border-violet-200 dark:border-violet-800" : "border-sky-200 dark:border-sky-800";
  const typeBadge  = found
    ? "bg-violet-100 text-violet-700 border-violet-200"
    : "bg-sky-100 text-sky-700 border-sky-200";

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn("overflow-hidden border-2 hover:shadow-lg transition-all duration-200 h-full flex flex-col", cardBorder)}>
        {/* Header */}
        <div className={cn("px-5 py-4 border-b flex items-start gap-3", headerCls)}>
          <span className="text-3xl shrink-0 mt-0.5">{uni.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", typeBadge)}>
                {found ? L.foundUniv : L.stateUniv}
              </span>
              {uni.scholarships && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  🏅 {L.scholarBadge}
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-sm leading-snug">{uni.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 shrink-0" />{uni.city}
              <span className="mx-1">·</span>{L.foundedLbl} {uni.founded}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* YKS badges */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">YKS</p>
            <div className="flex flex-wrap gap-1">
              {uni.yksTypes.map(t => (
                <span key={t} className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", YKS_TYPE_INFO[t].badge)}>
                  {YKS_TYPE_INFO[t].icon} {t}
                </span>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{L.strongProgs}</p>
            <div className="flex flex-wrap gap-1">
              {uni.programs.slice(0, 4).map(p => (
                <span key={p} className="text-[10px] bg-muted text-foreground/70 border border-border px-2 py-0.5 rounded-full">{p}</span>
              ))}
              {uni.programs.length > 4 && (
                <span className="text-[10px] text-muted-foreground px-1">+{uni.programs.length - 4}</span>
              )}
            </div>
          </div>

          {/* Tuition + Language */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/30 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{L.tuitionLbl}</p>
              <p className="font-semibold text-foreground text-[11px]">{uni.tuition}</p>
            </div>
            <div className="bg-muted/30 rounded-lg px-3 py-2">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5">{L.langLbl}</p>
              <p className="font-semibold text-foreground">{uni.languages.join(" / ")}</p>
            </div>
          </div>

          {/* QS rank */}
          {uni.qsRank && (
            <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-1.5">
              <Star className="w-3 h-3 shrink-0" />
              <span><span className="font-bold">{L.qsRank}:</span> #{uni.qsRank}</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed italic">{uni.note}</p>

          <a href={uni.website} target="_blank" rel="noopener noreferrer" className="mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              {L.visitSite} <ExternalLink className="w-3 h-3 ml-1.5" />
            </Button>
          </a>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Scholarship Card ─────────────────────────────────────────────────────────
function ScholarshipCard({ s }: { s: AbroadScholarship }) {
  const L = useLabels();
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-5 border border-border/70 hover:border-primary/40 hover:shadow-md transition-all h-full flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{s.flag}</span>
          <div>
            <h3 className="font-display font-bold text-sm">{s.name}</h3>
            <p className="text-xs text-muted-foreground">{s.country} · {s.level}</p>
          </div>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">{s.description}</p>
        {s.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg px-3 py-1.5">
            <BookOpen className="w-3 h-3 shrink-0" />
            <span><span className="font-bold">{L.deadline}:</span> {s.deadline}</span>
          </div>
        )}
        <a href={s.website} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <Button variant="outline" size="sm" className="w-full">
            {L.learnMore} <ExternalLink className="w-3 h-3 ml-1.5" />
          </Button>
        </a>
      </Card>
    </motion.div>
  );
}

// ─── YKS Filter Button ────────────────────────────────────────────────────────
function YKSBtn({ type, active, onClick, L }: { type: YKSType | "ALL"; active: boolean; onClick: () => void; L: ReturnType<typeof useLabels> }) {
  const { lang } = useLang();
  if (type === "ALL") {
    return (
      <button onClick={onClick} className={cn(
        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
        active ? "bg-foreground text-background border-foreground" : "bg-background border-border text-foreground hover:border-primary hover:text-primary"
      )}>
        <Filter className="w-3.5 h-3.5" /> {L.filterAll}
      </button>
    );
  }
  const info = YKS_TYPE_INFO[type];
  const lbl = lang === "tr" ? info.labelTR : lang === "de" ? info.labelDE : info.label;
  return (
    <button onClick={onClick} className={cn(
      "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
      active ? cn(info.bg, info.border, info.color) : "bg-background border-border text-foreground hover:border-primary hover:text-primary"
    )}>
      <span>{info.icon}</span> {lbl}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Turkiye() {
  const [, setLocation] = useLocation();
  const { lang } = useLang();
  const L = useLabels();
  const [tab, setTab]               = useState<"turkey" | "abroad">("turkey");
  const [yks, setYks]               = useState<YKSType | "ALL">("ALL");
  const [city, setCity]             = useState("All");
  const [showAllMap, setShowAllMap] = useState(false);

  const cities = ["All", ...Array.from(new Set(TURKISH_UNIVERSITIES.map(u => u.city)))];

  const filtered = TURKISH_UNIVERSITIES.filter(u =>
    (yks === "ALL" || u.yksTypes.includes(yks)) &&
    (city === "All" || u.city === city)
  );

  const mappings = showAllMap ? YKS_MAJOR_MAP : YKS_MAJOR_MAP.slice(0, 8);

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-full mb-4">
            🇹🇷 Türkiye
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold mb-3">{L.heroTitle}</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">{L.heroSub}</p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted rounded-2xl p-1.5 gap-1">
            {(["turkey", "abroad"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  tab === t ? "bg-white dark:bg-card shadow-md text-foreground" : "text-muted-foreground hover:text-foreground"
                )}>
                {t === "turkey" ? L.tabTurkey : L.tabAbroad}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">

          {/* ══ TAB: STUDY IN TURKEY ══ */}
          {tab === "turkey" && (
            <motion.div key="turkey" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>

              {/* YKS info cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {(["SAY", "EA", "SÖZ", "DİL"] as YKSType[]).map(type => {
                  const info = YKS_TYPE_INFO[type];
                  const lbl  = lang === "tr" ? info.labelTR : lang === "de" ? info.labelDE : info.label;
                  const desc = lang === "tr" ? info.descriptionTR : lang === "de" ? info.descriptionDE : info.description;
                  return (
                    <Card key={type} className={cn("p-4 border", info.border, info.bg)}>
                      <div className="text-2xl mb-1.5">{info.icon}</div>
                      <p className={cn("text-xs font-bold mb-1", info.color)}>{lbl}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{desc}</p>
                    </Card>
                  );
                })}
              </div>

              {/* YKS filter row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {(["ALL", "SAY", "EA", "SÖZ", "DİL"] as const).map(t => (
                  <YKSBtn key={t} type={t} active={yks === t} onClick={() => setYks(t)} L={L} />
                ))}
              </div>

              {/* City filter */}
              <div className="flex flex-wrap gap-2 mb-5">
                {cities.map(c => (
                  <button key={c} onClick={() => setCity(c)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors font-medium",
                      city === c
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background border-border text-foreground hover:border-primary hover:text-primary"
                    )}>
                    <MapPin className="w-3 h-3" />
                    {c === "All" ? L.allCities : c}
                  </button>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                {L.univCount(filtered.length)} {L.shown}
              </p>

              {/* University grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                <AnimatePresence mode="popLayout">
                  {filtered.map(uni => <UniversityCard key={uni.id} uni={uni} />)}
                </AnimatePresence>
              </div>

              {/* Major → YKS mapping */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-border/60" />
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{L.majorMapTitle}</span>
                  </div>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 text-center">{L.majorMapSub}</p>
                <Card className="overflow-hidden border border-border/70">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[480px]">
                      <tbody>
                        {mappings.map((m, i) => {
                          const info = YKS_TYPE_INFO[m.yksType];
                          return (
                            <tr key={m.major} className={cn("border-b border-border/40 last:border-0", i % 2 === 0 ? "bg-muted/10" : "bg-white dark:bg-card")}>
                              <td className="px-4 py-3 text-sm text-foreground/80">{m.major}</td>
                              <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{m.turkishEquivalent}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", info.badge)}>
                                  {info.icon} {m.yksType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-[10px] text-muted-foreground italic hidden lg:table-cell">{m.note ?? ""}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={() => setShowAllMap(v => !v)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-border/40">
                    {showAllMap
                      ? <><ChevronUp className="w-3.5 h-3.5" /> {L.showLess}</>
                      : <><ChevronDown className="w-3.5 h-3.5" /> {L.showAll} ({YKS_MAJOR_MAP.length})</>
                    }
                  </button>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ══ TAB: STUDY ABROAD ══ */}
          {tab === "abroad" && (
            <motion.div key="abroad" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold mb-2">{L.abroadTitle}</h2>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">{L.abroadSub}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ABROAD_SCHOLARSHIPS.map(s => <ScholarshipCard key={s.id} s={s} />)}
              </div>

              {/* Tips box */}
              <Card className="mt-8 p-6 border border-primary/20 bg-primary/3">
                <h3 className="font-display font-bold text-base mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> {L.tipsTitle}
                </h3>
                <ul className="space-y-2.5">
                  {L.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{tip}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Quiz CTA */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 p-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold mb-2">{L.ctaTitle}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">{L.ctaSub}</p>
          <Button onClick={() => setLocation("/questionnaire")} size="lg">
            {L.ctaBtn} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
