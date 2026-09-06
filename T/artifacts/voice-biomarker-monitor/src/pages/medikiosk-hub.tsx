import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, ArrowRight, Check, CheckCircle, Fingerprint, FileCheck,
  HeartPulse, Info, Languages, Leaf, Loader2, MessageCircle, Mic, Radio,
  ScanLine, Shield, Stethoscope, Users, Sprout, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useAyushMode } from "@/lib/ayush-mode";
import {
  startIntakeSession,
  recordConsent,
  validateABHA,
  registerABHA,
} from "@/lib/medikiosk-api";
import {
  INTAKE_STEPS,
  SUPPORTED_LANGUAGES,
} from "@/lib/clinical-ontology";
import { t, setLanguage, getLanguage, getTranslations, type SupportedLanguage } from "@/lib/medikiosk-i18n";

export default function MedikioskHub() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { mode: globalMode } = useAyushMode();
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => getLanguage());
  const [tr, setTr] = useState(() => getTranslations());
  const [selectedMode, setSelectedMode] = useState<"allopathic" | "ayush">(globalMode);

  useEffect(() => {
    setSelectedMode(globalMode);
  }, [globalMode]);
  const [abhaInput, setAbhaInput] = useState("");
  const [abhaStatus, setAbhaStatus] = useState<"idle" | "validating" | "valid" | "invalid" | "registering">("idle");
  const [abhaResult, setAbhaResult] = useState<Record<string, unknown> | null>(null);
  const [newAbhaForm, setNewAbhaForm] = useState({ name: "", phone: "", dob: "" });
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Validate ABHA ID via the ABDM gateway (sandbox or simulated sandbox)
  const handleValidateABHA = async () => {
    if (abhaInput.length < 10) return;
    setAbhaStatus("validating");
    try {
      const result = await validateABHA(abhaInput, { name: user?.name });
      setAbhaResult(result as unknown as Record<string, unknown>);
      setAbhaStatus(result.verified ? "valid" : "invalid");
    } catch {
      setAbhaStatus("invalid");
      setAbhaResult({ message: "Could not validate. You can continue without ABHA." });
    }
  };

  // Register new (demo) ABHA via the simulated ABDM create flow
  const handleRegisterABHA = async () => {
    if (!newAbhaForm.name || !newAbhaForm.phone) return;
    try {
      const result = await registerABHA(newAbhaForm);
      if (result.success) {
        const abhaId = result.abhaNumber || result.abhaId || "";
        setAbhaInput(abhaId);
        setAbhaResult({ valid: true, abhaId, mode: result.mode, message: result.message || "ABHA ID created." });
        setAbhaStatus("valid");
      }
    } catch {
      setAbhaStatus("invalid");
      setAbhaResult({ message: "Could not create ABHA. You can continue without ABHA." });
    }
  };

  // Start the intake session
  const handleStartSession = async () => {
    setLoading(true);
    try {
      const session = await startIntakeSession({
        patientId: user?.patientId || "PT-001",
        patientName: user?.name || "Patient",
        language: selectedLanguage,
        mode: selectedMode,
        abhaId: abhaInput || undefined,
      });

      setSessionId(session.sessionId);

      // Record consent
      await recordConsent(session.sessionId, "dpdp_2023", abhaInput || undefined);

    // Navigate to intake
    setLocation(`/medikiosk/intake?session=${session.sessionId}&complaint=&mode=${selectedMode}&lang=${selectedLanguage}`);
    } catch (err) {
      console.error("Failed to start session:", err);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 0) return true; // Identify step - always can proceed
    if (currentStep === 1) return true; // Mode selection
    if (currentStep === 2) return consentGiven;
    return false;
  };

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero Banner */}
        <section className={`relative overflow-hidden rounded-[2rem] text-white p-8 md:p-10 shadow-2xl ${
          globalMode === "ayush"
            ? "bg-gradient-to-br from-cyan-950 via-cyan-900 to-amber-950 shadow-cyan-900/30"
            : "bg-[#011C40] shadow-primary/10"
        }`}>
          {/* AYUSH decorative elements */}
          {globalMode === "ayush" && (
            <>
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(34,197,94,.22),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(245,158,11,.18),transparent_40%)]" />
              <div className="absolute top-4 right-6 opacity-10">
                <svg viewBox="0 0 120 120" className="w-40 h-40" fill="none">
                  <circle cx="60" cy="60" r="55" stroke="rgba(245,158,11,0.5)" strokeWidth="1"/>
                  <circle cx="60" cy="60" r="40" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
                  <circle cx="60" cy="60" r="25" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>
                  <path d="M60 5 L60 115 M5 60 L115 60" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5"/>
                  <path d="M20 20 L100 100 M100 20 L20 100" stroke="rgba(245,158,11,0.15)" strokeWidth="0.5"/>
                </svg>
              </div>
              <div className="absolute bottom-4 left-6 opacity-10">
                <svg viewBox="0 0 80 80" className="w-32 h-32">
                  <path d="M40 10 C20 30 20 50 40 70 C60 50 60 30 40 10Z" stroke="rgba(245,158,11,0.5)" strokeWidth="1" fill="none"/>
                  <path d="M30 35 Q40 20 50 35 Q50 50 40 55 Q30 50 30 35Z" stroke="rgba(34,197,94,0.4)" strokeWidth="1" fill="none"/>
                </svg>
              </div>
            </>
          )}
          {globalMode === "allopathic" && (
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_85%_15%,rgba(0,180,255,.28),transparent_38%),radial-gradient(ellipse_at_10%_90%,rgba(20,184,166,.22),transparent_40%)]" />
          )}
          <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase border ${
                globalMode === "ayush"
                  ? "bg-white/10 text-amber-200 border-amber-400/20"
                  : "bg-white/10 text-sky-200 border-white/10"
              }`}>
                {globalMode === "ayush" ? <Sprout size={13} className="animate-pulse" /> : <Stethoscope size={13} className="animate-pulse" />} 
                {globalMode === "ayush" ? "AyurKiosk · Dashavidha Pariksha" : "MediKiosk · Clinical Intake"}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-[Manrope] leading-tight">
                {globalMode === "ayush" ? (
                  <>{tr.heroTitle1} <span className="text-amber-300">{tr.heroTitle2}</span></>
                ) : (
                  <>{tr.heroTitle1} <span className="text-cyan-300">{tr.heroTitle2}</span></>
                )}
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                {globalMode === "ayush"
                  ? "Complete Ayurvedic intake with Prakriti assessment, Vikriti analysis, Agni evaluation, and Dashavidha Pariksha — powered by AI."
                  : tr.heroSubtitle
                }
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {([
                  ["⏱", "~5 min", tr.statIntake],
                  ["🎙", "Voice + Touch", tr.statVoice],
                  [globalMode === "ayush" ? "🌿" : "🏥", globalMode === "ayush" ? "Prakriti Ready" : tr.statPhysician, globalMode === "ayush" ? "Dashavidha Pariksha" : tr.statPhysician],
                ] as [string, string, string][]).map(([emoji, value, label]) => (
                  <div key={`${String(label)}-${globalMode}`} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
                    <p className="text-lg mb-1">{String(emoji)}</p>
                    <p className="text-sm font-black font-[Manrope]">{String(value)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{String(label)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Patient Journey Steps */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users size={18} className="text-primary" />
            <h3 className="text-xl font-extrabold font-[Manrope]">{tr.journeyTitle}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {INTAKE_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isComplete = i < currentStep;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/10"
                      : isComplete
                        ? "bg-secondary/10 border-secondary/20"
                        : "bg-card border"
                  }`}
                  onClick={() => isComplete && setCurrentStep(i)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                      isComplete
                        ? "bg-secondary text-white"
                        : isActive
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {isComplete ? <Check size={14} /> : step.number}
                    </div>
                    {isActive && <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Current</span>}
                  </div>
                  <h4 className="font-bold text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-bold">{step.duration}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Configuration Form */}
        <section className="bg-card border rounded-[2rem] p-8 shadow-sm">

          {/* Step 0: Language Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Languages size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{tr.selectLanguage}</h3>
                <p className="text-xs text-muted-foreground">{tr.selectLanguageHint}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                onClick={() => {
                  setSelectedLanguage(lang.code as SupportedLanguage);
                  setLanguage(lang.code as SupportedLanguage);
                  setTr(getTranslations());
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedLanguage === lang.code
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted/30 border hover:border-primary/20"
                }`}
                >
                  <p className="font-bold text-sm">{lang.nativeLabel}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{lang.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Mode Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Activity size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{tr.intakeMode}</h3>
                <p className="text-xs text-muted-foreground">{tr.intakeModeHint}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">              <button
                onClick={() => { setSelectedMode("allopathic"); }}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  selectedMode === "allopathic"
                    ? "bg-primary/5 border-primary/30 shadow-md ring-2 ring-primary/10"
                    : "bg-muted/20 border hover:border-primary/20"
                }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Stethoscope size={22} className={selectedMode === "allopathic" ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <h4 className="font-bold">{tr.allopathicMode}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Modern Medicine</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tr.allopathicDesc}
                </p>
                {selectedMode === "allopathic" && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary">
                    <CheckCircle size={14} /> Selected
                  </div>
                )}
              </button>
              <button
                onClick={() => { setSelectedMode("ayush"); }}
                className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedMode === "ayush"
                    ? "bg-gradient-to-br from-cyan-50 to-amber-50 border-cyan-500/30 shadow-md ring-2 ring-cyan-500/10"
                    : "bg-muted/20 border hover:border-cyan-500/20"
                }`}>
                {selectedMode === "ayush" && (
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <path d="M40 5 C25 25 25 45 40 65 C55 45 55 25 40 5Z" stroke="currentColor" strokeWidth="2" fill="none" className="text-cyan-700"/>
                    </svg>
                  </div>
                )}
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/15 to-amber-500/15 flex items-center justify-center">
                    <Leaf size={22} className={selectedMode === "ayush" ? "text-cyan-700" : "text-muted-foreground"} />
                  </div>
                  <div>
                    <h4 className="font-bold">{tr.ayushMode}</h4>
                    <p className="text-[10px] text-cyan-700/70 uppercase tracking-wider font-bold">Ayurveda & Siddha</p>
                  </div>
                </div>
                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {tr.ayushDesc}
                </p>
                {selectedMode === "ayush" && (
                  <div className="mt-3 relative inline-flex items-center gap-1 text-xs font-bold text-cyan-700">
                    <CheckCircle size={14} /> Selected · Dashavidha Pariksha Mode
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Step 2: ABHA ID */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Fingerprint size={20} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{tr.abhaId}</h3>
                <p className="text-xs text-muted-foreground">{tr.abhaHint}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter 14-digit ABHA ID"
                  value={abhaInput}
                  onChange={(e) => { setAbhaInput(e.target.value); setAbhaStatus("idle"); }}
                  maxLength={14}
                  className="flex-1 h-12 px-4 rounded-xl border bg-background text-base font-mono tracking-widest"
                />
                <Button
                  variant="outline"
                  onClick={handleValidateABHA}
                  disabled={abhaInput.length < 10 || abhaStatus === "validating"}
                  className="h-12 px-6 rounded-xl"
                >
                  {abhaStatus === "validating" ? <Loader2 className="animate-spin" size={16} /> : "Validate"}
                </Button>
              </div>

              {abhaStatus === "valid" && abhaResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-secondary/10 border border-secondary/20 rounded-xl"
                >
                  <p className="text-sm font-bold text-secondary flex items-center gap-2">
                    <CheckCircle size={16} /> {String(abhaResult.message || "ABHA verified")}
                  </p>
                  {(abhaResult as { beneficiary?: { name?: string } }).beneficiary?.name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ABHA holder: {(abhaResult as { beneficiary?: { name?: string } }).beneficiary!.name}
                    </p>
                  )}
                  <span
                    className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      abhaResult.mode === "simulated"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-cyan-100 text-cyan-700"
                    }`}
                  >
                    {abhaResult.mode === "simulated" ? "Simulated ABDM sandbox response" : "ABDM sandbox"}
                  </span>
                </motion.div>
              )}

              {abhaStatus === "invalid" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-muted/50 border rounded-xl">
                    <p className="text-sm text-muted-foreground">{String(abhaResult?.message || "Invalid ABHA ID")}</p>
                  </div>

                  <div className="p-4 bg-muted/30 border rounded-xl space-y-3">
                    <p className="text-sm font-bold">Register as New Patient</p>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        placeholder="Full Name"
                        value={newAbhaForm.name}
                        onChange={(e) => setNewAbhaForm((p) => ({ ...p, name: e.target.value }))}
                        className="h-10 px-3 rounded-lg border bg-background text-sm"
                      />
                      <input
                        placeholder="Phone"
                        value={newAbhaForm.phone}
                        onChange={(e) => setNewAbhaForm((p) => ({ ...p, phone: e.target.value }))}
                        className="h-10 px-3 rounded-lg border bg-background text-sm"
                      />
                      <input
                        type="date"
                        value={newAbhaForm.dob}
                        onChange={(e) => setNewAbhaForm((p) => ({ ...p, dob: e.target.value }))}
                        className="h-10 px-3 rounded-lg border bg-background text-sm"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegisterABHA}
                      disabled={!newAbhaForm.name || !newAbhaForm.phone}
                      className="rounded-lg"
                    >
                      Generate ABHA ID
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Step 3: Consent */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Shield size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{tr.privacyConsent}</h3>
                <p className="text-xs text-muted-foreground">{tr.consentHint}</p>
              </div>
            </div>

            <div className="p-5 bg-muted/30 border rounded-2xl space-y-4">
              <div className="space-y-2">
                <p className="text-sm leading-relaxed">
                  {tr.consentByProceeding}
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-secondary mt-0.5 shrink-0" />
                    {tr.consentListVoice}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-secondary mt-0.5 shrink-0" />
                    {tr.consentListOCR}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-secondary mt-0.5 shrink-0" />
                    {tr.consentListSummary}
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-secondary mt-0.5 shrink-0" />
                    {tr.consentListPrivacy}
                  </li>
                </ul>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-5 h-5 rounded border-2 accent-primary"
                />
                <span className="text-sm font-bold">{tr.consentCheckbox}</span>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleStartSession}
              disabled={!consentGiven || loading}
              className="px-10 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <Mic className="mr-2" size={20} />
              )}
              {loading ? "Starting..." : tr.beginHistory}
              {!loading && <ArrowRight className="ml-2" size={18} />}
            </Button>
          </div>
        </section>

        {/* Info Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(globalMode === "ayush"
            ? [
                { icon: Sprout, title: "Prakriti & Vikriti", desc: "AI-powered constitutional assessment analyzing Prakriti (body constitution) and Vikriti (current imbalance) through guided conversation.", color: "text-cyan-700" },
                { icon: Mic, title: tr.voiceTouch, desc: "Speak in your preferred language — Hindi, Tamil, Kannada, or 10+ Indian languages. AI guides you through Dashavidha Pariksha naturally.", color: "text-amber-600" },
                { icon: Sparkles, title: "Samprapti Analysis", desc: "AI maps your symptoms through Ayurvedic pathogenesis — Nidana, Samprapti, and Dosha assessment — for a physician-ready summary.", color: "text-cyan-800" },
              ]
            : [
                { icon: MessageCircle, title: tr.adaptiveInterview, desc: tr.adaptiveDesc, color: "text-primary" },
                { icon: Mic, title: tr.voiceTouch, desc: tr.voiceTouchDesc, color: "text-secondary" },
                { icon: FileCheck, title: tr.physicianReady, desc: tr.physicianReadyDesc, color: "text-cyan-600" },
              ]
          ).map((item) => (
            <div key={item.title} className="bg-card border rounded-2xl p-6 card-hover">
              <item.icon size={24} className={`${item.color} mb-4`} />
              <h4 className="font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </AppLayout>
  );
}


