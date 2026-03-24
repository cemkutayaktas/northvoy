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
  passwordHash: string;
  createdAt: string;
  savedResult: SavedResult | null;
  savedGoals: string[];
  preferredCountries: string[];
}

const ACCOUNTS_KEY = "northpath_accounts";
const CURRENT_KEY = "northpath_current_account";

// ─── Password hashing (SHA-256 via SubtleCrypto) ─────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "northpath_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ─── Email validation ────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// ─── Password validation ─────────────────────────────────────────────────────
export interface PasswordCheck {
  valid: boolean;
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}

export function checkPassword(password: string): PasswordCheck {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return {
    valid: minLength && hasUppercase && hasLowercase && hasNumber,
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
  };
}

// ─── Storage helpers ─────────────────────────────────────────────────────────
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

export async function registerAccount(username: string, email: string, password: string): Promise<{ ok: boolean; error?: string; account?: Account }> {
  const trimmedEmail = email.trim().toLowerCase();

  // Validate email format
  if (!isValidEmail(trimmedEmail)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  // Validate password strength
  const pwCheck = checkPassword(password);
  if (!pwCheck.valid) {
    return { ok: false, error: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number." };
  }

  // Check duplicate email
  const accounts = loadAccounts();
  if (accounts.find(a => a.email === trimmedEmail)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  // Validate username
  if (!username.trim() || username.trim().length < 2) {
    return { ok: false, error: "Username must be at least 2 characters." };
  }

  const hashed = await hashPassword(password);
  const account: Account = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    username: username.trim(),
    email: trimmedEmail,
    passwordHash: hashed,
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

export async function loginAccount(email: string, password: string): Promise<{ ok: boolean; error?: string; account?: Account }> {
  const accounts = loadAccounts();
  const trimmedEmail = email.trim().toLowerCase();
  const account = accounts.find(a => a.email === trimmedEmail);
  if (!account) return { ok: false, error: "No account found with this email." };

  const hashed = await hashPassword(password);

  // Support both old plaintext (legacy) and new hashed passwords
  const passwordMatch = account.passwordHash === hashed
    || (account as any).password === password; // Legacy fallback

  if (!passwordMatch) return { ok: false, error: "Incorrect password." };

  // Migrate legacy plaintext password to hashed
  if ((account as any).password && !account.passwordHash) {
    const idx = accounts.findIndex(a => a.id === account.id);
    if (idx !== -1) {
      accounts[idx] = { ...accounts[idx], passwordHash: hashed };
      delete (accounts[idx] as any).password;
      saveAccounts(accounts);
    }
  }

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
