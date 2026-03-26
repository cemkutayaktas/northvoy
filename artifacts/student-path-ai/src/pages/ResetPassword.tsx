import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Lock, Compass, Check, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkPassword } from "@/lib/accounts";

function PasswordStrength({ password }: { password: string }) {
  const check = useMemo(() => checkPassword(password), [password]);
  if (!password) return null;

  const rules = [
    { key: "minLength", label: "At least 8 characters", met: check.minLength },
    { key: "hasUppercase", label: "Uppercase letter", met: check.hasUppercase },
    { key: "hasLowercase", label: "Lowercase letter", met: check.hasLowercase },
    { key: "hasNumber", label: "One number", met: check.hasNumber },
  ];
  const metCount = rules.filter(r => r.met).length;
  const barColor = metCount <= 1 ? "bg-red-500" : metCount <= 2 ? "bg-orange-500" : metCount <= 3 ? "bg-yellow-500" : "bg-emerald-500";

  return (
    <div className="space-y-2 mt-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < metCount ? barColor : "bg-border")} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {rules.map(r => (
          <div key={r.key} className={cn("flex items-center gap-1 text-[11px] transition-colors", r.met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
            {r.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const pwCheck = useMemo(() => checkPassword(password), [password]);

  // Supabase v2 PKCE flow: reset link arrives as ?code=... query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Exchange PKCE code for a session
      supabase.auth.exchangeCodeForSession(code).then(({ data }) => {
        if (data.session) setSessionReady(true);
        // Remove the code from the URL so it can't be reused
        window.history.replaceState({}, "", window.location.pathname);
      });
    } else {
      // Fallback: session may already exist (e.g. implicit flow or page refresh)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setSessionReady(true);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!pwCheck.valid) { setError("Password must meet all requirements."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError(updateError.message); return; }
      setDone(true);
      // Sign out so user logs in fresh with new password
      await supabase.auth.signOut();
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[50%] h-[60%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[50%] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        <button onClick={() => setLocation("/auth")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-tight">NorthVoy</p>
            <p className="text-xs text-muted-foreground">Set New Password</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h1 className="font-display font-bold text-xl mb-1">Set New Password</h1>
            <p className="text-sm text-muted-foreground">Choose a strong new password for your account.</p>
          </div>

          {done ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Password updated!</p>
                <p className="text-sm text-muted-foreground">You can now sign in with your new password.</p>
              </div>
              <Button className="w-full" size="lg" onClick={() => setLocation("/auth")}>
                Go to Sign In
              </Button>
            </div>
          ) : !sessionReady ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">New Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {show ? <X className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type={showConfirm ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                  <button type="button" onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirm ? <X className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Updating…" : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
