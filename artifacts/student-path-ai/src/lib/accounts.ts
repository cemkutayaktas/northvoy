import { MatchResult, ProfileType, HiddenMatch, WhyNotEntry, QuestionnaireAnswers } from "./store";

export interface SavedResult {
  results: MatchResult[];
  profile: ProfileType;
  hidden: HiddenMatch | null;
  whyNot: WhyNotEntry[] | null;
  answers: QuestionnaireAnswers;
  savedAt: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  savedResult: SavedResult | null;
  savedGoals: string[];
  preferredCountries: string[];
}

const ACCOUNTS_KEY = "northpath_accounts";
const CURRENT_KEY = "northpath_current_account";

function loadAccounts(): Account[] {
  try {
    const d = localStorage.getItem(ACCOUNTS_KEY);
    return d ? JSON.parse(d) : [];
  } catch { return []; }
}

function saveAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getAllAccounts(): Account[] { return loadAccounts(); }

export function getCurrentAccountId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

export function getCurrentAccount(): Account | null {
  const id = getCurrentAccountId();
  if (!id) return null;
  return loadAccounts().find(a => a.id === id) ?? null;
}

export function setCurrentAccount(id: string | null) {
  if (id) localStorage.setItem(CURRENT_KEY, id);
  else localStorage.removeItem(CURRENT_KEY);
}

export function registerAccount(username: string, email: string, password: string): { ok: boolean; error?: string; account?: Account } {
  const accounts = loadAccounts();
  if (accounts.find(a => a.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const account: Account = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
    savedResult: null,
    savedGoals: [],
    preferredCountries: [],
  };
  accounts.push(account);
  saveAccounts(accounts);
  setCurrentAccount(account.id);
  return { ok: true, account };
}

export function loginAccount(email: string, password: string): { ok: boolean; error?: string; account?: Account } {
  const accounts = loadAccounts();
  const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (!account) return { ok: false, error: "No account found with this email." };
  if (account.password !== password) return { ok: false, error: "Incorrect password." };
  setCurrentAccount(account.id);
  return { ok: true, account };
}

export function logoutAccount() {
  setCurrentAccount(null);
}

function updateAccount(id: string, changes: Partial<Account>) {
  const accounts = loadAccounts();
  const idx = accounts.findIndex(a => a.id === id);
  if (idx === -1) return;
  accounts[idx] = { ...accounts[idx], ...changes };
  saveAccounts(accounts);
}

export function saveResultToAccount(id: string, data: SavedResult) {
  updateAccount(id, { savedResult: data });
}

export function updateAccountGoals(id: string, goals: string[]) {
  updateAccount(id, { savedGoals: goals });
}

export function updatePreferredCountries(id: string, countries: string[]) {
  updateAccount(id, { preferredCountries: countries });
}
