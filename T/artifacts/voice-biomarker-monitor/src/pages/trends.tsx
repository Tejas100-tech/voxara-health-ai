import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout";
import { ArrowRight, TrendingDown, TrendingUp, Zap } from "lucide-react";

type Range = "1M" | "3M" | "6M" | "1Y";

function generateTrendData(range: Range, baseClarity = 78, baseTremor = 35) {
  const points: { date: string; wellness: number; clarity: number; tremor: number; pitch: number; breathlessness: number }[] = [];
  const counts: Record<Range, number> = { "1M": 12, "3M": 18, "6M": 24, "1Y": 26 };
  const n = counts[range];
  const daySpan: Record<Range, number> = { "1M": 30, "3M": 90, "6M": 180, "1Y": 365 };
  const totalDays = daySpan[range];

  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const date = new Date(Date.now() - (1 - t) * totalDays * 86400000);
    const noise = () => (Math.random() - 0.5) * 8;
    const trend = t * 12;
    const clarity = Math.round(Math.min(99, Math.max(40, baseClarity + trend + Math.sin(t * 6) * 5 + noise())));
    const tremor = Math.round(Math.max(5, Math.min(85, baseTremor - trend * 0.5 + Math.cos(t * 4) * 4 + noise())));
    const pitch = Math.round(Math.min(99, 75 + t * 10 + Math.sin(t * 5) * 4 + noise()));
    const breathlessness = Math.round(Math.max(10, 60 - t * 15 + Math.sin(t * 3) * 6 + noise()));
    const wellness = Math.round((clarity + (100 - tremor) + pitch + (100 - breathlessness)) / 4);
    const month = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    points.push({ date: month, wellness, clarity, tremor, pitch, breathlessness });
  }
  return points;
}

type Metric = "wellness" | "clarity" | "tremor" | "pitch";

const METRIC_CONFIG: Record<Metric, { label: string; color: string; description: string }> = {
  wellness: { label: "Wellness Score", color: "hsl(var(--primary))", description: "Composite health from all biomarkers" },
  clarity: { label: "Vocal Clarity", color: "hsl(var(--secondary))", description: "Signal clarity and articulation" },
  tremor: { label: "Tremor Index", color: "hsl(0 78% 52%)", description: "Micro-instability vs. baseline" },
  pitch: { label: "Pitch Consistency", color: "hsl(199 80% 55%)", description: "Prosody and tonal stability" },
};

function LineChart({ data, metric }: { data: ReturnType<typeof generateTrendData>; metric: Metric }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const config = METRIC_CONFIG[metric];
  const values = data.map((d) => d[metric]);
  const min = Math.max(0, Math.min(...values) - 5);
  const max = Math.min(100, Math.max(...values) + 5);
  const range = max - min || 1;
  const W = 1000; const H = 200; const PAD = 20;
  const pw = W - PAD * 2; const ph = H - PAD * 2;

  const pts = data.map((_, i) => ({
    x: PAD + (i / (data.length - 1)) * pw,
    y: PAD + ph - ((values[i] - min) / range) * ph,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

  return (
    <div className="relative" onMouseLeave={() => setHoverIdx(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 220 }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={config.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((lvl) => {
          const y = PAD + ph * (1 - lvl);
          return (
            <g key={lvl}>
              <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="4,6" />
              <text x={2} y={y + 4} fontSize="22" fill="hsl(var(--muted-foreground))" fontWeight="600">
                {Math.round(min + lvl * range)}
              </text>
            </g>
          );
        })}
        <path d={areaPath} fill="url(#chartFill)" />
        <path d={linePath} fill="none" stroke={config.color} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hoverIdx === i ? 7 : 4}
            fill={hoverIdx === i ? config.color : "white"} stroke={config.color} strokeWidth="2.5"
            style={{ cursor: "pointer", transition: "r 0.15s" }}
            onMouseEnter={() => setHoverIdx(i)} />
        ))}
        {hoverIdx !== null && (
          <g>
            <rect x={pts[hoverIdx].x - 55} y={pts[hoverIdx].y - 50} width="110" height="44" rx="8"
              fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
            <text x={pts[hoverIdx].x} y={pts[hoverIdx].y - 31} textAnchor="middle"
              fontSize="18" fill="hsl(var(--muted-foreground))" fontWeight="600">{data[hoverIdx].date}</text>
            <text x={pts[hoverIdx].x} y={pts[hoverIdx].y - 13} textAnchor="middle"
              fontSize="22" fill={config.color} fontWeight="900">{values[hoverIdx]}%</text>
          </g>
        )}
      </svg>
    </div>
  );
}

