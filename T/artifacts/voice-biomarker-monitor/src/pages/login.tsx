import { useState } from "react";
import { useLocation, Link } from "wouter";
import { AlertCircle, Heart, Loader2, Lock, Mail, Stethoscope, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
    if (result.error) setError(result.error);
    else setLocation(result.role === "clinician" ? "/clinician" : "/");
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setLoading(true);
    const result = await login(demoEmail, demoPassword);
    setLoading(false);
    if (result.error) setError(result.error);
    else setLocation(result.role === "clinician" ? "/clinician" : "/");
  };

  const DEMO_ACCOUNTS = [
    { label: t("login.patient"), email: "ram@medikiosk.ai", password: "patient123", icon: User, desc: "Ram Kumar · General Medicine" },
    { label: t("login.patient"), email: "sunita@medikiosk.ai", password: "patient123", icon: Heart, desc: "Sunita Devi · Cardiology" },
    { label: t("login.clinician"), email: "doctor@medikiosk.ai", password: "doctor123", icon: Stethoscope, desc: "Dr. Priya Sharma" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left panel */}
      <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex flex-col justify-between p-10 min-h-[260px] lg:min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-emerald-500/15 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-teal-500/10 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-xl tracking-tight font-[Manrope]">{t("app.name")}</h1>
              <p className="text-emerald-300/70 text-[10px] uppercase tracking-widest font-bold">{t("app.tagline")}</p>
            </div>
          </div>
          {/* Language selector */}
          <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="h-9 rounded-lg border border-white/20 bg-white/10 px-2 text-xs font-bold text-white focus:outline-none max-w-[120px]">
            {LANGUAGES.filter((l) => ["en","hi","ta","te","bn","mr","gu","kn","ml","pa","or","as","ur","sa","ne"].includes(l.code)).map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black">{lang.nativeName}</option>
            ))}
          </select>
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white font-[Manrope] leading-tight mb-6">
            {t("landing.heroTitle")} <span className="text-emerald-400">{t("landing.heroHighlight")}</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">{t("landing.heroDescription")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Stethoscope, label: t("feature.clinicalGrade"), desc: t("feature.clinicalGradeDesc") },
              { icon: Heart, label: t("feature.abdmReady"), desc: t("feature.abdmReadyDesc") },
              { icon: Lock, label: t("feature.privacyCompliant"), desc: t("feature.privacyDesc") },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <Icon size={22} className="text-emerald-400 mb-3" />
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-xs font-semibold">{t("app.copyright")}</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-lg xl:max-w-xl">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold font-[Manrope] text-foreground mb-2">{t("login.title")}</h2>
            <p className="text-muted-foreground">
              {t("login.description")}{" "}
              <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">{t("login.createAccount")}</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("login.email")}</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="you@medikiosk.ai" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base" required autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground uppercase tracking-wider mb-2 block">{t("login.password")}</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 rounded-xl text-base" required autoComplete="current-password" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-semibold">
                <AlertCircle size={17} />{error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              {loading ? t("login.signingIn") : t("login.signIn")}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs text-muted-foreground font-bold uppercase tracking-widest">{t("login.demoAccounts")}</span>
            </div>
          </div>

          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <button key={account.email} onClick={() => handleDemoLogin(account.email, account.password)} disabled={loading}
                  className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted border rounded-2xl transition-all text-left group disabled:opacity-50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{account.desc}</p>
                    <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                    account.label === t("login.clinician")
                      ? "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400"
                      : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                  }`}>{account.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
