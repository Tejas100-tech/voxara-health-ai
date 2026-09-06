import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle, ChevronRight, Circle, Eye,
  HeartPulse, Loader2, Mic, MicOff, Radio, Send, Stethoscope,
  Volume2, X, AlertCircle, Leaf, Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout";
import { useAuth } from "@/lib/auth";
import { useAyushMode } from "@/lib/ayush-mode";
import {
  getIntakeQuestions,
  submitIntakeAnswer,
  submitVoiceAnswer,
  finalizeIntake,
} from "@/lib/medikiosk-api";
import type { IntakeQuestion } from "@/lib/medikiosk-api";
import { CHIEF_COMPLAINT_ICONS, getQuestionPhase } from "@/lib/medikiosk-data";
import { t, setLanguage, type SupportedLanguage, type TranslationSet } from "@/lib/medikiosk-i18n";

// ─── Chief Complaint Options ─────────────────────────────────────────────────

const CHIEF_COMPLAINT_OPTIONS = [
  { id: "chest_pain", label: "Chest Pain", emoji: "❤️" },
  { id: "breathlessness", label: "Breathlessness", emoji: "🫁" },
  { id: "headache", label: "Headache", emoji: "🧠" },
  { id: "abdominal_pain", label: "Abdominal Pain", emoji: "🔵" },
  { id: "joint_pain", label: "Joint Pain", emoji: "🦴" },
  { id: "fever", label: "Fever", emoji: "🌡️" },
  { id: "fatigue", label: "Fatigue", emoji: "😴" },
  { id: "cough", label: "Cough", emoji: "🗣️" },
  { id: "dizziness", label: "Dizziness", emoji: "💫" },
  { id: "skin_issues", label: "Skin Issues", emoji: "✨" },
  { id: "mood_changes", label: "Mood Changes", emoji: "🧠" },
  { id: "digestive_issues", label: "Digestive Issues", emoji: "🍽️" },
  { id: "other", label: "Other", emoji: "📝" },
];

const SOCRATES_ICONS: Record<string, string> = {
  site: "📍",
  onset: "⏰",
  character: "🔍",
  radiation: "➡️",
  associated: "🔗",
  timing: "🕐",
  exacerbating: "⬆️",
  relieving: "⬇️",
  severity: "📊",
};

