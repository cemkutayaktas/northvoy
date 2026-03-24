import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  Account, SavedResult,
  getCurrentAccount, registerAccount, loginAccount, logoutAccount,
  saveResultToAccount, updateAccountGoals, updatePreferredCountries,
} from "@/lib/accounts";

interface AccountContextValue {
  account: Account | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  saveResult: (data: SavedResult) => void;
  setGoals: (goals: string[]) => void;
  setPreferredCountries: (countries: string[]) => void;
  refresh: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(() => getCurrentAccount());

  const refresh = useCallback(() => setAccount(getCurrentAccount()), []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginAccount(email, password);
    if (res.ok && res.account) setAccount(res.account);
    return { ok: res.ok, error: res.error };
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await registerAccount(username, email, password);
    if (res.ok && res.account) setAccount(res.account);
    return { ok: res.ok, error: res.error };
  }, []);

  const logout = useCallback(() => {
    logoutAccount();
    setAccount(null);
  }, []);

  const saveResult = useCallback((data: SavedResult) => {
    if (!account) return;
    saveResultToAccount(account.id, data);
    refresh();
  }, [account, refresh]);

  const setGoals = useCallback((goals: string[]) => {
    if (!account) return;
    updateAccountGoals(account.id, goals);
    refresh();
  }, [account, refresh]);

  const setPreferredCountries = useCallback((countries: string[]) => {
    if (!account) return;
    updatePreferredCountries(account.id, countries);
    refresh();
  }, [account, refresh]);

  return (
    <AccountContext.Provider value={{ account, login, register, logout, saveResult, setGoals, setPreferredCountries, refresh }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside AccountProvider");
  return ctx;
}
