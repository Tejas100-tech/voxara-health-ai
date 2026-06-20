import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout";
import { Bell, BrainCircuit, CheckCheck, Filter, PhoneCall, ShieldCheck, Stethoscope, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api";

interface AlertNotification {
  _id: string;
  title: string;
  message: string;
  type: "biomarker" | "medication" | "clinical" | "system" | "appointment";
  severity: "critical" | "warning" | "info" | "success";
  isRead: boolean;
  createdAt: string;
  metadata?: { metricName?: string; value?: number; threshold?: number; sessionId?: string };
}

const SEVERITY_CONFIG = {
  critical: { dot: "bg-red-500", card: "border-l-red-500 bg-red-50 dark:bg-red-950/20", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400", icon: "text-red-600" },
  warning: { dot: "bg-amber-500", card: "border-l-amber-500 bg-amber-50 dark:bg-amber-950/20", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400", icon: "text-amber-600" },
  info: { dot: "bg-primary", card: "border-l-primary/60 bg-primary/5", badge: "bg-primary/10 text-primary", icon: "text-primary" },
  success: { dot: "bg-emerald-500", card: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", icon: "text-emerald-600" },
};

const TYPE_ICON: Record<string, typeof BrainCircuit> = {
  biomarker: BrainCircuit,
  medication: ShieldCheck,
  clinical: Stethoscope,
  system: Bell,
  appointment: PhoneCall,
};

type FilterType = "all" | "unread" | "critical" | "warning";

const DEMO: AlertNotification[] = [
  { _id: "d1", title: "Tremor Index Elevated", type: "biomarker", severity: "critical", isRead: false, message: "Tremor drift has exceeded your personal threshold (38% vs. 28% baseline). Immediate clinical review recommended.", createdAt: new Date(Date.now() - 12 * 60000).toISOString(), metadata: { metricName: "Tremor Drift", value: 38, threshold: 28, sessionId: "REC-81924" } },
  { _id: "d2", title: "Breathlessness Alert", type: "biomarker", severity: "warning", isRead: false, message: "Breathlessness score of 7.2/10 detected in your latest session. Your care team has been notified.", createdAt: new Date(Date.now() - 45 * 60000).toISOString(), metadata: { metricName: "Breathlessness", value: 7.2, threshold: 6, sessionId: "REC-81923" } },
  { _id: "d3", title: "Appointment Scheduled", type: "appointment", severity: "info", isRead: false, message: "Dr. Sarah Chen confirmed your urgent appointment at 4:30 PM today. Video link is ready.", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { _id: "d4", title: "Medication Reminder", type: "medication", severity: "info", isRead: true, message: "Time for your 12:00 PM dose of Levodopa 350mg. Take with food to reduce nausea.", createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { _id: "d5", title: "Recording Streak — 14 Days!", type: "system", severity: "success", isRead: true, message: "You've completed 14 consecutive days of voice recordings. Your data is giving your care team incredible insight.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: "d6", title: "AI Report Ready", type: "clinical", severity: "success", isRead: true, message: "GPT clinical analysis for session REC-81920 is complete. Disease progression: stable. Medication effectiveness: 74%.", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), metadata: { sessionId: "REC-81920" } },
  { _id: "d7", title: "Signal Anomaly Detected", type: "biomarker", severity: "warning", isRead: true, message: "Unusual spectral centroid pattern in REC-81918. May indicate environmental noise or fatigue-related dysarthria.", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), metadata: { metricName: "Spectral Centroid", sessionId: "REC-81918" } },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function adaptNotification(raw: unknown): AlertNotification {
  const n = raw as Record<string, unknown>;
  return {
    _id: String(n._id ?? n.id ?? Math.random()),
    title: String(n.title ?? "Alert"),
    message: String(n.body ?? n.message ?? ""),
    type: (["biomarker","medication","clinical","system","appointment"].includes(String(n.type)) ? n.type : "system") as AlertNotification["type"],
    severity: (["critical","warning","info","success"].includes(String(n.severity)) ? n.severity : n.kind === "Critical" ? "critical" : n.kind === "Watch" ? "warning" : "info") as AlertNotification["severity"],
    isRead: Boolean(n.isRead ?? n.acknowledged),
    createdAt: String(n.createdAt ?? new Date().toISOString()),
    metadata: (n.metadata as AlertNotification["metadata"]) ?? (n.sessionId ? { sessionId: String(n.sessionId) } : undefined),
  };
}

export default function AlertsHistory() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications();
        const adapted = (data as unknown[]).map(adaptNotification);
        setNotifications(adapted.length > 0 ? adapted : DEMO);
      } catch {
        setNotifications(DEMO);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try { await markNotificationRead(id); } catch { /* optimistic */ }
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    try { await markAllNotificationsRead(); } catch { /* optimistic */ }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "critical") return n.severity === "critical";
    if (filter === "warning") return n.severity === "warning" || n.severity === "critical";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter((n) => n.severity === "critical" && !n.isRead).length;

  return (
    <AppLayout userType="patient">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <Bell size={13} /> Smart Alerts
            </div>
            <h1 className="text-4xl font-extrabold font-[Manrope] text-foreground leading-tight">Alerts & Notifications</h1>
            <p className="text-muted-foreground mt-1">Real-time clinical alerts from your voice biomarker monitoring system.</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" className="rounded-xl font-bold" onClick={handleMarkAllRead}>
              <CheckCheck className="mr-2" size={16} /> Mark All Read ({unreadCount})
            </Button>
          )}
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total", value: notifications.length, color: "text-foreground", bg: "bg-card" },
            { label: "Unread", value: unreadCount, color: "text-primary", bg: "bg-primary/5" },
            { label: "Critical", value: criticalCount, color: "text-destructive", bg: "bg-destructive/5" },
            { label: "With Session", value: notifications.filter((n) => n.metadata?.sessionId).length, color: "text-secondary", bg: "bg-secondary/5" },
          ].map((s) => (
            <div key={s.label} className={`border rounded-2xl p-5 text-center ${s.bg}`}>
              <p className={`text-3xl font-black font-[Manrope] ${s.color}`}>{s.value}</p>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="flex items-center gap-3 flex-wrap">
          <Filter size={15} className="text-muted-foreground" />
          {(["all", "unread", "critical", "warning"] as FilterType[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${f === filter ? "bg-primary text-white border-primary shadow-sm" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "unread" && unreadCount > 0 && <span className="ml-2 bg-white/20 rounded-full px-1.5 py-0.5 text-xs">{unreadCount}</span>}
            </button>
          ))}
        </section>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border rounded-2xl p-12 text-center">
            <Bell className="mx-auto mb-4 text-muted-foreground" size={36} />
            <h3 className="font-bold text-lg mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((n) => {
              const cfg = SEVERITY_CONFIG[n.severity];
              const Icon = TYPE_ICON[n.type] ?? Bell;
              return (
                <div key={n._id}
                  className={`border-l-4 rounded-2xl p-5 transition-all cursor-pointer ${cfg.card} ${!n.isRead ? "shadow-sm" : "opacity-70"}`}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl bg-white/60 dark:bg-white/10 shrink-0 ${cfg.icon}`}><Icon size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-sm">{n.title}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.badge}`}>{n.severity}</span>
                        {!n.isRead && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{n.message}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">{timeAgo(n.createdAt)}</span>
                        {n.metadata?.sessionId && (
                          <Link href="/analysis" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <Zap size={10} /> {n.metadata.sessionId}
                          </Link>
                        )}
                        {n.type === "appointment" && (
                          <Link href="/appointments" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <PhoneCall size={10} /> View Appointment
                          </Link>
                        )}
                        {n.metadata?.value !== undefined && n.metadata?.threshold !== undefined && (
                          <span className="text-xs text-muted-foreground font-semibold">
                            {n.metadata.metricName}: <strong className="text-destructive">{n.metadata.value}</strong> vs threshold {n.metadata.threshold}
                          </span>
                        )}
                      </div>
                    </div>
                    {!n.isRead && (
                      <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n._id); }}
                        className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors shrink-0" title="Mark as read">
                        <CheckCheck size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
