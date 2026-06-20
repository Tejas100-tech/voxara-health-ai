import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import {
  Activity, AlertCircle, ArrowLeft, BrainCircuit, Calendar, CheckCircle2,
  ChevronDown, ChevronUp, Clock, Cloud, Database, FileText, Mic, Phone,
  Play, Pause, Plus, Radio, Send, Shield, ShieldAlert, Stethoscope,
  TrendingDown, TrendingUp, User, Wind, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { acknowledgeNotification } from "@/lib/api";

interface Session {
  _id: string;
  sessionId: string;
  capturedAt: string;
  duration: number;
  clarity: number;
  tremor: number;
  breathlessness: number;
  pitchConsistency: number;
  speechRate: number;
  risk: "Low" | "Moderate" | "Elevated";
  transcript: string;
  waveform: number[];
  audioUrl?: string;
}

interface Alert {
  _id: string;
  kind: "Critical" | "Watch" | "Insight";
  title: string;
  body: string;
  metric: string;
  value: number | string;
  acknowledged: boolean;
  createdAt: string;
}

interface Note {
  _id: string;
  content: string;
  clinicianName: string;
  noteType: string;
  priority: string;
  createdAt: string;
}

interface ProfileData {
  patient: {
    patientId: string;
    name: string;
    email: string;
    age: number;
    dob: string;
    phone: string;
    conditions: string[];
    clinicianName: string;
  };
  sessions: Session[];
  alerts: Alert[];
  notes: Note[];
  stats: {
    totalSessions: number;
    avgClarity: number;
    avgTremor: number;
    avgBreath: number;
    unreadAlerts: number;
    lastSession: Session | null;
  };
}

function AudioPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => new Audio(url));
  audio.onended = () => setPlaying(false);
  const toggle = () => {
    if (playing) audio.pause(); else audio.play().catch(() => setPlaying(false));
    setPlaying(!playing);
  };
  return (
    <button onClick={toggle} className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl text-xs font-bold transition-all">
      {playing ? <Pause size={12} /> : <Play size={12} />}
      {playing ? "Pause" : "Play"}
    </button>
  );
}

const riskColor = (r: string) =>
  r === "Elevated" ? "text-destructive bg-destructive/10 border-destructive/20"
  : r === "Moderate" ? "text-secondary bg-secondary/10 border-secondary/20"
  : "text-primary bg-primary/10 border-primary/20";

const noteTypeIcon: Record<string, typeof FileText> = {
  observation: BrainCircuit,
  medication: Shield,
  escalation: AlertCircle,
  appointment: Calendar,
  general: FileText,
};
const noteTypeColor: Record<string, string> = {
  observation: "text-primary bg-primary/10",
  medication: "text-secondary bg-secondary/10",
  escalation: "text-destructive bg-destructive/10",
  appointment: "text-amber-600 bg-amber-50",
  general: "text-muted-foreground bg-muted",
};
const priorityColor: Record<string, string> = {
  routine: "bg-muted text-muted-foreground",
  urgent: "bg-secondary/10 text-secondary",
  critical: "bg-destructive/10 text-destructive",
};

