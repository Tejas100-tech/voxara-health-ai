import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Activity, AlertCircle, AlertTriangle, BrainCircuit, CheckCircle2,
  ChevronRight, Download, Music, Pill, Share2, Sparkles, TrendingDown, TrendingUp, Wind,
} from "lucide-react";
import { useLatestSession, useLiveVitals, type AIAnalysis } from "@/lib/realtime";
import { fetchAIAnalysis } from "@/lib/api";

function RadarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const cx = 120; const cy = 120; const r = 90;
  const n = data.length;
  const angles = data.map((_, i) => (i * 2 * Math.PI) / n - Math.PI / 2);

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const axisPoints = angles.map((a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));

  const dataPoints = data.map((d, i) => {
    const pct = Math.min(1, Math.max(0, d.value / 100));
    return { x: cx + r * pct * Math.cos(angles[i]), y: cy + r * pct * Math.sin(angles[i]) };
  });

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] radar-animate">
      <defs>
        <radialGradient id="radarFill">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      {gridLevels.map((lvl) =>
        <polygon key={lvl} fill="none" stroke="hsl(var(--border))" strokeWidth="1"
          points={angles.map((a) => `${cx + r * lvl * Math.cos(a)},${cy + r * lvl * Math.sin(a)}`).join(" ")} />
      )}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="hsl(var(--border))" strokeWidth="1" />
      ))}
      <path d={polygonPath} fill="url(#radarFill)" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={data[i].color} stroke="white" strokeWidth="2" />
      ))}
      {axisPoints.map((pt, i) => {
        const labelX = cx + (r + 20) * Math.cos(angles[i]);
        const labelY = cy + (r + 20) * Math.sin(angles[i]);
        return (
          <text key={i} x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="700" fill="hsl(var(--muted-foreground))" className="uppercase">
            {data[i].label}
          </text>
        );
      })}
    </svg>
  );
}

