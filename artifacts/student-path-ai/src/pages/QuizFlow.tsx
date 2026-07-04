import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  saveAnswers, saveResults, saveProfile, saveConsent, saveHiddenMatch, saveWhyNot,
  saveDraft, getDraft, clearDraft,
  QuestionnaireAnswers,
} from "@/lib/store";
import { calculateResults, getProfileType } from "@/lib/matching";
import { QUIZ_OPTIONS, SCENARIO_OPTIONS, type LikertId, type ScenarioField } from "@/lib/quizOptions";
import { Check, ChevronRight, ChevronLeft, ShieldCheck, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useAccount } from "@/contexts/AccountContext";

// ─── Step definitions ─────────────────────────────────────────────────────────
type OptionStepId = keyof typeof QUIZ_OPTIONS;

type StepDef =
  | { kind: "options"; id: OptionStepId; multi: boolean }
  | { kind: "likert"; id: string; statements: LikertId[] }
  | { kind: "scenario"; id: ScenarioField };

const QUICK_STEPS: StepDef[] = [
  { kind: "options", id: "subjects", multi: true },
  { kind: "options", id: "interests", multi: true },
  { kind: "options", id: "strengths", multi: true },
  { kind: "options", id: "workStyle", multi: false },
  { kind: "options", id: "careerEnv", multi: false },
  { kind: "options", id: "learningApproach", multi: false },
  { kind: "options", id: "workOrientation", multi: false },
  { kind: "options", id: "futureGoals", multi: true },
  { kind: "options", id: "budgetLevel", multi: false },
];

// Detailed mode interleaves likert self-checks and scenario questions between
// the canonical steps, so the flow stays varied instead of form-like.
const DETAILED_STEPS: StepDef[] = [
  { kind: "options", id: "subjects", multi: true },
  { kind: "options", id: "interests", multi: true },
  { kind: "options", id: "strengths", multi: true },
  { kind: "likert", id: "likert1", statements: ["solveLogic", "buildThings", "expressArt", "helpPeople"] },
  { kind: "options", id: "workStyle", multi: false },
  { kind: "options", id: "careerEnv", multi: false },
  { kind: "likert", id: "likert2", statements: ["leadGroup", "curiousScience", "ventureSpirit", "fixTech"] },
  { kind: "options", id: "learningApproach", multi: false },
  { kind: "scenario", id: "scenarioProject" },
  { kind: "options", id: "workOrientation", multi: false },
  { kind: "likert", id: "likert3", statements: ["dataPatterns", "empathize", "publicSpeak", "experiment"] },
  { kind: "options", id: "futureGoals", multi: true },
  { kind: "scenario", id: "scenarioFreeDay" },
  { kind: "likert", id: "likert4", statements: ["aesthetics", "organizeEvents", "debateIdeas", "natureOutdoors"] },
  { kind: "options", id: "budgetLevel", multi: false },
];

const STEP_HINT_KEYS: Record<OptionStepId, string> = {
  subjects: "steps.selectAll",
  interests: "steps.selectAll",
  strengths: "steps.selectAll",
  workStyle: "steps.selectOne",
  careerEnv: "steps.selectOneResonates",
  learningApproach: "steps.selectOneFits",
  workOrientation: "steps.selectOne",
  futureGoals: "steps.selectAll",
  budgetLevel: "steps.selectOneDescribes",
};

