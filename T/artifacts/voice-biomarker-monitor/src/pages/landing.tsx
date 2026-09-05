import { Link } from "wouter";
import {
  HeartPulse, ShieldCheck, Play, Mic, ScanLine, BrainCircuit, ArrowRight,
  Sparkles, Menu, Languages, FileText, Users, Globe, Heart,
  Stethoscope, CircleCheck, Clock, Lock, Hospital,
  AudioLines, ChevronRight, Quote,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

/* ── Small shared pieces ─────────────────────────────────────── */

function AvatarStack({ size = "md" }: { size?: "md" | "sm" }) {
  const px = size === "md" ? "w-9 h-9" : "w-7 h-7";
  const tx = size === "md" ? "text-[10px]" : "text-[9px]";
  const people = [
    { initials: "RS", cls: "luna-btn-teal" },
    { initials: "AK", cls: "from-[#54ACBF] to-[#26658C]" },
    { initials: "PM", cls: "from-[#26658C] to-[#023859]" },
    { initials: "SD", cls: "from-[#A7EBF2] to-[#54ACBF] text-[#023859]" },
  ];
  return (
    <div className="flex -space-x-2.5">
      {people.map((p, i) => (
        <div
          key={i}
          className={`${px} ${tx} rounded-full bg-gradient-to-br ${p.cls} flex items-center justify-center text-white font-extrabold ring-2 ring-white`}
        >
          {p.initials}
        </div>
      ))}
    </div>
  );
}

const LANG_CODES = ["en", "hi", "hi-en", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur", "sa", "ne"] as LanguageCode[];

function LanguageSelect({ light = false }: { light?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as LanguageCode)}
      className={`h-9 rounded-full px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#54ACBF] max-w-[120px] cursor-pointer border ${
        light
          ? "border-white/25 bg-white/10 text-white [&>option]:text-black"
          : "border-[#B9DCE3] bg-white/80 text-[#023859] [&>option]:text-black"
      }`}
    >
      {LANGUAGES.filter((l) => LANG_CODES.includes(l.code)).map((lang) => (
        <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
      ))}
    </select>
  );
}

const PILL = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all";

