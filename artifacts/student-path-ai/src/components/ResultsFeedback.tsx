import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageSquareHeart, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/contexts/LanguageContext";
import { useAccount } from "@/contexts/AccountContext";
import { currentResultsId, feedbackSubmitted, type QuizMode } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const WANT_KEYS = [
  "choosing_between_majors", "universities", "costs_scholarships",
  "applications", "career_outlook", "talking_to_family", "other",
] as const;
type WantKey = (typeof WANT_KEYS)[number];
type Helped = "yes" | "somewhat" | "no";

const NOTE_MAX = 500;
const storageKey = (id: string) => `northvoy_feedback_${id}`;

/**
 * Optional, non-blocking feedback after results. Insert-only into Supabase
 * (RLS: nobody can read it back through the client). One submission per quiz
 * attempt, enforced client-side (localStorage) and server-side (unique index).
 * The free-text note never goes to analytics.
 */
export function ResultsFeedback({ quizMode, topMajor }: { quizMode?: QuizMode; topMajor?: string }) {
  const { t, lang } = useLang();
  const { account } = useAccount();
  const resultsId = currentResultsId();

  const [helped, setHelped] = useState<Helped | null>(null);
  const [wants, setWants] = useState<Set<WantKey>>(new Set());
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "dismissed">(() => {
    try {
      const v = resultsId ? localStorage.getItem(storageKey(resultsId)) : null;
      return v === "sent" ? "sent" : v === "dismissed" ? "dismissed" : "idle";
    } catch { return "idle"; }
  });

  if (!resultsId || status === "dismissed") return null;

  const remember = (v: "sent" | "dismissed") => { try { localStorage.setItem(storageKey(resultsId), v); } catch { /* ignore */ } };

  const toggleWant = (k: WantKey) =>
    setWants(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const submit = async () => {
    if (!helped || status === "sending") return;
    setStatus("sending");
    const wantsArr = [...wants];
    const { error } = await supabase.from("results_feedback").insert({
      attempt_id: resultsId,
      user_id: account?.id ?? null,
      helped,
      wants: wantsArr,
      note: note.trim().slice(0, NOTE_MAX) || null,
      lang,
      quiz_mode: quizMode ?? null,
      top_major: topMajor?.slice(0, 80) ?? null,
    });
    if (error) {
      // 23505 = unique violation: this attempt already has feedback — treat as sent.
      if (error.code === "23505") { remember("sent"); setStatus("sent"); return; }
      console.error("feedback insert failed:", error.message);
      setStatus("error");
      return;
    }
    remember("sent");
    feedbackSubmitted(quizMode, helped, wantsArr); // categorical only — the note stays private
    setStatus("sent");
  };

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5 flex items-start gap-3 mb-8">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90">{t("feedback.thanks")}</p>
        </motion.div>
      ) : (
        <motion.section key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          aria-labelledby="feedback-title"
          className="relative rounded-2xl border border-border bg-card p-5 sm:p-6 mb-8">
          <button type="button" onClick={() => { remember("dismissed"); setStatus("dismissed"); }}
            aria-label={t("feedback.dismiss")}
            className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3 pr-8">
            <MessageSquareHeart className="w-5 h-5 text-primary shrink-0" />
            <h2 id="feedback-title" className="font-display font-bold text-base sm:text-lg leading-snug">{t("feedback.title")}</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label={t("feedback.title")}>
            {(["yes", "somewhat", "no"] as Helped[]).map(h => (
              <button key={h} type="button" onClick={() => setHelped(h)} aria-pressed={helped === h}
                className={cn(
                  "min-h-11 px-4 rounded-xl border-2 text-sm font-semibold transition-all touch-manipulation",
                  helped === h ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40",
                )}>
                {t(`feedback.${h}`)}
              </button>
            ))}
          </div>

          {helped && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
              <p className="text-sm font-semibold mb-1">{t("feedback.wantsTitle")}</p>
              <p className="text-xs text-muted-foreground mb-3">{t("feedback.wantsHint")}</p>
              <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t("feedback.wantsTitle")}>
                {WANT_KEYS.map(k => (
                  <button key={k} type="button" onClick={() => toggleWant(k)} aria-pressed={wants.has(k)}
                    className={cn(
                      "min-h-10 px-3.5 rounded-full border text-xs sm:text-sm font-medium transition-all touch-manipulation",
                      wants.has(k) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40",
                    )}>
                    {t(`feedback.want_${k}`)}
                  </button>
                ))}
              </div>
              <textarea
                value={note} onChange={e => setNote(e.target.value.slice(0, NOTE_MAX))}
                maxLength={NOTE_MAX} rows={2}
                placeholder={t("feedback.notePlaceholder")}
                aria-label={t("feedback.notePlaceholder")}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-y mb-1"
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-4">
                <span>{t("feedback.privacy")}</span>
                <span aria-live="polite">{note.length}/{NOTE_MAX}</span>
              </div>
              {status === "error" && <p role="alert" className="text-sm text-red-500 mb-3">{t("feedback.error")}</p>}
              <button type="button" onClick={submit} disabled={status === "sending"}
                className="inline-flex items-center justify-center min-h-11 px-6 rounded-xl font-semibold text-sm text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 transition-colors w-full sm:w-auto">
                {status === "sending" ? t("feedback.sending") : t("feedback.submit")}
              </button>
            </motion.div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
