import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Activity, AlertCircle, HeartPulse, Loader2, Lock, Mail, Radio, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

const DEMO_ACCOUNTS = [
  { label: "Patient", email: "alex@voxara.ai", password: "patient123", icon: Activity, desc: "Alex Carter · Asthma + Mild Depression" },
  { label: "Patient", email: "sofia@voxara.ai", password: "patient123", icon: HeartPulse, desc: "Sofia Reyes · Parkinson's (Early Stage)" },
  { label: "Clinician", email: "doctor@voxara.ai", password: "doctor123", icon: Stethoscope, desc: "Dr. Priya Mehta · Command Center" },
];

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setLocation(result.role === "clinician" ? "/clinician" : "/");
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setLoading(true);
    const result = await login(demoEmail, demoPassword);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setLocation(result.role === "clinician" ? "/clinician" : "/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left panel */}
      <div className="relative flex-1 bg-slate-950 flex flex-col justify-between p-10 min-h-[260px] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-primary/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-secondary/15 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <HeartPulse size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-xl tracking-tight font-[Manrope]">Voxara Health AI</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Voice Biomarker Platform</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold text-sky-300 uppercase tracking-widest mb-6">
            <Radio size={13} className="animate-pulse" /> Real-Time Monitoring
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-[Manrope] leading-tight mb-6">
            Voice is the window to your <span className="text-cyan-300">health.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Voxara analyzes vocal biomarkers — clarity, tremors, breathlessness, pitch — to help clinicians detect early changes in chronic conditions like Asthma, Parkinson's, and Depression.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: "HIPAA Safe", desc: "Encrypted data pipeline" },
              { icon: Activity, label: "Real-Time AI", desc: "15-second voice scans" },
              { icon: Stethoscope, label: "Clinical Grade", desc: "Validated biomarkers" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <Icon size={22} className="text-cyan-300 mb-3" />
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-xs font-semibold">
          © 2026 Voxara Health AI · For clinical monitoring use only
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-lg xl:max-w-xl">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold font-[Manrope] text-foreground mb-2">Sign in to Voxara</h2>
            <p className="text-muted-foreground">
              Access your patient dashboard or clinician command center.{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@voxara.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-4 text-xs text-muted-foreground font-bold uppercase tracking-widest">Demo Accounts</span></div>
          </div>

          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={loading}
                  className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted border rounded-2xl transition-all text-left group disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{account.desc}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-full ${account.label === "Clinician" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
                    {account.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-center text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-widest">Are you a doctor?</p>
            <Link href="/doctor-login">
              <button className="w-full flex items-center justify-center gap-3 p-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl transition-all border border-slate-800 group">
                <Stethoscope size={18} className="text-cyan-400" />
                <span className="font-bold text-sm">Go to Doctor Portal</span>
                <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-semibold">Clinician Access</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
