import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity, AlertCircle, AlertTriangle, ArrowRight, BrainCircuit,
  Calendar, CheckCircle2, ChevronRight, Clock, Database, FileText,
  Filter, Mic, Radio, Search, Shield, ShieldAlert,
  Stethoscope, TrendingUp, Users, Wind, Zap
} from "lucide-react";
import { formatTime, useLiveVitals } from "@/lib/realtime";
import { useAuth } from "@/lib/auth";

interface PatientCard {
  patientId: string;
  name: string;
  email: string;
  age: number;
  conditions: string[];
  phone?: string;
  latestSession: {
    risk: string;
    clarity: number;
    tremor: number;
    breathlessness: number;
    capturedAt: string;
  } | null;
  sessionCount: number;
  unreadAlerts: number;
  criticalAlerts: number;
}

interface ClinicianStats {
  totalPatients: number;
  totalSessions: number;
  totalAlerts: number;
  criticalAlerts: number;
  elevatedPatients: number;
  recentNotes: Array<{ content: string; noteType: string; createdAt: string; patientName: string }>;
}

const riskColor = (r: string) =>
  r === "Elevated" ? "text-destructive" : r === "Moderate" ? "text-secondary" : "text-primary";
const riskBg = (r: string) =>
  r === "Elevated" ? "bg-destructive/10 border-destructive/20 text-destructive"
  : r === "Moderate" ? "bg-secondary/10 border-secondary/20 text-secondary"
  : "bg-primary/10 border-primary/20 text-primary";
const conditionColor = (c: string) =>
  c.toLowerCase().includes("parkinson") ? "bg-purple-100 text-purple-700"
  : c.toLowerCase().includes("asthma") ? "bg-blue-100 text-blue-700"
  : c.toLowerCase().includes("depression") ? "bg-amber-100 text-amber-700"
  : "bg-muted text-muted-foreground";

