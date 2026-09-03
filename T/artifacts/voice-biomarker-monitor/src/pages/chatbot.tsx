import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "wouter";
import { AppLayout } from "@/components/layout";
import {
  MessageSquare, Send, Loader2, Bot, User, Heart, Leaf,
  ArrowLeft, Sparkles, AlertCircle, Volume2, Mic, MicOff, Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/language";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  transcribeAudio,
  type ChatMessage,
} from "@/lib/api";

const CHATBOT_INFO: Record<string, Record<string, { title: string; subtitle: string; icon: string; color: string; gradient: string; description: string; topics: string[] }>> = {
  general: {
    en: {
      title: "General Health Assistant",
      subtitle: "Ask about symptoms, medications, diet & nutrition",
      icon: "🩺",
      color: "emerald",
      gradient: "from-emerald-600 to-teal-500",
      description: "I can help you with general health questions, symptom assessment, medication information, and lifestyle guidance. I'm an AI assistant — always consult a doctor for diagnosis and treatment.",
      topics: ["Fever & Infections", "Diabetes", "Blood Pressure", "Headaches", "Diet & Nutrition", "When to see a doctor"],
    },
    hi: {
      title: "सामान्य स्वास्थ्य सहायक",
      subtitle: "लक्षणों, दवाओं, आहार और पोषण के बारे में पूछें",
      icon: "🩺",
      color: "emerald",
      gradient: "from-emerald-600 to-teal-500",
      description: "मैं सामान्य स्वास्थ्य प्रश्नों, लक्षण मूल्यांकन, दवा जानकारी और जीवनशैली मार्गदर्शन में मदद कर सकता हूं। मैं एक AI सहायक हूं — निदान और उपचार के लिए हमेशा डॉक्टर से परामर्श करें।",
      topics: ["बुखार और संक्रमण", "मधुमेह", "रक्तचाप", "सिरदर्द", "आहार और पोषण", "कब डॉक्टर को दिखाएं"],
    },
  },
  ayush: {
    en: {
      title: "AYUSH Ayurvedic Assistant",
      subtitle: "Prakriti, Doshas, Herbs & Ayurvedic wellness",
      icon: "🌿",
      color: "amber",
      gradient: "from-amber-600 to-orange-500",
      description: "I provide Ayurvedic health guidance based on classical principles — Prakriti (constitution), Vikriti (imbalance), Agni (digestive fire), and herbal remedies. Always consult a qualified Vaidya for personalized treatment.",
      topics: ["Prakriti Assessment", "Dosha Balance", "Agni & Digestion", "Ayurvedic Herbs", "Dinacharya (Daily Routine)", "Ahara-Vihara (Diet & Lifestyle)"],
    },
    hi: {
      title: "आयुर्वेद सहायक",
      subtitle: "प्रकृति, दोष, जड़ी-बूटियाँ और आयुर्वेदिक कल्याण",
      icon: "🌿",
      color: "amber",
      gradient: "from-amber-600 to-orange-500",
      description: "मैं शास्त्रीय सिद्धांतों पर आधारित आयुर्वेदिक स्वास्थ्य मार्गदर्शन प्रदान करता हूं — प्रकृति, विकृति, अग्नि और जड़ी-बूटी उपचार। व्यक्तिगत उपचार के लिए एक योग्य वैद्य से परामर्श करें।",
      topics: ["प्रकृति मूल्यांकन", "दोष संतुलन", "अग्नि और पाचन", "आयुर्वेदिक जड़ी-बूटियाँ", "दिनचर्या", "आहार-विहार"],
    },
  },
};

const CHAT_STORAGE_PREFIX = "medikiosk.chat.";

function getChatStorageKey(patientId: string, chatType: string) {
  return `${CHAT_STORAGE_PREFIX}${patientId}.${chatType}`;
}

