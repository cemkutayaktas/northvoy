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
import { Check, ChevronRight, ChevronLeft, ShieldCheck, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useAccount } from "@/contexts/AccountContext";

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  {
    id: "subjects",
    title: "What subjects actually interest you in school?",
    description: "Pick everything that genuinely engages you — not what you think you should say.",
    multi: true,
    hint: "Select all that apply",
  },
  {
    id: "interests",
    title: "Which of these worlds pulls you in?",
    description: "Think about what you read about, talk about, or find yourself curious about beyond school.",
    multi: true,
    hint: "Select all that apply",
  },
  {
    id: "strengths",
    title: "What do people say you're naturally good at?",
    description: "Or what do you notice yourself doing effortlessly, even when others find it hard?",
    multi: true,
    hint: "Select all that apply",
  },
  {
    id: "workStyle",
    title: "On your most energising workday, what are you doing?",
    description: "Picture yourself in your ideal professional environment — what does it look like?",
    multi: false,
    hint: "Choose the one that feels most true",
  },
  {
    id: "careerEnv",
    title: "Where do you picture yourself working in 10 years?",
    description: "Think about the physical and cultural setting, not the job title.",
    multi: false,
    hint: "Choose the one that resonates most",
  },
  {
    id: "learningApproach",
    title: "How do you do your best thinking and learning?",
    description: "When you really understand something deeply, how did you get there?",
    multi: false,
    hint: "Choose the one that fits you best",
  },
  {
    id: "workOrientation",
    title: "What kind of impact do you want your work to have?",
    description: "Set aside practicality for a moment — if your work could do one thing, what would it be?",
    multi: false,
    hint: "Choose the statement that resonates most",
  },
  {
    id: "futureGoals",
    title: "What matters most to you in a career?",
    description: "Be honest — there are no right or wrong answers here.",
    multi: true,
    hint: "Select all that apply",
  },
  {
    id: "budgetLevel",
    title: "How would you describe your flexibility with study costs?",
    description: "This helps us tailor university suggestions to options that are realistic for you.",
    multi: false,
    hint: "Choose the option that describes your situation",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const OPTIONS: Record<StepId, string[]> = {
  subjects: [
    "Mathematics", "Physics", "Chemistry", "Biology", "History",
    "Geography", "Literature / Languages", "Computer Science",
    "Art / Design", "Economics", "Physical Education",
  ],
  interests: [
    "Building technology & software",
    "Launching businesses & startups",
    "Creating visual art & design",
    "Advancing science through research",
    "Helping people with health & wellbeing",
    "Shaping minds through education",
    "Defending justice & policy",
    "Protecting the environment",
    "Supporting communities & social causes",
    "Engineering innovative systems",
  ],
  strengths: [
    "Breaking down complex problems",
    "Thinking creatively and originally",
    "Connecting with and understanding people",
    "Leading and motivating others",
    "Technical or digital skills",
    "Organizing and planning effectively",
    "Researching and digging into topics",
    "Explaining things clearly to others",
    "Staying calm and finding solutions",
  ],
  workStyle: [
    "Analyzing data and patterns",
    "Collaborating and connecting with people",
    "Building or fixing physical things",
    "Designing and creating something new",
    "Working independently on focused tasks",
    "Managing a team toward a shared goal",
  ],
  careerEnv: [
    "A research lab or university",
    "A fast-paced corporate environment",
    "My own startup or business",
    "A creative studio or agency",
    "A school, hospital, or community space",
    "Outdoors or in the field",
    "A hospital or healthcare setting",
    "A government or policy institution",
  ],
  learningApproach: [
    "Reading deeply and theorizing",
    "Hands-on practice and experimentation",
    "Creative exploration and play",
    "Group projects and discussion",
    "Solo deep-dives and self-study",
    "Data analysis and structured reasoning",
  ],
  workOrientation: [
    "Push the boundaries of scientific knowledge",
    "Build products that millions of people use",
    "Lead teams and shape organizations",
    "Bring beauty and meaning into the world",
    "Directly improve people's lives day to day",
    "Find patterns that explain complex phenomena",
  ],
  futureGoals: [
    "Having meaningful impact in the world",
    "Earning well and building financial security",
    "Using my creativity freely",
    "Helping people directly every day",
    "Being at the cutting edge of innovation",
    "Building systems and technology",
    "Influencing policy and social change",
    "Understanding the world at a deep level",
  ],
  budgetLevel: [
    "I prefer more affordable options — local or lower-cost universities",
    "I'm open to moderate costs, including some international options",
    "I'm fully open to top universities anywhere, regardless of cost",
  ],
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

// ─── i18n step key to translation key map ────────────────────────────────────
const STEP_HINT_KEYS: Record<StepId, string> = {
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

// ─── Main component ───────────────────────────────────────────────────────────
type Screen = "consent" | "declined" | "quiz" | "processing";

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const { t, tOpt } = useLang();
  const { account } = useAccount();
  const [screen, setScreen] = useState<Screen>("consent");
  const [currentStep, setCurrentStep] = useState(0);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    subjects: [], interests: [], strengths: [],
    workStyle: "", careerEnv: "", learningApproach: "",
    workOrientation: "", futureGoals: [], budgetLevel: "",
  });

  const step = STEPS[currentStep];
  const stepKey = step.id as StepId;
  const isMulti = step.multi;

  // On mount: check for a saved draft (less than 24h old) and offer to resume
  useEffect(() => {
    const draft = getDraft();
    if (!draft) return;
    const ageMs = Date.now() - new Date(draft.savedAt).getTime();
    if (ageMs > 24 * 60 * 60 * 1000) { clearDraft(); return; }
    toast("Resume your questionnaire?", {
      description: "You have saved progress from earlier.",
      action: {
        label: "Resume",
        onClick: () => {
          setAnswers(draft.answers as QuestionnaireAnswers);
          setCurrentStep(draft.step);
          setScreen("quiz");
        },
      },
      cancel: { label: "Start fresh", onClick: () => clearDraft() },
      duration: 8000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOption = (option: string) => {
    let updated: QuestionnaireAnswers;
    if (isMulti) {
      const current = answers[stepKey] as string[];
      updated = { ...answers, [stepKey]: current.includes(option) ? current.filter(o => o !== option) : [...current, option] };
    } else {
      updated = { ...answers, [stepKey]: option };
    }
    setAnswers(updated);
    saveDraft(updated, currentStep);
  };

  const canProceed = () => {
    const v = answers[stepKey];
    return Array.isArray(v) ? v.length > 0 : v !== "";
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveDraft(answers, nextStep);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setScreen("processing");
    clearDraft(); // Remove draft once quiz is completed
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-3xl mx-auto">

        {/* Account nudge banner */}
        {!account && !nudgeDismissed && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/30 dark:border-primary/50 bg-primary/8 dark:bg-primary/20 px-4 py-3.5">
            <div className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-primary/15 dark:bg-primary/30 flex items-center justify-center">
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
                  {t(STEP_HINT_KEYS[stepKey])}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold mt-3 mb-2 leading-snug">{t(`steps.${stepKey}.question`)}</h2>
                <p className="text-sm text-muted-foreground">{t(`steps.${stepKey}.description`)}</p>
              </div>

              <div className={cn("grid gap-3", OPTIONS[stepKey].length > 6 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                {OPTIONS[stepKey].map((option) => {
                  const isSelected = isMulti
                    ? (answers[stepKey] as string[]).includes(option)
                    : answers[stepKey] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => toggleOption(option)}
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
            </motion.div>
          </AnimatePresence>

          <div className="bg-muted/50 border-t px-7 sm:px-10 py-5 flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => { if (currentStep === 0) setScreen("consent"); else setCurrentStep(p => p - 1); }}
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
