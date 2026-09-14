import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Zap, Globe, Users, Mail, Instagram, CheckCircle2 } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

const DEVELOPERS = [
  { key: "cem",   name: "Cem Kutay Aktaş", initials: "CKA", color: "from-blue-500 to-indigo-600"   },
  { key: "doruk", name: "Doruk Uzer",       initials: "DU",  color: "from-violet-500 to-purple-600" },
  { key: "devin", name: "Devin Tolun",      initials: "DT",  color: "from-emerald-500 to-teal-600"  },
] as const;

const STEPS = [
  { num: "01", icon: Mail,   colorClass: "text-blue-400",    bgClass: "bg-blue-500/10",   key: "step1" },
  { num: "02", icon: Zap,    colorClass: "text-violet-400",  bgClass: "bg-violet-500/10", key: "step2" },
  { num: "03", icon: Globe,  colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10",key: "step3" },
] as const;

const STATS = [
  { value: "9",    labelKey: "stat1" },
  { value: "200+", labelKey: "stat2" },
  { value: "60+",  labelKey: "stat3" },
  { value: "100%", labelKey: "stat4" },
] as const;

const dark = "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const { t } = useLang();

  const statLabels: Record<string, string> = {
    stat1: t("about.stat1"),
    stat2: t("about.stat2"),
    stat3: t("about.stat3"),
    stat4: t("about.stat4"),
  };

  return (
    <div className="min-h-screen">

      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-32 pb-24 px-4"
        style={{ background: dark }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-8 blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wider uppercase"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}
          >
            {t("about.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6"
            style={{ color: "#f1f5f9" }}
          >
            {t("about.titleA")}{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t("about.titleB")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: "#94a3b8" }}
          >
            {t("about.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <Link href="/questionnaire"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:gap-3"
              style={{ background: "#3b82f6", color: "#fff" }}
            >
              {t("about.cta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative max-w-3xl mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px"
          style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {STATS.map(({ value, labelKey }) => (
            <div
              key={labelKey}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-2xl sm:text-3xl font-display font-bold" style={{ color: "#f1f5f9" }}>{value}</span>
              <span className="text-xs mt-1" style={{ color: "#64748b" }}>{statLabels[labelKey]}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Mission ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-4 opacity-80">
                {t("about.missionBadge")}
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight mb-6">
                {t("about.problemTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                {t("about.problemText1")}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.problemText2")}
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="space-y-4">
                {(["pain1", "pain2", "pain3"] as const).map((key) => (
                  <div
                    key={key}
                    className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{t(`about.${key}Title`)}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`about.${key}Desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: dark }}>
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-4 opacity-70" style={{ color: "#93c5fd" }}>
              {t("about.howBadge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: "#f1f5f9" }}>
              {t("about.howItWorksTitle")}
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ num, icon: Icon, colorClass, bgClass, key }, i) => (
              <FadeUp key={key} delay={i * 0.1}>
                <div
                  className="relative p-7 rounded-2xl h-full"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className={`w-12 h-12 ${bgClass} rounded-xl flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                  </div>
                  <span className="text-xs font-bold tracking-widest opacity-30 mb-2 block" style={{ color: "#94a3b8" }}>
                    {num}
                  </span>
                  <h3 className="text-base font-bold mb-3" style={{ color: "#f1f5f9" }}>
                    {t(`about.${key}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
                    {t(`about.${key}Desc`)}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Technology / Privacy ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <div className="rounded-3xl overflow-hidden border border-border/60">
              {/* Header strip */}
              <div className="px-8 py-5 flex items-center gap-3 border-b border-border/50 bg-muted/30">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t("about.techTitle")}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t("about.privacyBadge")}
                </span>
              </div>
              {/* Body */}
              <div className="px-8 py-7 bg-card">
                <p className="text-muted-foreground leading-relaxed">{t("about.techDesc")}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Team ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4" style={{ background: dark }}>
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Users className="w-6 h-6" style={{ color: "#60a5fa" }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold" style={{ color: "#f1f5f9" }}>
              {t("about.teamTitle")}
            </h2>
          </FadeUp>

          {/* Founder card — full-width elevated */}
          <FadeUp delay={0}>
            <div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-7 rounded-2xl mb-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)" }}
            >
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-blue-500/30">
                  <img
                    src={`${import.meta.env.BASE_URL}images/cem-avatar.png`}
                    alt="Cem Kutay Aktaş"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-2"
                  style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
                  {t("about.founderBadge")}
                </div>
                <h3 className="text-base font-bold mb-1" style={{ color: "#f1f5f9" }}>Cem Kutay Aktaş</h3>
                <p className="text-sm" style={{ color: "#475569" }}>{t("about.roles.cem")}</p>
              </div>
            </div>
          </FadeUp>

          {/* Rest of team */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {DEVELOPERS.filter(d => d.key !== "cem").map((dev, i) => (
              <FadeUp key={dev.name} delay={(i + 1) * 0.08}>
                <div
                  className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {dev.key === "doruk" ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden mb-4 shadow-lg ring-1 ring-white/10">
                      <img
                        src={`${import.meta.env.BASE_URL}images/doruk-avatar.png`}
                        alt="Doruk Uzer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dev.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <span className="text-white text-sm font-bold">{dev.initials}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-bold leading-snug mb-1.5" style={{ color: "#f1f5f9" }}>{dev.name}</h3>
                  <p className="text-[11px] leading-snug" style={{ color: "#475569" }}>
                    {t(`about.roles.${dev.key}`)}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.3}>
            <p className="text-center text-sm mt-10" style={{ color: "#334155" }}>
              {t("about.footerNote")}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">{t("about.contactTitle")}</h2>
            <p className="text-muted-foreground mb-10">{t("about.contactDesc")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:northvoy@gmail.com"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
              >
                <Mail className="w-4 h-4 text-primary" />
                northvoy@gmail.com
              </a>
              <a
                href="https://instagram.com/NorthVoyAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
              >
                <Instagram className="w-4 h-4 text-pink-500" />
                @NorthVoyAI
              </a>
              <a
                href="https://tiktok.com/@NorthVoyAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition-colors text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"/></svg>
                @NorthVoyAI
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
