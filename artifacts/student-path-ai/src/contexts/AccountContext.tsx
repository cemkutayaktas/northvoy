import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { checkPassword } from "@/lib/accounts";

export interface SavedResult {
  results: import("@/lib/store").MatchResult[];
  profile: import("@/lib/store").ProfileType;
  hidden: import("@/lib/store").HiddenMatch | null;
  whyNot: import("@/lib/store").WhyNotEntry[] | null;
  answers: import("@/lib/store").QuestionnaireAnswers;
  savedAt: string;
}

export interface ApplicationDeadline {
  id: string;
  university: string;
  program: string;
  deadline: string; // ISO date string (YYYY-MM-DD)
  status: "planning" | "in-progress" | "submitted" | "accepted" | "rejected";
  notes?: string;
  createdAt: string;
}

export interface Account {
  id: string;
  username: string;
  email: string;
  savedResult: SavedResult | null;
  savedGoals: string[];
  preferredCountries: string[];
  deadlines: ApplicationDeadline[];
}

export interface ExportedData {
  version: 1;
  exportedAt: string;
  username: string;
  email: string;
  savedResult: SavedResult | null;
  savedGoals: string[];
  preferredCountries: string[];
}

interface AccountContextValue {
  account: Account | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ ok: boolean; requiresConfirmation?: boolean; error?: string }>;
  logout: () => void;
  saveResult: (data: SavedResult) => void;
  setGoals: (goals: string[]) => void;
  setPreferredCountries: (countries: string[]) => void;
  setDeadlines: (deadlines: ApplicationDeadline[]) => void;
  changePass: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  exportData: () => ExportedData | null;
  importData: (data: ExportedData) => Promise<{ ok: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  updateUser: (currentPassword: string, newUsername: string) => Promise<{ ok: boolean; error?: string }>;
  updateUserEmail: (currentPassword: string, newEmail: string) => Promise<{ ok: boolean; error?: string }>;
  deleteAcc: () => Promise<{ ok: boolean; error?: string }>;
  refresh: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

async function fetchAccountData(user: User): Promise<Account> {
  const [profileRes, dataRes] = await Promise.all([
    supabase.from("profiles").select("username").eq("id", user.id).single(),
    supabase.from("user_data").select("saved_result, goals, preferred_countries, deadlines").eq("id", user.id).single(),
  ]).catch(() => [null, null] as const);

  // If profile doesn't exist or network error, return fallback
  if (!profileRes || profileRes.error || !profileRes.data) {
    const fallbackUsername = user.user_metadata?.username
      ?? user.email?.split("@")[0]
      ?? "User";
    await Promise.all([
      supabase.from("profiles").upsert({ id: user.id, username: fallbackUsername }),
      supabase.from("user_data").upsert({ id: user.id }),
    ]);
    return {
      id: user.id,
      username: fallbackUsername,
      email: user.email ?? "",
      savedResult: null,
      savedGoals: [],
      preferredCountries: [],
      deadlines: [],
    };
  }

  return {
    id: user.id,
    username: profileRes.data.username,
    email: user.email ?? "",
    savedResult: dataRes.data?.saved_result ?? null,
    savedGoals: dataRes.data?.goals ?? [],
    preferredCountries: dataRes.data?.preferred_countries ?? [],
    deadlines: dataRes.data?.deadlines ?? [],
  };
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAccount = useCallback(async (user: User): Promise<Account> => {
    const data = await fetchAccountData(user);
    setAccount(data);
    return data;
  }, []);

  useEffect(() => {
    // Fallback: stop spinner after 5s even if Supabase is unreachable
    const timeout = setTimeout(() => setLoading(false), 5000);

    // onAuthStateChange fires immediately with INITIAL_SESSION in Supabase v2,
    // so we don't need a separate getSession() call — using both causes race conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      clearTimeout(timeout);
      try {
        if (session?.user) {
          await loadAccount(session.user);
        } else {
          setAccount(null);
        }
      } catch {
        // network error during account load — still stop spinner
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadAccount]);

  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await loadAccount(user);
  }, [loadAccount]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Wrap the ENTIRE login flow (auth + account load) in a single timeout
      // so a hanging loadAccount() can't freeze the button indefinitely.
      const result = await Promise.race([
        (async () => {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) return { ok: false as const, error: error.message };
          if (data.user) await loadAccount(data.user);
          return { ok: true as const };
        })(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Connection timed out. Please check your internet and try again.")),
            15000,
          )
        ),
      ]);
      return result;
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Network error. Please check your connection." };
    }
  }, [loadAccount]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    if (!username.trim() || username.trim().length < 2)
      return { ok: false, error: "Username must be at least 2 characters." };
    const pwCheck = checkPassword(password);
    if (!pwCheck.valid)
      return { ok: false, error: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number." };

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) return { ok: false, error: error.message };
    // If session is null, Supabase requires email confirmation
    const requiresConfirmation = !data.session;
    return { ok: true, requiresConfirmation };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAccount(null);
  }, []);

  const saveResult = useCallback(async (data: SavedResult) => {
    if (!account) return;
    await supabase.from("user_data").upsert({
      id: account.id,
      saved_result: data,
      updated_at: new Date().toISOString(),
    });
    setAccount(prev => prev ? { ...prev, savedResult: data } : null);
  }, [account]);

  const setGoals = useCallback(async (goals: string[]) => {
    if (!account) return;
    await supabase.from("user_data").upsert({
      id: account.id,
      goals,
      updated_at: new Date().toISOString(),
    });
    setAccount(prev => prev ? { ...prev, savedGoals: goals } : null);
  }, [account]);

  const setPreferredCountries = useCallback(async (countries: string[]) => {
    if (!account) return;
    await supabase.from("user_data").upsert({
      id: account.id,
      preferred_countries: countries,
      updated_at: new Date().toISOString(),
    });
    setAccount(prev => prev ? { ...prev, preferredCountries: countries } : null);
  }, [account]);

  const setDeadlines = useCallback(async (deadlines: ApplicationDeadline[]) => {
    if (!account) return;
    await supabase.from("user_data").upsert({
      id: account.id,
      deadlines,
      updated_at: new Date().toISOString(),
    });
    setAccount(prev => prev ? { ...prev, deadlines } : null);
  }, [account]);

  const changePass = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!account) return { ok: false, error: "Not logged in." };
    const pwCheck = checkPassword(newPassword);
    if (!pwCheck.valid)
      return { ok: false, error: "New password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number." };

    // Re-authenticate to verify current password
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: currentPassword,
    });
    if (signInErr) return { ok: false, error: "Current password is incorrect." };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, [account]);

  const exportData = useCallback((): ExportedData | null => {
    if (!account) return null;
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      username: account.username,
      email: account.email,
      savedResult: account.savedResult,
      savedGoals: account.savedGoals,
      preferredCountries: account.preferredCountries,
    };
  }, [account]);

  const importData = useCallback(async (data: ExportedData) => {
    if (!account) return { ok: false, error: "Not logged in." };
    if (!data || data.version !== 1) return { ok: false, error: "Invalid or unsupported backup file." };

    const { error } = await supabase.from("user_data").upsert({
      id: account.id,
      saved_result: data.savedResult,
      goals: data.savedGoals ?? [],
      preferred_countries: data.preferredCountries ?? [],
      updated_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    await refresh();
    return { ok: true };
  }, [account, refresh]);

  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, []);

  const updateUser = useCallback(async (currentPassword: string, newUsername: string) => {
    if (!account) return { ok: false, error: "Not logged in." };
    const trimmed = newUsername.trim();
    if (!trimmed || trimmed.length < 2) return { ok: false, error: "Username must be at least 2 characters." };

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: currentPassword,
    });
    if (signInErr) return { ok: false, error: "Current password is incorrect." };

    const { error } = await supabase.from("profiles").update({ username: trimmed }).eq("id", account.id);
    if (error) return { ok: false, error: error.message };
    setAccount(prev => prev ? { ...prev, username: trimmed } : null);
    return { ok: true };
  }, [account]);

  const updateUserEmail = useCallback(async (currentPassword: string, newEmail: string) => {
    if (!account) return { ok: false, error: "Not logged in." };

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: account.email,
      password: currentPassword,
    });
    if (signInErr) return { ok: false, error: "Current password is incorrect." };

    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }, [account]);

  const deleteAcc = useCallback(async () => {
    if (!account) return { ok: false, error: "Not logged in." };
    const { error } = await supabase.rpc("delete_user");
    if (error) return { ok: false, error: error.message };
    await supabase.auth.signOut();
    setAccount(null);
    return { ok: true };
  }, [account]);

  return (
    <AccountContext.Provider value={{
      account, loading,
      login, register, logout,
      saveResult, setGoals, setPreferredCountries, setDeadlines,
      changePass, exportData, importData,
      forgotPassword, updateUser, updateUserEmail, deleteAcc,
      refresh,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
}