function loadChatHistory(patientId: string, chatType: string): { sessionId: string; messages: ChatMessage[] } | null {
  try {
    const raw = localStorage.getItem(getChatStorageKey(patientId, chatType));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveChatHistory(patientId: string, chatType: string, sessionId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(getChatStorageKey(patientId, chatType), JSON.stringify({ sessionId, messages }));
  } catch { /* ignore quota errors */ }
}

function clearChatHistory(patientId: string, chatType: string) {
  try {
    localStorage.removeItem(getChatStorageKey(patientId, chatType));
  } catch { /* ignore */ }
}

export default function ChatbotPage() {
  const params = useParams();
  const chatType = (params.type as "general" | "ayush") || "general";
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevChatTypeRef = useRef(chatType);
  const loadedFromStorageRef = useRef(false);
  const chatTypeChangedRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Build info with translated subtitle and description
  const rawInfo = CHATBOT_INFO[chatType]?.[language] || CHATBOT_INFO[chatType]?.["en"] || CHATBOT_INFO.general.en;
  const info = {
    ...rawInfo,
    subtitle: chatType === "ayush" ? t("chat.subtitle.ayush") : t("chat.subtitle.general"),
    description: rawInfo.description,
  };

  // Reset state when chatType changes (not on mount)
  useEffect(() => {
    if (prevChatTypeRef.current !== chatType) {
      prevChatTypeRef.current = chatType;
      loadedFromStorageRef.current = false;
      chatTypeChangedRef.current = true;
      setSessionId(null);
      setMessages([]);
      setInitialized(false);
      setError(null);
      setInput("");
    }
  }, [chatType]);

  // Initialize chat session — try localStorage first, otherwise create new
  useEffect(() => {
    if (!user || initialized) return;
    if (loadedFromStorageRef.current) return;
    loadedFromStorageRef.current = true;

    // Try restoring from localStorage
    const stored = loadChatHistory(user.patientId, chatType);
    if (stored && stored.sessionId && stored.messages.length > 0) {
      // Verify the session still exists on the server
      getChatHistory(stored.sessionId)
        .then(() => {
          // Session is valid — restore it
          setSessionId(stored.sessionId);
          setMessages(stored.messages);
          setInitialized(true);
          setLoading(false);
        })
        .catch(() => {
          // Session was lost (server restarted) — clear and create new
          clearChatHistory(user.patientId, chatType);
          createNewSession();
        });
      return;
    }

    // No stored history — create a fresh session
    createNewSession();
  }, [user, chatType, initialized]);

  function createNewSession() {
    if (!user) return;
    setLoading(true);
    createChatSession(user.patientId, chatType, language)
      .then((res) => {
        setSessionId(res.sessionId);
        setMessages([res.greeting]);
        setInitialized(true);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    // Skip save on the render where chatType just changed — the messages
    // still belong to the previous chatbot and must not leak into the new key.
    if (chatTypeChangedRef.current) {
      chatTypeChangedRef.current = false;
      return;
    }
    if (user && sessionId && messages.length > 0) {
      saveChatHistory(user.patientId, chatType, sessionId, messages);
    }
  }, [user, chatType, sessionId, messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !sessionId || loading) return;

    setInput("");
    setLoading(true);

    // Optimistic add user message
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendChatMessage(sessionId, text, language);
      // Replace optimistic message and add response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== userMsg.id),
        res.userMessage,
        res.assistantMessage,
      ]);
    } catch (err: any) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      // If 404, session was lost — create new one and retry
      if (err?.message?.includes("404") || err?.message?.includes("Session not found") || err?.message?.includes("Failed to send message")) {
        clearChatHistory(user!.patientId, chatType);
        try {
          const newSession = await createChatSession(user!.patientId, chatType, language);
          setSessionId(newSession.sessionId);
          setMessages([newSession.greeting]);
          // Retry sending the message
          const retryRes = await sendChatMessage(newSession.sessionId, text, language);
          setMessages([newSession.greeting, retryRes.userMessage, retryRes.assistantMessage]);
        } catch {
          setError(t("chat.sendError"));
        }
      } else {
        setError(t("chat.sendError"));
      }
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());

        if (audioBlob.size < 100) return; // Too small, ignore

        setIsTranscribing(true);
        try {
          const result = await transcribeAudio(audioBlob, language);
          if (result.transcript) {
            setInput((prev) => (prev ? prev + " " + result.transcript : result.transcript));
          }
        } catch {
          // Transcription failed silently
        }
        setIsTranscribing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // Microphone access denied or not available
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isAyush = chatType === "ayush";

  return (
    <AppLayout userType={user?.role === "clinician" ? "clinician" : "patient"}>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className={`shrink-0 rounded-t-2xl bg-gradient-to-r ${info.gradient} p-5 text-white`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              {info.icon}
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-lg">{info.title}</h2>
              <p className="text-white/80 text-xs">{info.subtitle}</p>
            </div>
            {isAyush && (
              <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5 text-xs font-bold">
                <Leaf size={14} /> AYUSH Mode
              </div>
            )}
          </div>
        </div>

        {/* Quick topic chips */}
        {messages.length <= 1 && (
          <div className="shrink-0 bg-card border border-t-0 rounded-none px-5 py-3">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
              {t("chat.quickTopics")}
            </p>
            <div className="flex flex-wrap gap-2">
              {info.topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => { setInput(topic); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border hover:shadow-sm ${
                    isAyush
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100"
                      : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="shrink-0 bg-amber-50 dark:bg-amber-950/20 border-x border-t border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
            {t("chat.disclaimer")}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-muted/30 border-x px-4 py-4 space-y-4 min-h-0">
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">✕</button>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
                  {isAyush ? <Leaf size={16} /> : <Bot size={16} />}
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-md"
                    : "bg-card border rounded-bl-md shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/🔹 /g, '<br/>🔹 ')
                    .replace(/🌿 /g, '<br/>🌿 ')
                    .replace(/⚠️ /g, '<br/>⚠️ ')
                    .replace(/🌅 /g, '<br/>🌅 ')
                    .replace(/🧘 /g, '<br/>🧘 ')
                    .replace(/🍽️ /g, '<br/>🍽️ ')
                    .replace(/🛁 /g, '<br/>🛁 ')
                    .replace(/😴 /g, '<br/>😴 ')
                    .replace(/🥗 /g, '<br/>🥗 ')
                    .replace(/🏃 /g, '<br/>🏃 ')
                    .replace(/⚖️ /g, '<br/>⚖️ ')
                    .replace(/🚫 /g, '<br/>🚫 ')
                }} />
              </div>
              {msg.role === "user" && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center text-white shrink-0 shadow-md">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
                {isAyush ? <Leaf size={16} /> : <Bot size={16} />}
              </div>
              <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs font-bold">
                    {t("chat.thinking")}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 bg-card border border-t-0 rounded-b-2xl p-3">
          <div className="flex items-center gap-2">
            {/* Voice input button */}
            <Button
              onClick={toggleRecording}
              disabled={loading || !initialized || isTranscribing}
              variant={isRecording ? "destructive" : "outline"}
              className={`h-12 w-12 rounded-xl shrink-0 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : isTranscribing
                  ? "border-amber-300 bg-amber-50 dark:bg-amber-950/30"
                  : ""
              }`}
              title={isRecording ? t("chat.voice.stop") : t("chat.voice.start")}
            >
              {isTranscribing ? (
                <Loader2 size={18} className="animate-spin text-amber-600" />
              ) : isRecording ? (
                <Square size={18} />
              ) : (
                <Mic size={18} />
              )}
            </Button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording
                  ? t("chat.voice.listening")
                  : isTranscribing
                  ? t("chat.voice.transcribing")
                  : isAyush
                  ? t("chat.placeholder.ayush")
                  : t("chat.placeholder.general")
              }
              disabled={loading || !initialized}
              className="flex-1 h-12 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading || !initialized}
              className={`h-12 w-12 rounded-xl bg-gradient-to-r ${info.gradient} hover:opacity-90 shadow-lg`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
