import { useState } from "react";
import { useLocation, Link } from "wouter";
import { AlertCircle, ArrowLeft, Loader2, Mail, ShieldCheck, Stethoscope, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [role, setRole] = useState<"patient" | "clinician">("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({ name, email, password, role, phone, abhaId });
      setLocation("/login");
    } catch (err: any) { setError(err.message || "Registration failed"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-semibold">
            <ArrowLeft size={16} />{t("common.back")}
          </Link>
          <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="h-8 rounded-lg border bg-background px-2 text-xs font-bold focus:outline-none max-w-[110px]">
            {LANGUAGES.filter((l) => ["en","hi","ta","te","bn","mr","gu","kn","ml","pa","or","as","ur","sa","ne"].includes(l.code)).map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Stethoscope size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-emerald-700 dark:text-emerald-400 text-xl font-[Manrope]">{t("app.name")}</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("app.tagline")}</p>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold font-[Manrope] text-foreground mb-2">{t("signup.title")}</h2>
        <p className="text-muted-foreground mb-8">{t("signup.description")}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-3">
            <button type="button" onClick={() => setRole("patient")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all ${
                role === "patient" ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
              }`}><User size={18} /> {t("login.patient")}</button>
            <button type="button" onClick={() => setRole("clinician")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border transition-all ${
                role === "clinician" ? "bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
              }`}><Stethoscope size={18} /> {t("login.clinician")}</button>
          </div>

          <div>
            <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("signup.fullName")}</label>
            <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" required />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("login.email")}</label>
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-11 h-12 rounded-xl" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("login.password")}</label>
            <Input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl" required minLength={6} />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("signup.phone")}</label>
            <Input placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 rounded-xl" />
          </div>
          {role === "patient" && (
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600" /> {t("signup.abhaId")}
              </label>
              <Input placeholder="XX-XXXX-XXXX-XXXX" value={abhaId} onChange={(e) => setAbhaId(e.target.value)} className="h-12 rounded-xl" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
              <AlertCircle size={17} /> {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            {loading ? "..." : t("signup.createAccountBtn")}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("signup.alreadyHaveAccount")}{" "}
          <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">{t("signup.signIn")}</Link>
        </p>
      </div>
    </div>
  );
}