function BiomarkerCard({ icon: Icon, label, value, caption, bars, tone }: {
  icon: typeof Activity; label: string; value: string; caption: string; bars: number[];
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneClass = tone === "primary" ? "text-primary bg-primary/10"
    : tone === "secondary" ? "text-secondary bg-secondary/10"
    : "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400";
  const barColor = tone === "primary" ? "hsl(var(--primary))" : tone === "secondary" ? "hsl(var(--secondary))" : "hsl(179 60% 44%)";
  return (
    <div className="bg-card border p-7 rounded-3xl flex flex-col justify-between card-hover">
      <div>
        <div className="flex justify-between items-start mb-5">
          <div className={`p-4 rounded-2xl ${toneClass}`}><Icon size={28} /></div>
          <span className="flex items-center gap-1 text-secondary font-bold text-xs">
            <TrendingDown size={13} /> AI Tracked
          </span>
        </div>
        <h4 className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2">{label}</h4>
        <span className="text-4xl font-black text-foreground font-[Manrope]">{value}</span>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{caption}</p>
      </div>
      <div className="mt-6 h-14 flex items-end gap-1.5">
        {bars.map((h, i) => (
          <div key={i} className="w-full rounded-sm transition-all duration-300"
            style={{ height: `${Math.max(10, Math.min(100, h))}%`, background: i >= bars.length - 2 ? barColor : "hsl(var(--muted))" }} />
        ))}
      </div>
    </div>
  );
}

export default function Analysis() {
  const session = useLatestSession();
  const live = useLiveVitals();
  const [shared, setShared] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | undefined>(session.aiAnalysis);
  const [aiLoading, setAiLoading] = useState(!session.aiAnalysis);
  const ml = session.ml;

  useEffect(() => {
    if (session.aiAnalysis) { setAiAnalysis(session.aiAnalysis); setAiLoading(false); return; }
    let cancelled = false;
    setAiLoading(true);
    fetchAIAnalysis({ session })
      .then((a) => { if (!cancelled) { setAiAnalysis(a); setAiLoading(false); } })
      .catch(() => { if (!cancelled) setAiLoading(false); });
    return () => { cancelled = true; };
  }, [session.id]);

  const exportReport = () => {
    const report = JSON.stringify({ product: "Voxara Health AI", session, aiAnalysis, live }, null, 2);
    const blob = new Blob([report], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url;
    link.download = `${session.id.toLowerCase()}-voxara-report.json`; link.click();
    URL.revokeObjectURL(url);
  };

  const shareWithDoctor = async () => {
    const aiSummary = aiAnalysis ? ` AI: ${aiAnalysis.clinicalSummary.slice(0, 80)}...` : "";
    const text = `Voxara report ${session.id}: clarity ${session.clarity}%, breathlessness ${session.breathlessness}/10, risk ${session.risk}.${aiSummary}`;
    if (navigator.share) await navigator.share({ title: "Voxara Health AI Report", text }).catch(() => undefined);
    setShared(true);
  };

  const radarData = [
    { label: "Clarity", value: session.clarity, color: "hsl(var(--primary))" },
    { label: "Pitch", value: session.pitchConsistency, color: "hsl(var(--secondary))" },
    { label: "Stability", value: Math.max(0, 100 - session.tremor), color: "hsl(179 60% 44%)" },
    { label: "Speech", value: Math.min(100, (session.speechRate / 180) * 100), color: "hsl(199 80% 55%)" },
    { label: "Breath", value: Math.max(0, 100 - session.breathlessness * 10), color: "hsl(var(--secondary))" },
  ];

  const progressionColor = aiAnalysis?.diseaseProgression?.status === "improving" ? "text-emerald-600"
    : aiAnalysis?.diseaseProgression?.status === "declining" ? "text-destructive" : "text-primary";

  const progressionIcon = aiAnalysis?.diseaseProgression?.status === "improving"
    ? <TrendingDown className="text-emerald-600" size={20} />
    : aiAnalysis?.diseaseProgression?.status === "declining"
    ? <TrendingUp className="text-destructive" size={20} />
    : <Activity className="text-primary" size={20} />;

  const priorityColors = {
    routine: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    soon: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  };

  const severityColors = {
    low: "border-l-amber-400 bg-amber-50 dark:bg-amber-900/20",
    moderate: "border-l-orange-400 bg-orange-50 dark:bg-orange-900/20",
    high: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
  };

  return (
    <AppLayout userType="patient">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
              <Activity size={15} /> Live Session: #{session.id}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-[Manrope] leading-tight">
              Real-Time Voice <span className="text-secondary">Biomarker Analysis</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              MFCC feature extraction + GPT clinical AI — disease progression, medication effectiveness, anomaly detection.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl font-bold" onClick={exportReport}>
              <Download className="mr-2" size={15} /> Export JSON
            </Button>
            <Button className="rounded-xl font-bold" onClick={shareWithDoctor}>
              <Share2 className="mr-2" size={15} /> {shared ? "Shared ✓" : "Share with MD"}
            </Button>
          </div>
        </section>

        {/* Biomarker Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BiomarkerCard icon={Activity} label="Vocal Tremor Drift" value={`${session.tremor}%`}
            caption={aiAnalysis?.biomarkerInsights?.tremor ?? "Live deviation from personal baseline"}
            bars={[28, 42, 37, 44, session.tremor, live.tremorDrift, live.tremorDrift + 5]} tone="primary" />
          <BiomarkerCard icon={Wind} label="Breathlessness" value={`${session.breathlessness}/10`}
            caption={aiAnalysis?.biomarkerInsights?.breathlessness ?? "Respiratory strain inferred from pauses"}
            bars={[66, 62, 58, 49, live.respiratoryLoad, 36, 32]} tone="secondary" />
          <BiomarkerCard icon={Music} label="Pitch Consistency" value={`${session.pitchConsistency}%`}
            caption={aiAnalysis?.biomarkerInsights?.pitch ?? "Prosody and tonal stability"}
            bars={[78, 82, 76, 84, 88, live.vocalStability, session.pitchConsistency]} tone="tertiary" />
        </section>

        {/* Radar + Metrics */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-card border rounded-[2rem] p-8 flex flex-col items-center">
            <h4 className="font-[Manrope] font-bold text-xl mb-2 self-start">Biomarker Radar</h4>
            <p className="text-sm text-muted-foreground mb-6 self-start">5-axis vocal health fingerprint</p>
            <RadarChart data={radarData} />
            <div className="grid grid-cols-5 gap-2 mt-4 w-full">
              {radarData.map((d) => (
                <div key={d.label} className="text-center">
                  <div className="text-lg font-black font-[Manrope]" style={{ color: d.color }}>{d.value}%</div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{d.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-[2rem] p-8 space-y-5">
            <h4 className="font-[Manrope] font-bold text-xl">Sub-Metric Breakdown</h4>
            {[
              { label: "Jitter Local", val: `${(session.tremor / 24).toFixed(2)}%` },
              { label: "Noise Floor", val: `${session.noiseFloor} dB` },
              { label: "Speech Rate", val: `${session.speechRate} wpm` },
              { label: "Model Confidence", val: `${session.confidence}%` },
              { label: "ML Model", val: ml?.modelVersion ?? "Voxara ML Ensemble v3.0" },
              { label: "Calibration", val: ml?.calibration ?? "demo calibrated" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border hover:border-primary/20 transition-all">
                <span className="font-semibold text-muted-foreground text-sm">{m.label}</span>
                <span className="font-black text-foreground text-sm">{m.val}</span>
              </div>
            ))}
            <div className="bg-gradient-to-br from-secondary to-primary p-6 rounded-2xl text-white mt-2">
              <div className="flex items-center gap-2 mb-3"><BrainCircuit size={20} /><span className="font-bold">Digital Twin Baseline</span></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-black opacity-70">ML Risk</p>
                  <p className="text-xl font-black">{ml?.riskScore ?? live.riskScore}%</p>
                </div>
                <div className="bg-white/15 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-black opacity-70">Signal</p>
                  <p className="text-xl font-black">{live.signalQuality}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GPT Clinical AI */}
        <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-background border border-primary/15 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-72 w-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-[Manrope] font-bold text-2xl text-primary">GPT Clinical AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {ml?.modelVersion ?? "Voxara ML Ensemble v3.0"} · {session.mfcc ? "Real MFCC" : "Estimated"} · {session.confidence}% confidence
                </p>
              </div>
              {aiLoading && (
                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Analyzing...
                </div>
              )}
            </div>

            {aiAnalysis && aiAnalysis.diseaseProgression && aiAnalysis.medicationEffectiveness && aiAnalysis.anomaliesDetected && aiAnalysis.recommendations && aiAnalysis.biomarkerInsights ? (
              <div className="space-y-6">
                <div className="bg-background rounded-2xl p-6 border shadow-sm">
                  <p className="text-foreground/90 leading-relaxed text-lg">{aiAnalysis.clinicalSummary}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-background rounded-2xl p-6 border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">{progressionIcon}
                      <h5 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Disease Progression</h5>
                    </div>
                    <p className={`text-2xl font-black font-[Manrope] capitalize mb-1 ${progressionColor}`}>{aiAnalysis.diseaseProgression.status}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${aiAnalysis.diseaseProgression.confidence}%` }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{aiAnalysis.diseaseProgression.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiAnalysis.diseaseProgression.explanation}</p>
                  </div>
                  <div className="bg-background rounded-2xl p-6 border shadow-sm">
                    <div className="flex items-center gap-3 mb-3"><Pill size={20} className="text-secondary" />
                      <h5 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Medication Effectiveness</h5>
                    </div>
                    <p className="text-2xl font-black font-[Manrope] mb-1 text-secondary">{aiAnalysis.medicationEffectiveness.score}/100</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${aiAnalysis.medicationEffectiveness.score >= 70 ? "bg-emerald-500" : aiAnalysis.medicationEffectiveness.score >= 45 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${aiAnalysis.medicationEffectiveness.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground capitalize">{aiAnalysis.medicationEffectiveness.assessment.replace(/_/g, " ")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiAnalysis.medicationEffectiveness.notes}</p>
                  </div>
                </div>

                {aiAnalysis.anomaliesDetected.length > 0 && (
                  <div>
                    <h5 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle size={14} /> Anomalies Detected
                    </h5>
                    <div className="space-y-2">
                      {aiAnalysis.anomaliesDetected.map((a, i) => (
                        <div key={i} className={`border-l-4 px-4 py-3 rounded-r-xl text-sm ${severityColors[a.severity]}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold">{a.feature}</span>
                              <span className="text-muted-foreground ml-2">{a.value}</span>
                              <p className="text-muted-foreground mt-0.5">{a.concern}</p>
                            </div>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full border ${a.severity === "high" ? "bg-red-100 text-red-700 border-red-200" : a.severity === "moderate" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                              {a.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h5 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 size={14} /> AI Recommendations
                    </h5>
                    <div className="space-y-2">
                      {aiAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-background border rounded-xl text-sm">
                          <ChevronRight size={14} className="text-primary mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h5 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                        <AlertCircle size={14} /> Follow-Up Priority
                      </h5>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-bold capitalize text-sm ${priorityColors[aiAnalysis.followUpPriority]}`}>
                        <div className="w-2 h-2 rounded-full bg-current" /> {aiAnalysis.followUpPriority}
                      </div>
                    </div>
                    <div className="bg-background border rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Speech Rate Insight</p>
                      <p className="text-sm text-foreground/80">{aiAnalysis.biomarkerInsights.speechRate}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-foreground/90 leading-relaxed">
                <p>
                  Recording <span className="font-bold text-primary">{session.id}</span> shows {session.clarity}%
                  vocal clarity with a {session.risk.toLowerCase()} risk profile. ML ensemble score: {ml?.riskScore ?? live.riskScore}%,
                  breathlessness {session.breathlessness}/10, respiratory load {live.respiratoryLoad}%.
                </p>
                <div className="p-6 bg-background rounded-2xl border-l-4 border-primary shadow-sm">
                  <p className="italic text-muted-foreground">
                    Pitch consistency {session.pitchConsistency}%, anomaly index {ml?.anomalyIndex ?? Math.round(session.tremor / 2)}% — {ml?.recommendations[0] ?? "continue monitoring tremor drift"}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Transcript */}
        <section className="bg-card border p-8 rounded-[2rem]">
          <h4 className="font-[Manrope] font-bold text-xl mb-5">Transcript & Linguistic Analysis</h4>
          <div className="bg-muted/40 rounded-2xl p-5 text-foreground/80 leading-relaxed italic mb-4">
            "{session.transcript}"
          </div>
          {session.mfcc && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">MFCC Spectral Features (26-band Mel filterbank)</p>
              <div className="flex items-end gap-0.5 h-16 rounded-xl bg-muted/30 p-2">
                {session.mfcc.coefficients.map((c, i) => {
                  const normalized = Math.max(4, Math.min(100, Math.abs(c) * 8 + 15));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-sm bg-gradient-to-t from-primary to-secondary" style={{ height: `${normalized}%` }} />
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                {[
                  ["Spectral Centroid", `${session.mfcc.spectralCentroid} Hz`],
                  ["Zero Crossing Rate", `${session.mfcc.zeroCrossingRate}`],
                  ["Spectral Rolloff", `${session.mfcc.spectralRolloff}%`],
                ].map(([label, val]) => (
                  <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className="font-bold text-muted-foreground text-xs uppercase mb-1">{label}</p>
                    <p className="font-black text-lg">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
