import { useState } from "react";
import { useLocation } from "wouter";
import {
  Activity, AlertCircle, HeartPulse, Loader2, Lock, Mail,
  Radio, ShieldCheck, Stethoscope, User, Phone, Calendar, Plus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";

type Role = "patient" | "clinician";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinicianName, setClinicianName] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addCondition = () => {
    const trimmed = conditionInput.trim();
    if (trimmed && !conditions.includes(trimmed)) {
      setConditions((prev) => [...prev, trimmed]);
      setConditionInput("");
    }
  };

  const removeCondition = (c: string) => setConditions((prev) => prev.filter((x) => x !== c));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password, role,
          specialty: role === "clinician" ? specialty || "General Practice" : undefined,
          dob: dob || undefined,
          phone: phone || undefined,
          clinicianName: clinicianName || undefined,
          conditions: role === "patient" ? conditions : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await login(email, password);
      setLoading(false);
      if (result.error) {
        setLocation("/login");
      } else {
        setLocation(result.role === "clinician" ? "/clinician" : "/");
      }
    } catch {
      setError("Network error — please try again");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left panel */}
      <div className="relative flex-1 bg-slate-950 flex flex-col justify-between p-10 min-h-[200px] lg:min-h-screen overflow-hidden">
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
            <Radio size={13} className="animate-pulse" /> Join the Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-[Manrope] leading-tight mb-6">
            Start your health <span className="text-cyan-300">journey.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Create your account to begin tracking voice biomarkers, monitoring chronic conditions, and connecting with your clinical care team.
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
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-lg xl:max-w-xl overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold font-[Manrope] text-foreground mb-2">Create an account</h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => setLocation("/login")} className="text-primary font-bold hover:underline">
                Sign in
              </button>
            </p>
          </div>

          {/* Role selector */}
          <div className="flex rounded-xl border bg-muted/40 p-1 mb-6 gap-1">
            {(["patient", "clinician"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  role === r
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "patient" ? <Activity size={16} /> : <Stethoscope size={16} />}
                {r === "patient" ? "Patient" : "Doctor / Clinician"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={role === "clinician" ? "Dr. Jane Smith" : "Alex Carter"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Email</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
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
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Confirm</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 rounded-xl text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Patient-specific fields */}
            {role === "patient" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Date of Birth</label>
                    <div className="relative">
                      <Calendar size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="pl-11 h-12 rounded-xl text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Phone</label>
                    <div className="relative">
                      <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-11 h-12 rounded-xl text-base"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Assigned Clinician (optional)</label>
                  <div className="relative">
                    <Stethoscope size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Dr. Priya Mehta"
                      value={clinicianName}
                      onChange={(e) => setClinicianName(e.target.value)}
                      className="pl-11 h-12 rounded-xl text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Conditions (optional)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="e.g. Asthma"
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCondition(); } }}
                      className="h-10 rounded-xl text-sm flex-1"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addCondition} className="h-10 px-3 rounded-xl">
                      <Plus size={16} />
                    </Button>
                  </div>
                  {conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                          {c}
                          <button type="button" onClick={() => removeCondition(c)} className="hover:text-destructive">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Clinician-specific fields */}
            {role === "clinician" && (
              <>
                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Medical Specialty <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Stethoscope size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Neurology, Cardiology, General Practice"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="pl-11 h-12 rounded-xl text-base"
                      required={role === "clinician"}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">Phone (optional)</label>
                  <div className="relative">
                    <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-11 h-12 rounded-xl text-base"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold mt-2" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              {loading ? "Creating account..." : `Create ${role === "clinician" ? "Clinician" : "Patient"} Account`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
