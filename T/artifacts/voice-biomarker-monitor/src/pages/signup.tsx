import { useState } from "react";
import { useLocation, Link } from "wouter";
import { AlertCircle, ArrowLeft, Loader2, Mail, ShieldCheck, Stethoscope, User, CircleCheck, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

const LANG_CODES = ["en", "hi", "hi-en", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur", "sa", "ne"] as LanguageCode[];

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [abhaId, setAbhaId] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState<"patient" | "clinician">("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({ name, email, password, role, phone, abhaId, city });
      setLocation("/login");
    } catch (err: any) { setError(err.message || "Registration failed"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen luna-sky relative flex items-center justify-center px-5 py-10 overflow-x-clip">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 right-[-6rem] w-[520px] h-[520px] rounded-full bg-[#54ACBF]/20 blur-[110px]" />
        <div className="absolute bottom-[-4rem] left-[-6rem] w-[440px] h-[440px] rounded-full bg-[#A7EBF2]/70 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="rounded-[28px] bg-white/95 border border-[#B9DCE3]/70 shadow-2xl shadow-[#023859]/10 px-7 md:px-10 py-9 backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between mb-7">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#5d7a8c] hover:text-[#023859] font-bold">
              <ArrowLeft size={16} />{t("common.back")}
            </Link>
            <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="h-8 rounded-full border border-[#B9DCE3] bg-white px-3 text-xs font-bold text-[#023859] focus:outline-none max-w-[110px] cursor-pointer">
              {LANGUAGES.filter((l) => LANG_CODES.includes(l.code)).map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl luna-brand-gradient flex items-center justify-center shadow-lg shadow-[#26658C]/25">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div className="leading-tight">
              <h1 className="font-extrabold text-xl text-[#011C40] font-[Manrope]">{t("app.name")}</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#54ACBF] font-extrabold">{t("app.tagline")}</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold font-[Manrope] text-[#011C40] mb-2">{t("signup.title")}</h2>
          <p className="text-[#5d7a8c] font-semibold mb-7">{t("signup.description")}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-3">
              <button type="button" onClick={() => setRole("patient")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-sm border transition-all ${
                  role === "patient"
                    ? "luna-btn-teal border-transparent text-white shadow-lg shadow-[#54ACBF]/25"
                    : "bg-[#F7FCFD] border-[#DCEFF2] text-[#5d7a8c] hover:border-[#54ACBF]"
                }`}><User size={18} /> {t("login.patient")}</button>
              <button type="button" onClick={() => setRole("clinician")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-sm border transition-all ${
                  role === "clinician"
                    ? "luna-btn border-transparent text-white shadow-lg shadow-[#023859]/30"
                    : "bg-[#F7FCFD] border-[#DCEFF2] text-[#5d7a8c] hover:border-[#54ACBF]"
                }`}><Stethoscope size={18} /> {t("login.clinician")}</button>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("signup.fullName")}</label>
              <Input placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF]" required />
            </div>
            <div>
              <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("login.email")}</label>
              <div className="relative">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF]" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("login.password")}</label>
              <Input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF]" required minLength={6} />
            </div>
            <div>
              <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">{t("signup.phone")}</label>
              <Input placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF]" />
            </div>
            {role === "patient" && (
              <div>
                <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#54ACBF]" /> {t("signup.abhaId")}
                </label>
                <Input placeholder="XX-XXXX-XXXX-XXXX" value={abhaId} onChange={(e) => setAbhaId(e.target.value)}
                  className="h-12 rounded-2xl border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] focus:border-[#54ACBF]" />
              </div>
            )}

            <div>
              <label className="text-xs font-extrabold text-[#26658C] uppercase tracking-wider mb-2 block">City / Region</label>
              <div className="relative">
                <MapPin size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#54ACBF]" />
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[#B9DCE3] bg-[#F7FCFD] text-[#011C40] text-sm font-semibold focus:outline-none focus:border-[#54ACBF] appearance-none">
                  <option value="">Select your city</option>
                  {"Mumbai,Delhi,Bangalore,Hyderabad,Chennai,Kolkata,Pune,Ahmedabad,Jaipur,Lucknow,Chandigarh,Kochi".split(",").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
                <AlertCircle size={17} /> {error}
              </div>
            )}

            <Button type="submit" className="w-full h-12 rounded-2xl text-base font-extrabold luna-btn-teal hover:brightness-105" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
              {loading ? "..." : t("signup.createAccountBtn")}
              {!loading && <ArrowRight size={17} />}
            </Button>
          </form>

          <p className="text-center text-sm text-[#5d7a8c] font-semibold mt-6">
            {t("signup.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-[#26658C] font-extrabold hover:underline">{t("signup.signIn")}</Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold text-[#5d7a8c] border-t border-[#DCEFF2] pt-5">
            <CircleCheck size={13} className="text-[#54ACBF]" /> DPDPA 2023 compliant
            <span className="text-[#B9DCE3]">·</span>
            <CircleCheck size={13} className="text-[#54ACBF]" /> ABDM / ABHA ready
          </div>
        </div>
      </div>
    </div>
  );
}
