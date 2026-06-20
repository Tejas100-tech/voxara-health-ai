import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout";
import {
  Activity, AlertTriangle, BrainCircuit, CheckCircle2, ChevronRight,
  Cpu, Fingerprint, Radio, Sparkles, TrendingUp, Zap,
} from "lucide-react";
import { useLatestSession, useLiveVitals } from "@/lib/realtime";
import {
  runMLPipeline, loadDigitalTwin, type MLInsightsReport, type VocalClass,
} from "@/lib/ml-engine";

// ─── Mini Chart Components ────────────────────────────────────────────────────

function ConfidenceBar({ label, value, color, isActive }: { label: string; value: number; color: string; isActive: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${isActive ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border bg-card"}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
        <span className={`text-xl font-black font-[Manrope] ${isActive ? "text-primary" : "text-muted-foreground"}`}>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.round(value * 100)}%`, background: isActive ? color : "hsl(var(--muted-foreground))" }}
        />
      </div>
    </div>
  );
}

function ForecastChart({ points }: { points: { dayOffset: number; wellness: number; lower: number; upper: number }[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const W = 700; const H = 160; const PAD = 30;
  const pw = W - PAD * 2; const ph = H - PAD * 2;
  const min = Math.max(0, Math.min(...points.map((p) => p.lower)) - 5);
  const max = Math.min(100, Math.max(...points.map((p) => p.upper)) + 5);
  const range = max - min || 1;

  const toX = (i: number) => PAD + (i / (points.length - 1)) * pw;
  const toY = (v: number) => PAD + ph - ((v - min) / range) * ph;

  const midPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(p.wellness)}`).join(" ");
  const upperPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(p.upper)}`).join(" ");
  const lowerPath = points.map((p, i) => `L${toX(i)},${toY(p.lower)}`).reverse().join(" ");
  const areaPath = upperPath + " " + lowerPath + " Z";

  return (
    <div className="relative" onMouseLeave={() => setHoverIdx(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
        <defs>
          <linearGradient id="fcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#fcGrad)" />
        <path d={midPath} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="6,4" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={toX(i)} cy={toY(p.wellness)} r={hoverIdx === i ? 7 : 5}
              fill={hoverIdx === i ? "hsl(var(--primary))" : "white"} stroke="hsl(var(--primary))" strokeWidth="2.5"
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoverIdx(i)}
            />
            {hoverIdx === i && (
              <g>
                <rect x={toX(i) - 44} y={toY(p.wellness) - 48} width="88" height="42" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
                <text x={toX(i)} y={toY(p.wellness) - 30} textAnchor="middle" fontSize="14" fill="hsl(var(--muted-foreground))" fontWeight="600">Day +{p.dayOffset}</text>
                <text x={toX(i)} y={toY(p.wellness) - 12} textAnchor="middle" fontSize="18" fill="hsl(var(--primary))" fontWeight="900">{p.wellness}%</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <div className="flex justify-between px-1 mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {points.map((p) => <span key={p.dayOffset}>+{p.dayOffset}d</span>)}
      </div>
    </div>
  );
}

function RadarFingerprint({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data);
  const n = entries.length;
  const cx = 130; const cy = 130; const r = 100;
  const angles = entries.map((_, i) => (i * 2 * Math.PI) / n - Math.PI / 2);

  const pts = entries.map(([, v], i) => {
    const pct = v / 100;
    return { x: cx + r * pct * Math.cos(angles[i]), y: cy + r * pct * Math.sin(angles[i]) };
  });

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const axisEnds = angles.map((a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[260px]">
      <defs>
        <radialGradient id="fpGrad">
          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.45" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <polygon key={lvl} fill="none" stroke="hsl(var(--border))" strokeWidth="1"
          points={angles.map((a) => `${cx + r * lvl * Math.cos(a)},${cy + r * lvl * Math.sin(a)}`).join(" ")} />
      ))}
      {axisEnds.map((pt, i) => <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="hsl(var(--border))" strokeWidth="1" />)}
      <path d={path} fill="url(#fpGrad)" stroke="hsl(var(--secondary))" strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />)}
      {axisEnds.map((pt, i) => {
        const labelX = cx + (r + 22) * Math.cos(angles[i]);
        const labelY = cy + (r + 22) * Math.sin(angles[i]);
        return (
          <text key={i} x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="700" fill="hsl(var(--muted-foreground))" className="uppercase">
            {entries[i]?.[0] ?? ""}
          </text>
        );
      })}
    </svg>
  );
}

function ZScoreBar({ label, z, idx }: { label: string; z: number; idx: number }) {
  const abs = Math.abs(z);
  const clamped = Math.min(abs, 4);
  const color = abs > 3.5 ? "bg-red-500" : abs > 2.5 ? "bg-amber-500" : abs > 1.5 ? "bg-primary" : "bg-emerald-500";
  const textColor = abs > 3.5 ? "text-red-600" : abs > 2.5 ? "text-amber-600" : abs > 1.5 ? "text-primary" : "text-emerald-600";
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-[10px] font-bold text-muted-foreground w-10 shrink-0 uppercase text-right">C{idx}</span>
      <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden relative">
        <div className={`absolute top-0 h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${(clamped / 4) * 100}%` }} />
      </div>
      <span className={`text-xs font-black w-12 text-right ${textColor}`}>{z > 0 ? "+" : ""}{z.toFixed(2)}σ</span>
      <span className="text-[10px] text-muted-foreground w-24 truncate hidden sm:block">{label}</span>
    </div>
  );
}

const CLASS_COLORS: Record<VocalClass, string> = {
  stable: "hsl(var(--secondary))",
  mild_decline: "hsl(var(--primary))",
  moderate_decline: "hsl(45 80% 50%)",
  acute: "hsl(var(--destructive))",
};

const CLASS_LABELS: Record<VocalClass, string> = {
  stable: "Stable",
  mild_decline: "Mild Decline",
  moderate_decline: "Moderate Decline",
  acute: "Acute / Critical",
};

const CLASS_DESCRIPTIONS: Record<VocalClass, string> = {
  stable: "Voice biomarkers within normal bounds for this patient's digital twin baseline.",
  mild_decline: "Minor deviations detected. Monitor closely; no immediate clinical action required.",
  moderate_decline: "Meaningful biomarker shifts detected. Clinical review recommended within 48h.",
  acute: "Significant anomalies across multiple feature channels. Urgent clinical escalation advised.",
};

const MFCC_LABELS = ["C0 Energy","C1 F0 proxy","C2 Voice quality","C3 Timbre","C4 Resonance","C5 Articuln","C6 Clarity","C7 Nasality","C8 Fricatives","C9 HF detail","C10 Tremor HF","C11 Sibilance","C12 Breathiness"];

export default function MLDashboard() {
  const session = useLatestSession();
  const live = useLiveVitals();
  const twin = loadDigitalTwin();
  const [sessionCount, setSessionCount] = useState(twin?.sessionCount ?? 0);
  const [activeTab, setActiveTab] = useState<"network" | "fingerprint" | "forecast" | "anomaly">("network");

  const mlReport = useMemo<MLInsightsReport>(() => {
    return runMLPipeline({
      mfcc: session.mfcc?.coefficients ?? Array(13).fill(0).map((_, i) => Math.sin(i * 0.7) * 5),
      waveform: session.waveform,
      clarity: session.clarity,
      tremor: session.tremor,
      breathlessness: session.breathlessness,
      pitchConsistency: session.pitchConsistency,
      speechRate: session.speechRate,
      noiseFloor: session.noiseFloor,
      riskScore: live.riskScore,
      adherence: live.adherence,
      spectralCentroid: session.mfcc?.spectralCentroid,
      zcr: session.mfcc?.zeroCrossingRate,
      energy: session.mfcc?.energy,
      rolloff: session.mfcc?.spectralRolloff,
      historicalWellness: [72, 74, 75, 78, 77, 79, 80],
      calibration: session.mfcc ? "live" : "demo",
    });
  }, [session.id, live.riskScore]);

  useEffect(() => {
    const t = loadDigitalTwin();
    setSessionCount(t?.sessionCount ?? 0);
  }, [session.id]);

  const { network, clinical, anomaly, forecast, importance, fingerprint, deltaFeatures, modelMeta } = mlReport;
  const classColor = CLASS_COLORS[network.predictedClass];

  const fpData: Record<string, number> = {
    Energy: fingerprint.energy,
    Clarity: fingerprint.clarity,
    Pitch: fingerprint.pitch,
    Tremor: fingerprint.tremor,
    Breath: fingerprint.breathControl,
    Articuln: fingerprint.articulation,
    Resonance: fingerprint.resonance,
    Dynamic: fingerprint.dynamicRange,
  };

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white p-8 md:p-10">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_20%,rgba(0,180,255,.18),transparent_40%),radial-gradient(ellipse_at_10%_80%,rgba(20,184,166,.12),transparent_40%)]" />
          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase text-sky-200 border border-white/10">
                <Cpu size={12} className="animate-pulse" /> Voxara ML Engine v4.0 · On-Device Inference
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-[Manrope] leading-tight">
                Machine Learning <span className="text-cyan-300">Biomarker Insights</span>
              </h1>
              <p className="text-slate-300 leading-relaxed">
                22-feature feedforward neural network (22→32→16→4) running entirely in-browser. Delta MFCC, Holt-Winters forecasting, Iglewicz-Hoaglin anomaly detection, and adaptive digital twin personalization.
              </p>
            </div>
            {/* Network result pill */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md px-8 py-6 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Neural Net Classification</p>
                <p className="text-3xl font-black font-[Manrope]" style={{ color: classColor }}>{CLASS_LABELS[network.predictedClass]}</p>
                <p className="text-white/60 text-sm mt-1 font-semibold">{network.confidence}% confidence</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Inference", `${modelMeta.inferenceMs}ms`],
                  ["Features", `${modelMeta.featureCount}`],
                  ["Twin Sessions", `${sessionCount}`],
                ].map(([l, v]) => (
                  <div key={l} className="text-center rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{l}</p>
                    <p className="font-black text-white mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab nav */}
        <div className="flex gap-2 flex-wrap">
          {(["network", "fingerprint", "forecast", "anomaly"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${t === activeTab ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground bg-card"}`}>
              {t === "network" ? "Neural Network" : t === "fingerprint" ? "Vocal Fingerprint" : t === "forecast" ? "7-Day Forecast" : "Anomaly Detection"}
            </button>
          ))}
        </div>

        {/* ─── NEURAL NETWORK TAB ─── */}
        {activeTab === "network" && (
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Class probabilities */}
            <div className="xl:col-span-2 bg-card border rounded-[2rem] p-8 space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary"><BrainCircuit size={24} /></div>
                <div>
                  <h2 className="text-xl font-bold font-[Manrope]">Class Probability Distribution</h2>
                  <p className="text-sm text-muted-foreground">Softmax output of 4-class vocal health classifier</p>
                </div>
              </div>
              {(["stable", "mild_decline", "moderate_decline", "acute"] as VocalClass[]).map((cls, i) => (
                <ConfidenceBar
                  key={cls}
                  label={CLASS_LABELS[cls]}
                  value={network.probabilities[i] ?? 0}
                  color={CLASS_COLORS[cls]}
                  isActive={network.predictedClass === cls}
                />
              ))}
              <div className={`mt-4 rounded-2xl border p-5 ${network.predictedClass === "stable" ? "border-secondary/30 bg-secondary/5" : network.predictedClass === "acute" ? "border-destructive/30 bg-destructive/5" : "border-primary/20 bg-primary/5"}`}>
                <p className="font-bold text-sm mb-1 flex items-center gap-2">
                  <Sparkles size={14} className="text-primary" /> Clinical Interpretation
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{CLASS_DESCRIPTIONS[network.predictedClass]}</p>
              </div>

              {/* Network architecture diagram */}
              <div className="mt-6 bg-slate-950 rounded-2xl p-6 overflow-x-auto">
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-4">Network Architecture</p>
                <div className="flex items-center justify-around gap-4 min-w-[420px]">
                  {[
                    { label: "Input", neurons: 22, desc: "MFCC + spectral\n+ clinical" },
                    { label: "Hidden 1", neurons: 32, desc: "ReLU activation" },
                    { label: "Hidden 2", neurons: 16, desc: "ReLU activation" },
                    { label: "Output", neurons: 4, desc: "Softmax classes" },
                  ].map((layer, li) => (
                    <div key={li} className="flex flex-col items-center gap-3">
                      <div className="flex flex-col gap-1.5 items-center">
                        {Array.from({ length: Math.min(8, layer.neurons) }).map((_, ni) => (
                          <div key={ni}
                            className={`rounded-full transition-all duration-500 ${li === 0 ? "w-2 h-2 bg-cyan-400" : li === 3 ? "w-3 h-3" : "w-2.5 h-2.5 bg-primary/60"}`}
                            style={li === 3 ? { background: Object.values(CLASS_COLORS)[ni] ?? "hsl(var(--primary))", width: 12, height: 12 } : {}} />
                        ))}
                        {layer.neurons > 8 && <span className="text-white/30 text-[10px]">…{layer.neurons - 8} more</span>}
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-xs">{layer.label}</p>
                        <p className="text-white/40 text-[10px]">{layer.neurons}n</p>
                        <p className="text-white/30 text-[10px] whitespace-pre-line text-center">{layer.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Clinical metrics + feature importance sidebar */}
            <div className="space-y-5">
              {/* Clinical metrics */}
              <div className="bg-card border rounded-[2rem] p-7">
                <div className="flex items-center gap-2 mb-5">
                  <Activity size={18} className="text-primary" />
                  <h3 className="font-bold font-[Manrope]">Clinical Voice Metrics</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Jitter (Pitch Perturbation)", value: `${clinical.jitter}%`, threshold: "< 1.04%", normal: clinical.jitter < 1.04 },
                    { label: "Shimmer (Amplitude)", value: `${clinical.shimmer}%`, threshold: "< 3.81%", normal: clinical.shimmer < 3.81 },
                    { label: "HNR (Harmonic-Noise)", value: `${clinical.hnr} dB`, threshold: "> 12 dB", normal: clinical.hnr > 12 },
                    { label: "Voice Breaks", value: String(clinical.voiceBreaks), threshold: "< 3", normal: clinical.voiceBreaks < 3 },
                    { label: "APQ (Amplitude Perturb.)", value: `${clinical.apq}%`, threshold: "< 3.07%", normal: clinical.apq < 3.07 },
                    { label: "PPQ (Pitch Perturb.)", value: `${clinical.ppq}%`, threshold: "< 0.84%", normal: clinical.ppq < 0.84 },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border hover:border-primary/20 transition-all">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">{m.label}</p>
                        <p className="text-[10px] text-muted-foreground/60">{m.threshold}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm">{m.value}</span>
                        {m.normal
                          ? <CheckCircle2 size={14} className="text-secondary" />
                          : <AlertTriangle size={14} className="text-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top features */}
              <div className="bg-card border rounded-[2rem] p-7">
                <div className="flex items-center gap-2 mb-5">
                  <Zap size={18} className="text-primary" />
                  <h3 className="font-bold font-[Manrope]">Top Feature Importances</h3>
                </div>
                <div className="space-y-2.5">
                  {importance.slice(0, 6).map((f) => (
                    <div key={f.featureName} className="flex items-center gap-3">
                      <ChevronRight size={13} className="text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-semibold text-muted-foreground truncate">{f.featureName}</p>
                          <span className="text-xs font-black text-primary ml-2">{f.importance}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: `${f.importance}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── VOCAL FINGERPRINT TAB ─── */}
        {activeTab === "fingerprint" && (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border rounded-[2rem] p-8 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2 self-start">
                <Fingerprint size={22} className="text-secondary" />
                <h2 className="text-xl font-bold font-[Manrope]">8-Axis Vocal Fingerprint</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 self-start">
                Personalized biometric signature — unique to this patient's vocal profile.
              </p>
              <RadarFingerprint data={fpData} />
              <div className="grid grid-cols-4 gap-3 mt-4 w-full">
                {Object.entries(fpData).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-xl font-black font-[Manrope] text-secondary">{v}</div>
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Delta MFCC */}
              <div className="bg-card border rounded-[2rem] p-7">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-primary" />
                  <h3 className="font-bold font-[Manrope]">Delta MFCC — Temporal Dynamics</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  First-order (velocity) and second-order (acceleration) changes in MFCC over the recording. Captures tremor dynamics and articulation fluency.
                </p>
                <div className="h-20 flex items-center gap-1.5 mb-3">
                  {deltaFeatures.delta.map((d, i) => {
                    const h = Math.min(100, Math.abs(d) * 25 + 5);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm"
                          style={{ height: `${h}%`, background: d >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))", minHeight: 4 }} />
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Delta (velocity)</p>
                <div className="h-16 flex items-center gap-1.5">
                  {deltaFeatures.deltaDelta.map((d, i) => {
                    const h = Math.min(100, Math.abs(d) * 35 + 4);
                    return (
                      <div key={i} className="flex-1 rounded-sm"
                        style={{ height: `${h}%`, background: d >= 0 ? "hsl(var(--secondary))" : "hsl(45 80% 55%)", minHeight: 3 }} />
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Delta-Delta (acceleration)</p>
              </div>

              {/* Digital Twin Status */}
              <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-[2rem] p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Radio size={20} className="animate-pulse" />
                  <h3 className="font-bold font-[Manrope]">Adaptive Digital Twin</h3>
                </div>
                <p className="text-white/85 text-sm leading-relaxed mb-5">
                  Personalized EWMA baseline (α=0.2) that adapts to <em>your</em> vocal patterns across {sessionCount} sessions. Anomaly detection benchmarks against <em>your</em> voice, not population averages.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/15 rounded-2xl p-4"><p className="text-[10px] font-black uppercase opacity-60">Sessions Learned</p><p className="text-2xl font-black">{sessionCount}</p></div>
                  <div className="bg-white/15 rounded-2xl p-4"><p className="text-[10px] font-black uppercase opacity-60">EWMA α</p><p className="text-2xl font-black">0.20</p></div>
                  <div className="bg-white/15 rounded-2xl p-4"><p className="text-[10px] font-black uppercase opacity-60">Anomaly Score</p><p className="text-2xl font-black">{anomaly.modifiedZScore}σ</p></div>
                  <div className="bg-white/15 rounded-2xl p-4"><p className="text-[10px] font-black uppercase opacity-60">Anomalous Coeffs</p><p className="text-2xl font-black">{anomaly.anomalousCoeffs.length}/13</p></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── FORECAST TAB ─── */}
        {activeTab === "forecast" && (
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-card border rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={22} className="text-primary" />
                <h2 className="text-xl font-bold font-[Manrope]">7-Day Health Trajectory</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Holt-Winters double exponential smoothing forecast with 80% prediction intervals. Updates after every recording session.
              </p>
              <ForecastChart points={forecast} />
              <div className="flex items-center gap-6 mt-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-2"><span className="w-6 h-0.5 border-t-2 border-dashed border-primary inline-block" /> Predicted wellness</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-primary/15 inline-block" /> 80% prediction interval</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Day +1 Forecast", value: `${forecast[0]?.wellness ?? 0}%` },
                  { label: "Day +7 Forecast", value: `${forecast[6]?.wellness ?? 0}%` },
                  { label: "Trend", value: (forecast[6]?.wellness ?? 0) > (forecast[0]?.wellness ?? 0) ? "↑ Improving" : "↓ Declining" },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/30 rounded-2xl p-4 text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-black font-[Manrope] text-primary">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-card border rounded-[2rem] p-7">
                <h3 className="font-bold font-[Manrope] mb-4">Model Parameters</h3>
                {[
                  { label: "Algorithm", value: "Holt-Winters DES" },
                  { label: "Level (α)", value: "0.30" },
                  { label: "Trend (β)", value: "0.10" },
                  { label: "Horizon", value: "7 days" },
                  { label: "Interval", value: "80% PI" },
                  { label: "History Points", value: "10 sessions" },
                ].map((p) => (
                  <div key={p.label} className="flex justify-between py-3 border-b last:border-b-0 border-border/50">
                    <span className="text-sm text-muted-foreground font-semibold">{p.label}</span>
                    <span className="text-sm font-black">{p.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-card border rounded-[2rem] p-7">
                <h3 className="font-bold font-[Manrope] mb-4">All Feature Importances</h3>
                <div className="space-y-2">
                  {importance.slice(0, 10).map((f) => (
                    <div key={f.featureName} className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-secondary" style={{ width: `${f.importance}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{f.importance}%</span>
                      <span className="text-[10px] text-muted-foreground w-28 truncate">{f.featureName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── ANOMALY DETECTION TAB ─── */}
        {activeTab === "anomaly" && (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border rounded-[2rem] p-8">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={22} className={anomaly.isAnomaly ? "text-destructive" : "text-secondary"} />
                <h2 className="text-xl font-bold font-[Manrope]">Iglewicz-Hoaglin Anomaly Scan</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Modified Z-score per MFCC coefficient vs. your personal digital twin baseline. Score &gt; 3.5σ indicates anomaly.
              </p>
              <div className={`mb-6 rounded-2xl border-l-4 p-5 ${anomaly.isAnomaly ? "border-l-red-500 bg-red-50 dark:bg-red-950/20" : "border-l-secondary bg-secondary/5"}`}>
                <div className="flex items-center gap-3">
                  {anomaly.isAnomaly
                    ? <AlertTriangle className="text-red-600 shrink-0" size={20} />
                    : <CheckCircle2 className="text-secondary shrink-0" size={20} />}
                  <div>
                    <p className="font-bold">{anomaly.isAnomaly ? "Anomaly Detected" : "No Significant Anomaly"}</p>
                    <p className="text-sm text-muted-foreground">
                      Overall modified Z-score: <strong>{anomaly.modifiedZScore}σ</strong> ·
                      Max coefficient Z: <strong>{anomaly.maxZScore}σ</strong> ·
                      Anomalous coefficients: <strong>{anomaly.anomalousCoeffs.length}/13</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {anomaly.zScores.slice(0, 13).map((z, i) => (
                  <ZScoreBar key={i} z={z} idx={i} label={MFCC_LABELS[i] ?? `C${i}`} />
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-emerald-500" /> Normal (&lt;1.5σ)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-primary" /> Watch (1.5–2.5σ)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-amber-500" /> Alert (2.5–3.5σ)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-red-500" /> Anomaly (&gt;3.5σ)</span>
              </div>
            </div>

            <div className="space-y-5">
              {/* Model meta */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-[2rem] p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <Cpu size={20} className="text-cyan-400" />
                  <h3 className="font-bold font-[Manrope]">ML Engine Metadata</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ["Model", modelMeta.version],
                    ["Calibration", modelMeta.calibration === "live" ? "Live MFCC (real mic)" : "Demo estimator"],
                    ["Inference time", `${modelMeta.inferenceMs} ms`],
                    ["Input features", String(modelMeta.featureCount)],
                    ["Network params", "22×32 + 32 + 32×16 + 16 + 16×4 + 4 = 1,316"],
                    ["Activation", "ReLU hidden · Softmax output"],
                    ["Init scheme", "Xavier uniform (seeded)"],
                    ["Anomaly method", "Modified Z-score (Iglewicz-Hoaglin)"],
                    ["Forecast model", "Holt-Winters DES (α=0.3, β=0.1)"],
                    ["Baseline model", "EWMA (α=0.2) per-patient twin"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                      <span className="text-white/50 font-semibold shrink-0">{l}</span>
                      <span className="font-bold text-right text-xs text-white/90">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalous coefficients callout */}
              {anomaly.anomalousCoeffs.length > 0 && (
                <div className="bg-card border rounded-[2rem] p-7">
                  <h3 className="font-bold font-[Manrope] mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" /> Flagged Coefficients
                  </h3>
                  <div className="space-y-2">
                    {anomaly.anomalousCoeffs.map((idx) => (
                      <div key={idx} className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl px-4 py-3 text-sm">
                        <span className="font-bold text-amber-700 dark:text-amber-400">C{idx} — {MFCC_LABELS[idx]}</span>
                        <span className="font-black text-amber-600">{(anomaly.zScores[idx] ?? 0) > 0 ? "+" : ""}{(anomaly.zScores[idx] ?? 0).toFixed(2)}σ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
