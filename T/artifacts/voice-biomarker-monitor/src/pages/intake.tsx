import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  ShieldCheck, Mic, MicOff, ScanLine, BrainCircuit, CheckCircle2,
  ArrowRight, ArrowLeft, Upload, FileText, Loader2,
  AlertTriangle, Globe, Stethoscope, ClipboardList, Check,
  Leaf, Loader, Zap, Clock, Volume2, VolumeX, Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";
import {
  startIntakeSession, submitAnswer, uploadDocuments,
  generateClinicalSummary, recordConsent, getConsentText, transcribeAudio,
  getDoctors, assignDoctor, downloadSummaryAsPDF,
  type IntakeSession, type UploadedDocument, type HistoryAnswer, type ClinicalSummary, type Doctor,
} from "@/lib/api";
import { validateABHA, type AbhaVerifyResponse } from "@/lib/medikiosk-api";

type Step = "identity" | "consent" | "history" | "documents" | "summary";

// Step labels are defined as keys; actual labels come from t()
const STEPS_CONFIG: { key: Step; labelKey: string; icon: typeof ClipboardList }[] = [
  { key: "identity", labelKey: "step.identify", icon: ShieldCheck },
  { key: "consent", labelKey: "consent.title", icon: ShieldCheck },
  { key: "history", labelKey: "history.title.clinical", icon: Mic },
  { key: "documents", labelKey: "documents.title", icon: ScanLine },
  { key: "summary", labelKey: "summary.title.clinical", icon: BrainCircuit },
];

