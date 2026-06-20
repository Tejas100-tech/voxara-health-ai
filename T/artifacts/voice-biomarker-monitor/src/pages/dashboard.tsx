import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Link } from "wouter";
import {
  ArrowRight, Activity, BrainCircuit, Check, Flame, Heart, Mic,
  Pill, Radio, ShieldCheck, Stethoscope, TrendingUp, Wind, Zap,
} from "lucide-react";
import { formatTime, useLatestSession, useLiveVitals } from "@/lib/realtime";

function HealthRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = circ - (circ * score) / 100;
  const color =
    score >= 75 ? "hsl(199 100% 48%)" : score >= 50 ? "hsl(179 60% 44%)" : "hsl(0 78% 52%)";

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={filled}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1), stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black font-[Manrope] text-foreground leading-none">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Health</span>
      </div>
    </div>
  );
}

function SparkLine({ values, color = "hsl(var(--primary))" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 90}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className="w-full h-7" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MetricCard({
  icon: Icon, label, value, detail, accent, width, spark,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  accent: "primary" | "secondary" | "destructive" | "tertiary";
  width: number;
  spark: number[];
}) {
  const toneIcon = accent === "primary" ? "text-primary bg-primary/10"
    : accent === "secondary" ? "text-secondary bg-secondary/10"
    : accent === "destructive" ? "text-destructive bg-destructive/10"
    : "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400";
  const barColor = accent === "primary" ? "hsl(var(--primary))"
    : accent === "secondary" ? "hsl(var(--secondary))"
    : accent === "destructive" ? "hsl(var(--destructive))"
    : "hsl(179 60% 44%)";

  return (
    <div className="bg-card border p-6 rounded-3xl card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${toneIcon}`}><Icon size={22} /></div>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live</span>
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-4xl font-black font-[Manrope] text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground min-h-8">{detail}</p>
      <SparkLine values={spark} color={barColor} />
      <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(5, width))}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const live = useLiveVitals();
  const session = useLatestSession();
  const healthScore = Math.round((live.vocalStability + live.signalQuality + (100 - live.respiratoryLoad)) / 3);

  const [sparkSignal, setSparkSignal] = useState<number[]>([80, 85, 82, 88, 84, 90, live.signalQuality]);
  const [sparkStability, setSparkStability] = useState<number[]>([78, 82, 80, 85, 88, 86, live.vocalStability]);
  const [sparkRisk, setSparkRisk] = useState<number[]>([35, 30, 28, 32, 25, 28, live.riskScore]);
  const [sparkAdherence, setSparkAdherence] = useState<number[]>([90, 92, 94, 93, 95, 94, live.adherence]);

  useEffect(() => {
    setSparkSignal((p) => [...p.slice(-9), live.signalQuality]);
    setSparkStability((p) => [...p.slice(-9), live.vocalStability]);
    setSparkRisk((p) => [...p.slice(-9), live.riskScore]);
    setSparkAdherence((p) => [...p.slice(-9), live.adherence]);
  }, [live.signalQuality, live.vocalStability, live.riskScore, live.adherence]);

  const streakDays = 14;
  const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white p-8 md:p-10 flex flex-col xl:flex-row items-stretch justify-between gap-8 shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(0,180,255,.28),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(20,184,166,.22),transparent_40%)]" />

          <div className="relative z-10 space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-sky-200 border border-white/10">
              <Radio size={13} className="animate-pulse" /> Voxara Health AI · Live
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-[Manrope] leading-tight">
              Voice biomarkers that update{" "}
              <span className="text-cyan-300">as life happens.</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Real-time signal quality, respiratory load, tremor drift, and clinician escalation — synchronized from your latest voice sample.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {[
                ["Signal", `${live.signalQuality}%`],
                ["Stability", `${live.vocalStability}%`],
                ["Risk", `${live.riskScore}%`],
                ["Updated", formatTime(live.now)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">{label}</p>
                  <p className="mt-1 text-lg font-black font-[Manrope]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center gap-6 min-w-[240px]">
            <HealthRing score={healthScore} />
            <Link href="/record">
              <button className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-primary to-secondary transition-all duration-500 shadow-2xl shadow-cyan-500/20 active:scale-95 hover:scale-105 glow-pulse">
                <span className="absolute inset-[-16px] rounded-full border border-cyan-300/15 animate-pulse" />
                <Mic className="mb-2 group-hover:scale-110 transition-transform" size={52} />
                <span className="font-black tracking-tight text-center px-4 leading-tight text-base">
                  Start Live<br />Voice Scan
                </span>
              </button>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Microphone ready</p>
          </div>
        </section>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <MetricCard
            icon={Heart} label="Live Health Score" value={`${healthScore}%`}
            detail="Composite: signal + stability − respiratory" accent="primary"
            width={healthScore} spark={sparkSignal}
          />
          <MetricCard
            icon={Wind} label="Respiratory Load" value={`${live.respiratoryLoad}%`}
            detail="Breath strain model — continuous update" accent="secondary"
            width={live.respiratoryLoad} spark={sparkRisk.map((v) => v / 2)}
          />
          <MetricCard
            icon={Activity} label="Tremor Drift" value={`${live.tremorDrift}%`}
            detail="Micro-instability vs. personal baseline" accent="destructive"
            width={live.tremorDrift} spark={sparkRisk}
          />
          <MetricCard
            icon={Pill} label="Adherence Score" value={`${live.adherence}%`}
            detail="Medication routine + sample completion" accent="tertiary"
            width={live.adherence} spark={sparkAdherence}
          />
        </section>

        {/* Session Intelligence + Side Panels */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-card border rounded-[2rem] p-8 shadow-sm overflow-hidden relative card-hover">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5 mb-7">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                  <Zap size={13} /> Latest Session Intelligence
                </p>
                <h3 className="text-2xl font-extrabold font-[Manrope] text-foreground">{session.id}</h3>
                <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">{session.transcript}</p>
              </div>
              <Link href="/analysis" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-primary/20 hover:gap-3 transition-all shrink-0">
                Open Report <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
              {[
                ["Clarity", `${session.clarity}%`, BrainCircuit, "text-primary"],
                ["Pitch", `${session.pitchConsistency}%`, TrendingUp, "text-secondary"],
                ["Speech", `${session.speechRate} wpm`, Mic, "text-primary"],
                ["Risk", session.risk, ShieldCheck,
                  session.risk === "Elevated" ? "text-destructive" : session.risk === "Moderate" ? "text-secondary" : "text-primary"],
              ].map(([label, value, Icon, color]) => {
                const MetricIcon = Icon as typeof BrainCircuit;
                return (
                  <div key={String(label)} className="rounded-2xl bg-muted/30 p-5 border hover:border-primary/20 transition-all">
                    <MetricIcon className={`${color} mb-3`} size={22} />
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{String(label)}</p>
                    <p className={`mt-1 text-2xl font-black font-[Manrope] ${String(color)}`}>{String(value)}</p>
                  </div>
                );
              })}
            </div>
            <div className="h-20 flex items-end gap-1.5 rounded-2xl bg-slate-950 dark:bg-black/50 p-4 overflow-hidden">
              {session.waveform.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-secondary to-cyan-400 waveform-bar"
                  style={{ height: `${Math.max(10, bar)}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {/* Clinician Sync */}
            <div className="bg-gradient-to-br from-secondary to-primary p-7 rounded-[2rem] text-white shadow-xl card-hover">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope size={24} />
                <h3 className="text-xl font-bold font-[Manrope]">Clinician Sync</h3>
              </div>
              <p className="text-white/85 leading-relaxed mb-5 text-sm">
                Your latest sample is live for your care team.{" "}
                <span className="font-black text-white">{live.clinicianQueue}</span> events in the escalation queue.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-widest font-black text-white/60">Risk Level</p>
                  <p className="text-lg font-black mt-0.5">{live.riskScore < 30 ? "Low" : live.riskScore < 60 ? "Moderate" : "Elevated"}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md">
                  <p className="text-[10px] uppercase tracking-widest font-black text-white/60">Next Review</p>
                  <p className="text-lg font-black mt-0.5">4:30 PM</p>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-card border rounded-[2rem] p-7 card-hover">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold font-[Manrope]">Recording Streak</h3>
                <div className="flex items-center gap-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-orange-600 dark:text-orange-400 font-black text-sm">
                  <Flame size={15} /> {streakDays} Days
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {weekLabels.map((d, i) => (
                  <p key={i} className="text-center text-[10px] font-black text-muted-foreground uppercase">{d}</p>
                ))}
                {Array.from({ length: 14 }).map((_, i) => {
                  const intensity = i < 12 ? "bg-primary" : i === 12 ? "bg-primary/60" : "bg-muted";
                  return (
                    <div key={i} className={`aspect-square rounded-lg ${intensity} flex items-center justify-center transition-all`}>
                      {i < 13 && <Check size={10} className="text-white" />}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground font-semibold text-center">
                Keep going — you're on a <span className="font-black text-primary">14-day</span> streak!
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Sessions Today", value: "1", sub: "Goal: 2 per day", icon: Mic, color: "text-primary" },
            { label: "Avg Clarity", value: `${session.clarity}%`, sub: "Last 7 sessions", icon: BrainCircuit, color: "text-secondary" },
            { label: "Vocal Stability", value: `${live.vocalStability}%`, sub: "Live measurement", icon: Activity, color: "text-primary" },
            { label: "Clinician Queue", value: String(live.clinicianQueue), sub: "Events pending review", icon: Stethoscope, color: session.risk === "Elevated" ? "text-destructive" : "text-secondary" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-card border rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className={item.color} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live</span>
                </div>
                <p className="text-3xl font-black font-[Manrope]">{item.value}</p>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            );
          })}
        </section>
      </div>
    </AppLayout>
  );
}
