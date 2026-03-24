import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAccount } from "@/contexts/AccountContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  UserCircle, LogOut, BookMarked, Target, Globe, ChevronRight,
  Star, CalendarDays, Sparkles, Plus, X, CheckCircle2, Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GOAL_SUGGESTIONS = [
  "Research at least 3 universities offering my top major",
  "Complete an online course related to my field",
  "Attend a university open day or virtual tour",
  "Speak to a professional working in my target career",
  "Build a beginner project related to my major",
  "Improve my language skills for international study",
  "Prepare a personal statement draft",
  "Shadow or intern in a relevant workplace",
  "Join a club or activity linked to my interests",
  "Set a realistic study plan for the next 3 months",
];

const ALL_COUNTRIES = [
  "United States", "United Kingdom", "Germany", "Canada", "Netherlands",
  "Sweden", "Switzerland", "Australia", "France", "Singapore", "Finland",
  "Italy", "Spain", "Japan", "South Korea", "Norway", "Denmark", "Austria",
];

function GoalsEditor() {
  const { account, setGoals } = useAccount();
  const { t } = useLang();
  const goals = account?.savedGoals ?? [];
  const [custom, setCustom] = useState("");

  const toggle = (g: string) => {
    if (goals.includes(g)) setGoals(goals.filter(x => x !== g));
    else setGoals([...goals, g]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed || goals.includes(trimmed)) return;
    setGoals([...goals, trimmed]);
    setCustom("");
  };

  const removeGoal = (g: string) => setGoals(goals.filter(x => x !== g));

  return (
    <div className="space-y-5">
      {goals.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {t("account.goalsYours")} ({goals.length})
          </p>
          <div className="space-y-2">
            {goals.map(g => (
              <div key={g} className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm flex-1 text-foreground">{g}</span>
                <button onClick={() => removeGoal(g)} className="text-muted-foreground hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          {t("account.goalsSuggested")}
        </p>
        <div className="flex flex-wrap gap-2">
          {GOAL_SUGGESTIONS.filter(g => !goals.includes(g)).map(g => (
            <button key={g} onClick={() => toggle(g)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary hover:text-primary transition-colors text-left">
              <Plus className="w-3 h-3 shrink-0" />{g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          {t("account.goalsAddOwn")}
        </p>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCustom()}
            placeholder={t("account.goalsPlaceholder")}
            className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <Button variant="outline" size="sm" onClick={addCustom} disabled={!custom.trim()}>
            <Plus className="w-4 h-4" /> {t("account.goalsBtnAdd")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CountryPicker() {
  const { account, setPreferredCountries } = useAccount();
  const { t } = useLang();
  const selected = account?.preferredCountries ?? [];

  const toggle = (c: string) => {
    if (selected.includes(c)) setPreferredCountries(selected.filter(x => x !== c));
    else setPreferredCountries([...selected, c]);
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4">{t("account.countriesDesc")}</p>
      <div className="flex flex-wrap gap-2">
        {ALL_COUNTRIES.map(c => (
          <button key={c} onClick={() => toggle(c)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              selected.includes(c)
                ? "bg-primary text-white border-primary font-semibold"
                : "bg-background border-border text-foreground hover:border-primary hover:text-primary"
            )}>
            {c}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          {selected.length} {selected.length === 1 ? t("account.countrySelected") : t("account.countriesSelected")}
        </p>
      )}
    </div>
  );
}

function SavedResultCard({ savedResult }: { savedResult: NonNullable<ReturnType<typeof useAccount>["account"]>["savedResult"] }) {
  const [, setLocation] = useLocation();
  const { t } = useLang();

  if (!savedResult) return (
    <div className="text-center py-10 text-muted-foreground">
      <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{t("account.noResultsYet")}</p>
      <p className="text-xs mt-1">{t("account.noResultsDesc")}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => setLocation("/questionnaire")}>
        {t("account.takeQuizBtn")}
      </Button>
    </div>
  );

  const { results, profile, savedAt } = savedResult;
  const date = new Date(savedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("account.savedOn")} {date}</span>
        <button onClick={() => setLocation("/results")} className="flex items-center gap-1 text-primary font-semibold hover:underline">
          {t("account.viewFullResults")} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-xl shrink-0">{profile.icon}</div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("account.studentProfile")}</p>
          <p className="font-display font-bold text-base">{profile.label}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("account.yourTopMatches")}</p>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={r.major} className={cn(
              "flex items-center gap-3 rounded-xl border p-3",
              i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
            )}>
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {i === 0 ? <Trophy className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.major}</p>
                <p className="text-xs text-muted-foreground">{r.confidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Section = "results" | "goals" | "countries";

export default function Account() {
  const { account, logout } = useAccount();
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState<Section>("results");

  if (!account) {
    setLocation("/auth");
    return null;
  }

  const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "results", label: t("account.navSavedResults"), icon: Star },
    { id: "goals", label: t("account.navGoals"), icon: Target },
    { id: "countries", label: t("account.navCountries"), icon: Globe },
  ];

  const STATS = [
    { label: t("account.statTopMajor"), value: account.savedResult?.results[0]?.major?.split(" & ")[0] ?? "—", icon: Star },
    { label: t("account.statGoals"), value: account.savedGoals.length.toString(), icon: Target },
    { label: t("account.statCountries"), value: account.preferredCountries.length.toString(), icon: Globe },
  ];

  const handleLogout = () => { logout(); setLocation("/"); };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[50%] h-[60%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("account.yourAccount")}</p>
              <h1 className="text-2xl font-display font-extrabold">{account.username}</h1>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-600 hover:border-red-200 self-start sm:self-center">
            <LogOut className="w-4 h-4 mr-1.5" /> {t("account.signOut")}
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {STATS.map(s => (
            <Card key={s.label} className="p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1.5 text-primary opacity-70" />
              <p className="text-lg font-display font-bold leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">

          {/* Sidebar nav */}
          <div className="flex md:flex-col gap-2">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  section === n.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                <n.icon className="w-4 h-4 shrink-0" />{n.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <Card className="p-6">
            {section === "results" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Star className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navSavedResults")}</h2>
                </div>
                <SavedResultCard savedResult={account.savedResult} />
              </>
            )}

            {section === "goals" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Target className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navGoals")}</h2>
                </div>
                <GoalsEditor />
              </>
            )}

            {section === "countries" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navCountries")}</h2>
                </div>
                <CountryPicker />
              </>
            )}
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-sm">{t("account.retakePrompt")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("account.retakeDesc")}</p>
          </div>
          <Button onClick={() => setLocation("/questionnaire")} size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> {t("account.startQuestionnaire")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
