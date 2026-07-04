import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, Target, Check, ArrowRight, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { TiltCard } from "@/components/visual/TiltCard";
import { FloatingOrbs } from "@/components/visual/FloatingOrbs";
import { IsoCap } from "@/components/visual/IsoShapes";

// Mode chooser: /questionnaire — routes to /questionnaire/quick or /questionnaire/detailed
export default function Questionnaire() {
  const { t } = useLang();

  const modes = [
    {
      href: "/questionnaire/quick",
      icon: Zap,
      accent: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/25",
      title: t("quizChooser.quickTitle"),
      time: t("quizChooser.quickTime"),
      desc: t("quizChooser.quickDesc"),
      bullets: [t("quizChooser.quickB1"), t("quizChooser.quickB2"), t("quizChooser.quickB3")],
      badge: null as string | null,
    },
    {
      href: "/questionnaire/detailed",
      icon: Target,
      accent: "from-violet-500 to-fuchsia-500",
      shadow: "shadow-violet-500/25",
      title: t("quizChooser.detailedTitle"),
      time: t("quizChooser.detailedTime"),
      desc: t("quizChooser.detailedDesc"),
      bullets: [t("quizChooser.detailedB1"), t("quizChooser.detailedB2"), t("quizChooser.detailedB3")],
      badge: t("quizChooser.mostAccurate"),
    },
  ];

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-transparent overflow-hidden">
      <FloatingOrbs intensity="bold" />
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block absolute -top-6 right-2 w-20 animate-float-slow" aria-hidden
          >
            <IsoCap className="w-full h-auto" />
          </motion.div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {t("quizChooser.badge")}
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight mb-4">
            {t("quizChooser.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("quizChooser.subtitle")}
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modes.map((m, i) => (
            <motion.div
              key={m.href}
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.12 }}
            >
              <Link href={m.href} className="block group h-full">
                <TiltCard maxTilt={6} className="h-full">
                <div className={cn(
                  "relative h-full rounded-3xl border-2 border-border bg-card p-7 sm:p-8 flex flex-col",
                  "transition-all duration-300 group-hover:border-primary/40",
                  "group-hover:shadow-2xl", m.shadow
                )}>
                  {m.badge && (
                    <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
                      ✨ {m.badge}
                    </span>
                  )}

                  <div className={cn(
                    "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg",
                    m.accent, m.shadow,
                    "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <m.icon className="w-7 h-7 text-white" />
                  </div>

                  <h2 className="text-2xl font-display font-bold mb-1">{m.title}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    {m.time}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{m.desc}</p>

                  <ul className="space-y-2.5 mb-7 flex-1">
                    {m.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={3} />
                        <span className="text-foreground/90">{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={cn(
                    "inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-white",
                    "bg-gradient-to-r transition-all duration-300 group-hover:gap-3.5", m.accent
                  )}>
                    {t("quizChooser.start")} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Guidance note */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          💡 {t("quizChooser.recommendNote")}
        </motion.p>

      </div>
    </div>
  );
}
