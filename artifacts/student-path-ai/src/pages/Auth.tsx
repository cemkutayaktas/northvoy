import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAccount } from "@/contexts/AccountContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserCircle, Mail, Lock, User, Eye, EyeOff, Compass, ArrowLeft, Check, X, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkPassword, isValidEmail } from "@/lib/accounts";

type Tab = "login" | "register" | "forgot";

function Field({
  label, type, value, onChange, icon: Icon, error, placeholder,
}: {
  label: string; type: string; value: string; onChange: (v: string) => void;
  icon: React.ElementType; error?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 pl-10 pr-10 rounded-xl border text-sm bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            error ? "border-red-400" : "border-border"
          )}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { login } = useAccount();
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError(t("auth.errorFillAll")); return; }
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.ok) setLocation("/account");
      else setError(res.error ?? t("auth.errorLoginFailed"));
    } catch {
      setError(t("auth.errorLoginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={t("auth.labelEmail")} type="email" value={email} onChange={setEmail} icon={Mail} placeholder={t("auth.placeholderEmail")} />
      <Field label={t("auth.labelPassword")} type="password" value={password} onChange={setPassword} icon={Lock} placeholder={t("auth.placeholderPassword")} />
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? t("auth.btnSigningIn") : t("auth.btnSignIn")}
      </Button>
      <button type="button" onClick={onForgot}
        className="block w-full text-center text-xs text-primary hover:underline transition-colors">
        {t("auth.forgotPassword")}
      </button>
    </form>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const { t } = useLang();
  const check = useMemo(() => checkPassword(password), [password]);

  if (!password) return null;

  const rules = [
    { key: "minLength", label: t("auth.pwRuleMinLength"), met: check.minLength },
    { key: "hasUppercase", label: t("auth.pwRuleUppercase"), met: check.hasUppercase },
    { key: "hasLowercase", label: t("auth.pwRuleLowercase"), met: check.hasLowercase },
    { key: "hasNumber", label: t("auth.pwRuleNumber"), met: check.hasNumber },
  ];

  const metCount = rules.filter(r => r.met).length;
  const barColor = metCount <= 1 ? "bg-red-500" : metCount <= 2 ? "bg-orange-500" : metCount <= 3 ? "bg-yellow-500" : "bg-emerald-500";

  return (
    <div className="space-y-2 mt-1.5">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < metCount ? barColor : "bg-border")} />
        ))}
      </div>
      {/* Rule checklist */}
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

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { register } = useAccount();
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim() || username.trim().length < 2) e.username = t("auth.errorUsernameMin");
    if (!email.trim() || !isValidEmail(email)) e.email = t("auth.errorEmailInvalid");
    const pwCheck = checkPassword(password);
    if (!pwCheck.valid) e.password = t("auth.errorPasswordRequirements");
    if (password !== confirm) e.confirm = t("auth.errorPasswordMatch");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res = await register(username, email, password);
      if (res.ok) {
        if (res.requiresConfirmation) setConfirmationSent(true);
        else setLocation("/account");
      } else setGlobalError(res.error ?? t("auth.errorRegisterFailed"));
    } catch {
      setGlobalError(t("auth.errorRegisterFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{t("auth.confirmEmailTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("auth.confirmEmailDesc")} <strong>{email}</strong></p>
        </div>
        <p className="text-xs text-muted-foreground">{t("auth.confirmEmailNote")}</p>
        <Button variant="outline" className="w-full" onClick={() => setConfirmationSent(false)}>
          {t("auth.btnBackToSignUp")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label={t("auth.labelUsername")} type="text" value={username} onChange={setUsername} icon={User} placeholder={t("auth.placeholderUsername")} error={errors.username} />
      <Field label={t("auth.labelEmail")} type="email" value={email} onChange={setEmail} icon={Mail} placeholder={t("auth.placeholderEmail")} error={errors.email} />
      <div>
        <Field label={t("auth.labelPassword")} type="password" value={password} onChange={setPassword} icon={Lock} placeholder={t("auth.placeholderPasswordNew")} error={errors.password} />
        <PasswordStrength password={password} />
      </div>
      <Field label={t("auth.labelConfirmPassword")} type="password" value={confirm} onChange={setConfirm} icon={Lock} placeholder={t("auth.placeholderPasswordRepeat")} error={errors.confirm} />

      {globalError && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">{globalError}</div>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? t("auth.btnCreatingAccount") : t("auth.btnCreateAccount")}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { forgotPassword } = useAccount();
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !isValidEmail(email)) { setError(t("auth.errorEmailInvalid")); return; }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.ok) setSent(true);
      else setError(res.error ?? "Failed to send reset email.");
    } catch {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
          <Check className="w-7 h-7 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-foreground">{t("auth.resetEmailSent")}</p>
          <p className="text-sm text-muted-foreground">{t("auth.resetEmailSentDesc")} <strong>{email}</strong></p>
        </div>
        <Button onClick={onBack} className="w-full" size="lg">{t("auth.btnBackToLogin")}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("auth.resetSubtitle")}</p>
      <Field label={t("auth.labelEmail")} type="email" value={email} onChange={setEmail} icon={Mail} placeholder={t("auth.placeholderEmail")} />
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? t("auth.btnSendingReset") : t("auth.btnSendResetLink")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {t("auth.rememberPassword")}{" "}
        <button type="button" onClick={onBack} className="text-primary font-semibold hover:underline">{t("auth.signInLink")}</button>
      </p>
    </form>
  );
}