// ─── Voice Recording Hook ───────────────────────────────────────────────────

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError("");
    if (!navigator?.mediaDevices?.getUserMedia) {
      setError("Microphone recording requires a secure connection (HTTPS or localhost).");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;

      // Prefer webm, fall back to whatever is supported
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setError("Recording error occurred. Please try again.");
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          setError("No audio was recorded. Please try again.");
          setIsProcessing(false);
          return;
        }

        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setIsProcessing(true);

        // Send to transcription API
        try {
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuffer);
          const res = await fetch("/api/ai/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioBase64: base64, mimeType: blob.type }),
          });
          if (res.ok) {
            const data = await res.json();
            setTranscript(data.transcript || "");
          } else {
            // Transcription API unavailable — use a helpful fallback
            setTranscript("(Voice recorded — transcription service unavailable. Please type your answer or try again.)");
          }
        } catch {
          setTranscript("(Voice recorded — offline mode. Please type your answer or try again.)");
        }
        setIsProcessing(false);
      };

      mediaRecorder.start(250); // collect data every 250ms for smoother handling
      setIsRecording(true);
      setTranscript("");
    } catch (err: unknown) {
      const msg = err instanceof DOMException && err.name === "NotAllowedError"
        ? "Microphone permission denied. Please allow microphone access and try again."
        : err instanceof DOMException && err.name === "NotFoundError"
          ? "No microphone found. Please connect a microphone and try again."
          : "Could not access microphone. Please check your settings.";
      setError(msg);
      console.error("Microphone error:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { isRecording, transcript, isProcessing, error, startRecording, stopRecording, setTranscript };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function MedikioskIntake() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session") || "";
  const initialMode = (params.get("mode") as "allopathic" | "ayush") || "allopathic";

  const [currentPhase, setCurrentPhase] = useState<"chief_complaint" | "socrates" | "general" | "ayush" | "review">("chief_complaint");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [socratesQuestions, setSocratesQuestions] = useState<IntakeQuestion[]>([]);
  const [generalQuestions, setGeneralQuestions] = useState<IntakeQuestion[]>([]);
  const [ayushQuestions, setAyushQuestions] = useState<IntakeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [scaleValue, setScaleValue] = useState(5);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completeness, setCompleteness] = useState(0);

  const [language] = useState<SupportedLanguage>(() => {
    const lang = (params.get("lang") as SupportedLanguage) || "en";
    setLanguage(lang);
    return lang;
  });
  const voice = useVoiceRecording();

  // Chief complaint labels mapped to translations
  const CHIEF_COMPLAINT_MAP: Record<string, keyof TranslationSet> = {
    chest_pain: "chestPain",
    breathlessness: "breathlessness",
    headache: "headache",
    abdominal_pain: "abdominalPain",
    joint_pain: "jointPain",
    fever: "fever",
    fatigue: "fatigue",
    cough: "cough",
    dizziness: "dizziness",
    skin_issues: "skinIssues",
    mood_changes: "moodChanges",
    digestive_issues: "digestiveIssues",
    other: "other",
  };

  const getTranslatedChiefComplaint = (id: string): string => {
    const key = CHIEF_COMPLAINT_MAP[id];
    return key ? t(key) : id;
  };

  // Load questions when chief complaint is selected
  useEffect(() => {
    if (!sessionId) return;
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await getIntakeQuestions(sessionId, chiefComplaint || undefined);
        setSocratesQuestions(data.socratesQuestions || []);
        setGeneralQuestions(data.generalHistoryQuestions || []);
        setAyushQuestions(data.ayushQuestions || []);
        setAnswers(data.existingAnswers || {});
        setRedFlags(data.redFlags || []);
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [sessionId, chiefComplaint]);

  // Calculate completeness
  useEffect(() => {
    const total = socratesQuestions.length + generalQuestions.length + (initialMode === "ayush" ? ayushQuestions.length : 0);
    const answered = Object.keys(answers).length;
    setCompleteness(total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0);
  }, [answers, socratesQuestions, generalQuestions, ayushQuestions, initialMode]);

  // Get current question set and active question
  const getCurrentQuestions = (): IntakeQuestion[] => {
    switch (currentPhase) {
      case "chief_complaint": return [];
      case "socrates": return socratesQuestions;
      case "general": return generalQuestions;
      case "ayush": return ayushQuestions;
      case "review": return [];
      default: return [];
    }
  };

  const activeQuestions = getCurrentQuestions();
  const activeQuestion = activeQuestions[currentQuestionIdx];

  // Handle chief complaint selection
  const handleChiefComplaintSelect = (complaintId: string) => {
    setChiefComplaint(complaintId);
    setCurrentPhase("socrates");
    setCurrentQuestionIdx(0);
  };

  // Handle answer submission
  const handleAnswerSubmit = async () => {
    if (!activeQuestion || !sessionId) return;
    setSubmitting(true);

    let answer: unknown;
    if (activeQuestion.type === "single_choice") {
      answer = selectedOptions[0] || "";
    } else if (activeQuestion.type === "multiple_choice") {
      answer = selectedOptions;
    } else if (activeQuestion.type === "scale") {
      answer = scaleValue;
    } else {
      answer = voice.transcript || freeText;
    }

    try {
      const result = await submitIntakeAnswer(
        sessionId,
        activeQuestion.id,
        answer,
        currentPhase === "socrates" ? chiefComplaint : undefined,
      );
      setRedFlags(result.redFlags || []);
      setAnswers((prev) => ({ ...prev, [activeQuestion.id]: answer }));

      // Move to next question
      if (currentQuestionIdx < activeQuestions.length - 1) {
        setCurrentQuestionIdx((p) => p + 1);
      } else {
        // Move to next phase
        if (currentPhase === "socrates") {
          setCurrentPhase(initialMode === "ayush" ? "ayush" : "general");
          setCurrentQuestionIdx(0);
        } else if (currentPhase === "ayush") {
          setCurrentPhase("general");
          setCurrentQuestionIdx(0);
        } else if (currentPhase === "general") {
          setCurrentPhase("review");
        }
      }

      // Reset selections
      setSelectedOptions([]);
      setFreeText("");
      setScaleValue(5);
      voice.setTranscript("");
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Finalize and navigate to summary
  const handleFinalize = async () => {
    setSubmitting(true);
    try {
      await finalizeIntake(sessionId);
      setLocation(`/medikiosk/summary?session=${sessionId}`);
    } catch (err) {
      console.error("Failed to finalize:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle option selection
  const toggleOption = (option: string) => {
    if (activeQuestion?.type === "single_choice") {
      setSelectedOptions([option]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    }
  };

  const { mode: globalMode } = useAyushMode();
  const isAyush = initialMode === "ayush" || globalMode === "ayush";

  const phases = [
    { id: "chief_complaint", label: t("phaseChiefComplaint") },
    { id: "socrates", label: t("phaseSymptomDetails") },
    ...(isAyush ? [{ id: "ayush", label: t("phaseAyushAssessment") }] : []),
    { id: "general", label: t("phaseGeneralHistory") },
    { id: "review", label: t("phaseReview") },
  ];

  const currentPhaseIdx = phases.findIndex((p) => p.id === currentPhase);

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Progress Bar */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setLocation("/medikiosk")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back to MediKiosk
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Progress</span>
              <span className={`text-sm font-black ${isAyush ? "text-cyan-700" : "text-primary"}`}>{completeness}%</span>
            </div>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isAyush ? "bg-gradient-to-r from-cyan-700 to-amber-500" : "bg-gradient-to-r from-primary to-secondary"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {phases.map((phase, i) => (
              <span
                key={phase.id}
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  i <= currentPhaseIdx ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {phase.label}
              </span>
            ))}
          </div>
        </div>

        {/* Red Flags Alert */}
        <AnimatePresence>
          {redFlags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Radio size={16} className="text-destructive animate-pulse" />
                <h4 className="font-bold text-destructive text-sm">⚠ Red Flag Alert</h4>
              </div>
              <p className="text-xs text-destructive/80">
                Priority alert sent to triage staff. Your symptoms require urgent attention.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border rounded-[2rem] p-8 shadow-sm min-h-[500px]"
          >
            {/* Chief Complaint Selection */}
            {currentPhase === "chief_complaint" && (
              <div>
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isAyush ? "bg-cyan-500/10" : "bg-primary/10"}`}>
                    {isAyush ? <Sprout size={28} className="text-cyan-700" /> : <Stethoscope size={28} className="text-primary" />}
                  </div>
                  <h3 className="text-2xl font-extrabold font-[Manrope] mb-2">{t("whatBringsYou")}</h3>
                  <p className="text-muted-foreground">{t("selectSymptom")}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CHIEF_COMPLAINT_OPTIONS.map((complaint) => (
                    <button
                      key={complaint.id}
                      onClick={() => handleChiefComplaintSelect(complaint.id)}
                      className={`p-4 rounded-2xl border text-left transition-all hover:border-primary/30 hover:bg-primary/5 ${
                        chiefComplaint === complaint.id ? "bg-primary/10 border-primary/30" : ""
                      }`}
                    >
                      <span className="text-2xl block mb-2">{complaint.emoji}</span>
                      <span className="font-bold text-sm">{getTranslatedChiefComplaint(complaint.id)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question Phase (SOCRATES, General, AYUSH) */}
            {(currentPhase === "socrates" || currentPhase === "general" || currentPhase === "ayush") && (
              <div>
                {/* Phase Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">
                      {currentPhase === "socrates" ? SOCRATES_ICONS[activeQuestion?.id?.replace("socol_", "") || "site"] || "🔍" : "📋"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {currentPhase === "socrates" ? t("symptomDetails") : currentPhase === "ayush" ? t("ayushAssessment") : t("generalHistory")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("questionOf")} {currentQuestionIdx + 1} / {activeQuestions.length}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                ) : activeQuestion ? (
                  <>
                    {/* Question */}
                    <div className="mb-8">
                      <h4 className="text-xl font-extrabold font-[Manrope] mb-2">
                        {activeQuestion.question}
                      </h4>
                      {activeQuestion.type === "free_text" && (
                        <p className="text-sm text-muted-foreground">{t("typeOrVoice")}</p>
                      )}
                    </div>

                    {/* Options */}
                    {activeQuestion.options && (
                      <div className="space-y-3 mb-8">
                        {activeQuestion.options.map((option) => {
                          const isSelected = selectedOptions.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => toggleOption(option)}
                              className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? "bg-primary/10 border-primary/30 text-primary"
                                  : "bg-muted/30 border hover:border-primary/20"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                              }`}>
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                              <span className="font-semibold text-sm">{option}</span>
                              {activeQuestion.type === "multiple_choice" && isSelected && (
                                <CheckCircle size={16} className="ml-auto text-primary" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Scale Input */}
                    {activeQuestion.type === "scale" && (
                      <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm text-muted-foreground font-bold">1 - {t("mild")}</span>
                          <div className="flex-1 flex items-center gap-2">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                              <button
                                key={val}
                                onClick={() => setScaleValue(val)}
                                className={`flex-1 h-10 rounded-lg font-bold text-sm transition-all ${
                                  scaleValue === val
                                    ? val <= 3
                                      ? "bg-cyan-500 text-white"
                                      : val <= 6
                                        ? "bg-amber-500 text-white"
                                        : "bg-destructive text-white"
                                    : "bg-muted/50 hover:bg-muted"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground font-bold">10 - {t("severe")}</span>
                        </div>
                        <p className="text-center text-sm font-bold text-foreground mt-2">
                          {t("severity")}: <span className={
                            scaleValue <= 3 ? "text-cyan-600" : scaleValue <= 6 ? "text-amber-600" : "text-destructive"
                          }>{scaleValue}/10</span>
                        </p>
                      </div>
                    )}

                    {/* Free Text Input */}
                    {activeQuestion.type === "free_text" && (
                      <div className="mb-8 space-y-4">
                        <textarea
                          value={freeText}
                          onChange={(e) => setFreeText(e.target.value)}
                          placeholder={t("typeAnswer")}
                          className="w-full h-32 px-4 py-3 rounded-xl border bg-background text-base resize-none"
                        />
                      </div>
                    )}

                    {/* Voice Input */}
                    <div className="mb-8 p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Volume2 size={16} className="text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("voiceInput")}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={voice.isRecording ? voice.stopRecording : voice.startRecording}
                          disabled={voice.isProcessing}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                            voice.isRecording
                              ? "bg-destructive text-white animate-pulse"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          {voice.isProcessing ? (
                            <Loader2 className="animate-spin" size={24} />
                          ) : voice.isRecording ? (
                            <MicOff size={24} />
                          ) : (
                            <Mic size={24} />
                          )}
                        </button>
                        <div className="flex-1">
                          {voice.isRecording && (
                            <p className="text-sm font-bold text-destructive animate-pulse">{t("recording")}</p>
                          )}
                          {voice.isProcessing && (
                            <p className="text-sm text-muted-foreground">{t("transcribing")}</p>
                          )}
                          {voice.error && (
                            <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg mt-2">
                              <AlertCircle size={14} className="text-destructive shrink-0" />
                              <p className="text-xs text-destructive">{voice.error}</p>
                            </div>
                          )}
                          {voice.transcript && (
                            <p className="text-sm text-foreground bg-background p-3 rounded-lg border mt-2">
                              &ldquo;{voice.transcript}&rdquo;
                            </p>
                          )}
                          {!voice.isRecording && !voice.isProcessing && !voice.transcript && !voice.error && (
                            <p className="text-sm text-muted-foreground">{t("tapMic")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )}

                {/* Submit Button */}
                {activeQuestion && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        if (currentQuestionIdx > 0) {
                          setCurrentQuestionIdx((p) => p - 1);
                        } else if (currentPhase === "socrates") {
                          setCurrentPhase("chief_complaint");
                        } else if (currentPhase === "ayush") {
                          setCurrentPhase("socrates");
                          setCurrentQuestionIdx(socratesQuestions.length - 1);
                        } else if (currentPhase === "general") {
                          setCurrentPhase(initialMode === "ayush" ? "ayush" : "socrates");
                          setCurrentQuestionIdx(initialMode === "ayush" ? ayushQuestions.length - 1 : socratesQuestions.length - 1);
                        }
                      }}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft size={16} /> {t("previous")}
                    </button>
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={submitting || (
                        activeQuestion.type === "single_choice" && selectedOptions.length === 0
                      )}
                      className="px-8 rounded-xl"
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : currentQuestionIdx === activeQuestions.length - 1 ? (
                        t("nextSection")
                      ) : (
                        t("submitAnswer")
                      )}
                      {!submitting && <ArrowRight className="ml-2" size={16} />}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Review Phase */}
            {currentPhase === "review" && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Eye size={28} className="text-secondary" />
                  </div>
                  <h3 className="text-2xl font-extrabold font-[Manrope] mb-2">{t("reviewAnswers")}</h3>
                  <p className="text-muted-foreground">{t("reviewSubtitle")}</p>
                </div>

                {/* Chief Complaint */}
                <div className="mb-6 p-4 bg-primary/5 border border-primary/15 rounded-xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{t("chiefComplaintLabel")}</p>
                  <p className="font-bold">{getTranslatedChiefComplaint(chiefComplaint)}</p>
                </div>

                {/* Answer Summary */}
                <div className="space-y-4">
                  {Object.entries(answers).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/30 rounded-xl border">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                        {key.replace("socol_", "").replace(/_/g, " ")}
                      </p>
                      <p className="text-sm font-semibold">
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Completeness */}
                <div className="mt-6 p-4 bg-secondary/5 border border-secondary/15 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{t("completenessScore")}</p>
                    <p className="text-lg font-black text-secondary">{completeness}%</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  {completeness < 60 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("considerMoreDetails")}
                    </p>
                  )}
                </div>

                {/* Generate Summary Button */}
                <div className="flex justify-center mt-8">
                  <Button
                    size="lg"
                    onClick={handleFinalize}
                    disabled={submitting}
                    className="px-12 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <CheckCircle className="mr-2" size={20} />
                    )}
                    {submitting ? t("generatingSummary") : t("generateSummary")}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

