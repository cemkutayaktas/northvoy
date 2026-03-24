export interface QuestionnaireAnswers {
  subjects: string[];
  interests: string[];
  strengths: string[];
  workStyle: string;
  careerEnv: string;
  learningApproach: string;
  workOrientation: string;
  futureGoals: string[];
  budgetLevel: string;
}

export interface PathwayBranch {
  name: string;
  description: string;
  roles: string[];
}

export interface TwelveMonthPlan {
  q1: { title: string; focus: string[] };
  q2: { title: string; focus: string[] };
  q3: { title: string; focus: string[] };
  q4: { title: string; focus: string[] };
}

export interface AlternativeRoute {
  major: string;
  reason: string;
}

export interface MatchResult {
  major: string;
  score: number;
  confidence: "Strong Match" | "Good Match" | "Exploratory Match";
  explanation: string;
  whyItMatches: string[];
  userStrengths: string[];
  skills: string[];
  careers: string[];
  nextSteps: string[];
  countries: { name: string; flag: string }[];
  universities: string[];
  pathways: PathwayBranch[];
  twelveMonthPlan: TwelveMonthPlan | null;
  studyCostLabel: string;
  studyCostColor: string;
  alternativeRoute: AlternativeRoute;
  miniProject: string;
}

export interface HiddenMatch {
  major: string;
  reason: string;
  icon: string;
  skills: string[];
  tag: string;
}

export interface WhyNotEntry {
  major: string;
  reason: string;
  tip: string;
}

export interface ProfileType {
  label: string;
  tagline: string;
  icon: string;
  color: string;
}

const STORAGE_KEY_ANSWERS  = "northpath_answers";
const STORAGE_KEY_RESULTS  = "northpath_results";
const STORAGE_KEY_PROFILE  = "northpath_profile";
const STORAGE_KEY_HIDDEN   = "northpath_hidden";
const STORAGE_KEY_WHYNOT   = "northpath_whynot";
const STORAGE_KEY_CONSENT  = "northpath_consent";

export function saveAnswers(a: QuestionnaireAnswers) { localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(a)); }
export function getAnswers(): QuestionnaireAnswers | null { const d = localStorage.getItem(STORAGE_KEY_ANSWERS); return d ? JSON.parse(d) : null; }

export function saveResults(r: MatchResult[]) { localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(r)); }
export function getResults(): MatchResult[] | null { const d = localStorage.getItem(STORAGE_KEY_RESULTS); return d ? JSON.parse(d) : null; }

export function saveProfile(p: ProfileType) { localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(p)); }
export function getProfile(): ProfileType | null { const d = localStorage.getItem(STORAGE_KEY_PROFILE); return d ? JSON.parse(d) : null; }

export function saveHiddenMatch(h: HiddenMatch) { localStorage.setItem(STORAGE_KEY_HIDDEN, JSON.stringify(h)); }
export function getHiddenMatch(): HiddenMatch | null { const d = localStorage.getItem(STORAGE_KEY_HIDDEN); return d ? JSON.parse(d) : null; }

export function saveWhyNot(w: WhyNotEntry[]) { localStorage.setItem(STORAGE_KEY_WHYNOT, JSON.stringify(w)); }
export function getWhyNot(): WhyNotEntry[] | null { const d = localStorage.getItem(STORAGE_KEY_WHYNOT); return d ? JSON.parse(d) : null; }

export function saveConsent() { localStorage.setItem(STORAGE_KEY_CONSENT, "true"); }
export function hasConsent(): boolean { return localStorage.getItem(STORAGE_KEY_CONSENT) === "true"; }

export function clearData() {
  [STORAGE_KEY_ANSWERS, STORAGE_KEY_RESULTS, STORAGE_KEY_PROFILE, STORAGE_KEY_HIDDEN, STORAGE_KEY_WHYNOT].forEach(k => localStorage.removeItem(k));
}
