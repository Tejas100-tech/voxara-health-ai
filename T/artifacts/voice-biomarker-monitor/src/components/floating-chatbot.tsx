import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Mic, MicOff, Send, Loader2, Volume2, VolumeX,
  X, Minimize2, Leaf, Stethoscope, HeartPulse, AlertCircle,
  ChevronDown, Sparkles, BookOpen,
} from "lucide-react";
import {
  createAyushChatSession,
  sendAyushChatMessage,
  createHealthChatSession,
  sendHealthChatMessage,
} from "@/lib/ayush-api";
import { useAuth } from "@/lib/auth";
import { useAyushMode } from "@/lib/ayush-mode";
import { getTranslations } from "@/lib/medikiosk-i18n";

interface ChatMessage {
  id: string;
  role: "patient" | "bot";
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  category?: string;
}

// ─── Mode Configurations ───────────────────────────────────────────────────

const AYUSH_MODES = [
  { key: "education" as const, label: "Learn Ayurveda", icon: BookOpen, emoji: "📚" },
  { key: "pre_consultation" as const, label: "Assessment", icon: Stethoscope, emoji: "🩺" },
  { key: "practitioner" as const, label: "Practitioner", icon: Sparkles, emoji: "✨" },
];

const HEALTH_MODES = [
  { key: "general" as const, label: "General Health", icon: HeartPulse, emoji: "❤️" },
  { key: "symptom_checker" as const, label: "Symptom Checker", icon: Stethoscope, emoji: "🩺" },
  { key: "health_education" as const, label: "Health Info", icon: BookOpen, emoji: "📚" },
];