export default function ClinicianOverview() {
  const live = useLiveVitals();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [patients, setPatients] = useState<PatientCard[]>([]);
  const [stats, setStats] = useState<ClinicianStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.patientId) return;
    Promise.all([
      fetch(`/api/clinician/${user.patientId}/patients`).then((r) => r.json()),
      fetch(`/api/clinician/${user.patientId}/stats`).then((r) => r.json()),
    ])
      .then(([pats, st]) => {
        setPatients(Array.isArray(pats) ? pats : []);
        setStats(st);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.patientId]);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.conditions.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const criticalPatients = patients.filter((p) => p.criticalAlerts > 0 || p.latestSession?.risk === "Elevated");
  const healthyPatients = patients.filter((p) => p.latestSession?.risk === "Low" && p.criticalAlerts === 0);

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-2 flex items-center gap-2">
              <Radio size={15} className="animate-pulse" /> Provider Command Center
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-[Manrope] leading-tight">
              {user?.name?.split(" ")[0]}'s Dashboard
            </h1>
            <p className="text-muted-foreground mt-3 text-base max-w-2xl flex items-center gap-2">
              <Database size={14} className="text-secondary" />
              Live MongoDB · {stats?.totalPatients ?? "—"} patients · last sync {formatTime(live.now)}
            </p>
          </div>
          <div className="flex gap-4">
            <StatPill label="Sessions" value={String(stats?.totalSessions ?? "—")} icon={Mic} color="text-primary" />
            <StatPill label="Open Alerts" value={String(stats?.totalAlerts ?? "—")} icon={AlertCircle} color={stats?.totalAlerts ? "text-destructive" : "text-primary"} />
            <StatPill label="Critical" value={String(stats?.criticalAlerts ?? "—")} icon={ShieldAlert} color={stats?.criticalAlerts ? "text-destructive" : "text-primary"} />
          </div>
        </header>

        {/* Triage + AI model row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority triage */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-primary p-8 rounded-[2rem] text-white shadow-xl overflow-hidden relative">
            <div className="absolute right-0 top-0 h-64 w-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3 mb-6">
              <div className="bg-white text-destructive p-2 rounded-full"><AlertTriangle size={20} /></div>
              <div>
                <h2 className="text-xl font-bold font-[Manrope]">Priority Triage Engine</h2>
                <p className="text-white/60 text-xs">Escalation monitoring · live data</p>
              </div>
            </div>
            {criticalPatients.length === 0 ? (
              <div className="relative z-10 flex flex-col items-center justify-center py-8 gap-3">
                <CheckCircle2 size={40} className="text-emerald-400" />
                <p className="text-white/80 font-semibold">No escalations right now</p>
                <p className="text-white/50 text-sm">All patients are within safe thresholds</p>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                {criticalPatients.slice(0, 4).map((p) => (
                  <button
                    key={p.patientId}
                    onClick={() => setLocation(`/clinician/patient/${p.patientId}`)}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all text-left"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-base">{p.name}</p>
                        <p className="text-xs text-white/60">{p.patientId}</p>
                      </div>
                      <span className="bg-destructive text-white text-xs px-2 py-0.5 rounded-full font-bold uppercase">{p.latestSession?.risk ?? "—"}</span>
                    </div>
                    {p.latestSession && (
                      <div className="flex gap-3 text-xs text-white/80 font-semibold mb-4">
                        <span>Clarity: {p.latestSession.clarity}%</span>
                        <span>Tremor: {p.latestSession.tremor}%</span>
                        <span>Breath: {p.latestSession.breathlessness}/10</span>
                      </div>
                    )}
                    <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-red-400" style={{ width: `${p.latestSession?.tremor ?? 0}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">{p.criticalAlerts} critical alert{p.criticalAlerts !== 1 ? "s" : ""}</span>
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">View Profile <ChevronRight size={12} /></span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI + stats panel */}
          <div className="bg-card border p-8 rounded-[2rem] flex flex-col gap-8 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4"><BrainCircuit className="text-primary" size={24} /><h3 className="font-bold text-lg font-[Manrope]">AI Biomarker Health</h3></div>
              <div className="space-y-5">
                <Progress label="Signal Confidence" value={live.signalQuality} tone="bg-primary" />
                <Progress label="Queue Clarity" value={Math.max(0, 100 - live.clinicianQueue * 5)} tone="bg-secondary" />
                <Progress label="Escalation Risk" value={live.riskScore} tone="bg-destructive" />
              </div>
            </div>
            <div className="border-t pt-6 space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2"><Zap size={12} /> Clinic Snapshot</p>
              <SnapRow icon={Users} label="Assigned Patients" value={String(stats?.totalPatients ?? "—")} />
              <SnapRow icon={ShieldAlert} label="Elevated Risk" value={String(stats?.elevatedPatients ?? "—")} urgent={!!stats?.elevatedPatients} />
              <SnapRow icon={FileText} label="Notes Written" value={stats?.recentNotes?.length ? `${stats.recentNotes.length}+` : "0"} />
              <SnapRow icon={Calendar} label="Adherence" value={`${live.adherence}%`} />
            </div>
          </div>
        </section>

        {/* Recent notes from MongoDB */}
        {stats?.recentNotes && stats.recentNotes.length > 0 && (
          <section className="bg-card border rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold font-[Manrope] mb-5 flex items-center gap-2"><FileText size={18} className="text-primary" /> Recent Clinical Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.recentNotes.map((n, i) => (
                <div key={i} className="bg-muted/30 border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">{n.noteType}</span>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{n.content}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Stethoscope size={11} /> {n.patientName}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Patient roster */}
        <section>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-foreground font-[Manrope]">Patient Roster</h2>
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  className="pl-10 rounded-full bg-muted/50 border-none h-11 text-sm"
                  placeholder="Search by name or condition..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-full h-11 px-5 font-bold text-sm"><Filter className="mr-2" size={15} /> Filter</Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Radio className="animate-pulse text-secondary" size={22} /> Loading patient roster from MongoDB...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border rounded-3xl p-16 text-center">
              <Users size={56} className="text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-xl font-bold text-muted-foreground">No patients found</p>
              {search && <p className="text-sm text-muted-foreground mt-2">No patients match "{search}"</p>}
              {!search && <p className="text-sm text-muted-foreground mt-2">No patients are assigned to your account yet. Patient records are loaded from MongoDB.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {filtered.map((p) => (
                <button
                  key={p.patientId}
                  onClick={() => setLocation(`/clinician/patient/${p.patientId}`)}
                  className="bg-card border rounded-3xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4 min-w-[180px]">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-xl text-primary shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-base text-foreground leading-tight">{p.name}</p>
                        <p className="text-xs text-muted-foreground font-semibold">{p.patientId} · Age {p.age}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.conditions.map((c) => (
                            <span key={c} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${conditionColor(c)}`}>{c.split(" ")[0]}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {p.latestSession ? (
                        <>
                          <MiniMetric label="Risk" value={p.latestSession.risk} color={riskColor(p.latestSession.risk)} />
                          <MiniMetric label="Clarity" value={`${p.latestSession.clarity}%`} />
                          <MiniMetric label="Tremor" value={`${p.latestSession.tremor}%`} color={p.latestSession.tremor > 50 ? "text-destructive" : undefined} />
                          <MiniMetric label="Breath" value={`${p.latestSession.breathlessness}/10`} color={p.latestSession.breathlessness > 7 ? "text-destructive" : undefined} />
                          <MiniMetric label="Sessions" value={String(p.sessionCount)} />
                          <MiniMetric
                            label="Alerts"
                            value={p.unreadAlerts > 0 ? String(p.unreadAlerts) : "Clear"}
                            color={p.criticalAlerts > 0 ? "text-destructive" : p.unreadAlerts > 0 ? "text-secondary" : "text-primary"}
                          />
                        </>
                      ) : (
                        <div className="col-span-3 flex items-center justify-center text-muted-foreground text-sm font-semibold gap-2">
                          <Mic size={14} /> No sessions yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      {p.criticalAlerts > 0 && (
                        <span className="flex items-center gap-1.5 text-xs font-black text-destructive">
                          <ShieldAlert size={13} /> {p.criticalAlerts} Critical
                        </span>
                      )}
                      {p.latestSession && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                          <Clock size={12} /> {new Date(p.latestSession.capturedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-black text-primary group-hover:gap-2.5 transition-all">
                      View Profile <ArrowRight size={13} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

function StatPill({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Mic; color: string }) {
  return (
    <div className="bg-card border p-4 px-6 rounded-2xl text-center shadow-sm min-w-[90px]">
      <Icon size={16} className={`${color} mx-auto mb-1`} />
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function SnapRow({ icon: Icon, label, value, urgent }: { icon: typeof Users; label: string; value: string; urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon size={13} />{label}</div>
      <span className={`text-sm font-black ${urgent ? "text-destructive" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function Progress({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
        <span>{label}</span><span className="text-foreground">{value}%</span>
      </div>
      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${tone} rounded-full transition-all duration-500`} style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center p-2.5 bg-muted/30 rounded-xl">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm font-black ${color ?? "text-foreground"}`}>{value}</p>
    </div>
  );
}