/* ── Landing page ────────────────────────────────────────────── */

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen luna-sky font-sans">
      {/* ── Sticky nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#B9DCE3]/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-[72px] flex items-center justify-between gap-4">
          <a href="#home" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl luna-brand-gradient flex items-center justify-center shadow-lg shadow-[#26658C]/25">
              <HeartPulse size={24} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-extrabold text-lg font-[Manrope] text-[#011C40] tracking-tight">{t("app.name")}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[#54ACBF]">{t("app.tagline")}</p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-[#23506e]">
            <a href="#home" className="hover:text-[#023859] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#023859] transition-colors">About</a>
            <a href="#modules" className="hover:text-[#023859] transition-colors">Modules</a>
            <a href="#how" className="hover:text-[#023859] transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <LanguageSelect />
            <Link href="/login" className={`${PILL} hidden sm:inline-flex px-5 py-2.5 text-sm text-[#023859] hover:bg-[#A7EBF2]/40`}>
              Sign In
            </Link>
            <Link href="/signup" className={`${PILL} luna-btn px-5 py-2.5 text-sm shadow-lg`}>
              Get Started
            </Link>
            <button className="lg:hidden w-10 h-10 rounded-xl border border-[#B9DCE3] bg-white flex items-center justify-center text-[#023859]" aria-label="Menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section id="home" className="relative overflow-x-clip">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 right-[-6rem] w-[560px] h-[560px] rounded-full bg-[#54ACBF]/15 blur-[110px]" />
          <div className="absolute top-40 left-[-8rem] w-[420px] h-[420px] rounded-full bg-[#A7EBF2]/60 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] rounded-full bg-[#26658C]/10 blur-[90px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 md:px-6 pt-12 md:pt-16 pb-52 md:pb-56">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left copy */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white/80 border border-[#A7EBF2] px-4 py-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#54ACBF] animate-ping-soft" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#26658C]">
                  New update · GPT-5.6 Luna AI Clinical Summary
                </span>
              </div>

              <h1 className="text-[2.7rem] leading-[1.08] md:text-6xl xl:text-[4.2rem] font-extrabold font-[Manrope] text-[#011C40] tracking-tight">
                {t("landing.heroTitle")}{" "}
                <span className="luna-text-gradient block pb-1">{t("landing.heroHighlight")}</span>
              </h1>

              <p className="text-[#3f5f74] text-lg leading-relaxed max-w-xl">
                {t("landing.heroDescription")}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-bold text-[#26658C]">
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={15} /> No typing</span>
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={15} /> No paperwork</span>
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={15} /> 15+ Indian languages</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#how" className={`${PILL} luna-btn px-8 py-4 text-base`}>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <Play size={15} className="fill-white" />
                  </span>
                  See how we work
                </a>
                <Link href="/signup" className={`${PILL} luna-btn-teal px-8 py-4 text-base`}>
                  Start Patient Intake
                  <ArrowRight size={18} />
                </Link>
              </div>

            </div>

            {/* Right visual */}
            <div className="relative select-none">
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#A7EBF2]/70 via-white/40 to-[#54ACBF]/25 blur-2xl" aria-hidden />

              <div className="relative rounded-[28px] border border-white bg-white/90 backdrop-blur-xl shadow-2xl shadow-[#023859]/15 overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#DCEFF2]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A7EBF2]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#54ACBF]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#26658C]" />
                  </div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#26658C]">
                    OPD Kiosk 07 · General Medicine
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#023859]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#54ACBF] animate-ping-soft" /> LIVE
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* AI question */}
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#A7EBF2]/45 border border-[#A7EBF2] px-4 py-3 text-[13px] font-semibold text-[#02465f]">
                    नमस्ते 🙏 तीन दिन से सीने में दर्द और बुखार है — कब शुरू हुआ और कैसा लगता है?
                  </div>

                  {/* User answer */}
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md luna-brand-gradient px-4 py-3 text-[13px] font-semibold text-white shadow-md">
                    तीन दिन से सीने के बीचों-बीच दर्द है… left arm तक फैलता है।
                    <span className="mt-1.5 flex items-center gap-1 text-[10px] text-white/70 font-bold uppercase tracking-wide">
                      <AudioLines size={11} /> Voice · हिन्दी
                    </span>
                  </div>

                  {/* Draft summary */}
                  <div className="rounded-2xl border border-[#DCEFF2] bg-[#F4FBFD] p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#26658C]">Clinical summary · draft</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#54ACBF]/15 text-[#023859] text-[10px] font-extrabold px-2.5 py-1">
                        <CircleCheck size={11} /> Ready for doctor
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <p className="text-[#5d7a8c] font-semibold">Chief complaint<span className="block text-[#011C40] font-bold">Chest pain · 3 days</span></p>
                      <p className="text-[#5d7a8c] font-semibold">SOCRATES<span className="block text-[#011C40] font-bold">Pressing, radiating</span></p>
                      <p className="text-[#5d7a8c] font-semibold">Red flags<span className="block text-[#011C40] font-bold flex items-center gap-1"><CircleCheck size={11} className="text-[#54ACBF]" /> Escalated to doctor</span></p>
                      <p className="text-[#5d7a8c] font-semibold">Records scanned<span className="block text-[#011C40] font-bold">2 Rx · 1 lab report</span></p>
                    </div>
                  </div>

                  {/* Voice footer */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#DCEFF2] px-4 py-2.5 bg-white">
                    <div className="flex items-center gap-[3px] h-8">
                      {[0.4, 0.7, 0.5, 1, 0.6, 0.9, 0.45, 0.75, 0.55, 1, 0.5, 0.8, 0.4, 0.65, 0.9, 0.5].map((h, i) => (
                        <span
                          key={i}
                          className="eq-bar w-[3px] rounded-full bg-gradient-to-t from-[#26658C] to-[#54ACBF]"
                          style={{ height: `${h * 100}%`, animationDelay: `${(i % 6) * 0.12}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] font-extrabold text-[#26658C]">Analyzing… 96%</p>
                    <span className="w-9 h-9 rounded-full luna-btn-teal flex items-center justify-center shadow-md">
                      <Mic size={15} className="text-white" />
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Overlapping quick-start bar ──────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-30 translate-y-1/2 px-5 md:px-6">
          <div className="max-w-7xl mx-auto rounded-[26px] bg-white border border-[#B9DCE3]/70 shadow-2xl shadow-[#023859]/15 overflow-hidden">
            <div className="grid lg:grid-cols-[1fr_1fr_1fr_auto]">
              {[
                { icon: Mic, label: "Module A · Converse", value: "AI Voice + Touch Intake", desc: "Adaptive questions in 15+ languages" },
                { icon: ScanLine, label: "Module B · Scan", value: "Prescription & Lab OCR", desc: "Rx, lab reports, discharge summaries" },
                { icon: BrainCircuit, label: "Module C · Summarize", value: "Doctor-ready Summary", desc: "SOCRATES structure, red-flag alerts" },
              ].map(({ icon: Icon, label, value, desc }, idx) => (
                <Link
                  key={label}
                  href="/login"
                  className={`group flex items-center gap-4 px-6 py-5 hover:bg-[#F2FAFC] transition-colors ${
                    idx > 0 ? "lg:border-l border-[#DCEFF2]" : ""
                  } ${idx > 0 ? "max-lg:border-t border-[#DCEFF2]" : ""}`}
                >
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-[#A7EBF2]/45 border border-[#A7EBF2] text-[#023859] flex items-center justify-center group-hover:bg-[#26658C] group-hover:text-white group-hover:border-transparent transition-all">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#54ACBF]">{label}</span>
                    <span className="block text-[15px] font-extrabold font-[Manrope] text-[#011C40] truncate">{value}</span>
                    <span className="block text-xs text-[#5d7a8c] truncate">{desc}</span>
                  </span>
                  <ChevronRight size={18} className="text-[#54ACBF] shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
              <div className="flex items-center p-5 max-lg:border-t lg:border-l border-[#DCEFF2] bg-gradient-to-br from-[#F4FBFD] to-white">
                <Link href="/signup" className={`${PILL} luna-btn px-7 py-4 text-sm w-full`}>
                  Start Patient Intake
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About / why it matters ─────────────────────────────── */}
      <section id="about" className="pt-40 md:pt-44 pb-24 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#54ACBF]">{t("landing.challenge")}</p>
              <h2 className="text-3xl md:text-[2.6rem] font-extrabold font-[Manrope] text-[#011C40] leading-tight">
                {t("landing.problemTitle")} <span className="luna-text-gradient">{t("landing.problemHighlight")}</span> {t("landing.problemSuffix")}
              </h2>
              <p className="text-[#3f5f74] leading-relaxed">
                History-taking is the first casualty of crowded OPDs. MediKiosk captures the
                complete story <em className="font-semibold text-[#023859]">before</em> the doctor walks in —
                so every minute of the consultation is spent on care, not paperwork.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  { icon: Mic, title: "Conversational by design", desc: "Patients speak naturally — the AI asks adaptive SOCRATES-based follow-ups in their language." },
                  { icon: ScanLine, title: "Old records finally matter", desc: "Paper prescriptions and lab reports are digitized, structured, and linked to the summary." },
                  { icon: ShieldCheck, title: "Consent-first & compliant", desc: "DPDPA 2023 aligned consent with ABHA ID linking and FHIR-ready export." },
                ].map(({ icon: Icon, title, desc }) => (
                  <li key={title} className="flex gap-4">
                    <span className="w-11 h-11 shrink-0 rounded-xl bg-[#A7EBF2]/50 border border-[#A7EBF2] text-[#023859] flex items-center justify-center">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="block font-extrabold font-[Manrope] text-[#011C40]">{title}</span>
                      <span className="block text-sm text-[#5d7a8c] leading-relaxed">{desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layered summary visual */}
            <div className="relative select-none">
              <div className="luna-dots absolute -inset-8 rounded-[3rem] opacity-60" aria-hidden />
              <div className="relative rounded-[26px] bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40] p-8 text-white shadow-2xl shadow-[#023859]/30 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#54ACBF]/25 blur-[70px]" aria-hidden />
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#A7EBF2]">Doctor-ready summary</p>
                  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><Stethoscope size={16} className="text-[#A7EBF2]" /></span>
                </div>
                <div className="space-y-3">
                  {[
                    { k: "Chief complaint", v: "Chest pain radiating to left arm · 3 days" },
                    { k: "Past history", v: "Hypertension (2019) · on Telmisartan" },
                    { k: "Allergies", v: "Penicillin — anaphylaxis (2021)" },
                    { k: "Medications", v: "Telmisartan 40 mg OD · Atorvastatin 10 mg HS" },
                    { k: "Vitals & labs", v: "BP 158/96 · HbA1c 6.1 · LDL 142" },
                  ].map((r) => (
                    <div key={r.k} className="flex items-start justify-between gap-4 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-sm">
                      <span className="text-[#A7EBF2]/90 font-semibold whitespace-nowrap">{r.k}</span>
                      <span className="text-white/90 font-semibold text-right">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#A7EBF2] font-bold">
                    <Clock size={14} /> History captured in 4m 12s
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#54ACBF] px-4 py-1.5 text-xs font-extrabold text-white">
                    <CircleCheck size={13} /> Reviewed & confirmed
                  </span>
                </div>
              </div>
              {/* Floating consent chip */}
              <div className="absolute -bottom-6 right-6 rounded-2xl bg-white px-4 py-3 shadow-xl border border-[#B9DCE3]/60 flex items-center gap-3 animate-floaty-slow">
                <span className="w-8 h-8 rounded-full bg-[#A7EBF2]/60 text-[#023859] flex items-center justify-center"><Lock size={14} /></span>
                <span>
                  <span className="block text-[11px] font-extrabold text-[#011C40] leading-none">Consent captured</span>
                  <span className="block text-[10px] font-bold text-[#5d7a8c] mt-1">ABHA · DPDPA 2023</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────────── */}
      <section className="px-5 md:px-6 pb-24">
        <div className="max-w-7xl mx-auto rounded-[26px] border border-[#B9DCE3]/60 bg-white/70 backdrop-blur px-6 md:px-12 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Clock, stat: "2–5 min", label: "Average OPD consultation", desc: "History usually gets skipped" },
            { icon: Users, stat: "5,000+", label: "Daily patients per big hospital", desc: "Manual triage can't scale" },
            { icon: FileText, stat: "100%", label: "Paper records still in OPD", desc: "Rx, labs, discharge summaries" },
            { icon: HeartPulse, stat: "15+", label: "Indian languages supported", desc: "Hindi, Tamil, Bengali, Hinglish…" },
          ].map(({ icon: Icon, stat, label, desc }) => (
            <div key={label} className="text-center lg:text-left">
              <span className="mx-auto lg:mx-0 w-11 h-11 rounded-2xl luna-btn-teal text-white flex items-center justify-center mb-4"><Icon size={20} /></span>
              <p className="text-3xl font-extrabold font-[Manrope] text-[#011C40] leading-none">{stat}</p>
              <p className="text-sm font-extrabold text-[#26658C] mt-2">{label}</p>
              <p className="text-xs text-[#5d7a8c] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ────────────────────────────────────────────── */}
      <section id="modules" className="pb-24 px-5 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#54ACBF] mb-3">{t("landing.features")}</p>
            <h2 className="text-3xl md:text-[2.6rem] font-extrabold font-[Manrope] text-[#011C40]">{t("landing.howItWorks")}</h2>
            <p className="text-[#5d7a8c] mt-4 max-w-2xl mx-auto">
              Four purpose-built modules that turn a 2-minute rushed visit into a complete,
              structured clinical encounter — for every patient, in every language.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Mic, step: "Module A", title: "Conversational History Engine", desc: "Adaptive voice + touch interview. SOCRATES pain framework, systematic review for every other complaint.", accent: "from-[#A7EBF2] to-[#54ACBF]" },
              { icon: ScanLine, step: "Module B", title: "Document Digitization", desc: "Scan prescriptions, lab reports and discharge summaries. OCR extracts diagnoses, medications and lab values.", accent: "from-[#54ACBF] to-[#26658C]" },
              { icon: BrainCircuit, step: "Module C", title: "Clinical Summary Generator", desc: "GPT-5.6 Luna synthesizes conversation + documents into a structured, physician-ready summary in seconds.", accent: "from-[#26658C] to-[#023859]" },
              { icon: ShieldCheck, step: "Module D", title: "Consent & ABDM Integration", desc: "DPDPA 2023 compliant consent, ABHA ID linking and FHIR interoperability — privacy by design.", accent: "from-[#54ACBF] to-[#A7EBF2]" },
            ].map(({ icon: Icon, step, title, desc, accent }) => (
              <Link
                key={title}
                href="/signup"
                className="group rounded-3xl bg-white border border-[#B9DCE3]/70 p-8 lift-card"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-lg shadow-[#26658C]/20 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#54ACBF]">{step}</p>
                </div>
                <h3 className="font-extrabold text-xl font-[Manrope] text-[#011C40] mb-3">{title}</h3>
                <p className="text-sm text-[#5d7a8c] leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#26658C] group-hover:gap-3.5 transition-all">
                  Explore module <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey ────────────────────────────────────────────── */}
      <section id="how" className="pb-24 px-5 md:px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto rounded-[30px] bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40] px-6 md:px-14 py-16 md:py-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-[#54ACBF]/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" aria-hidden />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#A7EBF2]/10 rounded-full blur-[90px] -translate-x-1/4 translate-y-1/4" aria-hidden />
          <Sparkles className="absolute top-10 left-10 w-20 h-20 text-[#A7EBF2]/20" aria-hidden />

          <div className="relative text-center mb-14">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#A7EBF2] mb-3">{t("landing.patientJourney")}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold font-[Manrope]">{t("landing.fiveSteps")}</h2>
          </div>

          <div className="relative grid md:grid-cols-5 gap-8">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#A7EBF2]/0 via-[#54ACBF]/50 to-[#A7EBF2]/0" aria-hidden />
            {[
              { num: "1", title: t("step.identify"), desc: t("step.identifyDesc"), icon: ShieldCheck },
              { num: "2", title: t("step.converse"), desc: t("step.converseDesc"), icon: Mic },
              { num: "3", title: t("step.scan"), desc: t("step.scanDesc"), icon: ScanLine },
              { num: "4", title: t("step.summarize"), desc: t("step.summarizeDesc"), icon: BrainCircuit },
              { num: "5", title: t("step.consult"), desc: t("step.consultDesc"), icon: Stethoscope },
            ].map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="relative text-center group">
                <div className="relative z-10 w-16 h-16 rounded-full luna-btn-teal border-4 border-[#023859] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-xl shadow-[#011C40]/40">
                  <Icon size={26} className="text-white" />
                </div>
                <p className="text-[10px] font-extrabold text-[#A7EBF2] mb-1">STEP {num}</p>
                <h3 className="font-extrabold font-[Manrope] mb-2">{title}</h3>
                <p className="text-sm text-[#9fc3d4] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-14 text-center">
            <Link href="/signup" className={`${PILL} bg-white text-[#023859] hover:bg-[#A7EBF2] px-9 py-4 text-base shadow-2xl`}>
              Try the 5-minute journey
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-[#9fc3d4] mt-4 font-semibold">
              No app install · works on any kiosk or phone browser
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonial ────────────────────────────────────────── */}
      <section className="pb-24 px-5 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="mx-auto text-[#54ACBF] w-10 h-10 mb-6" aria-hidden />
          <blockquote className="text-2xl md:text-[1.9rem] font-bold font-[Manrope] text-[#011C40] leading-snug">
            “Every patient now walks in with a complete history. We diagnose faster and
            finally have time to <span className="luna-text-gradient">talk to the person</span>,
            not just the file.”
          </blockquote>
          <div className="flex items-center justify-center gap-3 mt-8">
            <AvatarStack />
            <div className="text-left">
              <p className="text-sm font-extrabold text-[#011C40]">Dr. Priya Sharma</p>
              <p className="text-xs font-semibold text-[#5d7a8c]">Head of OPD · District General Hospital</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="pb-24 px-5 md:px-6">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40] px-6 md:px-16 py-16 md:py-20 text-white">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="luna-dots absolute inset-0 opacity-20" />
            <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-[#54ACBF]/25 rounded-full blur-[90px]" />
            <div className="absolute -top-20 right-10 w-64 h-64 bg-[#A7EBF2]/15 rounded-full blur-[80px]" />
          </div>
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#A7EBF2] mb-5">
                <Hospital size={13} /> For hospitals & clinics
              </p>
              <h2 className="text-3xl md:text-[2.7rem] font-extrabold font-[Manrope] leading-tight mb-5">{t("landing.readyCTA")}</h2>
              <p className="text-[#9fc3d4] max-w-xl leading-relaxed mb-8">
                Deploy MediKiosk at your OPD reception or as a mobile-first web app.
                Our team handles hardware, ABDM onboarding and clinician training.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className={`${PILL} bg-white text-[#023859] hover:bg-[#A7EBF2] px-8 py-4 text-base shadow-2xl`}>
                  Book a pilot
                  <ArrowRight size={18} />
                </Link>
                <Link href="/login" className={`${PILL} border-2 border-white/25 text-white hover:bg-white/10 px-8 py-4 text-base`}>
                  <Stethoscope size={18} /> Clinician Portal
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-xs font-bold text-[#A7EBF2]/90">
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={14} /> DPDPA 2023</span>
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={14} /> ABDM / ABHA</span>
                <span className="inline-flex items-center gap-1.5"><CircleCheck size={14} /> FHIR-ready</span>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-56 h-56 rounded-[2.4rem] bg-white/[0.06] border border-white/15 backdrop-blur flex flex-col items-center justify-center gap-5 text-center p-8">
                <span className="w-20 h-20 rounded-full luna-btn-teal flex items-center justify-center shadow-2xl shadow-[#54ACBF]/40">
                  <Play size={30} className="fill-white ml-1" />
                </span>
                <p className="font-extrabold text-lg font-[Manrope]">See MediKiosk in action</p>
                <p className="text-xs text-[#9fc3d4] font-semibold -mt-3">2-minute product walkthrough</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#011C40] text-white pt-16 pb-8 px-5 md:px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl luna-brand-gradient flex items-center justify-center shadow-lg">
                <HeartPulse size={24} className="text-white" />
              </div>
              <div>
                <p className="font-extrabold text-lg font-[Manrope]">{t("app.name")}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-[#A7EBF2]">{t("app.tagline")}</p>
              </div>
            </div>
            <p className="text-sm text-[#9fc3d4] leading-relaxed max-w-xs">
              AI-powered clinical history capture for hospitals, clinics and AYUSH centres —
              in every Indian language.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#9fc3d4] font-semibold">
              <Globe size={13} className="text-[#54ACBF]" /> {t("footer.hindi")}
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#54ACBF] mb-5">Platform</p>
            <ul className="space-y-3 text-sm text-[#cfdde4] font-semibold">
              <li><a href="#how" className="hover:text-[#A7EBF2] transition-colors">AI History Intake</a></li>
              <li><a href="#modules" className="hover:text-[#A7EBF2] transition-colors">Document OCR</a></li>
              <li><a href="#modules" className="hover:text-[#A7EBF2] transition-colors">Clinical Summary</a></li>
              <li><Link href="/login" className="hover:text-[#A7EBF2] transition-colors">Clinician Portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#54ACBF] mb-5">Compliance</p>
            <ul className="space-y-3 text-sm text-[#cfdde4] font-semibold">
              <li className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#54ACBF]" /> DPDPA 2023 Compliant</li>
              <li className="inline-flex items-center gap-2"><Heart size={14} className="text-[#54ACBF]" /> ABDM Integrated</li>
              <li className="inline-flex items-center gap-2"><Lock size={14} className="text-[#54ACBF]" /> End-to-end encrypted</li>
              <li className="inline-flex items-center gap-2"><Languages size={14} className="text-[#54ACBF]" /> 15+ languages</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9fc3d4] font-semibold">{t("app.copyright")}</p>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#9fc3d4]">
            <span className="rounded-full bg-white/10 px-3 py-1">Made in India 🇮🇳</span>
            <span className="rounded-full bg-white/10 px-3 py-1">For every language</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