export default function PatientDetailPage() {
  const params = useParams<{ patientId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("observation");
  const [notePriority, setNotePriority] = useState("routine");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "alerts" | "notes">("overview");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/clinician/patient/${params.patientId}/profile`);
      const json = await res.json();
      setData(json);
      setAlerts(json.alerts || []);
    } catch {}
    finally { setLoading(false); }
  }, [params.patientId]);

  useEffect(() => { load(); }, [load]);

  const addNote = async () => {
    if (!noteContent.trim() || !user) return;
    setSaving(true);
    try {
      await fetch(`/api/patients/${params.patientId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicianId: user.patientId,
          clinicianName: user.name,
          content: noteContent,
          noteType,
          priority: notePriority,
        }),
      });
      setNoteContent("");
      await load();
    } catch {}
    finally { setSaving(false); }
  };

  const handleAck = async (id: string) => {
    await acknowledgeNotification(id);
    setAlerts((prev) => prev.map((a) => a._id === id ? { ...a, acknowledged: true } : a));
  };

  if (loading) {
    return (
      <AppLayout userType="clinician">
        <div className="flex items-center justify-center min-h-96 gap-3 text-muted-foreground">
          <Radio className="animate-pulse" size={22} /> Loading patient profile from MongoDB...
        </div>
      </AppLayout>
    );
  }

  if (!data) {
    return (
      <AppLayout userType="clinician">
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <AlertCircle size={48} className="text-destructive/30" />
          <p className="text-xl font-bold">Patient not found</p>
          <Button onClick={() => setLocation("/clinician")}>Back to Command Center</Button>
        </div>
      </AppLayout>
    );
  }

  const { patient, sessions, notes, stats } = data;

  const chartData = [...sessions].reverse().slice(-15).map((s, i) => ({
    i: i + 1,
    date: new Date(s.capturedAt).toLocaleDateString([], { month: "short", day: "numeric" }),
    clarity: s.clarity,
    tremor: s.tremor,
    breathlessness: Math.round(s.breathlessness * 10),
    pitch: s.pitchConsistency,
  }));

  const lastSession = stats.lastSession;
  const radarData = lastSession ? [
    { metric: "Clarity", value: lastSession.clarity },
    { metric: "Pitch", value: lastSession.pitchConsistency },
    { metric: "Stability", value: 100 - lastSession.tremor },
    { metric: "Breath", value: Math.max(0, 100 - lastSession.breathlessness * 10) },
    { metric: "Speech Rate", value: Math.min(100, lastSession.speechRate / 2) },
  ] : [];

  const conditionBadge = (c: string) =>
    c.toLowerCase().includes("parkinson") ? "bg-purple-100 text-purple-700"
    : c.toLowerCase().includes("asthma") ? "bg-blue-100 text-blue-700"
    : c.toLowerCase().includes("depression") ? "bg-amber-100 text-amber-700"
    : "bg-muted text-muted-foreground";

  const tabs = ["overview", "sessions", "alerts", "notes"] as const;

  return (
    <AppLayout userType="clinician">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Back + header */}
        <div>
          <button onClick={() => setLocation("/clinician")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Command Center
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Patient card */}
            <div className="lg:col-span-5 bg-card border rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-extrabold font-[Manrope] text-foreground">{patient.name}</h1>
                  <p className="text-sm text-muted-foreground font-semibold">{patient.patientId} · Age {patient.age}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {patient.conditions.map((c) => (
                      <span key={c} className={`text-xs font-bold px-2.5 py-1 rounded-full ${conditionBadge(c)}`}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {patient.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><User size={14} className="text-muted-foreground" /></div>
                    <span className="text-muted-foreground font-medium">{patient.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Phone size={14} className="text-muted-foreground" /></div>
                    <span className="text-muted-foreground font-medium">{patient.phone}</span>
                  </div>
                )}
                {patient.dob && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0"><Calendar size={14} className="text-muted-foreground" /></div>
                    <span className="text-muted-foreground font-medium">DOB: {patient.dob}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Stethoscope size={14} className="text-primary" /></div>
                  <span className="font-semibold text-foreground">{patient.clinicianName}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Sessions", value: String(stats.totalSessions), icon: Mic, accent: "primary" },
                { label: "Avg Clarity", value: `${stats.avgClarity}%`, icon: BrainCircuit, accent: "secondary" },
                { label: "Avg Tremor", value: `${stats.avgTremor}%`, icon: Activity, accent: "destructive" },
                { label: "Avg Breath", value: `${stats.avgBreath}/10`, icon: Wind, accent: "secondary" },
                { label: "Open Alerts", value: String(stats.unreadAlerts), icon: AlertCircle, accent: stats.unreadAlerts > 0 ? "destructive" : "primary" },
                { label: "Notes", value: String(notes.length), icon: FileText, accent: "primary" },
              ].map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="bg-card border rounded-2xl p-5 shadow-sm">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent === "primary" ? "bg-primary/10 text-primary" : accent === "secondary" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                  <p className="text-2xl font-black font-[Manrope] mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "alerts" && stats.unreadAlerts > 0 ? (
                <span className="flex items-center gap-2">{tab} <span className="bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{stats.unreadAlerts}</span></span>
              ) : tab}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
              {/* Trend chart */}
              <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-xl font-bold font-[Manrope] mb-6 flex items-center gap-2"><Database size={18} className="text-secondary" /> Biomarker Trends (MongoDB)</h3>
                {chartData.length === 0 ? (
                  <div className="h-56 flex items-center justify-center text-muted-foreground">No sessions yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient>
                        <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                      <Area type="monotone" dataKey="clarity" name="Clarity" stroke="#0ea5e9" fill="url(#gC)" strokeWidth={2.5} dot={{ r: 4, fill: "#0ea5e9" }} />
                      <Area type="monotone" dataKey="tremor" name="Tremor" stroke="#ef4444" fill="url(#gT)" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Latest session */}
              {lastSession && (
                <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold font-[Manrope]">Latest Session · {lastSession.sessionId}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-black border ${riskColor(lastSession.risk)}`}>{lastSession.risk} Risk</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      ["Clarity", `${lastSession.clarity}%`, BrainCircuit],
                      ["Tremor", `${lastSession.tremor}%`, Activity],
                      ["Breathlessness", `${lastSession.breathlessness}/10`, Wind],
                      ["Pitch", `${lastSession.pitchConsistency}%`, TrendingUp],
                    ].map(([label, value, Icon]) => {
                      const I = Icon as typeof BrainCircuit;
                      return (
                        <div key={String(label)} className="bg-muted/40 border rounded-2xl p-4">
                          <I size={16} className="text-primary mb-2" />
                          <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">{String(label)}</p>
                          <p className="text-xl font-black mt-1">{String(value)}</p>
                        </div>
                      );
                    })}
                  </div>
                  {lastSession.waveform?.length > 0 && (
                    <div className="h-16 flex items-end gap-1.5 rounded-2xl bg-slate-950 p-4 mb-4 overflow-hidden">
                      {lastSession.waveform.map((bar, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-secondary to-cyan-300 rounded-full" style={{ height: `${Math.max(8, bar)}%` }} />
                      ))}
                    </div>
                  )}
                  {lastSession.transcript && (
                    <div className="bg-muted/30 border rounded-2xl p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Transcript</p>
                      <p className="text-sm leading-relaxed">{lastSession.transcript}</p>
                    </div>
                  )}
                  {lastSession.audioUrl && (
                    <div className="mt-4 flex items-center gap-3">
                      <AudioPlayer url={lastSession.audioUrl} />
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Cloud size={12} /> Cloudinary</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="xl:col-span-4 space-y-6">
              {/* Radar chart */}
              {radarData.length > 0 && (
                <div className="bg-card border rounded-[2rem] p-6 shadow-sm">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Biomarker Radar · Last Session</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 700 }} />
                      <Radar name="Score" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Quick note compose */}
              <div className="bg-card border rounded-[2rem] p-6 shadow-sm">
                <h4 className="text-base font-bold font-[Manrope] mb-4 flex items-center gap-2"><FileText size={18} className="text-primary" /> Add Clinical Note</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="flex-1 text-xs font-bold uppercase tracking-wide bg-muted border rounded-xl px-3 py-2 text-muted-foreground">
                      <option value="observation">Observation</option>
                      <option value="medication">Medication</option>
                      <option value="escalation">Escalation</option>
                      <option value="appointment">Appointment</option>
                      <option value="general">General</option>
                    </select>
                    <select value={notePriority} onChange={(e) => setNotePriority(e.target.value)} className="text-xs font-bold uppercase tracking-wide bg-muted border rounded-xl px-3 py-2 text-muted-foreground">
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Write clinical observation, medication change, or escalation note..."
                    className="w-full rounded-2xl border bg-muted/30 p-4 text-sm resize-none min-h-28 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                  />
                  <Button className="w-full rounded-xl font-bold" onClick={addNote} disabled={saving || !noteContent.trim()}>
                    <Send size={15} className="mr-2" /> {saving ? "Saving..." : "Save Note"}
                  </Button>
                </div>
              </div>

              {/* Recent alerts summary */}
              {alerts.filter((a) => !a.acknowledged).length > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-[2rem] p-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-destructive mb-4 flex items-center gap-2"><Zap size={14} /> Unacknowledged Alerts</h4>
                  {alerts.filter((a) => !a.acknowledged).slice(0, 3).map((a) => (
                    <div key={a._id} className="mb-3 last:mb-0 p-3 bg-card border rounded-2xl">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-black text-destructive uppercase tracking-wider">{a.kind}</p>
                          <p className="text-sm font-semibold mt-0.5">{a.title}</p>
                        </div>
                        <button onClick={() => handleAck(a._id)} className="shrink-0 text-xs text-muted-foreground hover:text-primary font-bold px-2 py-1 bg-muted rounded-lg transition-colors">Ack</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions tab */}
        {activeTab === "sessions" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2"><Database size={14} className="text-secondary" /> {sessions.length} sessions loaded from MongoDB</p>
            {sessions.length === 0 && (
              <div className="bg-card border rounded-3xl p-12 text-center">
                <Mic size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-xl font-bold text-muted-foreground">No sessions yet for this patient</p>
              </div>
            )}
            {sessions.map((s) => {
              const expanded = expandedSession === s._id;
              return (
                <div key={s._id} className="bg-card border rounded-3xl overflow-hidden hover:shadow-md transition-all">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedSession(expanded ? null : s._id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Mic size={22} /></div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-black font-[Manrope]">{s.sessionId}</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${riskColor(s.risk)}`}>{s.risk}</span>
                          {s.audioUrl && <span className="text-xs text-secondary font-bold flex items-center gap-1"><Cloud size={11} />Audio</span>}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                          <span className="flex items-center gap-1"><Calendar size={11} />{new Date(s.capturedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{new Date(s.capturedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="hidden md:flex gap-5 text-sm">
                        <span className="font-bold">Clarity: <span className="text-primary">{s.clarity}%</span></span>
                        <span className="font-bold">Tremor: <span className="text-destructive">{s.tremor}%</span></span>
                        <span className="font-bold">Breath: <span className="text-secondary">{s.breathlessness}/10</span></span>
                      </div>
                      {expanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                    </div>
                  </div>
                  {expanded && (
                    <div className="border-t px-6 pb-6 pt-5 bg-muted/20 space-y-4">
                      {s.waveform?.length > 0 && (
                        <div className="h-16 flex items-end gap-1.5 rounded-2xl bg-slate-950 p-4 overflow-hidden">
                          {s.waveform.map((bar: number, i: number) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-secondary to-cyan-300 rounded-full" style={{ height: `${Math.max(8, bar)}%` }} />
                          ))}
                        </div>
                      )}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {[["Clarity", `${s.clarity}%`], ["Tremor", `${s.tremor}%`], ["Breath", `${s.breathlessness}/10`], ["Pitch", `${s.pitchConsistency}%`], ["Speech", `${s.speechRate} wpm`], ["Duration", `${s.duration}s`]].map(([l, v]) => (
                          <div key={l} className="bg-card border rounded-xl p-3 text-center">
                            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{l}</p>
                            <p className="text-base font-black mt-1">{v}</p>
                          </div>
                        ))}
                      </div>
                      {s.transcript && <div className="bg-card border rounded-2xl p-4"><p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">Transcript</p><p className="text-sm leading-relaxed">{s.transcript}</p></div>}
                      {s.audioUrl && <div className="flex items-center gap-3"><AudioPlayer url={s.audioUrl} /><span className="text-xs text-muted-foreground flex items-center gap-1"><Cloud size={12} /> Cloudinary</span></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Alerts tab */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {alerts.length === 0 && (
              <div className="bg-card border rounded-3xl p-12 text-center">
                <CheckCircle2 size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-xl font-bold text-muted-foreground">No alerts for this patient</p>
              </div>
            )}
            {alerts.map((a) => (
              <div key={a._id} className={`bg-card border-l-4 ${a.kind === "Critical" ? "border-l-destructive" : "border-l-secondary"} rounded-3xl p-6 ${a.acknowledged ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-black uppercase tracking-widest ${a.kind === "Critical" ? "text-destructive" : "text-secondary"}`}>{a.kind}</span>
                      <span className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                    </div>
                    <h4 className="text-lg font-bold font-[Manrope] mb-1">{a.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">Metric: {a.metric} · Value: {String(a.value)}</p>
                  </div>
                  {!a.acknowledged && (
                    <Button size="sm" variant="outline" className="rounded-xl shrink-0" onClick={() => handleAck(a._id)}>Acknowledge</Button>
                  )}
                  {a.acknowledged && <span className="text-xs font-black uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1.5 rounded-full shrink-0">Done</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes tab */}
        {activeTab === "notes" && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-4">
              {notes.length === 0 && (
                <div className="bg-card border rounded-3xl p-12 text-center">
                  <FileText size={48} className="text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-xl font-bold text-muted-foreground">No clinical notes yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Add the first note using the composer on the right.</p>
                </div>
              )}
              {notes.map((n) => {
                const NoteIcon = noteTypeIcon[n.noteType] ?? FileText;
                return (
                  <div key={n._id} className="bg-card border rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${noteTypeColor[n.noteType] ?? "bg-muted text-muted-foreground"}`}>
                        <NoteIcon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-xs font-black uppercase tracking-widest text-primary capitalize">{n.noteType}</span>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full capitalize ${priorityColor[n.priority] ?? "bg-muted text-muted-foreground"}`}>{n.priority}</span>
                          <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-base leading-relaxed text-foreground">{n.content}</p>
                        <p className="text-xs text-muted-foreground font-semibold mt-3 flex items-center gap-1"><Stethoscope size={11} /> {n.clinicianName}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="xl:col-span-4">
              <div className="bg-card border rounded-[2rem] p-6 shadow-sm sticky top-6">
                <h4 className="text-base font-bold font-[Manrope] mb-4 flex items-center gap-2"><Plus size={18} className="text-primary" /> New Clinical Note</h4>
                <div className="space-y-3">
                  <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className="w-full text-xs font-bold uppercase tracking-wide bg-muted border rounded-xl px-3 py-2.5 text-muted-foreground">
                    <option value="observation">Observation</option>
                    <option value="medication">Medication Change</option>
                    <option value="escalation">Escalation</option>
                    <option value="appointment">Appointment</option>
                    <option value="general">General</option>
                  </select>
                  <select value={notePriority} onChange={(e) => setNotePriority(e.target.value)} className="w-full text-xs font-bold uppercase tracking-wide bg-muted border rounded-xl px-3 py-2.5 text-muted-foreground">
                    <option value="routine">Routine Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Clinical note, observation, medication change, or follow-up plan..."
                    className="w-full rounded-2xl border bg-muted/30 p-4 text-sm resize-none min-h-36 focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                  />
                  <Button className="w-full rounded-xl font-bold" onClick={addNote} disabled={saving || !noteContent.trim()}>
                    <Send size={15} className="mr-2" /> {saving ? "Saving..." : "Save Note to MongoDB"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