const MEDICATIONS = [
  { date: "Week 2", name: "Levodopa", change: "250mg → 350mg", direction: "up" as const, impact: "+12% tremor stability 48h post-adjustment" },
  { date: "Week 6", name: "Pramipexole", change: "0.75mg maintained", direction: "stable" as const, impact: "Monitoring for sleep interaction" },
  { date: "Week 10", name: "Amantadine", change: "100mg → 50mg", direction: "down" as const, impact: "Reduced dyskinesia; tracking motor fluency" },
];

export default function Trends() {
  const [range, setRange] = useState<Range>("3M");
  const [metric, setMetric] = useState<Metric>("wellness");
  const data = useMemo(() => generateTrendData(range), [range]);
  const config = METRIC_CONFIG[metric];

  const latest = data[data.length - 1];
  const earliest = data[0];
  const delta = latest[metric] - earliest[metric];
  const improving = metric === "tremor" ? delta < 0 : delta > 0;

  return (
    <AppLayout userType="patient">
      <div className="max-w-6xl mx-auto space-y-8">

        <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
              <Zap size={13} /> Longitudinal Biomarker Analysis
            </div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight font-[Manrope]">Health Trends</h1>
            <p className="text-muted-foreground mt-1 max-w-lg">
              Long-term analysis of vocal biomarkers and neuromotor stability metrics.
            </p>
          </div>
          <div className="flex bg-muted p-1 rounded-xl border border-border">
            {(["1M", "3M", "6M", "1Y"] as Range[]).map((t) => (
              <button key={t} onClick={() => setRange(t)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${t === range ? "bg-background shadow text-primary border border-border" : "text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Main Chart */}
        <section className="bg-card border rounded-[2rem] p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ background: config.color }} />
                <h2 className="text-xl font-bold text-foreground font-[Manrope]">{config.label}</h2>
                <span className="text-xs text-muted-foreground font-semibold">{config.description}</span>
              </div>
              <div className="text-5xl font-black text-primary flex items-baseline gap-3 font-[Manrope]">
                {latest[metric]}
                <span className={`text-xl font-bold flex items-center ${improving ? "text-emerald-600" : "text-destructive"}`}>
                  {improving ? <TrendingUp size={20} className="mr-1" /> : <TrendingDown size={20} className="mr-1" />}
                  {improving ? "+" : ""}{delta}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                vs. {earliest[metric]}% at start of {range} period
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => (
                <button key={m} onClick={() => setMetric(m)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${m === metric ? "text-white border-transparent shadow-md" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}
                  style={m === metric ? { background: METRIC_CONFIG[m].color } : {}}>
                  {METRIC_CONFIG[m].label}
                </button>
              ))}
            </div>
          </div>

          <LineChart data={data} metric={metric} />

          <div className="flex justify-between mt-3 text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
            {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Avg Wellness", value: `${Math.round(data.reduce((s, d) => s + d.wellness, 0) / data.length)}%`, up: true },
            { label: "Peak Clarity", value: `${Math.max(...data.map((d) => d.clarity))}%`, up: true },
            { label: "Min Tremor", value: `${Math.min(...data.map((d) => d.tremor))}%`, up: false },
            { label: "Sessions", value: `${data.length}`, up: true },
          ].map((s) => (
            <div key={s.label} className="bg-card border rounded-2xl p-5 card-hover text-center">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">{s.label}</p>
              <p className="text-3xl font-black font-[Manrope] text-foreground">{s.value}</p>
              <span className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${s.up ? "text-emerald-600" : "text-destructive"}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {range} period
              </span>
            </div>
          ))}
        </section>

        {/* Medication Impact */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground font-[Manrope]">Medication Impact</h3>
            <div className="flex gap-4 text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /> Increase</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-muted-foreground" /> Stable</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-destructive" /> Decrease</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MEDICATIONS.map((m) => (
              <div key={m.name}
                className={`bg-card border-l-4 rounded-2xl p-6 shadow-sm card-hover ${m.direction === "up" ? "border-l-secondary" : m.direction === "down" ? "border-l-destructive" : "border-l-muted-foreground"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${m.direction === "up" ? "text-secondary" : m.direction === "down" ? "text-destructive" : "text-muted-foreground"}`}>{m.date}</span>
                    <h4 className="font-bold text-lg text-foreground">{m.name}</h4>
                  </div>
                  {m.direction === "up" ? <TrendingUp className="text-secondary" size={20} />
                    : m.direction === "down" ? <TrendingDown className="text-destructive" size={20} />
                    : <div className="w-6 h-1 bg-muted-foreground rounded-full mt-2" />}
                </div>
                <div className="flex items-center gap-3 mb-3 bg-muted/50 p-3 rounded-xl text-sm">
                  <span className="font-medium text-muted-foreground">{m.change.split("→")[0]}</span>
                  <ArrowRight className="text-muted-foreground" size={14} />
                  <span className="font-bold text-primary">{m.change.split("→")[1] ?? m.change}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.impact}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
