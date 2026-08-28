import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Mic, MicOff, Send, Loader2, Volume2, VolumeX,
  BookOpen, MessageCircle, Stethoscope, AlertCircle,
  ChevronDown, User, Sparkles, Leaf, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createAyushChatSession,
  sendAyushChatMessage,
} from "@/lib/ayush-api";

interface AyurBotProps {
  patientId?: string;
  patientName?: string;
  language?: string;
  initialMode?: "education" | "pre_consultation" | "practitioner";
  onExtractedData?: (data: Record<string, unknown>) => void;
  compact?: boolean;
  embedded?: boolean;
}

interface ChatMessage {
  id: string;
  role: "patient" | "bot";
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  category?: string;
}

const MODE_CONFIG = {
  education: {
    title: "AyurBot — Learn",
    subtitle: "Ayurvedic Education",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  pre_consultation: {
    title: "AyurBot — Assessment",
    subtitle: "Pre-Consultation Assistant",
    icon: Stethoscope,
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  practitioner: {
    title: "AyurBot — Assistant",
    subtitle: "Practitioner Mode",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
};

export function AyurBot({
  patientId = "PT-001",
  patientName = "Patient",
  language = "en",
  initialMode = "pre_consultation",
  onExtractedData,
  compact = false,
  embedded = false,
}: AyurBotProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize session
  useEffect(() => {
    const init = async () => {
      try {
        const session = await createAyushChatSession({
          patientId,
          patientName,
          language,
          mode,
        });
        setSessionId(session.sessionId);
        setMessages([{
          id: "greeting",
          role: "bot",
          content: session.greeting,
          timestamp: new Date().toISOString(),
          suggestedActions: mode === "education"
            ? ["Explain Prakriti", "Explain Agni", "Start Assessment"]
            : mode === "pre_consultation"
              ? ["Start Assessment", "Explain Terms First"]
              : ["Show Previous Records", "Show Timeline"],
        }]);
      } catch {
        setError("Failed to connect to AyurBot. Please try again.");
      }
    };
    init();
  }, [patientId, patientName, language, mode]);

  // Send message
  const handleSend = async (text?: string) => {
    const msg = text || inputText.trim();
    if (!msg || !sessionId) return;

    const patientMsg: ChatMessage = {
      id: `p-${Date.now()}`,
      role: "patient",
      content: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, patientMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await sendAyushChatMessage(sessionId, msg);
      const botMsg: ChatMessage = {
        id: response.messageId,
        role: "bot",
        content: response.message,
        timestamp: new Date().toISOString(),
        suggestedActions: response.suggestedActions,
        category: response.category,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (response.extractedData && onExtractedData) {
        onExtractedData(response.extractedData);
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "I'm having trouble responding. Please try again.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice recording
  const toggleVoiceRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus" : "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        // For demo, use the transcript placeholder
        handleSend("(Voice input captured — transcription processing...)");
      };
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone access denied. Please allow microphone access.");
    }
  };

  // Text-to-speech
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#⚠️✅]/g, "").substring(0, 500));
      utterance.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-US";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const config = MODE_CONFIG[mode];
  const ModeIcon = config.icon;

  return (
    <div className={`flex flex-col ${compact ? "h-[500px]" : embedded ? "h-full" : "h-[700px]"} bg-card border rounded-2xl overflow-hidden shadow-lg`}>
      {/* Header */}
      <div className={`shrink-0 bg-gradient-to-r ${config.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Leaf size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{config.title}</h3>
              <p className="text-[10px] uppercase tracking-wider opacity-80">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const current = messages[messages.length - 1];
                if (current?.role === "bot") speakText(current.content);
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Read last message"
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ModeIcon size={16} />
              </button>
              {showModeSelector && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-xl shadow-xl z-50 overflow-hidden">
                  {(["education", "pre_consultation", "practitioner"] as const).map((m) => {
                    const Cfg = MODE_CONFIG[m];
                    const Ico = Cfg.icon;
                    return (
                      <button
                        key={m}
                        onClick={() => { setMode(m); setShowModeSelector(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors text-sm ${mode === m ? "bg-primary/5 font-bold" : ""}`}
                      >
                        <Ico size={16} className={mode === m ? "text-primary" : "text-muted-foreground"} />
                        <div>
                          <p className="font-semibold">{Cfg.title}</p>
                          <p className="text-[10px] text-muted-foreground">{Cfg.subtitle}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${msg.role === "patient" ? "order-2" : ""}`}>
              {msg.role === "bot" && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Leaf size={12} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AyurBot</span>
                </div>
              )}
              <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "patient"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : `${config.bgLight} border ${config.borderColor} rounded-bl-md`
              }`}>
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-2" : ""}>
                    {line.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={j}>{part.slice(2, -2)}</strong>
                        : part,
                    )}
                  </p>
                ))}
              </div>

              {/* Suggested Actions */}
              {msg.role === "bot" && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestedActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleSend(action)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${
                        config.bgLight} ${config.borderColor} hover:opacity-80`}
                    >
                      {action}
                      <ArrowRight size={10} />
                    </button>
                  ))}
                </div>
              )}

              {/* Bot message actions */}
              {msg.role === "bot" && (
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => speakText(msg.content)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Listen"
                  >
                    <Volume2 size={12} />
                  </button>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Loader2 size={12} className="text-white animate-spin" />
            </div>
            <div className={`px-3 py-2 rounded-xl ${config.bgLight} border ${config.borderColor}`}>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t p-3 bg-background/50">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceRecording}
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive text-white animate-pulse"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isRecording ? "Listening..." : "Type your message..."}
            className="flex-1 h-10 px-4 rounded-xl border bg-background text-sm"
            disabled={isRecording}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            size="icon"
            className="shrink-0 w-10 h-10 rounded-xl"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[10px] text-muted-foreground">
            ⚠️ Educational only. Not medical advice.
          </p>
          <p className="text-[10px] text-muted-foreground font-semibold">
            {mode === "education" ? "📚 Education" : mode === "pre_consultation" ? "🏥 Assessment" : "👨‍⚕️ Practitioner"}
          </p>
        </div>
      </div>
    </div>
  );
}
