import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, Globe, UserCircle, LogOut, Menu, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccount } from "@/contexts/AccountContext";
import { Lang } from "@/lib/i18n";

const LANG_OPTIONS: { value: Lang; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "tr", label: "Türkçe", flag: "🇹🇷" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function Navbar() {
  const [location] = useLocation();
  const { lang, setLang, t } = useLang();
  const { theme, toggle } = useTheme();
  const { account, logout } = useAccount();
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setLangOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/questionnaire", label: t("nav.quiz") },
    { href: "/compare", label: "Compare" },
    { href: "/blog", label: t("nav.blog") },
    { href: "/countries", label: t("nav.countries") },
    { href: "/turkiye", label: "🇹🇷 Türkiye" },
    { href: "/about", label: t("nav.about") },
  ];

  const current = LANG_OPTIONS.find(o => o.value === lang)!;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 border-t-0 border-x-0 rounded-none bg-white/70 dark:bg-transparent backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img src="/favicon.svg" alt="NorthVoy" className="w-full h-full" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              NorthVoy
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative py-2 group",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-200 ease-out",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Language switcher */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 h-9 px-2 sm:px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{current.flag} {current.value.toUpperCase()}</span>
                <span className="sm:hidden">{current.flag}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", langOpen && "rotate-180")} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border bg-card shadow-xl shadow-black/10 py-1 z-50">
                  {LANG_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setLang(opt.value); setLangOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted",
                        lang === opt.value ? "text-primary font-semibold" : "text-foreground"
                      )}
                    >
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account button (desktop) */}
            {account ? (
              <div className="relative hidden sm:block" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/15 transition-colors border border-primary/20"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="max-w-[80px] truncate">{account.username}</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card shadow-xl shadow-black/10 py-1 z-50">
                    <Link href="/account" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <UserCircle className="w-4 h-4" /> {t("account.myAccount")}
                    </Link>
                    <Link href="/tracker" onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                      <TrendingUp className="w-4 h-4" /> Application Tracker
                    </Link>
                    <button
                      onClick={() => { logout(); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <LogOut className="w-4 h-4" /> {t("account.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth"
                className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border">
                <UserCircle className="w-4 h-4" /> {t("auth.tabSignIn")}
              </Link>
            )}

            {/* Start Quiz CTA (desktop) */}
            <Link href="/questionnaire" className="hidden md:inline-flex items-center h-9 px-4 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
              {t("nav.startQuiz")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      <AnimatePresence>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl overflow-hidden">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                  location === link.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="h-px bg-border/50 my-2" />

            {account ? (
              <>
                <Link href="/account"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <UserCircle className="w-4 h-4 text-primary" />
                  {account.username} — {t("account.myAccount")}
                </Link>
                <Link href="/tracker"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Application Tracker
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <LogOut className="w-4 h-4" />
                  {t("account.signOut")}
                </button>
              </>
            ) : (
              <Link href="/auth"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <UserCircle className="w-4 h-4" />
                {t("auth.tabSignIn")}
              </Link>
            )}

            <div className="pt-2">
              <Link href="/questionnaire"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                {t("nav.startQuiz")}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}
