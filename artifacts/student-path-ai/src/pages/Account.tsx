import { useState, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAccount } from "@/contexts/AccountContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  UserCircle, LogOut, BookMarked, Target, Globe, ChevronRight,
  Star, Sparkles, Plus, X, CheckCircle2, Trophy,
  Settings, Lock, Download, Upload, Check, Trash2, Mail, AtSign,
  CalendarDays, Clock, AlertTriangle, GraduationCap, Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkPassword } from "@/lib/accounts";
import { saveResults, saveProfile, saveHiddenMatch, saveWhyNot, saveAnswers } from "@/lib/store";
import type { ExportedData, ApplicationDeadline } from "@/contexts/AccountContext";

const GOAL_SUGGESTIONS = [
  "Research at least 3 universities offering my top major",
  "Complete an online course related to my field",
  "Attend a university open day or virtual tour",
  "Speak to a professional working in my target career",
  "Build a beginner project related to my major",
  "Improve my language skills for international study",
  "Prepare a personal statement draft",
  "Shadow or intern in a relevant workplace",
  "Join a club or activity linked to my interests",
  "Set a realistic study plan for the next 3 months",
];

const ALL_COUNTRIES = [
  "United States", "United Kingdom", "Germany", "Canada", "Netherlands",
  "Sweden", "Switzerland", "Australia", "France", "Singapore", "Finland",
  "Italy", "Spain", "Japan", "South Korea", "Norway", "Denmark", "Austria",
];