export function FloatingChatbot() {
  const { mode: ayushMode } = useAyushMode();
  const { user } = useAuth();
  const isAyush = ayushMode === "ayush";

  // ─── State ─────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  // Independent message & session state per mode so conversations don't leak
  const [ayushMessages, setAyushMessages] = useState<ChatMessage[]>([]);
  const [healthMessages, setHealthMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [ayushSessionId, setAyushSessionId] = useState<string | null>(null);
  const [healthSessionId, setHealthSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [ayushSubMode, setAyushSubMode] = useState<"education" | "pre_consultation" | "practitioner">("education");
  const [healthSubMode, setHealthSubMode] = useState<"general" | "symptom_checker" | "health_education">("general");

  // Derived values — pick the right store for the current mode
  const messages = isAyush ? ayushMessages : healthMessages;
  const setMessages = isAyush ? setAyushMessages : setHealthMessages;
  const sessionId = isAyush ? ayushSessionId : healthSessionId;
  const setSessionId = isAyush ? setAyushSessionId : setHealthSessionId;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const tr = getTranslations();
  const currentAyushMode = AYUSH_MODES.find((m) => m.key === ayushSubMode) || AYUSH_MODES[0];
  const currentHealthMode = HEALTH_MODES.find((m) => m.key === healthSubMode) || HEALTH_MODES[0];

  // ─── Dynamic Theme ─────────────────────────────────────────────────────
  const theme = useMemo(() => isAyush ? {
    gradient: "from-[#54ACBF] to-[#26658C]",
    buttonGradient: "from-[#54ACBF] to-[#26658C]",
    buttonShadow: "shadow-[#54ACBF]/30",
    headerBg: "bg-gradient-to-r from-[#54ACBF] to-[#26658C]",
    badge: "bg-[#A7EBF2]/20 text-[#023859] dark:bg-[#A7EBF2]/10 dark:text-[#A7EBF2]",
    botLabel: tr.chatAyurBot,
    botLabelColor: "text-[#54ACBF] dark:text-[#A7EBF2]",
    botDot: "bg-[#54ACBF]",
    suggestedBg: "bg-[#A7EBF2]/10 text-[#023859] dark:bg-[#A7EBF2]/10 dark:text-[#A7EBF2] hover:bg-[#A7EBF2]/20 dark:hover:bg-[#A7EBF2]/20",
    leafIcon: true,
  } : {
    gradient: "from-blue-500 to-indigo-600",
    buttonGradient: "from-blue-500 to-indigo-600",
    buttonShadow: "shadow-blue-500/30",
    headerBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    botLabel: tr.chatHealthBot,
    botLabelColor: "text-blue-600 dark:text-blue-400",
    botDot: "bg-blue-500",
    suggestedBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50",
    leafIcon: false,
  }, [isAyush]);

  // ─── Helpers ───────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // No state reset needed on mode change — each mode has its own state store

  // ─── Session Creation ──────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !sessionId && !isMinimized) {
      (async () => {
        try {
          const lang = isAyush ? "hi" : "en";
          let result;
          if (isAyush) {
            result = await createAyushChatSession({
              patientId: user?.patientId || "PT-GUEST",
              patientName: user?.name || "Guest",
              language: lang,
              mode: ayushSubMode,
            });
          } else {
            result = await createHealthChatSession({
              patientId: user?.patientId || "PT-GUEST",
              patientName: user?.name || "Guest",
              language: lang,
              mode: healthSubMode,
            });
          }
          setSessionId(result.sessionId);
          setMessages([{
            id: "welcome",
            role: "bot",
            content: result.greeting,
            timestamp: new Date().toISOString(),
            suggestedActions: isAyush
              ? ["Start Assessment", "Explain Prakriti", "Talk to Practitioner"]
              : ["Common Symptoms", "Chronic Conditions", "Diet & Nutrition", "Exercise Tips"],
          }]);
        } catch {
          setMessages([{
            id: "welcome",
            role: "bot",
            content: isAyush
              ? "Namaste! 🙏 I'm MediKiosk AyurBot. How can I help you with Ayurveda today?"
              : "Hello! I'm your Health Assistant. How can I help you with your health today?",
            timestamp: new Date().toISOString(),
            suggestedActions: isAyush
              ? ["Start Assessment", "Explain Prakriti", "Talk to Practitioner"]
              : ["Common Symptoms", "Chronic Conditions", "Diet & Nutrition", "Exercise Tips"],
          }]);
        }
      })();
    }
  }, [isOpen, sessionId, isMinimized, isAyush, ayushSubMode, healthSubMode, user]);

  // ─── Send Message ──────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "patient",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let result;
      if (isAyush) {
        if (sessionId) {
          result = await sendAyushChatMessage(sessionId, text.trim());
        } else {
          const session = await createAyushChatSession({
            patientId: user?.patientId || "PT-GUEST",
            patientName: user?.name || "Guest",
            language: "hi",
            mode: ayushSubMode,
          });
          setSessionId(session.sessionId);
          result = await sendAyushChatMessage(session.sessionId, text.trim());
        }
      } else {
        if (sessionId) {
          result = await sendHealthChatMessage(sessionId, text.trim());
        } else {
          const session = await createHealthChatSession({
            patientId: user?.patientId || "PT-GUEST",
            patientName: user?.name || "Guest",
            language: "en",
            mode: healthSubMode,
          });
          setSessionId(session.sessionId);
          result = await sendHealthChatMessage(session.sessionId, text.trim());
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "bot",
        content: result.message,
        timestamp: new Date().toISOString(),
        suggestedActions: result.suggestedActions,
        category: result.category,
      };
      setMessages((prev) => [...prev, botMsg]);
      setHasUnread(true);

      if (isSpeaking && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(result.message);
        utterance.lang = isAyush ? "hi-IN" : "en-IN";
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, isAyush, ayushSubMode, healthSubMode, user, isSpeaking]);

  // ─── Voice Input ───────────────────────────────────────────────────────
  const handleVoiceInput = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      alert("Microphone recording requires a secure connection (HTTPS or localhost).");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1];
          if (base64) {
            setIsLoading(true);
            try {
              const res = await fetch("/api/ai/transcribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioBase64: base64, mimeType: "audio/webm" }),
              });
              const data = await res.json();
              if (data.transcript) sendMessage(data.transcript);
              else setIsLoading(false);
            } catch {
              setIsLoading(false);
            }
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      // Mic permission denied
    }
  }, [isRecording, sendMessage]);

  // ─── Suggested Actions ─────────────────────────────────────────────────
  const handleSuggestedAction = useCallback((action: string) => {
    const a = action.toLowerCase();
    if (a.includes("start assessment") || a.includes("begin")) sendMessage("start assessment");
    else if (a.includes("explain") || a.includes("learn more")) sendMessage(action);
    else if (a.includes("practitioner") || a.includes("talk to")) sendMessage("talk to practitioner");
    else sendMessage(action);
  }, [sendMessage]);

  const handleModeChange = useCallback((newMode: string) => {
    if (isAyush) {
      setAyushSubMode(newMode as typeof ayushSubMode);
      setAyushSessionId(null);
      setAyushMessages([]);
    } else {
      setHealthSubMode(newMode as typeof healthSubMode);
      setHealthSessionId(null);
      setHealthMessages([]);
    }
    setShowModeSelect(false);
  }, [isAyush]);

  // ─── Render ────────────────────────────────────────────────────────────
  const subModes = isAyush ? AYUSH_MODES : HEALTH_MODES;
  const currentMode = isAyush ? currentAyushMode : currentHealthMode;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => { setIsOpen(true); setHasUnread(false); }}
            className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br ${theme.buttonGradient} text-white shadow-xl ${theme.buttonShadow} flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer`}
          >
            {isAyush ? <Leaf size={24} /> : <HeartPulse size={24} />}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: isMinimized ? "auto" : "min(560px, calc(100vh - 6rem))" }}
          >
            {/* Header */}
            <div className={`shrink-0 ${theme.headerBg} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    {isAyush ? <Leaf size={20} /> : <HeartPulse size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{isAyush ? "MediKiosk AyurBot" : "MediKiosk HealthBot"}</h3>
                    <p className="text-[10px] text-white/70 font-medium">{currentMode.emoji} {isAyush ? (ayushSubMode === "education" ? tr.chatLearnAyurveda : ayushSubMode === "pre_consultation" ? tr.chatAssessment : tr.chatPractitioner) : (healthSubMode === "general" ? tr.chatGeneralHealth : healthSubMode === "symptom_checker" ? tr.chatSymptomChecker : tr.chatHealthInfo)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                    title={isSpeaking ? "Mute" : "Read aloud"}
                  >
                    {isSpeaking ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>
                  <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                    <Minimize2 size={16} />
                  </button>
                  <button onClick={() => { setIsOpen(false); setIsMinimized(false); }} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Mode Selector */}
              {!isMinimized && (
                <div className="mt-3 relative">
                  <button
                    onClick={() => setShowModeSelect(!showModeSelect)}
                    className="flex items-center gap-2 text-xs bg-white/15 hover:bg-white/25 rounded-lg px-3 py-1.5 transition-colors font-medium"
                  >
                    {currentMode.emoji} {currentMode.label}
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {showModeSelect && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border p-1 z-10 min-w-[180px]"
                      >
                        {subModes.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = isAyush ? (ayushSubMode === opt.key) : (healthSubMode === opt.key);
                          return (
                            <button
                              key={opt.key}
                              onClick={() => handleModeChange(opt.key)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                isSelected
                                  ? isAyush ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              <Icon size={14} />
                              {opt.emoji} {opt.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "patient"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}>
                        {msg.role === "bot" && (
                          <div className="flex items-center gap-1.5 mb-1">
                            {isAyush ? (
                              <Leaf size={10} className="text-cyan-500" />
                            ) : (
                              <HeartPulse size={10} className="text-blue-500" />
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.botLabelColor}`}>
                              {theme.botLabel}
                            </span>
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {msg.suggestedActions.map((action) => (
                              <button
                                key={action}
                                onClick={() => handleSuggestedAction(action)}
                                className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-colors ${theme.suggestedBg}`}
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        )}

                        {msg.category === "safety" && (
                          <div className="flex items-center gap-1.5 mt-2 text-red-600 dark:text-red-400">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-bold uppercase">Safety Alert</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                        <Loader2 size={14} className={`animate-spin ${isAyush ? "text-cyan-500" : "text-blue-500"}`} />
                        <span className="text-xs text-muted-foreground">{tr.chatThinking}</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVoiceInput}
                      className={`shrink-0 p-2.5 rounded-xl transition-all ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
                      }`}
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage(input);
                        }
                      }}
                      placeholder={isRecording ? "..." : isAyush ? tr.chatPlaceholderAyush : tr.chatPlaceholderHealth}
                      className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                      disabled={isLoading}
                    />

                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className={`shrink-0 p-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-gradient-to-r ${theme.gradient}`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