export default function IntakeFlow() {
  const { user } = useAuth();
  const { language: uiLang, setLanguage: setUILanguage, t } = useLanguage();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<Step>("identity");
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<IntakeSession | null>(null);

  // Identity
  const [abhaId, setAbhaId] = useState(user?.abhaId || "");
  const [abhaVerifying, setAbhaVerifying] = useState(false);
  // Full gateway verification outcome (status, beneficiary, gateway txn id) —
  // persisted on the intake session + clinical summary for the doctor's view.
  const [abhaVerified, setAbhaVerified] = useState<AbhaVerifyResponse | null>(null);
  const [abhaCheckFailed, setAbhaCheckFailed] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [mode, setMode] = useState<"allopathic" | "ayush">("allopathic");

  // Consent
  const [consentText, setConsentText] = useState<any>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  // History interview
  const [answers, setAnswers] = useState<HistoryAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [historyProgress, setHistoryProgress] = useState(0);
  const [historyComplete, setHistoryComplete] = useState(false);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Documents
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Summary
  const [summary, setSummary] = useState<ClinicalSummary | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Doctor selection
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [doctorAssigned, setDoctorAssigned] = useState(false);

  // Rapid track
  const [track, setTrack] = useState<"full" | "rapid">("full");
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Noise
  const [noiseLevel, setNoiseLevel] = useState<"low" | "medium" | "high">("low");
  const [noiseDb, setNoiseDb] = useState(0);
  const [touchFallback, setTouchFallback] = useState(false);

  // MCQ options
  const [allMcqs, setAllMcqs] = useState<(string[] | null)[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (step === "consent" && !consentText) {
      getConsentText(language).then(setConsentText).catch(() => {});
    }
    if (step === "summary" && doctors.length === 0) {
      getDoctors().then(setDoctors).catch(() => {});
    }
  }, [step, language]);

  // Timer: count elapsed seconds during intake
  useEffect(() => {
    if (step === "history" || step === "documents") {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAssignDoctor = async (doctorId: string) => {
    if (!sessionId) return;
    try {
      await assignDoctor(sessionId, doctorId);
      setSelectedDoctor(doctorId);
      setDoctorAssigned(true);
    } catch (err) {
      console.error(err);
    }
  };

  const advanceStep = (nextStep: Step) => {
    const idx = STEPS_CONFIG.findIndex((s) => s.key === nextStep);
    setStep(nextStep);
    setStepIndex(idx);
  };

  // ── ABHA verification via ABDM gateway (sandbox / simulated sandbox) ──
  const handleVerifyAbha = async () => {
    if (!abhaId.trim()) return;
    setAbhaVerifying(true);
    setAbhaCheckFailed(null);
    setAbhaVerified(null);
    try {
      const result = await validateABHA(abhaId.trim(), {
        name: user?.name,
        gender: (user as { gender?: string } | null)?.gender,
        dateOfBirth:
          (user as { dob?: string; dateOfBirth?: string } | null)?.dob ||
          (user as { dob?: string; dateOfBirth?: string } | null)?.dateOfBirth,
      });
      if (result.verified) {
        setAbhaVerified(result);
      } else {
        setAbhaVerified(null);
        setAbhaCheckFailed(result.message || "Could not verify this ABHA number. You can continue without ABHA.");
      }
    } catch {
      setAbhaCheckFailed("Verification service unavailable. You can continue without ABHA.");
    }
    setAbhaVerifying(false);
  };

  // ── Identity Step ───────────────────────────────────────────────────────
  const handleIdentitySubmit = async () => {
    if (!user) return;
    try {
      const result = await startIntakeSession({
        patientId: user.patientId,
        patientName: user.name,
        abhaId,
        abhaVerification: abhaVerified ?? undefined,
        language,
        mode,
        track,
      });
      setSessionId(result.sessionId);
      setSession(result.session);
      setCurrentQuestion(result.nextQuestion.question);
      setCurrentCategory(result.nextQuestion.category);
      setTotalQuestions(result.totalQuestions || (track === "rapid" ? 3 : 10));
      // Store initial MCQ options from the first question
      if (result.nextQuestion?.mcqOptions) {
        setAllMcqs([result.nextQuestion.mcqOptions]);
      }
      if (result.noise) {
        setNoiseLevel(result.noise.level as any);
        setNoiseDb(result.noise.db);
        if (result.noise.level === "high") setTouchFallback(true);
      }
      advanceStep("consent");
    } catch (err) {
      console.error(err);
    }
  };

  // ── Consent Step ────────────────────────────────────────────────────────
  const handleConsentSubmit = async () => {
    if (!sessionId || !user) return;
    try {
      await recordConsent({
        sessionId,
        patientId: user.patientId,
        patientName: user.name,
        abhaId,
        consentGranted: true,
        language,
      });
      advanceStep("history");
    } catch (err) {
      console.error(err);
    }
  };

  // ── Voice Recording (Real Web Audio API) ────────────────────────────────
  const startRecording = useCallback(async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert("Microphone recording requires a secure connection (HTTPS or localhost). Please type your answer or access via localhost.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });

        if (blob.size > 500) {
          setIsTranscribing(true);
          try {
            // Pass the selected language to transcription for proper language detection
            const result = await transcribeAudio(blob, language);
            if (result.transcript) {
              setCurrentAnswer((prev) => (prev ? prev + " " + result.transcript : result.transcript));
              // Log the detected language for debugging
              if (result.language) {
                console.log(`Transcription language: ${result.language}, provider: ${result.provider}`);
              }
            } else if (result.message) {
              // Transcription unavailable — user can type
            }
          } catch {
            // Silently fail — user types instead
          }
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // Microphone not available — user types instead
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ── Submit Answer ───────────────────────────────────────────────────────
  const handleAnswerSubmit = async () => {
    if (!sessionId || !currentAnswer.trim()) return;
    setIsSubmitting(true);
    try {
      const isFirstAnswer = answers.length === 0;
      const result = await submitAnswer(
        sessionId,
        currentAnswer.trim(),
        currentQuestion,
        currentCategory,
        isFirstAnswer ? currentAnswer.trim() : undefined
      );

      if (isFirstAnswer) setChiefComplaint(currentAnswer.trim());

      const newAnswers = [
        ...answers,
        {
          question: currentQuestion,
          answer: currentAnswer.trim(),
          category: currentCategory,
          timestamp: new Date().toISOString(),
        },
      ];
      setAnswers(newAnswers);
      setCurrentAnswer("");
      setShowCustomInput(false);
      setHistoryProgress(result.progress || 0);

      // Store MCQ options for the next question from the response
      if (result.nextQuestion?.mcqOptions) {
        setAllMcqs([...allMcqs, result.nextQuestion.mcqOptions]);
      } else {
        setAllMcqs([...allMcqs, null]);
      }

      if (result.isComplete) {
        setHistoryComplete(true);
        setTimeout(() => advanceStep("documents"), 1200);
      } else {
        setCurrentQuestion(result.nextQuestion.question);
        setCurrentCategory(result.nextQuestion.category);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  // ── Document Upload ─────────────────────────────────────────────────────
  const handleFileUpload = async (files: FileList | null) => {
    if (!sessionId || !files || files.length === 0) return;
    setUploading(true);
    try {
      const result = await uploadDocuments(sessionId, Array.from(files));
      setUploadedDocs((prev) => [...prev, ...result.documents]);
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // ── Generate Summary ────────────────────────────────────────────────────
  const handleGenerateSummary = async () => {
    if (!sessionId || !user) return;
    setGeneratingSummary(true);
    try {
      const result = await generateClinicalSummary({
        sessionId,
        patientName: user.name,
        patientId: user.patientId,
        abhaId,
        abhaVerification: abhaVerified ?? undefined,
        chiefComplaint,
        answers,
        documents: uploadedDocs,
        mode,
      });
      setSummary(result.summary);
    } catch (err) {
      console.error(err);
    }
    setGeneratingSummary(false);
  };

  const currentStepIdx = STEPS_CONFIG.findIndex((s) => s.key === step);

  return (
    <AppLayout userType="patient">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between bg-card border rounded-2xl p-4">
          {STEPS_CONFIG.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === currentStepIdx;
            const isDone = i < currentStepIdx;
            return (
              <div key={s.key} className="flex items-center flex-1">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400"
                      : isDone
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  <span className="text-xs font-bold hidden sm:inline">{t(s.labelKey).split(' ').slice(0, 2).join(' ')}</span>
                </div>
                {i < STEPS_CONFIG.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full ${isDone ? "bg-cyan-400" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Identity Step ─────────────────────────────────────────────── */}
        {step === "identity" && (
          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-6">
              <ShieldCheck size={44} className="text-cyan-600 mx-auto mb-3" />
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">{t("identity.title")}</h2>
              <p className="text-muted-foreground">{t("identity.description")}</p>
            </div>

            {/* ── LANGUAGE CARDS (Visual Selector) ──────────────────────── */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block flex items-center gap-2">
                <Globe size={14} /> {t("identity.language")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "ur"].map((code) => {
                  const lang = LANGUAGES.find((l) => l.code === code);
                  if (!lang) return null;
                  const isSelected = language === code;
                  return (
                    <button
                      key={code}
                      onClick={() => { setLanguage(code as LanguageCode); setUILanguage(code as LanguageCode); }}
                      className={`flex flex-col items-center justify-center min-h-[4.5rem] p-3 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md ring-2 ring-cyan-200 dark:ring-cyan-800"
                          : "border-border hover:border-cyan-300 hover:bg-muted/30"
                      }`}
                    >
                      <span className={`text-base font-black leading-tight ${isSelected ? "text-cyan-700 dark:text-cyan-400" : "text-foreground"}`}>
                        {lang.nativeName}
                      </span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">{lang.name}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                {LANGUAGES.find((l) => l.code === language)?.script} — {t("identity.scriptNote")}
              </p>
            </div>

            {/* Patient Name */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-2 block">{t("identity.patientName")}</label>
              <Input value={user?.name || ""} disabled className="h-14 rounded-xl bg-muted/50 text-base" />
            </div>

            {/* ABHA ID */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-2 block flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-600" /> {t("identity.abhaId")}
                <span className="text-[10px] font-semibold text-muted-foreground normal-case tracking-normal">
                  · verified against the ABDM gateway
                </span>
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder={t("identity.abhaPlaceholder")}
                  value={abhaId}
                  onChange={(e) => {
                    setAbhaId(e.target.value);
                    setAbhaVerified(null);
                    setAbhaCheckFailed(null);
                  }}
                  className="h-14 rounded-xl text-base font-mono tracking-wider"
                />
                <Button
                  type="button"
                  onClick={handleVerifyAbha}
                  disabled={abhaId.replace(/\D/g, "").length < 14 || abhaVerifying}
                  className="h-14 px-4 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 shrink-0"
                >
                  {abhaVerifying ? <Loader2 size={18} className="animate-spin" /> : "Verify"}
                </Button>
              </div>

              {abhaVerified?.verified && (
                <div className="mt-2 flex items-start gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl px-3 py-2">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Verified — ABDM{abhaVerified.mode === "simulated" ? " sandbox (simulated demo)" : " sandbox"}
                    {abhaVerified.beneficiary?.name ? ` · ${abhaVerified.beneficiary.name}` : ""}.
                    {abhaVerified.mode === "simulated" && (
                      <span className="block text-[10px] font-medium mt-0.5">
                        Demo simulation — add ABDM sandbox credentials for a live gateway call.
                      </span>
                    )}
                  </span>
                </div>
              )}

              {abhaCheckFailed && (
                <div className="mt-2 flex items-start gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{abhaCheckFailed}</span>
                </div>
              )}
            </div>

            {/* ── History-Taking Mode (Large Touch Cards) ──────────────── */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block">{t("identity.mode")}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("allopathic")}
                  className={`flex flex-col items-center gap-2 p-5 min-h-[7rem] rounded-2xl border-2 transition-all ${
                    mode === "allopathic"
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md"
                      : "border-border hover:border-cyan-300"
                  }`}
                >
                  <Stethoscope size={28} className={mode === "allopathic" ? "text-cyan-600" : "text-muted-foreground"} />
                  <span className="font-bold text-sm">{t("identity.mode.clinical")}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{t("identity.mode.clinicalDesc")}</span>
                </button>
                <button
                  onClick={() => setMode("ayush")}
                  className={`flex flex-col items-center gap-2 p-5 min-h-[7rem] rounded-2xl border-2 transition-all ${
                    mode === "ayush"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md"
                      : "border-border hover:border-amber-300"
                  }`}
                >
                  <Leaf size={28} className={mode === "ayush" ? "text-amber-600" : "text-muted-foreground"} />
                  <span className="font-bold text-sm">{t("identity.mode.ayush")}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{t("identity.mode.ayushDesc")}</span>
                </button>
              </div>
            </div>

            {/* ── Session Track (Large Touch Cards) ────────────────────── */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider mb-3 block flex items-center gap-2">
                <Zap size={14} /> {t("track.speed")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTrack("rapid")}
                  className={`flex flex-col items-center gap-2 p-5 min-h-[7rem] rounded-2xl border-2 transition-all ${
                    track === "rapid"
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 shadow-md"
                      : "border-border hover:border-amber-300"
                  }`}
                >
                  <Zap size={24} className={track === "rapid" ? "text-amber-600" : "text-muted-foreground"} />
                  <span className="font-bold text-sm">⚡ {t("track.rapid")}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{t("track.rapidDesc")}</span>
                </button>
                <button
                  onClick={() => setTrack("full")}
                  className={`flex flex-col items-center gap-2 p-5 min-h-[7rem] rounded-2xl border-2 transition-all ${
                    track === "full"
                      ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md"
                      : "border-border hover:border-cyan-300"
                  }`}
                >
                  <ClipboardList size={24} className={track === "full" ? "text-cyan-600" : "text-muted-foreground"} />
                  <span className="font-bold text-sm">📋 {t("track.full")}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{t("track.fullDesc")}</span>
                </button>
              </div>
            </div>

            {/* Continue Button — Extra large for kiosk */}
            <Button onClick={handleIdentitySubmit} className="w-full h-16 rounded-2xl font-black text-lg bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20" size="lg">
              {t("identity.continue")} <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        )}

        {/* ── Consent Step ──────────────────────────────────────────────── */}
        {step === "consent" && consentText && (
          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-8">
              <ShieldCheck size={40} className="text-cyan-600 mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">{consentText.title}</h2>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {consentText.sections.map((section: any, i: number) => (
                <div key={i} className="bg-muted/30 rounded-xl p-5">
                  <h4 className="font-bold text-sm mb-2 text-cyan-700 dark:text-cyan-400">{section.heading}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                <span className="text-sm font-semibold leading-relaxed">{consentText.consentStatement}</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => advanceStep("identity")} className="rounded-xl font-bold">
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Button onClick={handleConsentSubmit} disabled={!consentChecked}
                className="flex-1 h-12 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700" size="lg">
                <CheckCircle2 size={18} className="mr-2" /> {t("consent.agreeBtn")}
              </Button>
            </div>
          </div>
        )}

        {/* ── History Interview Step ────────────────────────────────────── */}
        {step === "history" && (
          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-6">
              {mode === "ayush" ? <Leaf size={40} className="text-amber-500 mx-auto mb-4" /> : track === "rapid" ? <Zap size={40} className="text-amber-500 mx-auto mb-4" /> : <Mic size={40} className="text-cyan-600 mx-auto mb-4" />}
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">
                {mode === "ayush" ? t("history.title.ayush") : track === "rapid" ? `⚡ ${t("history.rapidTitle")}` : t("history.title.clinical")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mode === "ayush" ? t("history.description.ayush") : track === "rapid" ? t("history.rapidDesc") : t("history.description.clinical")}
              </p>
            </div>

            {/* Timer & Noise Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-xs font-mono font-bold text-muted-foreground">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex items-center gap-2">
                {noiseLevel === "high" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                    <VolumeX size={12} className="text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{t("noise.high")}</span>
                  </div>
                )}
                {noiseLevel === "medium" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <Volume2 size={12} className="text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">{t("noise.medium")}</span>
                  </div>
                )}
                {noiseLevel === "low" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/40 rounded-full">
                    <Mic size={12} className="text-cyan-600" />
                    <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400">{t("noise.low")}</span>
                  </div>
                )}
                <button
                  onClick={() => setTouchFallback(!touchFallback)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                    touchFallback
                      ? "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Hand size={12} /> {touchFallback ? t("noise.touchMode") : t("noise.switchTouch")}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{currentCategory}</span>
                <span className={`text-xs font-bold ${mode === "ayush" ? "text-amber-600" : "text-cyan-600"}`}>{t("history.progress")} {historyProgress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${mode === "ayush" ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-cyan-500 to-sky-400"}`}
                  style={{ width: `${historyProgress}%` }} />
              </div>
            </div>

            {/* Previous Q&A */}
            <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-2">
              {answers.map((a, i) => (
                <div key={i} className="space-y-1.5">
                  <div className={`rounded-xl px-4 py-2 text-xs font-semibold ${
                    mode === "ayush"
                      ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                      : "bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400"
                  }`}>
                    {a.category}: {a.question}
                  </div>
                  <div className="bg-muted/50 border rounded-xl px-4 py-2 text-sm ml-4">{a.answer}</div>
                </div>
              ))}
            </div>

            {/* Current question */}
            {!historyComplete && currentQuestion && (
              <div className="space-y-4">
                <div className={`rounded-xl px-5 py-4 border ${
                  mode === "ayush"
                    ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
                    : "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800"
                }`}>
                  <p className={`text-xs font-bold mb-1 ${mode === "ayush" ? "text-amber-700 dark:text-amber-400" : "text-cyan-700 dark:text-cyan-400"}`}>
                    {currentCategory}
                  </p>
                  <p className="text-foreground font-semibold">{currentQuestion}</p>
                </div>

                <div className="flex gap-3">
                  <Input
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAnswerSubmit()}
                    placeholder={isTranscribing ? t("history.transcribing") : t("history.placeholder")}
                    className="h-14 rounded-xl text-base"
                    disabled={isSubmitting || isTranscribing}
                  />
                  <button
                    onClick={toggleVoiceRecording}
                    className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse"
                        : isTranscribing
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600"
                        : mode === "ayush"
                        ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 hover:bg-amber-200"
                        : "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 hover:bg-cyan-200"
                    }`}
                    title={isRecording ? "Stop recording" : "Start voice input"}
                    disabled={isTranscribing}
                  >
                    {isRecording ? <MicOff size={20} /> : isTranscribing ? <Loader size={20} className="animate-spin" /> : <Mic size={20} />}
                  </button>
                </div>

                {isTranscribing && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold text-center">
                    🎤 Transcribing your voice...
                  </p>
                )}

                {/* MCQ Options: Quick-tap answer cards */}
                {allMcqs[answers.length] && !showCustomInput && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">
                      {t("history.mcqPrompt")}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {allMcqs[answers.length]!.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setCurrentAnswer(opt);
                          }}
                          className={`min-h-[3.5rem] px-3 py-2 rounded-xl font-semibold text-sm text-left border-2 transition-all leading-tight ${
                            currentAnswer === opt
                              ? mode === "ayush" ? "border-amber-500 bg-amber-100 dark:bg-amber-900/40 shadow-md" : "border-cyan-500 bg-cyan-100 dark:bg-cyan-900/40 shadow-md"
                              : "border-border hover:border-cyan-300 hover:bg-muted/30"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setShowCustomInput(true); setCurrentAnswer(""); }}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-muted-foreground/30 text-sm font-semibold text-muted-foreground hover:border-cyan-400 hover:text-cyan-600 transition-all"
                    >
                      ✏️ {t("history.customInput")}
                    </button>
                  </div>
                )}

                {/* Custom input mode (shown when no MCQ or user chose 'Other') */}
                {(showCustomInput || !allMcqs[answers.length]) && (
                  <div className="space-y-2">
                    {allMcqs[answers.length] && (
                      <button
                        onClick={() => { setShowCustomInput(false); setCurrentAnswer(""); }}
                        className="text-xs font-semibold text-cyan-600 hover:underline flex items-center gap-1"
                      >
                        {t("history.backToOptions")}
                      </button>
                    )}
                  </div>
                )}

                <Button onClick={handleAnswerSubmit} disabled={!currentAnswer.trim() || isSubmitting || isTranscribing}
                  className={`w-full h-12 rounded-xl font-bold ${mode === "ayush" ? "bg-amber-500 hover:bg-amber-600" : "bg-cyan-600 hover:bg-cyan-700"}`}>
                  {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <ArrowRight size={18} className="mr-2" />}
                  {t("history.submit")}
                </Button>
              </div>
            )}

            {historyComplete && (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-cyan-500 mx-auto mb-4" />
                <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                  {mode === "ayush" ? t("history.complete.ayush") : t("history.complete.clinical")}
                </p>
                <p className="text-muted-foreground text-sm mt-1">{t("history.movingTo")}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Documents Step ────────────────────────────────────────────── */}
        {step === "documents" && (
          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-6">
              <ScanLine size={40} className="text-sky-600 mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">{t("documents.title")}</h2>
              <p className="text-muted-foreground text-sm">{t("documents.description")}</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                dragOver ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/40" : "border-border hover:border-cyan-300"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
              <Upload size={36} className="text-muted-foreground mx-auto mb-4" />
              <p className="font-bold text-foreground mb-1">{t("documents.dropzone")}</p>
              <p className="text-sm text-muted-foreground">{t("documents.formats")}</p>
              {uploading && (
                <div className="flex items-center justify-center gap-2 mt-4 text-cyan-600">
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </div>
              )}
            </div>

            {uploadedDocs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  {t("documents.scanned")} ({uploadedDocs.length})
                </p>
                {uploadedDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
                    <FileText size={20} className="text-sky-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} · {doc.date} · {doc.facility || "Unknown"}</p>
                      {doc.extractedEntities?.diagnoses?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {doc.extractedEntities.diagnoses.map((d: string, i: number) => (
                            <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400">{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {doc.ocrConfidence !== undefined && doc.ocrConfidence < 85 && (
                      <div className="shrink-0 flex flex-col items-center gap-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.ocrConfidence >= 70 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                        }`}>
                          {doc.ocrConfidence}% confident
                        </span>
                        <span className="text-[9px] text-amber-600">Verify with patient</span>
                      </div>
                    )}
                    {doc.ocrConfidence !== undefined && doc.ocrConfidence >= 85 && (
                      <div className="shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{doc.ocrConfidence}% ✓</span>
                      </div>
                    )}
                    {doc.abnormalFlags && doc.abnormalFlags.length > 0 && <AlertTriangle size={16} className="text-amber-500 shrink-0" />}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => advanceStep("history")} className="rounded-xl font-bold">
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
              <Button onClick={() => advanceStep("summary")}
                className="flex-1 h-12 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700" size="lg">
                {uploadedDocs.length > 0 ? t("documents.continue") : t("documents.skip")} <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Summary Step ──────────────────────────────────────────────── */}
        {step === "summary" && (
          <div className="bg-card border rounded-[2rem] p-8 space-y-6">
            <div className="text-center mb-6">
              {mode === "ayush" ? <Leaf size={40} className="text-amber-500 mx-auto mb-4" /> : <BrainCircuit size={40} className="text-cyan-600 mx-auto mb-4" />}
              <h2 className="text-2xl font-extrabold font-[Manrope] mb-2">
                {mode === "ayush" ? t("summary.title.ayush") : t("summary.title.clinical")}
              </h2>
              <p className="text-muted-foreground text-sm">
                {mode === "ayush" ? t("summary.description.ayush") : t("summary.description.clinical")}
              </p>
            </div>

            {!summary && !generatingSummary && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">
                  {t("summary.ready")} {answers.length} {t("summary.answers")}
                  {uploadedDocs.length > 0 ? ` ${t("summary.and")} ${uploadedDocs.length} ${t("summary.documents")}` : ""}.
                </p>
                <Button onClick={handleGenerateSummary}
                  className={`h-12 px-8 rounded-xl font-bold ${mode === "ayush" ? "bg-amber-500 hover:bg-amber-600" : "bg-cyan-600 hover:bg-cyan-700"}`} size="lg">
                  <BrainCircuit size={18} className="mr-2" />
                  {t("summary.generate")} {mode === "ayush" ? t("summary.ayushSummary") : t("summary.clinicalSummary")}
                </Button>
              </div>
            )}

            {generatingSummary && (
              <div className="text-center py-12">
                <Loader2 size={40} className={`animate-spin mx-auto mb-4 ${mode === "ayush" ? "text-amber-500" : "text-cyan-500"}`} />
                <p className="font-bold mb-1">{t("summary.generating")}</p>
                <p className="text-sm text-muted-foreground">
                  {mode === "ayush" ? t("summary.analyzing.ayush") : t("summary.analyzing.clinical")}
                </p>
              </div>
            )}

            {summary && (
              <div className="space-y-4">
                {/* Header */}
                <div className="bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-cyan-600" />
                    <span className="font-bold text-cyan-700 dark:text-cyan-400">{t("summary.readyForReview")}</span>
                    {mode === "ayush" && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">AYUSH</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div>Patient: {summary.patientName}</div>
                    <div>ID: {summary.patientId}</div>
                    {summary.abhaId && (
                      <div>
                        ABHA: {summary.abhaId}
                        {summary.abhaVerification?.verified && (
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                            {" "}✓ {summary.abhaVerification.beneficiary?.name || "verified"}
                          </span>
                        )}
                      </div>
                    )}
                    <div>Generated: {new Date(summary.generatedAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* AYUSH Dashavidha Pariksha */}
                {summary.dashavidhaPariksha && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                    <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2">
                      <Leaf size={16} /> {t("summary.dashavidhaPariksha")}
                    </h4>
                    <div className="grid gap-3">
                      {Object.values(summary.dashavidhaPariksha).map((p, i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 w-40">{p.title}</span>
                          <span className="text-muted-foreground">{p.finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AYUSH Ahara-Vihara */}
                {summary.aharaVihara && (
                  <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl p-5">
                    <h4 className="font-bold text-sm text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                      🍽️ {t("summary.aharaVihara")}
                    </h4>
                    {Object.values(summary.aharaVihara).map((a, i) => (
                      <div key={i} className="flex gap-3 text-sm mb-2">
                        <span className="text-orange-600 dark:text-orange-400 font-bold shrink-0 w-40">{a.title}</span>
                        <span className="text-muted-foreground">{a.finding}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Standard clinical sections */}
                <SummarySection title={t("summary.chiefComplaint")} content={summary.chiefComplaint} accent={mode === "ayush"} />
                {summary.historyOfPresentIllness && <SummarySection title={t("summary.hpi")} content={summary.historyOfPresentIllness} />}
                {summary.pastMedicalHistory && <SummarySection title={t("summary.pastHistory")} content={summary.pastMedicalHistory} />}
                {summary.drugAllergyHistory && <SummarySection title={t("summary.drugAllergy")} content={summary.drugAllergyHistory} />}
                {summary.familyHistory && <SummarySection title={t("summary.familyHistory")} content={summary.familyHistory} />}
                {summary.personalHistory && <SummarySection title={t("summary.personalHistory")} content={summary.personalHistory} />}

                {summary.abnormalFlags?.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                    <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <AlertTriangle size={16} /> {t("summary.abnormalFindings")}
                    </h4>
                    <ul className="space-y-1">
                      {summary.abnormalFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-amber-600 dark:text-amber-400">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* NAMASTE-ICD11 Dual-Coding */}
                {summary.namasteIcd11Coding && summary.namasteIcd11Coding.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                    <h4 className="font-bold text-sm text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                      🏥 {t("summary.namasteIcd11") || "NAMASTE-ICD11 Dual-Coding"}
                    </h4>
                    <div className="space-y-4">
                      {summary.namasteIcd11Coding.map((coding: any, i: number) => (
                        <div key={i} className="border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                              {coding.namaste.code}
                            </span>
                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                              {coding.namaste.display}
                            </span>
                          </div>
                          {coding.icd11Translations && coding.icd11Translations.length > 0 && (
                            <div className="ml-4 space-y-2">
                              {coding.icd11Translations.map((translation: any, j: number) => (
                                <div key={j} className="flex items-start gap-3 text-xs">
                                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                                    {translation.targetCode}
                                  </span>
                                  <div>
                                    <span className="text-foreground font-medium">{translation.targetDisplay}</span>
                                    <span className="ml-2 text-muted-foreground">
                                      ({translation.equivalence}, {Math.round(translation.confidence * 100)}%)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <SummarySection title={mode === "ayush" ? t("summary.ayushAssessment") : t("summary.assessment")} content={summary.aiAssessment} accent />

                {/* Download & Doctor Selection */}
                <div className="bg-card border rounded-xl p-5 space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider">{t("doctor.select")}</h3>
                  <p className="text-xs text-muted-foreground">{t("doctor.selectDesc")}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {doctors.filter((d) => d.available).map((doc) => (
                      <button
                        key={doc.doctorId}
                        onClick={() => handleAssignDoctor(doc.doctorId)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                          selectedDoctor === doc.doctorId
                            ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md"
                            : "border-border hover:border-cyan-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                          {doc.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="font-bold text-xs">{doc.name}</div>
                          <div className="text-[10px] text-muted-foreground">{doc.specialty}</div>
                        </div>
                        {selectedDoctor === doc.doctorId && <Check size={14} className="text-cyan-600" />}
                      </button>
                    ))}
                  </div>
                  {doctorAssigned && (
                    <div className="flex items-center gap-2 text-cyan-600 text-sm font-bold">
                      <CheckCircle2 size={14} /> {t("doctor.sent")} {doctors.find((d) => d.doctorId === selectedDoctor)?.name}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => advanceStep("documents")} className="rounded-xl font-bold">
                    <ArrowLeft size={16} className="mr-2" /> {t("summary.edit")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadSummaryAsPDF(summary)}
                    className="rounded-xl font-bold"
                  >
                    <FileText size={16} className="mr-2" /> {t("summary.download")}
                  </Button>
                  <Button onClick={() => setLocation("/records")}
                    className="flex-1 h-12 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700" size="lg">
                    <CheckCircle2 size={18} className="mr-2" /> {t("summary.submitComplete")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function SummarySection({ title, content, accent }: { title: string; content: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 ${
      accent ? "bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800" : "bg-muted/30 border"
    }`}>
      <h4 className={`font-bold text-sm mb-2 ${accent ? "text-cyan-700 dark:text-cyan-400" : "text-foreground"}`}>{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{content || "Not documented"}</p>
    </div>
  );
}
