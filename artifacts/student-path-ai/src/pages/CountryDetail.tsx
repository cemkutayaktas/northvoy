import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_GUIDES } from "@/lib/countryGuides";
import {
  GraduationCap,
  Wallet,
  ShieldCheck,
  Sparkles,
  University,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function CountryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLang();
  const [, setLocation] = useLocation();

  const guide = COUNTRY_GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">{t("countries.notFound")}</p>
      </div>
    );
  }

  const majors = Object.keys(guide.topUniversitiesByMajor);
  const firstMajor = majors[0] ?? "";

  return <CountryDetailInner guide={guide} firstMajor={firstMajor} />;
}

// Inner component so we can call hooks after the early return above
function CountryDetailInner({
  guide,
  firstMajor,
}: {
  guide: (typeof COUNTRY_GUIDES)[number];
  firstMajor: string;
}) {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [selectedMajor, setSelectedMajor] = useState<string>(firstMajor);

  const majors = Object.keys(guide.topUniversitiesByMajor);
  const unis = selectedMajor ? (guide.topUniversitiesByMajor[selectedMajor] ?? []) : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div
        className="pt-24 pb-14 px-4 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => setLocation("/countries")}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("countries.backToCountries")}
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-5 mb-6">
              <span className="text-6xl leading-none select-none">{guide.flag}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white">
                {guide.name}
              </h1>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5">
                <GraduationCap className="w-4 h-4 text-white/70 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {t("countries.tuition")}
                  </p>
                  <p className="text-sm font-semibold text-white">{guide.avgTuitionRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5">
                <Wallet className="w-4 h-4 text-white/70 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {t("countries.costOfLiving")}
                  </p>
                  <p className="text-sm font-semibold text-white">{guide.costOfLivingRange}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">

        {/* Overview */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionHeader icon={<Sparkles className="w-4 h-4" />} label="Overview" />
          <p className="text-foreground/80 leading-relaxed">{t(guide.overviewKey)}</p>
        </motion.section>

        {/* Highlights */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionHeader icon={<CheckCircle2 className="w-4 h-4" />} label={t("countries.highlights")} />
          <ul className="space-y-2.5">
            {guide.highlights.map((key) => (
              <li key={key} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                {t(key)}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Visa info */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionHeader icon={<ShieldCheck className="w-4 h-4" />} label={t("countries.visaInfo")} />
          <Card className="p-5 border border-border/70 bg-muted/20">
            <p className="text-sm text-foreground/80 leading-relaxed">{t(guide.visaInfoKey)}</p>
          </Card>
        </motion.section>

        {/* University finder */}
        {majors.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <SectionHeader icon={<University className="w-4 h-4" />} label={t("countries.topUniversities")} />

            <div className="mb-4 max-w-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                {t("countries.selectMajor")}
              </p>
              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger>
                  <SelectValue placeholder={t("countries.selectMajor")} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border border-border shadow-xl z-[60]">
                  {majors.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {unis.length > 0 && (
              <ul className="space-y-2">
                {unis.map((uni, i) => (
                  <li
                    key={uni}
                    className="flex items-center gap-3 bg-muted/30 border border-border/50 rounded-lg px-4 py-2.5 text-sm font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {uni}
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        )}

        {/* Back button */}
        <div className="pt-4">
          <Button variant="outline" onClick={() => setLocation("/countries")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("countries.backToCountries")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-primary">{icon}</span>
      <h2 className="text-base font-display font-bold">{label}</h2>
      <div className="h-px flex-1 bg-border/60 ml-1" />
    </div>
  );
}
