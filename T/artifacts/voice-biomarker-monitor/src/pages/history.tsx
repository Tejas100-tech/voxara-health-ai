import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import {
  Activity, BrainCircuit, Calendar, CheckCircle2, ChevronDown, ChevronUp,
  Clock, Cloud, Database, Flame, Mic, Play, Pause, Radio, TrendingDown, TrendingUp, Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend
} from "recharts";

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
  confidence: number;
  risk: "Low" | "Moderate" | "Elevated";
  transcript: string;
  waveform: number[];
  audioUrl?: string;
}

interface Stats {
  totalSessions: number;
  avgClarity: number;
  avgTremor: number;
  avgBreathlessness: number;
  riskDistribution: Record<string, number>;
  streak: number;
}

function AudioPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => new Audio(url));

  audio.onended = () => setPlaying(false);

  const toggle = () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setPlaying(false));
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl text-xs font-bold transition-all"
    >
      {playing ? <Pause size={14} /> : <Play size={14} />}
      {playing ? "Pause" : "Play"} Recording
      <Cloud size={13} className="opacity-60" />
    </button>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "chart">("chart");

  useEffect(() => {
    if (!user) return;
    const pid = user.patientId;

    Promise.all([
      fetch(`/api/patients/${pid}/sessions`).then((r) => r.json()),
      fetch(`/api/patients/${pid}/stats`).then((r) => r.json()),
    ])
      .then(([s, st]) => {
        setSessions(Array.isArray(s) ? s : []);
        setStats(st);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const chartData = [...sessions]
    .reverse()
    .slice(-20)
    .map((s, i) => ({
      index: i + 1,
      date: new Date(s.capturedAt).toLocaleDateString([], { month: "short", day: "numeric" }),
      time: new Date(s.capturedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      clarity: s.clarity,
      tremor: s.tremor,
      breathlessness: Math.round(s.breathlessness * 10),
      pitch: s.pitchConsistency,
    }));

  const riskColor = (risk: string) =>
    risk === "Elevated" ? "text-destructive bg-destructive/10 border-destructive/20"
      : risk === "Moderate" ? "text-secondary bg-secondary/10 border-secondary/20"
      : "text-primary bg-primary/10 border-primary/20";

  const clarityTrend = sessions.length >= 2
    ? sessions[0].clarity - sessions[sessions.length - 1].clarity
    : 0;

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <header>
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm mb-3">
            <Database size={15} className="text-secondary" /> Session History · MongoDB
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-[Manrope] text-primary tracking-tight mb-3">Your Biomarker History</h1>
              <p className="text-xl text-muted-foreground">All voice sessions with biomarker trends, AI analysis, and cloud audio playback.</p>
            </div>
          </div>
        </header>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <StatCard icon={Mic} label="Total Sessions" value={String(stats.totalSessions)} accent="primary" />
            <StatCard icon={BrainCircuit} label="Avg Clarity" value={`${stats.avgClarity}%`} accent="secondary" />
            <StatCard icon={Activity} label="Avg Tremor" value={`${stats.avgTremor}%`} accent="destructive" />
            <StatCard icon={Wind} label="Avg Breath" value={`${stats.avgBreathlessness}/10`} accent="secondary" />
            <StatCard icon={Flame} label="Day Streak" value={`${stats.streak}d`} accent="primary" />
            <StatCard
              icon={clarityTrend >= 0 ? TrendingUp : TrendingDown}
              label="Clarity Trend"
              value={`${clarityTrend >= 0 ? "+" : ""}${clarityTrend}%`}
              accent={clarityTrend >= 0 ? "primary" : "destructive"}
            />
          </div>
        )}

        {/* Risk summary */}
        {stats && stats.totalSessions > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {(["Low", "Moderate", "Elevated"] as const).map((r) => (
              <div key={r} className={`border rounded-2xl p-5 ${riskColor(r)}`}>
                <p className="text-xs font-black uppercase tracking-widest mb-1">{r} Risk</p>
                <p className="text-3xl font-black font-[Manrope]">{stats.riskDistribution[r] || 0}</p>
                <p className="text-xs mt-1 opacity-70">sessions</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart / Timeline tabs */}
        <div className="bg-card border rounded-[2rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-[Manrope]">Biomarker Trends</h3>
            <div className="flex gap-2">
              {(["chart", "timeline"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {tab === "chart" ? "Line Chart" : "Data Table"}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              <Radio className="animate-pulse mr-3" size={20} /> Loading sessions from MongoDB...
            </div>
          ) : sessions.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-center gap-4">
              <Mic size={48} className="text-muted-foreground/30" />
              <p className="text-xl font-bold text-muted-foreground">No sessions recorded yet</p>
              <p className="text-muted-foreground">Complete your first voice scan to see your biomarker history here.</p>
            </div>
          ) : activeTab === "chart" ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="gradClarity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradTremor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPitch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  formatter={(value: number, name: string) => [`${value}${name === "breathlessness" ? "/10 ×10" : "%"}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Legend />
                <Area type="monotone" dataKey="clarity" name="Clarity" stroke="#0ea5e9" fill="url(#gradClarity)" strokeWidth={2.5} dot={{ r: 4, fill: "#0ea5e9" }} />
                <Area type="monotone" dataKey="tremor" name="Tremor" stroke="#ef4444" fill="url(#gradTremor)" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} />
                <Area type="monotone" dataKey="pitch" name="Pitch" stroke="#14b8a6" fill="url(#gradPitch)" strokeWidth={2} dot={{ r: 3, fill: "#14b8a6" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-4 font-black uppercase tracking-wider text-xs">Date/Time</th>
                    <th className="text-center py-3 px-4 font-black uppercase tracking-wider text-xs">Clarity</th>
                    <th className="text-center py-3 px-4 font-black uppercase tracking-wider text-xs">Tremor</th>
                    <th className="text-center py-3 px-4 font-black uppercase tracking-wider text-xs">Breath</th>
                    <th className="text-center py-3 px-4 font-black uppercase tracking-wider text-xs">Pitch</th>
                    <th className="text-center py-3 px-4 font-black uppercase tracking-wider text-xs">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold">{new Date(s.capturedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.capturedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
                      </td>
                      <td className="text-center py-3 px-4 font-bold">{s.clarity}%</td>
                      <td className="text-center py-3 px-4 font-bold">{s.tremor}%</td>
                      <td className="text-center py-3 px-4 font-bold">{s.breathlessness}/10</td>
                      <td className="text-center py-3 px-4 font-bold">{s.pitchConsistency}%</td>
                      <td className="text-center py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${riskColor(s.risk)}`}>{s.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Session Cards */}
        {!loading && sessions.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold font-[Manrope] mb-6">Session Detail Cards</h3>
            <div className="space-y-4">
              {sessions.map((session) => {
                const isExpanded = expandedId === session._id;
                const date = new Date(session.capturedAt);
                return (
                  <div key={session._id} className={`bg-card border rounded-3xl overflow-hidden transition-all hover:shadow-md ${isExpanded ? "shadow-lg" : ""}`}>
                    <div
                      className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : session._id)}
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Mic size={26} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black text-lg font-[Manrope]">{session.sessionId}</p>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-black border ${riskColor(session.risk)}`}>{session.risk}</span>
                            {session.audioUrl && (
                              <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-black flex items-center gap-1">
                                <Cloud size={11} /> Audio
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar size={13} />{date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</span>
                            <span className="flex items-center gap-1"><Clock size={13} />{date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                            <span className="flex items-center gap-1"><Mic size={13} />{session.duration}s recorded</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6">
                          <Metric label="Clarity" value={`${session.clarity}%`} good={session.clarity > 75} />
                          <Metric label="Tremor" value={`${session.tremor}%`} good={session.tremor < 40} />
                          <Metric label="Breath" value={`${session.breathlessness}/10`} good={session.breathlessness < 5} />
                        </div>
                        {isExpanded ? <ChevronUp size={20} className="text-muted-foreground shrink-0" /> : <ChevronDown size={20} className="text-muted-foreground shrink-0" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t px-6 pb-6 pt-5 space-y-6 bg-muted/20">
                        {/* Mini waveform */}
                        {session.waveform && session.waveform.length > 0 && (
                          <div className="h-20 flex items-end gap-1.5 rounded-2xl bg-slate-950 p-4 overflow-hidden">
                            {session.waveform.map((bar: number, i: number) => (
                              <div key={i} className="flex-1 bg-gradient-to-t from-secondary to-cyan-300 rounded-full" style={{ height: `${Math.max(8, bar)}%` }} />
                            ))}
                          </div>
                        )}

                        {/* Biomarker grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            ["Clarity", `${session.clarity}%`, BrainCircuit],
                            ["Tremor Index", `${session.tremor}%`, Activity],
                            ["Breathlessness", `${session.breathlessness}/10`, Wind],
                            ["Pitch Consistency", `${session.pitchConsistency}%`, TrendingUp],
                            ["Speech Rate", `${session.speechRate} wpm`, Mic],
                            ["Confidence", `${session.confidence}%`, CheckCircle2],
                          ].map(([label, value, Icon]) => {
                            const I = Icon as typeof BrainCircuit;
                            return (
                              <div key={String(label)} className="bg-card border rounded-2xl p-4">
                                <I size={18} className="text-primary mb-2" />
                                <p className="text-xs text-muted-foreground font-black uppercase tracking-wider">{String(label)}</p>
                                <p className="text-xl font-black font-[Manrope] mt-1">{String(value)}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Transcript */}
                        <div className="bg-card border rounded-2xl p-5">
                          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2"><Mic size={13} /> Transcript</p>
                          <p className="text-base leading-relaxed text-foreground">{session.transcript}</p>
                        </div>

                        {/* Audio playback */}
                        {session.audioUrl && (
                          <div className="flex items-center gap-4 flex-wrap">
                            <AudioPlayer url={session.audioUrl} />
                            <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1"><Cloud size={13} /> Stored in Cloudinary</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Mic; label: string; value: string; accent: "primary" | "secondary" | "destructive" }) {
  const color = accent === "primary" ? "text-primary bg-primary/10" : accent === "secondary" ? "text-secondary bg-secondary/10" : "text-destructive bg-destructive/10";
  return (
    <div className="bg-card border rounded-2xl p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={18} /></div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-black font-[Manrope] mt-1">{value}</p>
    </div>
  );
}

function Metric({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`text-lg font-black ${good ? "text-primary" : "text-destructive"}`}>{value}</p>
    </div>
  );
}
