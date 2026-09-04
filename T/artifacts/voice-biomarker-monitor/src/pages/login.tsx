import { useState } from "react";
import { useLocation, Link } from "wouter";
import { AlertCircle, Heart, Loader2, Lock, Mail, Stethoscope, User, CircleCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

const LANG_CODES = ["en", "hi", "hi-en", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur", "sa", "ne"] as LanguageCode[];

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
    <div className="min-h-screen luna-sky relative flex items-center justify-center px-5 py-10 overflow-x-clip">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 right-[-6rem] w-[520px] h-[520px] rounded-full bg-[#54ACBF]/20 blur-[110px]" />
        <div className="absolute bottom-[-4rem] left-[-6rem] w-[440px] h-[440px] rounded-full bg-[#A7EBF2]/70 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* ── Left brand panel ── */}
        <div className="hidden lg:flex flex-col justify-between min-h-[560px]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl luna-brand-gradient flex items-center justify-center shadow-lg shadow-[#26658C]/25">
              <Stethoscope size={26} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-xl font-[Manrope] text-[#011C40]">{t("app.name")}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[#54ACBF]">{t("app.tagline")}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold font-[Manrope] text-[#011C40] leading-[1.1]">
              {t("landing.heroTitle")}{" "}
              <span className="luna-text-gradient">{t("landing.heroHighlight")}</span>
            </h2>
            <p className="text-[#3f5f74] leading-relaxed max-w-md">{t("landing.heroDescription")}</p>
            <div className="space-y-3">
              {[
                { icon: Stethoscope, label: t("feature.clinicalGrade"), desc: t("feature.clinicalGradeDesc") },
                { icon: Heart, label: t("feature.abdmReady"), desc: t("feature.abdmReadyDesc") },
                { icon: Lock, label: t("feature.privacyCompliant"), desc: t("feature.privacyDesc") },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl bg-white/85 border border-[#B9DCE3]/60 px-5 py-4 shadow-sm backdrop-blur">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-[#A7EBF2]/55 text-[#023859] flex items-center justify-center">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold font-[Manrope] text-[#011C40]">{label}</span>
                    <span className="block text-xs text-[#5d7a8c] font-semibold">{desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-bold text-[#5d7a8c]">{t("app.copyright")}</p>
        </div>

        {/* ── Right form card ── */}
        <div className="w-full max-w-lg mx-auto">
          <div className="rounded-[28px] bg-white/95 border border-[#B9DCE3]/70 shadow-2xl shadow-[#023859]/10 px-7 md:px-10 py-9 backdrop-blur">
            {/* Mobile brand */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl luna-brand-gradient flex items-center justify-center">
                  <Stethoscope size={20} className="text-white" />
                </div>
                <p className="font-extrabold text-lg font-[Manrope] text-[#011C40]">{t("app.name")}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[1.7rem] font-extrabold font-[Manrope] text-[#011C40] mb-2">{t("login.title")}</h2>
              <p className="text-[#5d7a8c] font-semibold">
                {t("login.description")}{" "}
                <Link href="/signup" className="text-[#26658C] font-extrabold hover:underline">{t("login.createAccount")}</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              <div>
                <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("login.email")}</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                  <Input type="email" placeholder="you@medikiosk.ai" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF] text-base" required autoComplete="email" />
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("login.password")}</label>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF] text-base" required autoComplete="current-password" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
                  <AlertCircle size={17} />{error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 rounded-2xl text-base font-extrabold luna-btn-teal hover:brightness-105" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
                {loading ? t("login.signingIn") : t("login.signIn")}
              </Button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DCEFF2]" /></div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[11px] text-[#5d7a8c] font-extrabold uppercase tracking-widest">{t("login.demoAccounts")}</span>
              </div>
            </div>

            <div className="space-y-3">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                return (
                  <button key={account.email} onClick={() => handleDemoLogin(account.email, account.password)} disabled={loading}
                    className="w-full flex items-center gap-4 p-4 bg-[#F7FCFD] hover:bg-[#A7EBF2]/25 border border-[#DCEFF2] rounded-2xl transition-all text-left group disabled:opacity-50">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#A7EBF2] text-[#26658C] flex items-center justify-center shrink-0 group-hover:bg-[#26658C] group-hover:border-transparent group-hover:text-white transition-all">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm text-[#011C40] truncate">{account.desc}</p>
                      <p className="text-xs text-[#5d7a8c] font-semibold truncate">{account.email}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${
                      account.label === t("login.clinician")
                        ? "bg-[#26658C]/10 text-[#26658C]"
                        : "bg-[#54ACBF]/15 text-[#023859]"
                    }`}>{account.label}</span>
                    <ArrowRight size={15} className="text-[#54ACBF] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#DCEFF2] pt-5">
              <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-[#5d7a8c]">
                <CircleCheck size={13} className="text-[#54ACBF]" /> DPDPA 2023 · ABDM
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="h-9 rounded-full border border-[#B9DCE3] bg-white px-3 text-xs font-bold text-[#023859] focus:outline-none focus:ring-2 focus:ring-[#54ACBF] max-w-[120px] cursor-pointer">
                {LANGUAGES.filter((l) => LANG_CODES.includes(l.code)).map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