export default function Auth() {
  const [tab, setTab] = useState<Tab>("login");
  const [, setLocation] = useLocation();
  const { account } = useAccount();
  const { t } = useLang();

  useEffect(() => {
    if (account) setLocation("/account");
  }, [account, setLocation]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[50%] h-[60%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[50%] bg-secondary/5 rounded-full blur-[120px] -z-10" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        {/* Back link */}
        <button onClick={() => setLocation("/")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t("auth.backToHome")}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">NorthVoy</p>
            <p className="text-xs text-muted-foreground">{t("auth.academicPlatform")}</p>
          </div>
        </div>

        <Card className="border-2 border-border/60 shadow-xl shadow-black/5 overflow-hidden">
          {/* Tab switcher — hidden during forgot password flow */}
          {tab !== "forgot" && (
            <div className="flex border-b border-border">
              {(["login", "register"] as const).map(tabKey => (
                <button key={tabKey} onClick={() => setTab(tabKey)}
                  className={cn(
                    "flex-1 py-4 text-sm font-semibold transition-colors",
                    tab === tabKey
                      ? "text-primary border-b-2 border-primary -mb-px bg-primary/3"
                      : "text-muted-foreground hover:text-foreground"
                  )}>
                  {tabKey === "login" ? t("auth.tabSignIn") : t("auth.tabCreateAccount")}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                {tab === "forgot"
                  ? <KeyRound className="w-6 h-6 text-primary" />
                  : <UserCircle className="w-6 h-6 text-primary" />}
              </div>
              <h1 className="text-xl font-display font-bold">
                {tab === "login" ? t("auth.titleSignIn") : tab === "register" ? t("auth.titleRegister") : t("auth.resetPassword")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {tab === "login" ? t("auth.subtitleSignIn") : tab === "register" ? t("auth.subtitleRegister") : ""}
              </p>
            </div>

            {tab === "login" && <LoginForm onForgot={() => setTab("forgot")} />}
            {tab === "register" && <RegisterForm onSuccess={() => setTab("login")} />}
            {tab === "forgot" && <ForgotPasswordForm onBack={() => setTab("login")} />}

            {tab !== "forgot" && (
              <p className="text-center text-xs text-muted-foreground mt-5">
                {tab === "login"
                  ? <span>{t("auth.noAccount")} <button onClick={() => setTab("register")} className="text-primary font-semibold hover:underline">{t("auth.signUpFree")}</button></span>
                  : <span>{t("auth.alreadyAccount")} <button onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">{t("auth.signInLink")}</button></span>}
              </p>
            )}

            <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed opacity-70">
              {t("auth.localDataNote")}
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