function GoalsEditor() {
  const { account, setGoals } = useAccount();
  const { t } = useLang();
  const goals = account?.savedGoals ?? [];
  const [custom, setCustom] = useState("");

  const toggle = (g: string) => {
    if (goals.includes(g)) setGoals(goals.filter(x => x !== g));
    else setGoals([...goals, g]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed || goals.includes(trimmed)) return;
    setGoals([...goals, trimmed]);
    setCustom("");
  };

  const removeGoal = (g: string) => setGoals(goals.filter(x => x !== g));

  return (
    <div className="space-y-5">
      {goals.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {t("account.goalsYours")} ({goals.length})
          </p>
          <div className="space-y-2">
            {goals.map(g => (
              <div key={g} className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-sm flex-1 text-foreground">{g}</span>
                <button onClick={() => removeGoal(g)} className="text-muted-foreground hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          {t("account.goalsSuggested")}
        </p>
        <div className="flex flex-wrap gap-2">
          {GOAL_SUGGESTIONS.filter(g => !goals.includes(g)).map(g => (
            <button key={g} onClick={() => toggle(g)}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:border-primary hover:text-primary transition-colors text-left">
              <Plus className="w-3 h-3 shrink-0" />{g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          {t("account.goalsAddOwn")}
        </p>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCustom()}
            placeholder={t("account.goalsPlaceholder")}
            className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <Button variant="outline" size="sm" onClick={addCustom} disabled={!custom.trim()}>
            <Plus className="w-4 h-4" /> {t("account.goalsBtnAdd")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CountryPicker() {
  const { account, setPreferredCountries } = useAccount();
  const { t } = useLang();
  const selected = account?.preferredCountries ?? [];

  const toggle = (c: string) => {
    if (selected.includes(c)) setPreferredCountries(selected.filter(x => x !== c));
    else setPreferredCountries([...selected, c]);
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-4">{t("account.countriesDesc")}</p>
      <div className="flex flex-wrap gap-2">
        {ALL_COUNTRIES.map(c => (
          <button key={c} onClick={() => toggle(c)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              selected.includes(c)
                ? "bg-primary text-white border-primary font-semibold"
                : "bg-background border-border text-foreground hover:border-primary hover:text-primary"
            )}>
            {c}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          {selected.length} {selected.length === 1 ? t("account.countrySelected") : t("account.countriesSelected")}
        </p>
      )}
    </div>
  );
}

function SavedResultCard({ savedResult }: { savedResult: NonNullable<ReturnType<typeof useAccount>["account"]>["savedResult"] }) {
  const [, setLocation] = useLocation();
  const { t } = useLang();

  if (!savedResult) return (
    <div className="text-center py-10 text-muted-foreground">
      <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{t("account.noResultsYet")}</p>
      <p className="text-xs mt-1">{t("account.noResultsDesc")}</p>
      <Button variant="outline" size="sm" className="mt-4" onClick={() => setLocation("/questionnaire")}>
        {t("account.takeQuizBtn")}
      </Button>
    </div>
  );

  const { results, profile, hidden, whyNot, answers, savedAt } = savedResult;
  const date = new Date(savedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  const handleViewResults = () => {
    // Restore saved results to localStorage so the Results page can read them on any device
    saveResults(results);
    saveProfile(profile);
    if (hidden) saveHiddenMatch(hidden);
    if (whyNot) saveWhyNot(whyNot);
    if (answers) saveAnswers(answers);
    setLocation("/results");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t("account.savedOn")} {date}</span>
        <button onClick={handleViewResults} className="flex items-center gap-1 text-primary font-semibold hover:underline">
          {t("account.viewFullResults")} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-xl shrink-0">{profile.icon}</div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("account.studentProfile")}</p>
          <p className="font-display font-bold text-base">{profile.label}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("account.yourTopMatches")}</p>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={r.major} className={cn(
              "flex items-center gap-3 rounded-xl border p-3",
              i === 0 ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20"
            )}>
              <div className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                i === 0 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {i === 0 ? <Trophy className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{r.major}</p>
                <p className="text-xs text-muted-foreground">{r.confidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const { changePass } = useAccount();
  const { t } = useLang();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwCheck = useMemo(() => checkPassword(newPw), [newPw]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!current) { setError("Please enter your current password."); return; }
    if (!pwCheck.valid) { setError("New password must meet all requirements."); return; }
    if (newPw !== confirm) { setError("New passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await changePass(current, newPw);
      if (res.ok) {
        toast.success(t("account.passwordChanged"));
        setCurrent(""); setNewPw(""); setConfirm("");
      } else {
        toast.error(res.error ?? "Failed to change password.");
      }
    } catch { toast.error("An error occurred."); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("account.currentPassword")}</label>
        <input type="password" value={current} onChange={e => setCurrent(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("account.newPassword")}</label>
        <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        {newPw && (
          <div className="flex gap-1 mt-1">
            {[pwCheck.minLength, pwCheck.hasUppercase, pwCheck.hasLowercase, pwCheck.hasNumber].map((met, i) => (
              <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", met ? "bg-emerald-500" : "bg-border")} />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("account.confirmNewPassword")}</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>
        <Lock className="w-4 h-4 mr-1.5" />
        {loading ? "..." : t("account.btnChangePassword")}
      </Button>
    </form>
  );
}

function DataBackup() {
  const { exportData, importData } = useAccount();
  const { t } = useLang();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NorthVoy_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string) as ExportedData;
        const res = await importData(data);
        if (res.ok) toast.success(t("account.importSuccess"));
        else toast.error(res.error ?? t("account.importError"));
      } catch {
        toast.error(t("account.importError"));
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{t("account.dataBackupDesc")}</p>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-1.5" /> {t("account.exportData")}
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="w-4 h-4 mr-1.5" /> {t("account.importData")}
        </Button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>
    </div>
  );
}

function ProfileForm() {
  const { account, updateUser, updateUserEmail } = useAccount();
  const { t } = useLang();
  const [usernamePw, setUsernamePw] = useState("");
  const [newUsername, setNewUsername] = useState(account?.username ?? "");
  const [usernamePending, setUsernamePending] = useState(false);
  const [emailPw, setEmailPw] = useState("");
  const [newEmail, setNewEmail] = useState(account?.email ?? "");
  const [emailPending, setEmailPending] = useState(false);

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernamePw) { toast.error("Please enter your current password."); return; }
    if (!newUsername.trim() || newUsername.trim().length < 2) { toast.error("Username must be at least 2 characters."); return; }
    setUsernamePending(true);
    try {
      const res = await updateUser(usernamePw, newUsername);
      if (res.ok) { toast.success(t("account.usernameUpdated")); setUsernamePw(""); }
      else toast.error(res.error ?? "Failed to update username.");
    } catch { toast.error("An error occurred."); }
    finally { setUsernamePending(false); }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPw) { toast.error("Please enter your current password."); return; }
    setEmailPending(true);
    try {
      const res = await updateUserEmail(emailPw, newEmail);
      if (res.ok) { toast.success(t("account.emailUpdated")); setEmailPw(""); }
      else toast.error(res.error ?? "Failed to update email.");
    } catch { toast.error("An error occurred."); }
    finally { setEmailPending(false); }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Change Username */}
      <form onSubmit={handleUsernameSubmit} className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          <AtSign className="w-3.5 h-3.5" /> {t("account.changeUsername")}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("account.newUsername")}</label>
          <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("account.currentPassword")}</label>
          <input type="password" value={usernamePw} onChange={e => setUsernamePw(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <Button type="submit" size="sm" disabled={usernamePending}>
          <AtSign className="w-4 h-4 mr-1.5" />
          {usernamePending ? "..." : t("account.btnUpdateUsername")}
        </Button>
      </form>

      {/* Change Email */}
      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          <Mail className="w-3.5 h-3.5" /> {t("account.changeEmail")}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("account.newEmail")}</label>
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("account.currentPassword")}</label>
          <input type="password" value={emailPw} onChange={e => setEmailPw(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <Button type="submit" size="sm" disabled={emailPending}>
          <Mail className="w-4 h-4 mr-1.5" />
          {emailPending ? "..." : t("account.btnUpdateEmail")}
        </Button>
      </form>
    </div>
  );
}

function DangerZone() {
  const { deleteAcc } = useAccount();
  const { t } = useLang();
  const [confirm, setConfirm] = useState(false);
  const [, setLocation] = useLocation();

  const handleDelete = async () => {
    const res = await deleteAcc();
    if (res.ok) {
      toast.success(t("account.accountDeleted"));
      setLocation("/");
    } else {
      toast.error(res.error ?? "Failed to delete account.");
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t("account.dangerZoneDesc")}</p>
      {!confirm ? (
        <Button variant="outline" size="sm" onClick={() => setConfirm(true)}
          className="border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
          <Trash2 className="w-4 h-4 mr-1.5" /> {t("account.btnDeleteAccount")}
        </Button>
      ) : (
        <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 space-y-3">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{t("account.deleteConfirmText")}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white border-0">
              {t("account.btnConfirmDelete")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirm(false)}>
              {t("common.close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Deadline Tracker ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ApplicationDeadline["status"], { label: string; color: string; bg: string }> = {
  "planning":    { label: "Planning",    color: "text-slate-600",   bg: "bg-slate-100 border-slate-200"   },
  "in-progress": { label: "In Progress", color: "text-blue-600",    bg: "bg-blue-50 border-blue-200"      },
  "submitted":   { label: "Submitted",   color: "text-violet-600",  bg: "bg-violet-50 border-violet-200"  },
  "accepted":    { label: "Accepted",    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  "rejected":    { label: "Rejected",    color: "text-red-500",     bg: "bg-red-50 border-red-200"        },
};

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + "T00:00:00");
  return Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function UrgencyBadge({ days }: { days: number }) {
  if (days < 0)  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Passed</span>;
  if (days === 0) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 animate-pulse">Today!</span>;
  if (days <= 7)  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">{days}d left</span>;
  if (days <= 30) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{days}d left</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">{days}d left</span>;
}

const EMPTY_FORM = { university: "", program: "", deadline: "", status: "planning" as ApplicationDeadline["status"], notes: "" };

function DeadlineTracker() {
  const { account, setDeadlines } = useAccount();
  const deadlines = account?.deadlines ?? [];
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const sorted = [...deadlines].sort((a, b) => {
    const da = daysUntil(a.deadline), db = daysUntil(b.deadline);
    // Upcoming first, then passed (most recent pass last)
    if (da >= 0 && db < 0) return -1;
    if (da < 0 && db >= 0) return 1;
    return da - db;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (d: ApplicationDeadline) => {
    setForm({ university: d.university, program: d.program, deadline: d.deadline, status: d.status, notes: d.notes ?? "" });
    setEditId(d.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.university.trim() || !form.program.trim() || !form.deadline) return;
    setSaving(true);
    let updated: ApplicationDeadline[];
    if (editId) {
      updated = deadlines.map(d => d.id === editId ? { ...d, ...form } : d);
    } else {
      const newEntry: ApplicationDeadline = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      updated = [...deadlines, newEntry];
    }
    await setDeadlines(updated);
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id: string) => {
    await setDeadlines(deadlines.filter(d => d.id !== id));
  };

  const handleStatusChange = async (id: string, status: ApplicationDeadline["status"]) => {
    await setDeadlines(deadlines.map(d => d.id === id ? { ...d, status } : d));
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Track your application deadlines and stay organized.</p>
        <Button size="sm" onClick={openAdd} className="shrink-0">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Deadline
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <p className="text-sm font-semibold">{editId ? "Edit Deadline" : "Add New Deadline"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">University *</label>
              <input value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}
                placeholder="e.g. TU Munich"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Program *</label>
              <input value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                placeholder="e.g. MSc Computer Science"
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Deadline Date *</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ApplicationDeadline["status"] }))}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes (optional)</label>
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Need recommendation letters, IELTS score required"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving || !form.university.trim() || !form.program.trim() || !form.deadline}>
              <Check className="w-3.5 h-3.5 mr-1.5" /> {saving ? "Saving…" : editId ? "Update" : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditId(null); }}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {sorted.length === 0 && !showForm && (
        <div className="text-center py-10 text-muted-foreground">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No deadlines yet</p>
          <p className="text-xs mt-1">Add your university application deadlines to stay on track.</p>
        </div>
      )}

      {/* Deadline list */}
      {sorted.length > 0 && (
        <div className="space-y-2">
          {sorted.map(d => {
            const days = daysUntil(d.deadline);
            const statusCfg = STATUS_CONFIG[d.status];
            const isPast = days < 0;
            return (
              <motion.div key={d.id} layout
                className={cn("rounded-xl border p-4 transition-opacity", isPast ? "opacity-60" : "")}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    days <= 7 && days >= 0 ? "bg-red-100" : days <= 30 && days >= 0 ? "bg-amber-100" : "bg-muted")}>
                    {days <= 7 && days >= 0
                      ? <AlertTriangle className="w-4 h-4 text-red-500" />
                      : <GraduationCap className="w-4 h-4 text-muted-foreground" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold truncate">{d.university}</p>
                      <UrgencyBadge days={days} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.program}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(d.deadline + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      {/* Inline status selector */}
                      <select
                        value={d.status}
                        onChange={e => handleStatusChange(d.id, e.target.value as ApplicationDeadline["status"])}
                        className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none", statusCfg.bg, statusCfg.color)}>
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    {d.notes && <p className="text-xs text-muted-foreground mt-1.5 italic">📝 {d.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(d)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(d.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {sorted.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          {Object.entries(STATUS_CONFIG).map(([k, v]) => {
            const count = deadlines.filter(d => d.status === k).length;
            if (count === 0) return null;
            return (
              <span key={k} className={cn("px-2 py-0.5 rounded-full border font-medium", v.bg, v.color)}>
                {v.label}: {count}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

type Section = "results" | "goals" | "countries" | "deadlines" | "settings";

export default function Account() {
  const { account, logout } = useAccount();
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [section, setSection] = useState<Section>("results");

  if (!account) {
    setLocation("/auth");
    return null;
  }

  const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "results",   label: t("account.navSavedResults"), icon: Star },
    { id: "goals",     label: t("account.navGoals"),        icon: Target },
    { id: "countries", label: t("account.navCountries"),    icon: Globe },
    { id: "deadlines", label: "Deadlines",                  icon: CalendarDays },
    { id: "settings",  label: t("account.navSettings"),     icon: Settings },
  ];

  const STATS = [
    { label: t("account.statTopMajor"), value: account.savedResult?.results[0]?.major?.split(" & ")[0] ?? "—", icon: Star },
    { label: t("account.statGoals"), value: account.savedGoals.length.toString(), icon: Target },
    { label: t("account.statCountries"), value: account.preferredCountries.length.toString(), icon: Globe },
  ];

  const handleLogout = () => { logout(); setLocation("/"); };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[50%] h-[60%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("account.yourAccount")}</p>
              <h1 className="text-2xl font-display font-extrabold">{account.username}</h1>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-600 hover:border-red-200 self-start sm:self-center">
            <LogOut className="w-4 h-4 mr-1.5" /> {t("account.signOut")}
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8">
          {STATS.map(s => (
            <Card key={s.label} className="p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1.5 text-primary opacity-70" />
              <p className="text-lg font-display font-bold leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">

          {/* Sidebar nav */}
          <div className="flex md:flex-col gap-2">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  section === n.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                <n.icon className="w-4 h-4 shrink-0" />{n.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <Card className="p-6">
            {section === "results" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Star className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navSavedResults")}</h2>
                </div>
                <SavedResultCard savedResult={account.savedResult} />
              </>
            )}

            {section === "goals" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Target className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navGoals")}</h2>
                </div>
                <GoalsEditor />
              </>
            )}

            {section === "countries" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.navCountries")}</h2>
                </div>
                <CountryPicker />
              </>
            )}

            {section === "deadlines" && (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">Application Deadlines</h2>
                </div>
                <DeadlineTracker />
              </>
            )}

            {section === "settings" && (
              <>
                {/* Profile Settings */}
                <div className="flex items-center gap-2 mb-5">
                  <UserCircle className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.profileSettings")}</h2>
                </div>
                <ProfileForm />

                <div className="border-t border-border my-8" />

                {/* Change Password */}
                <div className="flex items-center gap-2 mb-5">
                  <Lock className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.changePassword")}</h2>
                </div>
                <ChangePasswordForm />

                <div className="border-t border-border my-8" />

                {/* Data Backup */}
                <div className="flex items-center gap-2 mb-5">
                  <Download className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-bold text-base">{t("account.dataBackup")}</h2>
                </div>
                <DataBackup />

                <div className="border-t border-border my-8" />

                {/* Danger Zone */}
                <div className="flex items-center gap-2 mb-5">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <h2 className="font-display font-bold text-base text-red-500">{t("account.dangerZone")}</h2>
                </div>
                <DangerZone />
              </>
            )}
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-sm">{t("account.retakePrompt")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t("account.retakeDesc")}</p>
          </div>
          <Button onClick={() => setLocation("/questionnaire")} size="sm">
            <Sparkles className="w-4 h-4 mr-1.5" /> {t("account.startQuestionnaire")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
