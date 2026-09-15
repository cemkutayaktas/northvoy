/**
 * Product analytics — a thin, typed layer over the GA4 gtag that index.html
 * already loads. No second provider.
 *
 * Journey measured:
 *   page_view → quiz_start → quiz_step_complete… → quiz_complete → results_view
 *   → signup_cta_click / signup_start / signup_complete / login_success
 *   → share_click / share_success → pdf_download_click / pdf_generated
 *   → feedback_submit
 *
 * Rules:
 *  - Every event name describes something actually observed. A click is never
 *    recorded as a success; successes fire only after the underlying call
 *    resolves (share API / clipboard resolved, PDF generated without throwing,
 *    Supabase insert returned no error).
 *  - No PII: no names, emails, free text, or raw questionnaire answers. Params
 *    are restricted to the typed allowlist below.
 *  - page_location is sanitised: only utm_* query params survive. The share
 *    link's encoded answers and Supabase's auth tokens in the URL hash never
 *    reach GA4.
 *  - Duplicates from rerenders / StrictMode / refresh are suppressed with
 *    once-keys scoped to the quiz attempt or the current session.
 *  - Respects the browser's Global Privacy Control signal.
 */

export type QuizMode = "quick" | "detailed";
export type Lang = "en" | "tr" | "de";

type Params = {
  quiz_mode?: QuizMode;
  lang?: Lang;
  attempt_id?: string;
  step_id?: string;
  step_index?: number;
  step_total?: number;
  top_major?: string;          // the product's own category output, not personal data
  confidence?: string;
  method?: "native" | "clipboard_text" | "clipboard_link";
  source?: string;             // which CTA / gate triggered a signup intent
  requires_confirmation?: boolean;
  helped?: "yes" | "somewhat" | "no";
  wants?: string;              // comma-joined option KEYS, never free text
  page_location?: string;
  page_path?: string;
};

const ATTEMPT_KEY = "northvoy_attempt";
const RESULTS_ID_KEY = "northvoy_results_id";

function gtagAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

function privacyOptOut(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function currentLang(): Lang {
  try {
    const l = localStorage.getItem("northvoy_lang");
    return l === "tr" || l === "de" ? l : "en";
  } catch { return "en"; }
}

/** Keep only campaign attribution params; drop share payloads, tokens, hashes. */
export function sanitizeLocation(href: string): string {
  try {
    const u = new URL(href);
    const keep = new URLSearchParams();
    for (const [k, v] of u.searchParams) if (/^utm_/i.test(k)) keep.set(k, v);
    u.search = keep.toString() ? `?${keep.toString()}` : "";
    u.hash = "";
    return u.toString();
  } catch { return ""; }
}

function fire(name: string, params: Params = {}): void {
  if (!gtagAvailable() || privacyOptOut()) return;
  const clean: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) clean[k] = v;
  if (clean.lang === undefined) clean.lang = currentLang();
  window.gtag("event", name, clean);
}

// ─── Once-keys ────────────────────────────────────────────────────────────────
// sessionStorage survives React rerenders and in-app navigation but not a new
// tab/session; a module-level Set catches StrictMode double effects even if
// storage is unavailable.
const memoryOnce = new Set<string>();
function once(key: string, scope: "session" | "local" = "session"): boolean {
  const k = `northvoy_ev_${key}`;
  if (memoryOnce.has(k)) return false;
  memoryOnce.add(k);
  try {
    const store = scope === "local" ? localStorage : sessionStorage;
    if (store.getItem(k)) return false;
    store.setItem(k, "1");
  } catch { /* storage unavailable — memory set still dedupes this page load */ }
  return true;
}

// ─── Page views (existing behaviour, now sanitised) ───────────────────────────
export function pageView(path: string): void {
  fire("page_view", { page_path: path, page_location: sanitizeLocation(window.location.href) });
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
interface Attempt { id: string; mode: QuizMode }

function readAttempt(): Attempt | null {
  try { const raw = localStorage.getItem(ATTEMPT_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

/**
 * Called when the user enters the quiz screen. Creates an attempt id and fires
 * quiz_start ONLY if there is no in-progress attempt for this mode (resuming a
 * saved draft is not a new start).
 */
export function quizStarted(mode: QuizMode, resumed: boolean): string {
  const existing = readAttempt();
  if (resumed && existing && existing.mode === mode) return existing.id;
  const id = (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify({ id, mode })); } catch { /* ignore */ }
  fire("quiz_start", { quiz_mode: mode, attempt_id: id });
  return id;
}

/** Fires once per (attempt, step); going back and forward again does not double count. */
export function quizStepCompleted(mode: QuizMode, stepId: string, stepIndex: number, stepTotal: number): void {
  const a = readAttempt();
  if (!a || !once(`step_${a.id}_${stepId}`, "local")) return;
  fire("quiz_step_complete", { quiz_mode: mode, attempt_id: a.id, step_id: stepId, step_index: stepIndex, step_total: stepTotal });
}

/** Fires once per attempt, when results are computed and stored. */
export function quizCompleted(mode: QuizMode, topMajor: string, confidence: string): void {
  const a = readAttempt();
  const id = a?.id ?? "unknown";
  if (!once(`complete_${id}`, "local")) return;
  fire("quiz_complete", { quiz_mode: mode, attempt_id: id, top_major: topMajor, confidence });
  try {
    localStorage.setItem(RESULTS_ID_KEY, id);
    localStorage.removeItem(ATTEMPT_KEY);
  } catch { /* ignore */ }
}

export function currentResultsId(): string | null {
  try { return localStorage.getItem(RESULTS_ID_KEY); } catch { return null; }
}

// ─── Results ──────────────────────────────────────────────────────────────────
/** Once per results set per session (a fresh visit tomorrow is a genuine new view). */
export function resultsViewed(mode: QuizMode | undefined, topMajor: string, confidence: string, shared: boolean): void {
  const id = shared ? "shared" : currentResultsId() ?? "unknown";
  if (!once(`results_${id}`)) return;
  fire("results_view", { quiz_mode: mode, attempt_id: id, top_major: topMajor, confidence, source: shared ? "shared_link" : "own" });
}

export function signupCtaClicked(source: string): void {
  fire("signup_cta_click", { source });
}

// ─── Share / PDF ──────────────────────────────────────────────────────────────
export function shareClicked(method: Params["method"]): void { fire("share_click", { method }); }
/** Only after navigator.share resolved or clipboard.writeText resolved. */
export function shareSucceeded(method: Params["method"]): void { fire("share_success", { method }); }

export function pdfDownloadClicked(): void { fire("pdf_download_click"); }
/**
 * The PDF was generated and handed to the browser's download without throwing.
 * Whether the user keeps the file cannot be observed, hence the name.
 */
export function pdfGenerated(): void { fire("pdf_generated"); }

// ─── Auth ─────────────────────────────────────────────────────────────────────
/** Form submitted and passed client validation (a request is being made). */
export function signupStarted(): void { fire("signup_start"); }
/** Supabase created the account. Email confirmation may still be pending. */
export function signupCompleted(requiresConfirmation: boolean): void {
  fire("signup_complete", { requires_confirmation: requiresConfirmation });
}
/** A session was established (password login, or first login after confirming email). */
export function loginSucceeded(): void { fire("login_success"); }

// ─── Feedback ─────────────────────────────────────────────────────────────────
/** Only after the feedback row was stored. Never includes the free-text note. */
export function feedbackSubmitted(mode: QuizMode | undefined, helped: Params["helped"], wants: string[]): void {
  fire("feedback_submit", { quiz_mode: mode, helped, wants: wants.join(",") });
}
