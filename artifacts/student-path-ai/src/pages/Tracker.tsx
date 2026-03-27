import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "@/contexts/AccountContext";
import type { ApplicationDeadline } from "@/contexts/AccountContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  CalendarDays, Plus, Trash2, GraduationCap, Clock,
  CheckCircle2, XCircle, Loader2, ClipboardList, Edit2, X, Save,
  TrendingUp, AlertTriangle, FileCheck,
} from "lucide-react";

type Status = ApplicationDeadline["status"];

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  "planning":    { label: "Planning",    color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",    icon: ClipboardList },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300", icon: Loader2 },
  "submitted":   { label: "Submitted",   color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300", icon: FileCheck },
  "accepted":    { label: "Accepted",    color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300", icon: CheckCircle2 },
  "rejected":    { label: "Rejected",    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300",    icon: XCircle },
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline, status }: { deadline: string; status: Status }) {
  if (status === "accepted" || status === "rejected") return null;
  const days = daysUntil(deadline);
  if (days < 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
      <AlertTriangle className="w-3 h-3" /> Overdue
    </span>
  );
  if (days === 0) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
      <AlertTriangle className="w-3 h-3" /> Due today!
    </span>
  );
  if (days <= 7) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> {days}d left
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
      <CalendarDays className="w-3 h-3" /> {days}d left
    </span>
  );
}

const EMPTY_FORM = { university: "", program: "", deadline: "", status: "planning" as Status, notes: "" };

function AddForm({ onSave, onCancel }: { onSave: (d: typeof EMPTY_FORM) => void; onCancel: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const set = (k: keyof typeof EMPTY_FORM, v: string) => setForm(f => ({ ...f, [k]: v }));

  const valid = form.university.trim() && form.program.trim() && form.deadline;

  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <Card className="p-5 border-2 border-primary/30 bg-primary/3 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Add New Application</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">University *</label>
            <input
              value={form.university}
              onChange={e => set("university", e.target.value)}
              placeholder="e.g. MIT"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Program *</label>
            <input
              value={form.program}
              onChange={e => set("program", e.target.value)}
              placeholder="e.g. Computer Science BSc"
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Deadline *</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => set("deadline", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <select
              value={form.status}
              onChange={e => set("status", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            placeholder="Any notes about this application…"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" disabled={!valid} onClick={() => valid && onSave(form)}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Application
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function AppCard({ entry, onDelete, onStatusChange }: {
  entry: ApplicationDeadline;
  onDelete: () => void;
  onStatusChange: (s: Status) => void;
}) {
  const [editing, setEditing] = useState(false);
  const cfg = STATUS_CONFIG[entry.status];
  const Icon = cfg.icon;
  const date = new Date(entry.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
      <Card className={cn(
        "p-5 border transition-shadow hover:shadow-md",
        entry.status === "accepted" && "border-green-200 bg-green-50/30 dark:bg-green-950/10",
        entry.status === "rejected" && "border-red-200 bg-red-50/30 dark:bg-red-950/10",
      )}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <GraduationCap className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-sm">{entry.university}</h4>
              <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border", cfg.color)}>
                <Icon className="w-3 h-3" />{cfg.label}
              </span>
              <DeadlineBadge deadline={entry.deadline} status={entry.status} />
            </div>
            <p className="text-xs text-muted-foreground mb-1">{entry.program}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> {date}
            </p>
            {entry.notes && (
              <p className="text-xs text-foreground/70 mt-2 bg-muted/40 rounded-lg px-3 py-1.5 leading-relaxed">{entry.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setEditing(e => !e)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Update status:</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(STATUS_CONFIG) as Status[]).map(s => {
                  const c = STATUS_CONFIG[s];
                  const Ic = c.icon;
                  return (
                    <button key={s} onClick={() => { onStatusChange(s); setEditing(false); }}
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all",
                        entry.status === s ? c.color : "bg-background border-border text-muted-foreground hover:border-primary hover:text-primary"
                      )}>
                      <Ic className="w-3 h-3" />{c.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function Tracker() {
  const [, setLocation] = useLocation();
  const { account, loading, setDeadlines } = useAccount();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading && !account) setLocation("/auth");
  }, [loading, account, setLocation]);

  if (loading || !account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const deadlines = account.deadlines ?? [];

  // Sort: non-terminal by deadline asc, then terminal (accepted/rejected) at end
  const sorted = [...deadlines].sort((a, b) => {
    const termA = a.status === "accepted" || a.status === "rejected";
    const termB = b.status === "accepted" || b.status === "rejected";
    if (termA !== termB) return termA ? 1 : -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const stats = {
    total: deadlines.length,
    inProgress: deadlines.filter(d => d.status === "in-progress").length,
    submitted: deadlines.filter(d => d.status === "submitted").length,
    accepted: deadlines.filter(d => d.status === "accepted").length,
  };

  const handleAdd = (form: typeof EMPTY_FORM) => {
    const entry: ApplicationDeadline = {
      id: crypto.randomUUID(),
      university: form.university.trim(),
      program: form.program.trim(),
      deadline: form.deadline,
      status: form.status,
      notes: form.notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    setDeadlines([...deadlines, entry]);
    setShowForm(false);
    toast.success("Application added!");
  };

  const handleDelete = (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
    toast.success("Application removed.");
  };

  const handleStatus = (id: string, status: Status) => {
    setDeadlines(deadlines.map(d => d.id === id ? { ...d, status } : d));
    toast.success(`Marked as ${STATUS_CONFIG[status].label}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Application Tracker</h1>
              </div>
              <p className="text-sm text-muted-foreground ml-13">Track your university applications and deadlines in one place.</p>
            </div>
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Plus className="w-4 h-4 mr-1.5" /> Add Application
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-foreground", bg: "bg-muted/40" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
            { label: "Submitted", value: stats.submitted, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
            { label: "Accepted", value: stats.accepted, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30" },
          ].map(s => (
            <Card key={s.label} className={cn("p-4 border-border/50", s.bg)}>
              <p className={cn("text-2xl font-display font-extrabold", s.color)}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && <AddForm onSave={handleAdd} onCancel={() => setShowForm(false)} />}
        </AnimatePresence>

        {/* Application list */}
        {sorted.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No applications yet</p>
            <p className="text-xs mt-1">Click "Add Application" to start tracking your university applications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sorted.map(entry => (
                <AppCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDelete(entry.id)}
                  onStatusChange={s => handleStatus(entry.id, s)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
