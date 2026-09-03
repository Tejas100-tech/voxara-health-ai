import { Link } from "wouter";
import {
  Stethoscope, ShieldCheck, Clock, BrainCircuit, ScanLine,
  ArrowRight, FileText, Hospital, Users, Globe, Heart, Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#011C40] via-[#023859] to-[#011C40]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Stethoscope size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-white font-extrabold text-xl tracking-tight font-[Manrope]">{t("app.name")}</h1>
                <p className="text-cyan-300/70 text-[10px] uppercase tracking-widest font-bold">{t("app.tagline")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector on Landing */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="h-9 rounded-lg border border-white/20 bg-white/10 px-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[130px]"
              >
                {LANGUAGES.filter((l) => ["en","hi","ta","te","bn","mr","gu","kn","ml","pa","or","as","ur","sa","ne"].includes(l.code)).map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-black">{lang.nativeName}</option>
                ))}
              </select>
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-cyan-300 hover:bg-white/10 rounded-xl font-bold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center pb-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/15 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-widest border border-cyan-500/20">
                <Clock size={13} className="animate-pulse" />
                {t("landing.heroHighlight")} {t("landing.problemSuffix")}
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-white font-[Manrope] leading-[1.1]">
                {t("landing.heroTitle")}{" "}
                <span className="text-cyan-400">{t("landing.heroHighlight")}</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">{t("landing.heroDescription")}</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl px-8 py-7 text-base font-bold shadow-xl shadow-cyan-500/25">
                    <Stethoscope className="mr-2" size={20} />{t("landing.startPatientIntake")}<ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-2xl px-8 py-7 text-base font-bold border-white/20 text-white hover:bg-white/10">
                    {t("landing.clinicianPortal")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-3 text-cyan-400 text-sm font-bold">
                  <Mic size={18} />
                  {t("step.converse")}
                </div>
                <div className="space-y-3">
                  {[
                    { q: "What is the main problem that brought you here today?", a: "I have had chest pain for 3 days..." },
                    { q: "Can you describe the pain? Is it sharp, dull, or burning?", a: "It is a pressing pain in the center..." },
                    { q: "Does the pain spread to your arm, jaw, or back?", a: "Yes, sometimes to my left arm..." },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-2.5 text-sm text-cyan-300 font-semibold">{item.q}</div>
                      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 ml-6">{item.a}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-cyan-400/70 font-bold pt-2 border-t border-white/10">
                  <BrainCircuit size={14} />
                  AI detects red flags and generates clinical summary
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">{t("landing.challenge")}</p>
            <h3 className="text-3xl md:text-4xl font-extrabold font-[Manrope] text-foreground max-w-3xl mx-auto">
              {t("landing.problemTitle")}{" "}
              <span className="text-cyan-600 dark:text-cyan-400">{t("landing.problemHighlight")}</span>{" "}
              {t("landing.problemSuffix")}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: "2–5 min consultations", desc: "Average primary-care consultation in India is just over 2 minutes — among the shortest globally." },
              { icon: FileText, title: "Paper records chaos", desc: "Patients carry physical prescriptions, lab reports, and discharge summaries from multiple providers." },
              { icon: Users, title: "5,000+ daily OPD patients", desc: "Tertiary hospitals register thousands of patients per day. Manual triage cannot scale." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border rounded-2xl p-7 hover:shadow-lg transition-all">
                <Icon size={28} className="text-cyan-600 dark:text-cyan-400 mb-4" />
                <h4 className="font-bold text-lg font-[Manrope] mb-2">{title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">{t("landing.features")}</p>
            <h3 className="text-3xl md:text-4xl font-extrabold font-[Manrope] text-foreground">{t("landing.howItWorks")}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Mic, step: "Module A", title: "Conversational History Engine", desc: "AI conducts adaptive voice + touch interview. SOCRATES framework for pain, systematic review for other complaints.", color: "from-cyan-500 to-sky-400" },
              { icon: ScanLine, step: "Module B", title: "Document Digitization", desc: "Scan prescriptions, lab reports, and discharge summaries. OCR extracts diagnoses, medications, lab values.", color: "from-sky-500 to-cyan-400" },
              { icon: BrainCircuit, step: "Module C", title: "Clinical Summary Generator", desc: "AI synthesizes conversation + documents into a structured physician-ready summary.", color: "from-cyan-500 to-blue-400" },
              { icon: ShieldCheck, step: "Module D", title: "Consent & ABDM Integration", desc: "DPDPA 2023 compliant consent. ABHA ID linking. FHIR interoperability.", color: "from-blue-500 to-indigo-400" },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={title} className="bg-card border rounded-3xl p-8 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={26} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-2">{step}</p>
                <h4 className="font-extrabold text-xl font-[Manrope] mb-3">{title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Journey */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">{t("landing.patientJourney")}</p>
            <h3 className="text-3xl md:text-4xl font-extrabold font-[Manrope] text-foreground">{t("landing.fiveSteps")}</h3>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {[
              { num: "1", title: t("step.identify"), desc: t("step.identifyDesc"), icon: ShieldCheck },
              { num: "2", title: t("step.converse"), desc: t("step.converseDesc"), icon: Mic },
              { num: "3", title: t("step.scan"), desc: t("step.scanDesc"), icon: ScanLine },
              { num: "4", title: t("step.summarize"), desc: t("step.summarizeDesc"), icon: BrainCircuit },
              { num: "5", title: t("step.consult"), desc: t("step.consultDesc"), icon: Stethoscope },
            ].map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-sky-400 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Icon size={28} />
                </div>
                <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 flex items-center justify-center text-xs font-black mx-auto -mt-6 relative z-10 border-2 border-background">
                  {num}
                </div>
                <h4 className="font-bold text-base font-[Manrope] mt-3 mb-1">{title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-cyan-600 to-sky-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold font-[Manrope] text-white mb-6">{t("landing.readyCTA")}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50 rounded-2xl px-8 py-7 text-base font-bold shadow-xl">
                <Hospital className="mr-2" size={20} />{t("landing.startPatientIntake")}<ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="rounded-2xl px-8 py-7 text-base font-bold border-white/30 text-white hover:bg-white/10">
                Sign In to Kiosk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-card">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Stethoscope size={18} className="text-cyan-600" />
            <span className="text-sm font-bold text-muted-foreground">{t("app.copyright")}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5"><Globe size={14} /> {t("footer.hindi")}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> {t("footer.dpdpa")}</span>
            <span className="flex items-center gap-1.5"><Heart size={14} /> {t("footer.abdm")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
