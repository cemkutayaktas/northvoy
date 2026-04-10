import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  GraduationCap,
  Globe,
  Users,
  FileDown,
  Clock,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Frown,
  Shuffle,
  MessageCircle,
  Mail,
  BarChart3,
  Map,
  Zap,
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AnimatedCounter({ value }: { value: string }) {
  const num = parseInt(value);
  const suffix = value.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1400;
    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, num]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const slideIn = (dir: "left" | "right") => ({
  hidden: { opacity: 0, x: dir === "left" ? -48 : 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
});

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useLang();

  // ── Mouse parallax for hero ──
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { damping: 28, stiffness: 120 };
  const sx = useSpring(mouseX, springCfg);
  const sy = useSpring(mouseY, springCfg);
  const c1x = useTransform(sx, v => v * 0.016);
  const c1y = useTransform(sy, v => v * 0.016);
  const c2x = useTransform(sx, v => v * 0.030);
  const c2y = useTransform(sy, v => v * 0.030);
  const c3x = useTransform(sx, v => v * -0.012);
  const c3y = useTransform(sy, v => v * -0.012);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - r.left - r.width / 2);
    mouseY.set(e.clientY - r.top - r.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
  }, [mouseX, mouseY]);

  // ── Quiz preview cycling ──
  const quizRef = useRef(null);
  const quizInView = useInView(quizRef, { once: false });
  const [activeOpt, setActiveOpt] = useState(0);
  const quizOptions = [
    t("home.quizOpt1"), t("home.quizOpt2"), t("home.quizOpt3"), t("home.quizOpt4"),
  ];
  useEffect(() => {
    if (!quizInView) return;
    const id = setInterval(() => setActiveOpt(p => (p + 1) % 4), 1800);
    return () => clearInterval(id);
  }, [quizInView]);

  // ── Data ──
  const stats = [
    { value: "20+", label: t("home.statMajors"), icon: GraduationCap },
    { value: "60+", label: t("home.statCountries"), icon: Globe },
    { value: "200+", label: t("home.statUniversities"), icon: BookOpen },
    { value: "3", label: t("home.statLanguages"), icon: Users },
  ];

  const problems = [
    { icon: Frown, title: t("home.problem1Title"), desc: t("home.problem1Desc") },
    { icon: Shuffle, title: t("home.problem2Title"), desc: t("home.problem2Desc") },
    { icon: MessageCircle, title: t("home.problem3Title"), desc: t("home.problem3Desc") },
  ];

  const steps = [
    { num: "01", title: t("home.step1Title"), desc: t("home.step1Desc") },
    { num: "02", title: t("home.step2Title"), desc: t("home.step2Desc") },
    { num: "03", title: t("home.step3Title"), desc: t("home.step3Desc") },
  ];

  const testimonials = [
    { name: "Alex K.", role: t("home.test1Role"), text: t("home.test1Text"), initial: "A" },
    { name: "Maria S.", role: t("home.test2Role"), text: t("home.test2Text"), initial: "M" },
    { name: "Yusuf T.", role: t("home.test3Role"), text: t("home.test3Text"), initial: "Y" },
  ];

  const marqueeItems = [
    `⚡ ${t("home.freeInstant")}`,
    `🎯 ${t("home.marqueePrecision")}`,
    `🌍 60+ ${t("home.statCountries")}`,
    `📚 20+ ${t("home.statMajors")}`,
    `⏱ ${t("home.fiveMinutes")}`,
    `📄 ${t("home.marqueePDF")}`,
    `🔒 ${t("home.marqueePrivacy")}`,
    `🎓 200+ ${t("home.statUniversities")}`,
  ];

  const footerProduct = [
    { label: t("home.navQuiz"), href: "/questionnaire" },
    { label: t("home.navCompare"), href: "/compare" },
    { label: t("home.navTurkey"), href: "/turkiye" },
    { label: t("home.navTracker"), href: "/tracker" },
  ];
  const footerCompany = [
    { label: t("home.navAbout"), href: "/about" },
    { label: t("home.navSignIn"), href: "/auth" },
  ];

  // ── Dark section shared style ──
  const dark = "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[100dvh] flex items-center pt-16 sm:pt-20 overflow-hidden"
        style={{ background: dark }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 hero-dot-grid opacity-[0.22] pointer-events-none" />
        {/* Spotlight glow — follows right side where cards are */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 70% at 75% 50%, rgba(59,130,246,0.13) 0%, transparent 65%)" }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-20 items-center">

            {/* ── Left copy ── */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-sm font-medium"
                  style={{ borderColor: "rgba(99,102,241,0.30)", background: "rgba(99,102,241,0.10)", color: "#a5b4fc" }}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("home.badge")}
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display font-black text-white leading-[1.01] tracking-tight mb-7"
                style={{ fontSize: "clamp(3rem, 6.5vw, 5.75rem)" }}
              >
                {t("home.h1a")}<br />
                <span style={{
                  background: "linear-gradient(90deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {t("home.h1b")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="text-lg sm:text-xl leading-relaxed mb-10 max-w-[520px]"
                style={{ color: "#94a3b8" }}
              >
                {t("home.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <Link href="/questionnaire">
                  <button
                    className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-white transition-all duration-200 w-full sm:w-auto"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 8px 32px rgba(59,130,246,0.30)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 40px rgba(59,130,246,0.45)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(59,130,246,0.30)"; }}
                  >
                    {t("home.cta")}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/about">
                  <button
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 w-full sm:w-auto"
                    style={{ border: "1px solid rgba(255,255,255,0.13)", color: "#cbd5e1" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.28)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.13)"; (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  >
                    {t("home.howItWorks")}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.36 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm"
                style={{ color: "#475569" }}
              >
                {[
                  { icon: CheckCircle2, label: t("home.freeInstant"), col: "#10b981" },
                  { icon: Clock, label: t("home.fiveMinutes"), col: "#10b981" },
                  { icon: CheckCircle2, label: t("home.personalized"), col: "#10b981" },
                ].map(({ icon: Icon, label, col }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" style={{ color: col }} />{label}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: 3-layer parallax product visual ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="hidden lg:block relative"
              style={{ minHeight: 480 }}
            >
              {/* Layer 3 — back: world-map glow card */}
              <motion.div
                style={{ x: c3x, y: c3y }}
                className="absolute inset-0 rounded-2xl"
                css-note="background layer"
              >
                <div className="absolute inset-0 rounded-2xl opacity-50"
                  style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.06) 100%)", border: "1px solid rgba(255,255,255,0.05)" }} />
                {/* World dots suggestion */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
                      style={{
                        left: `${15 + (i % 6) * 14}%`,
                        top: `${20 + Math.floor(i / 6) * 40 + (i % 3) * 15}%`,
                        opacity: 0.3 + (i % 4) * 0.18,
                      }} />
                  ))}
                </div>
              </motion.div>

              {/* Layer 1 — main: Results card (browser mockup) */}
              <motion.div style={{ x: c1x, y: c1y }} className="relative z-10">
                <div className="rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
                    background: "#0d1227",
                  }}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 px-4 py-3"
                    style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex gap-1.5 shrink-0">
                      {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="rounded-md px-3 py-1 flex items-center justify-center gap-1.5"
                        style={{ background: "#0a0f1e" }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
                        <span className="text-xs" style={{ color: "#374151" }}>northvoy.com/results</span>
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                          <img src="/favicon.svg" alt="NorthVoy" className="w-full h-full" />
                        </div>
                        <span className="font-display font-bold text-sm text-white">{t("home.resultCardTitle")}</span>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: "rgba(255,255,255,0.07)", color: "#64748b" }}>
                        {t("home.resultCardMatches")}
                      </span>
                    </div>
                    {/* Top match */}
                    <div className="rounded-xl p-4 mb-3"
                      style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.10))", border: "1px solid rgba(59,130,246,0.22)" }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "#60a5fa" }}>
                            {t("home.topMatch")}
                          </div>
                          <div className="font-display font-bold text-lg text-white leading-tight">Computer Science</div>
                        </div>
                        <div className="text-4xl font-display font-black leading-none" style={{ color: "#60a5fa" }}>94%</div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#3b82f6,#6366f1)" }}
                          initial={{ width: 0 }} animate={{ width: "94%" }}
                          transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }} />
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {[t("home.skill1"), t("home.skill2"), t("home.skill3")].map(s => (
                          <span key={s} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.20)" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Secondary */}
                    {[{ name: "Data Science", pct: 81, col: "#6366f1" }, { name: "Engineering", pct: 74, col: "#8b5cf6" }].map((m, i) => (
                      <div key={m.name} className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm font-medium text-white">{m.name}</span>
                            <span className="text-sm font-bold" style={{ color: "#475569" }}>{m.pct}%</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <motion.div className="h-full rounded-full" style={{ background: m.col, opacity: 0.65 }}
                              initial={{ width: 0 }} animate={{ width: `${m.pct}%` }}
                              transition={{ duration: 1.2, delay: 1.1 + i * 0.15, ease: "easeOut" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-3 flex items-center justify-between text-xs"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#475569" }}>
                      <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> 12 {t("home.universities")}</span>
                      <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> 8 {t("home.countries")}</span>
                      <span className="flex items-center gap-1.5" style={{ color: "#10b981" }}><CheckCircle2 className="w-3.5 h-3.5" /> {t("home.free")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Layer 2 — front: floating quiz card */}
              <motion.div
                style={{ x: c2x, y: c2y }}
                className="absolute -top-6 -left-8 z-20 w-52"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-[10px] font-semibold" style={{ color: "#60a5fa" }}>{t("home.featureQuizPreviewLabel")}</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-2.5 leading-snug">{t("home.quizQuestion")}</div>
                  {quizOptions.map((opt, i) => (
                    <div key={i} className="text-[10px] px-2.5 py-1.5 rounded-lg mb-1 last:mb-0 transition-all duration-300"
                      style={{
                        background: i === activeOpt ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${i === activeOpt ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.06)"}`,
                        color: i === activeOpt ? "#93c5fd" : "#64748b",
                        fontWeight: i === activeOpt ? 600 : 400,
                      }}>
                      {opt}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Floating badges */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="absolute -top-4 -right-4 z-30 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white"
                style={{ background: "#10b981", boxShadow: "0 6px 24px rgba(16,185,129,0.42)" }}>
                ✓ {t("home.freeInstant")}
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.25 }}
                className="absolute -bottom-5 right-8 z-30 rounded-2xl px-4 py-2.5"
                style={{ background: "rgba(15,23,42,0.96)", border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}>
                <div className="text-sm font-display font-black text-white">2,000+</div>
                <div className="text-[10px]" style={{ color: "#64748b" }}>{t("home.studentsGuided")}</div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. MARQUEE BENEFITS STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden py-4 border-y border-white/[0.06]"
        style={{ background: "rgba(10,14,30,0.95)" }}>
        <div className="flex animate-[scroll_35s_linear_infinite] gap-0 w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 text-sm font-medium whitespace-nowrap"
              style={{ color: "#94a3b8", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          3. STATS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border/50 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {stats.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-black text-foreground">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. PROBLEM SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-36 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp} custom={0} className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border mb-7"
              style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.18)", color: "#ef4444" }}>
              <AlertCircle className="w-3.5 h-3.5" />
              {t("home.problemBadge")}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.05] mb-6">
              {t("home.problemTitle")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("home.problemSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {problems.map((p, i) => (
              <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="group relative rounded-2xl p-7 border border-border/60 bg-card hover:border-border card-lift transition-colors duration-200">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(239,68,68,0.04) 0%, transparent 60%)" }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#f87171" }}>
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. FEATURE ROW 1 — Smart Quiz (dark)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32" style={{ background: dark }}>
        <div className="absolute inset-0 hero-dot-grid opacity-[0.14] pointer-events-none" />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Quiz mockup */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("left")} ref={quizRef}>
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
                {/* Progress bar */}
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold" style={{ color: "#60a5fa" }}>{t("home.featureQuizPreviewLabel")}</span>
                    <span className="text-xs" style={{ color: "#475569" }}>33%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full w-1/3" style={{ background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                  </div>
                </div>
                {/* Question */}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#475569" }}>
                    {t("home.quizSelectAll")}
                  </p>
                  <h3 className="text-lg font-display font-bold text-white mb-5 leading-snug">
                    {t("home.quizQuestion")}
                  </h3>
                  <div className="space-y-2.5">
                    {quizOptions.map((opt, i) => (
                      <AnimatePresence key={i} mode="wait">
                        <motion.div
                          animate={{
                            background: i === activeOpt ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
                            borderColor: i === activeOpt ? "rgba(59,130,246,0.40)" : "rgba(255,255,255,0.07)",
                          }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
                          style={{ border: "1px solid" }}
                        >
                          <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-300"
                            style={{
                              background: i === activeOpt ? "#3b82f6" : "transparent",
                              border: `1.5px solid ${i === activeOpt ? "#3b82f6" : "rgba(255,255,255,0.20)"}`,
                            }}>
                            {i === activeOpt && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm transition-colors duration-300"
                            style={{ color: i === activeOpt ? "#e2e8f0" : "#64748b", fontWeight: i === activeOpt ? 500 : 400 }}>
                            {opt}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <button className="text-sm px-4 py-2 rounded-lg transition-colors"
                      style={{ color: "#475569", border: "1px solid rgba(255,255,255,0.08)" }}>
                      ← {t("home.quizBack")}
                    </button>
                    <button className="text-sm px-5 py-2 rounded-lg font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)" }}>
                      {t("home.quizContinue")} →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("right")}>
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: "#3b82f6" }}>
                01 / {t("home.feat1Title")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-[1.06] mb-6">
                {t("home.feat1Headline")}
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
                {t("home.feat1Desc")}
              </p>
              <ul className="space-y-3.5 mb-10">
                {[t("home.feat1Point1"), t("home.feat1Point2"), t("home.feat1Point3")].map(pt => (
                  <li key={pt} className="flex items-center gap-3 text-sm" style={{ color: "#94a3b8" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.30)" }}>
                      <CheckCircle2 className="w-3 h-3" style={{ color: "#60a5fa" }} />
                    </div>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/questionnaire">
                <button className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "#60a5fa" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#93c5fd"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#60a5fa"}>
                  {t("home.cta")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. FEATURE ROW 2 — Match Scores (light)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(99,102,241,0.05) 0%, transparent 60%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("left")}>
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block text-primary">
                02 / {t("home.feat2Title")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.06] mb-6">
                {t("home.feat2Headline")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("home.feat2Desc")}
              </p>
              <ul className="space-y-3.5 mb-10">
                {[t("home.feat2Point1"), t("home.feat2Point2"), t("home.feat2Point3")].map(pt => (
                  <li key={pt} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/questionnaire">
                <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 duration-200">
                  {t("home.ctaBottom")} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Results mockup */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("right")}>
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/60 bg-card">
                {/* Header */}
                <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-display font-bold">{t("home.resultCardTitle")}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{t("home.resultCardMatches")}</span>
                </div>
                {/* Top match */}
                <div className="p-6">
                  <div className="rounded-xl p-5 mb-4 border border-primary/20 bg-primary/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{t("home.topMatch")}</div>
                        <h4 className="font-display font-bold text-xl">Computer Science</h4>
                      </div>
                      <div className="text-4xl font-display font-black text-primary leading-none">94%</div>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {[t("home.skill1"), t("home.skill2"), t("home.skill3")].map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                  {[{ name: "Data Science", pct: 81 }, { name: "Engineering", pct: 74 }].map((m, i) => (
                    <div key={m.name} className="flex items-center gap-3 py-3"
                      style={{ borderTop: i === 0 ? "1px solid hsl(var(--border)/0.5)" : "none" }}>
                      <span className="text-sm font-medium w-32 shrink-0">{m.name}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-400/60" style={{ width: `${m.pct}%` }} />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground w-10 text-right">{m.pct}%</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-3 gap-3">
                    {[
                      { icon: GraduationCap, val: "12", lbl: t("home.universities") },
                      { icon: Globe, val: "8", lbl: t("home.countries") },
                      { icon: Map, val: "3", lbl: t("home.careers") },
                    ].map(({ icon: Icon, val, lbl }) => (
                      <div key={lbl} className="text-center p-2 rounded-xl bg-muted/50">
                        <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                        <div className="text-base font-display font-black">{val}+</div>
                        <div className="text-[10px] text-muted-foreground">{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. FEATURE ROW 3 — Global Universities (dark)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-28 lg:py-32" style={{ background: dark }}>
        <div className="absolute inset-0 hero-dot-grid opacity-[0.14] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* University map visual */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("left")} className="order-2 lg:order-1">
              <div className="rounded-2xl p-6"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" style={{ color: "#10b981" }} />
                    <span className="text-sm font-display font-bold text-white">{t("home.feat3Title")}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.20)" }}>
                    60+ {t("home.statCountries")}
                  </span>
                </div>
                {/* Country grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { flag: "🇩🇪", country: "Germany", count: "42 unis" },
                    { flag: "🇺🇸", country: "USA", count: "38 unis" },
                    { flag: "🇬🇧", country: "UK", count: "30 unis" },
                    { flag: "🇨🇦", country: "Canada", count: "22 unis" },
                    { flag: "🇹🇷", country: "Turkey", count: "18 unis" },
                    { flag: "🇦🇺", country: "Australia", count: "15 unis" },
                  ].map(({ flag, country, count }) => (
                    <div key={country} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors group cursor-default"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(16,185,129,0.25)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}>
                      <span className="text-lg">{flag}</span>
                      <div>
                        <div className="text-xs font-semibold text-white leading-tight">{country}</div>
                        <div className="text-[10px]" style={{ color: "#475569" }}>{count}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center py-3 rounded-xl text-xs font-medium"
                  style={{ background: "rgba(16,185,129,0.08)", color: "#34d399", border: "1px solid rgba(16,185,129,0.15)" }}>
                  + {t("home.moreCountries")}
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
              variants={slideIn("right")} className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: "#10b981" }}>
                03 / {t("home.feat3Title")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight leading-[1.06] mb-6">
                {t("home.feat3Headline")}
              </h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "#94a3b8" }}>
                {t("home.feat3Desc")}
              </p>
              <ul className="space-y-3.5 mb-10">
                {[t("home.feat3Point1"), t("home.feat3Point2"), t("home.feat3Point3")].map(pt => (
                  <li key={pt} className="flex items-center gap-3 text-sm" style={{ color: "#94a3b8" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                      <CheckCircle2 className="w-3 h-3" style={{ color: "#10b981" }} />
                    </div>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/compare">
                <button className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "#34d399" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#6ee7b7"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#34d399"}>
                  {t("home.compareMajors")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          8. MAJORS TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-primary/5 border-y border-primary/10 overflow-hidden">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          {t("home.exploreMajors")}
        </p>
        <div className="relative mb-3">
          <div className="flex animate-[scroll_28s_linear_infinite] gap-3 w-max">
            {[...["Computer Science","Finance","Medicine","Architecture","Game Design","Cybersecurity","Marketing","Psychology"],
              ...["Computer Science","Finance","Medicine","Architecture","Game Design","Cybersecurity","Marketing","Psychology"]].map((m, i) => (
              <span key={i} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-card border border-border/60 text-foreground whitespace-nowrap shadow-sm">{m}</span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex animate-[scrollRight_32s_linear_infinite] gap-3 w-max">
            {[...["Nursing","Law","Data Science","Linguistics","Engineering","Media Studies","Economics","Philosophy"],
              ...["Nursing","Law","Data Science","Linguistics","Engineering","Media Studies","Economics","Philosophy"]].map((m, i) => (
              <span key={i} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/8 border border-primary/15 text-primary whitespace-nowrap shadow-sm">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          9. HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-36 bg-muted/20 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-5">{t("home.howItWorksTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.howItWorksSubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {steps.map((s, i) => (
              <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl font-display font-black text-lg text-white mb-6 shadow-lg relative z-10"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))", boxShadow: "0 8px 24px rgba(59,130,246,0.28)" }}>
                  {s.num}
                </div>
                <h3 className="font-display font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="text-center mt-14">
            <Link href="/questionnaire">
              <button className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:-translate-y-0.5">
                {t("home.ctaBottom")} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          10. TESTIMONIALS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 lg:py-36 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(99,102,241,0.05) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp} custom={0} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-display font-black tracking-tight mb-5">{t("home.testimonialsTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.testimonialsSubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((tm, i) => (
              <motion.div key={i} custom={i + 1} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="group glass-panel rounded-2xl p-7 card-lift border border-border/60 flex flex-col">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic flex-1">"{tm.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-primary text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))", border: "1px solid rgba(99,102,241,0.20)" }}>
                    {tm.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{tm.name}</div>
                    <div className="text-xs text-muted-foreground">{tm.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          11. FINAL CTA — always dark
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28 sm:py-36" style={{ background: dark }}>
        <div className="absolute inset-0 hero-dot-grid opacity-[0.18] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(59,130,246,0.18) 0%, transparent 65%)" }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8"
              style={{
                background: "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(99,102,241,0.12))",
                border: "1px solid rgba(59,130,246,0.25)",
                boxShadow: "0 0 50px rgba(59,130,246,0.22)",
              }}>
              <Compass className="w-8 h-8" style={{ color: "#60a5fa" }} />
            </div>
            <h2 className="font-display font-black text-white tracking-tight leading-[1.05] mb-5"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
              {t("home.finalCtaTitle")}
            </h2>
            <p className="text-lg mb-10 leading-relaxed max-w-xl mx-auto" style={{ color: "#94a3b8" }}>
              {t("home.finalCtaDesc")}
            </p>
            <Link href="/questionnaire">
              <button
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 8px 40px rgba(59,130,246,0.35)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 50px rgba(59,130,246,0.52)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 40px rgba(59,130,246,0.35)"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
              >
                {t("home.cta")} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="mt-6 text-sm" style={{ color: "#334155" }}>{t("home.ctaTrust")}</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          12. FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: "#060a18", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-900/40">
                  <img src="/favicon.svg" alt="NorthVoy" className="w-full h-full" />
                </div>
                <span className="font-display font-bold text-xl text-white">NorthVoy</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs mb-5" style={{ color: "#64748b" }}>
                {t("home.footerDescription")}
              </p>
              <a href="mailto:northvoy@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: "#475569" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#475569"}>
                <Mail className="w-3.5 h-3.5" /> northvoy@gmail.com
              </a>
            </div>
            {/* Product */}
            <div>
              <h4 className="font-display font-bold text-sm mb-4" style={{ color: "#e2e8f0" }}>{t("home.footerProductTitle")}</h4>
              <ul className="space-y-3">
                {footerProduct.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm transition-colors"
                      style={{ color: "#475569" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#475569"}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="font-display font-bold text-sm mb-4" style={{ color: "#e2e8f0" }}>{t("home.footerCompanyTitle")}</h4>
              <ul className="space-y-3 mb-6">
                {footerCompany.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm transition-colors"
                      style={{ color: "#475569" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#475569"}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2.5">
                {[
                  { href: "https://instagram.com/NorthVoyAI", label: "Instagram", icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                    </svg>
                  )},
                  { href: "https://tiktok.com/@NorthVoyAI", label: "TikTok", icon: (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.23 8.23 0 004.81 1.54V6.78a4.85 4.85 0 01-1.04-.09z"/>
                    </svg>
                  )},
                ].map(({ href, label, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(59,130,246,0.15)"; (e.currentTarget as HTMLAnchorElement).style.color = "#60a5fa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#334155" }}>
            <span>&copy; {new Date().getFullYear()} NorthVoy. {t("home.footerRights")}</span>
            <span>{t("home.footerDisclaimer")}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
