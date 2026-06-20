import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  AlertCircle, BrainCircuit, ChevronRight, Loader2, Lock,
  Mail, Radio, Stethoscope, UserPlus, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

const DEMO_DOCTOR = {
  email: "doctor@voxara.ai",
  password: "doctor123",
  name: "Dr. Priya Mehta",
  specialty: "General Practice",
};

export default function DoctorLoginPage() {
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
    } else if (result.role !== "clinician") {
      setError("This portal is for doctors only. Please use the patient login instead.");
    } else {
      setLocation("/clinician");
    }
  };

  const handleDemoLogin = async () => {
    setEmail(DEMO_DOCTOR.email);
    setPassword(DEMO_DOCTOR.password);
    setError("");
    setLoading(true);
    const result = await login(DEMO_DOCTOR.email, DEMO_DOCTOR.password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setLocation("/clinician");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left panel — dark clinical theme */}
      <div className="relative flex-1 bg-slate-900 flex flex-col justify-between p-10 min-h-[260px] lg:min-h-screen overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Stethoscope size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-extrabold text-xl tracking-tight font-[Manrope]">Voxara Doctor Portal</h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Clinical Command Center</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-widest mb-6">
            <Radio size={13} className="animate-pulse" /> Live Patient Monitoring
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-[Manrope] leading-tight mb-6">
            Your patients,<br /><span className="text-cyan-400">always in view.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Access real-time voice biomarker data, review patient sessions, manage appointments, and join live video consultations — all from one clinical dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: BrainCircuit, label: "AI Biomarkers", desc: "Voice analysis in real-time" },
              { icon: Users, label: "Patient Panel", desc: "All your assigned patients" },
              { icon: Radio, label: "Live Video", desc: "Instant consultation calls" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <Icon size={22} className="text-cyan-400 mb-3" />
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs font-semibold">
          © 2026 Voxara Health AI · Licensed clinicians only
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-lg xl:max-w-xl bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
              <Stethoscope size={12} /> Doctor Portal
            </div>
            <h2 className="text-3xl font-extrabold font-[Manrope] text-white mb-2">Sign in to your dashboard</h2>
            <p className="text-slate-400">
              New to Voxara?{" "}
              <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
                Register as a doctor
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Work Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-base transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
              {loading ? "Signing in…" : "Access Doctor Dashboard"}
            </button>
          </form>

          {/* Demo doctor */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center">
              <span className="bg-slate-950 px-4 text-xs text-slate-500 font-bold uppercase tracking-widest">Demo Account</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-left group disabled:opacity-50 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <Stethoscope size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{DEMO_DOCTOR.name} · {DEMO_DOCTOR.specialty}</p>
              <p className="text-xs text-slate-500 truncate">{DEMO_DOCTOR.email} · password: doctor123</p>
            </div>
            <span className="shrink-0 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400">
              Demo
            </span>
          </button>

          {/* Register CTA */}
          <Link href="/signup">
            <button className="w-full flex items-center justify-center gap-3 p-4 border border-white/10 hover:border-white/20 rounded-2xl transition-all text-slate-400 hover:text-white group">
              <UserPlus size={17} className="text-cyan-500 group-hover:text-cyan-400" />
              <span className="font-semibold text-sm">Register as a new doctor</span>
            </button>
          </Link>

          <p className="mt-6 text-center text-xs text-slate-600">
            Are you a patient?{" "}
            <Link href="/login" className="text-slate-400 hover:text-white font-semibold">
              Patient login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
