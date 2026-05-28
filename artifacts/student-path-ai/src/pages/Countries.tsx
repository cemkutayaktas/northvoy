import { useRef } from "react";
import { useLocation } from "wouter";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Wallet, ArrowRight, Sparkles } from "lucide-react";
import { COUNTRY_GUIDES } from "@/lib/countryGuides";

function CountryCard({ guide, index }: { guide: (typeof COUNTRY_GUIDES)[number]; index: number }) {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border border-border/70 hover:border-primary/40 hover:shadow-lg transition-all duration-200">
        {/* Card header */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-4">
          <span className="text-5xl leading-none select-none">{guide.flag}</span>
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">{guide.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{guide.currency}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 pb-5 flex-1 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 text-sm">
            <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                {t("countries.tuition")}
              </p>
              <p className="font-semibold text-foreground">{guide.avgTuitionRange}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-sm">
            <Wallet className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                {t("countries.costOfLiving")}
              </p>
              <p className="font-semibold text-foreground">{guide.costOfLivingRange}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <Button
            className="w-full"
            onClick={() => setLocation(`/countries/${guide.slug}`)}
          >
            {t("countries.viewGuide")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Countries() {
  const { t } = useLang();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 text-center"
        style={{
          background: "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full mb-5">
            🌍 {t("countries.studyAbroad")}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white mb-4">
            {t("countries.pageTitle")}
          </h1>
          <p className="text-base text-white/70 max-w-xl mx-auto">
            {t("countries.pageSubtitle")}
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRY_GUIDES.map((guide, i) => (
            <CountryCard key={guide.slug} guide={guide} index={i} />
          ))}
        </div>
      </div>

      {/* Quiz CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-8 sm:p-10 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold mb-2">
            {t("majorPages.takeQuizCta")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            {t("countries.pageSubtitle")}
          </p>
          <Button size="lg" onClick={() => setLocation("/questionnaire")} className="gap-2">
            {t("nav.startQuiz")} <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