// ─── Consent screen ───────────────────────────────────────────────────────────
function ConsentScreen({ onAgree, onDecline }: { onAgree: () => void; onDecline: () => void }) {
  const { t } = useLang();
  const bullets = [t("consent.bullet1"), t("consent.bullet2"), t("consent.bullet3"), t("consent.bullet4")];
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/8 to-secondary/5 p-8 sm:p-10 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">{t("consent.label")}</p>
              <h2 className="text-2xl font-display font-bold">{t("consent.title")}</h2>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("consent.description")}</p>
        </div>
        <div className="p-8 sm:p-10 space-y-5">
          <div className="space-y-3 text-sm text-muted-foreground">
            {bullets.map((bullet, i) => (
              <div key={i} className="flex gap-3">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
            <span dangerouslySetInnerHTML={{ __html: t("consent.notice") }} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="lg" className="flex-1" onClick={onAgree}>
              <ShieldCheck className="w-4 h-4 mr-2" />{t("consent.agree")}
            </Button>
            <Button variant="outline" size="lg" onClick={onDecline} className="sm:w-auto">{t("consent.decline")}</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function DeclineScreen({ onBack }: { onBack: () => void }) {
  const { t } = useLang();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-display font-bold mb-3">{t("consent.declinedTitle")}</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">{t("consent.declinedBody")}</p>
      <Button onClick={onBack} variant="outline">{t("consent.goBack")}</Button>
    </motion.div>
  );
}

// ─── Processing screen ────────────────────────────────────────────────────────
function ProcessingScreen() {
  const { t } = useLang();
  const stages = [t("processing.stage1"), t("processing.stage2"), t("processing.stage3")];
  const [stage, setStage] = useState(0);
  useState(() => {
    const id = setInterval(() => setStage(s => Math.min(s + 1, stages.length - 1)), 600);
    return () => clearInterval(id);
  });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto text-center py-20">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
      <h2 className="text-2xl font-display font-bold mb-2">{t("processing.title")}</h2>
      <AnimatePresence mode="wait">
        <motion.p key={stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-muted-foreground">
          {stages[stage]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
type Screen = "consent" | "declined" | "quiz" | "processing";

export default function QuizFlow({ mode }: { mode: "quick" | "detailed" }) {
  const [, setLocation] = useLocation();
  const { t, tOpt } = useLang();
  const { account } = useAccount();
  const [screen, setScreen] = useState<Screen>("consent");
  const [currentStep, setCurrentStep] = useState(0);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const STEPS = mode === "detailed" ? DETAILED_STEPS : QUICK_STEPS;

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    subjects: [], interests: [], strengths: [],
    workStyle: "", careerEnv: "", learningApproach: "",
    workOrientation: "", futureGoals: [], budgetLevel: "",
    likert: {}, scenarios: [], mode,
  });

  const step = STEPS[currentStep];

  // On mount: check for a saved draft (same mode, less than 24h old) and offer to resume
  useEffect(() => {
    const draft = getDraft();
    if (!draft) return;
    const draftMode = (draft.answers as QuestionnaireAnswers).mode ?? "quick";
    if (draftMode !== mode) return;
    const ageMs = Date.now() - new Date(draft.savedAt).getTime();
    if (ageMs > 24 * 60 * 60 * 1000) { clearDraft(); return; }
    toast("Resume your questionnaire?", {
      description: "You have saved progress from earlier.",
      action: {
        label: "Resume",
        onClick: () => {
          setAnswers({ likert: {}, scenarios: [], ...(draft.answers as QuestionnaireAnswers), mode });
          setCurrentStep(Math.min(draft.step, STEPS.length - 1));
          setScreen("quiz");
        },
      },
      cancel: { label: "Start fresh", onClick: () => clearDraft() },
      duration: 8000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft whenever answers or step change (functional updates below keep
  // rapid consecutive clicks — e.g. filling a likert grid quickly — from losing state).
  useEffect(() => {
    if (screen === "quiz") saveDraft(answers, currentStep);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, currentStep]);

  const toggleOption = (stepId: OptionStepId, multi: boolean, option: string) => {
    setAnswers(prev => {
      if (!multi) return { ...prev, [stepId]: option };
      const current = prev[stepId as "subjects"] as string[];
      return { ...prev, [stepId]: current.includes(option) ? current.filter(o => o !== option) : [...current, option] };
    });
  };

  const chooseScenario = (sf: ScenarioField, option: string) => {
    setAnswers(prev => ({
      ...prev,
      scenarios: [...(prev.scenarios ?? []).filter(s => !SCENARIO_OPTIONS[sf].includes(s)), option],
    }));
  };

  const setLikert = (id: LikertId, value: number) => {
    setAnswers(prev => ({ ...prev, likert: { ...(prev.likert ?? {}), [id]: value } }));
  };

  const canProceed = () => {
    if (step.kind === "options") {
      const v = answers[step.id as "subjects"];
      return Array.isArray(v) ? v.length > 0 : v !== "";
    }
    if (step.kind === "likert") {
      return step.statements.every(id => (answers.likert ?? {})[id] != null);
    }
    return (answers.scenarios ?? []).some(s => SCENARIO_OPTIONS[step.id].includes(s));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(p => p + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setScreen("processing");
    clearDraft();
    setTimeout(() => {
      saveAnswers(answers);
      const { results, hiddenMatch, whyNot } = calculateResults(answers);
      saveResults(results);
      saveHiddenMatch(hiddenMatch);
      saveWhyNot(whyNot);
      saveProfile(getProfileType(answers));
      setLocation("/results");
    }, 2000);
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (screen === "consent") return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <ConsentScreen onAgree={() => { saveConsent(); setScreen("quiz"); }} onDecline={() => setScreen("declined")} />
    </div>
  );

  if (screen === "declined") return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <DeclineScreen onBack={() => setScreen("consent")} />
    </div>
  );

  if (screen === "processing") return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <ProcessingScreen />
    </div>
  );

  // Per-step header content
  const hintKey = step.kind === "options" ? STEP_HINT_KEYS[step.id]
    : step.kind === "likert" ? "likert.hint"
    : "steps.selectOne";
  const question = step.kind === "likert" ? t("likert.groupTitle") : t(`steps.${step.id}.question`);
  const description = step.kind === "likert" ? t("likert.groupDescription") : t(`steps.${step.id}.description`);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">

        {/* Account nudge banner */}
        {!account && !nudgeDismissed && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/60 px-4 py-3.5">
            <div className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{t("auth.nudgeBannerTitle")}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t("auth.nudgeBannerDesc")}</p>
              <Link href="/auth"
                className="inline-block mt-2 text-xs font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
                {t("auth.nudgeBannerBtn")} →
              </Link>
            </div>
            <button
              onClick={() => setNudgeDismissed(true)}
              aria-label={t("auth.nudgeBannerDismiss")}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Question {currentStep + 1} / {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-3 gap-0.5">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-1 rounded-full flex-1 transition-all duration-300",
                i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary/50" : "bg-border")} />
            ))}
          </div>
        </div>

        <Card className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }} className="p-7 sm:p-10"
            >
              <div className="mb-7">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                  {t(hintKey)}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold mt-3 mb-2 leading-snug">{question}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>

              {step.kind === "likert" ? (
                <div className="space-y-4">
                  {step.statements.map((id) => {
                    const val = (answers.likert ?? {})[id];
                    return (
                      <div key={id} className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200",
                        val != null ? "border-primary/40 bg-primary/[0.03]" : "border-border bg-card"
                      )}>
                        <p className="font-medium text-sm leading-snug mb-3">{t(`likert.${id}`)}</p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground w-14 sm:w-16 shrink-0 leading-tight">{t("likert.disagree")}</span>
                          <div className="flex flex-1 gap-1.5 sm:gap-2">
                            {[1, 2, 3, 4, 5].map(v => (
                              <button
                                key={v}
                                onClick={() => setLikert(id, v)}
                                aria-label={`${t(`likert.${id}`)} — ${v}/5`}
                                className={cn(
                                  "h-9 sm:h-10 flex-1 rounded-lg border-2 text-xs font-bold transition-all duration-150",
                                  val === v
                                    ? "bg-primary border-primary text-white shadow-[0_0_14px_rgba(59,130,246,0.25)] scale-[1.04]"
                                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-card"
                                )}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground w-14 sm:w-16 shrink-0 text-right leading-tight">{t("likert.agree")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={cn("grid gap-3", (step.kind === "options" ? QUIZ_OPTIONS[step.id] : SCENARIO_OPTIONS[step.id]).length > 6 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                  {(step.kind === "options" ? QUIZ_OPTIONS[step.id] : SCENARIO_OPTIONS[step.id]).map((option) => {
                    const isMulti = step.kind === "options" && step.multi;
                    const isSelected = step.kind === "options"
                      ? (step.multi
                        ? (answers[step.id as "subjects"] as string[]).includes(option)
                        : answers[step.id as "workStyle"] === option)
                      : (answers.scenarios ?? []).includes(option);

                    return (
                      <button
                        key={option}
                        onClick={() => step.kind === "options"
                          ? toggleOption(step.id, step.multi, option)
                          : chooseScenario(step.id, option)}
                        className={cn(
                          "flex items-center text-left p-4 rounded-xl border-2 transition-all duration-200 group",
                          isSelected
                            ? "border-primary bg-primary/5 shadow-[0_0_18px_rgba(59,130,246,0.1)]"
                            : "border-border hover:border-primary/40 bg-card hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 shrink-0 flex items-center justify-center mr-3 border-2 transition-all",
                          isMulti ? "rounded-md" : "rounded-full",
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/40 group-hover:border-primary/60"
                        )}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className={cn("font-medium text-sm leading-snug", isSelected ? "text-foreground" : "text-muted-foreground")}>
                          {tOpt(option)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="bg-muted/50 border-t px-7 sm:px-10 py-5 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => { if (currentStep === 0) setLocation("/questionnaire"); else setCurrentStep(p => p - 1); }}
              className="text-muted-foreground"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />{t("common.back")}
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()} className="min-w-[150px]">
              {currentStep === STEPS.length - 1 ? "Discover My Path" : (<>{t("common.next")}<ChevronRight className="w-5 h-5 ml-1" /></>)}
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
