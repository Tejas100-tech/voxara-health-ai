import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "./language";
import type { LanguageCode } from "./translations";

// ── Accessibility (elderly / low-literacy) support ────────────────────────
// - Simple Mode: scales the whole UI up (bigger text + touch targets) and
//   turns on high-contrast focus rings.
// - Speak: reads on-screen text aloud. It prefers the Sarvam cloud TTS
//   endpoint (/api/tts) so audio prompts sound consistent on ANY device in
//   12 Indian languages; falls back to the browser's speechSynthesis.
// - First-run guided tour state (icon-driven walkthrough, spoken aloud).

const SIMPLE_KEY = "medikiosk.a11y.simple";
const HC_KEY = "medikiosk.a11y.highcontrast";
const AUDIO_MODE_KEY = "medikiosk.a11y.audiomode";
const TOUR_KEY = "medikiosk.a11y.tour.seen.v1";

// App languages with a cloud (Sarvam) voice. `hi-en` is read by the English
// (en-IN) voice which handles romanized Hinglish well.
const CLOUD_LANGS: ReadonlySet<string> = new Set([
  "en", "hi", "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "hi-en",
]);

// Language → best Indian voice locale for the local speechSynthesis fallback
const VOICE_LOCALE: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  as: "bn-IN",
  ur: "hi-IN",
  sa: "hi-IN",
  ne: "hi-IN",
  ks: "hi-IN",
  si: "en-IN",
  "hi-en": "hi-IN",
};

function pickVoice(code: LanguageCode): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const target = VOICE_LOCALE[code] || "en-IN";
  const prefix = target.split("-")[0].toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang.toLowerCase() === target.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
    voices[0] ||
    null
  );
}

interface AccessibilityContextValue {
  simpleMode: boolean;
  toggleSimpleMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  audioMode: boolean;
  toggleAudioMode: () => void;
  speaking: boolean;
  speak: (text: string, opts?: { rate?: number; lang?: LanguageCode }) => void;
  stopSpeaking: () => void;
  tourSeen: boolean;
  tourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
  simpleMode: false,
  toggleSimpleMode: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
  audioMode: false,
  toggleAudioMode: () => {},
  speaking: false,
  speak: () => {},
  stopSpeaking: () => {},
  tourSeen: false,
  tourOpen: false,
  openTour: () => {},
  closeTour: () => {},
});

/** Small LRU for synthesized audio so repeated prompts don't re-hit the API */
const audioCache = new Map<string, string>();
const AUDIO_CACHE_MAX = 40;

function cachePut(key: string, url: string) {
  audioCache.delete(key);
  audioCache.set(key, url);
  if (audioCache.size > AUDIO_CACHE_MAX) {
    const oldest = audioCache.keys().next().value as string | undefined;
    if (oldest) {
      const old = audioCache.get(oldest);
      audioCache.delete(oldest);
      if (old) URL.revokeObjectURL(old);
    }
  }
}

function appLangForCloud(lang: LanguageCode): string {
  return lang === "hi-en" ? "en" : lang;
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIMPLE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [speaking, setSpeaking] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HC_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [audioMode, setAudioMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUDIO_MODE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [tourSeen, setTourSeen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(TOUR_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Playback resources
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakIdRef = useRef(0); // bumped on stop/speak → stale async plays are ignored

  // Keep voices fresh (some browsers load them asynchronously)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const warm = () => window.speechSynthesis.getVoices();
    warm();
    window.speechSynthesis.onvoiceschanged = warm;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Simple Mode scales the whole UI (html font-size drives Tailwind rem sizing)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-simple", simpleMode);
    try {
      localStorage.setItem(SIMPLE_KEY, simpleMode ? "1" : "0");
    } catch {
      /* ignore */
    }
    return () => root.classList.remove("a11y-simple");
  }, [simpleMode]);

  // High-contrast mode (forced light, black on white, strong borders)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-hc", highContrast);
    try {
      localStorage.setItem(HC_KEY, highContrast ? "1" : "0");
    } catch {
      /* ignore */
    }
    return () => root.classList.remove("a11y-hc");
  }, [highContrast]);

  // Audio mode (auto-narrates pages for visually impaired users)
  useEffect(() => {
    try {
      localStorage.setItem(AUDIO_MODE_KEY, audioMode ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [audioMode]);

  const toggleSimpleMode = useCallback(() => setSimpleMode((v) => !v), []);
  const toggleHighContrast = useCallback(() => setHighContrast((v) => !v), []);
  const toggleAudioMode = useCallback(() => setAudioMode((v) => !v), []);

  const stopSpeaking = useCallback(() => {
    speakIdRef.current += 1; // invalidate any in-flight cloud play
    abortRef.current?.abort();
    abortRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    utterRef.current = null;
    setSpeaking(false);
  }, []);

  /** Local browser speechSynthesis (fallback + languages without a cloud voice) */
  const localSpeak = useCallback(
    (text: string, langCode: LanguageCode, rate: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeaking(false);
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = VOICE_LOCALE[langCode] || "en-IN";
      const voice = pickVoice(langCode);
      if (voice) utter.voice = voice;
      utter.rate = rate;
      utter.pitch = 1;
      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      utterRef.current = utter;
      synth.speak(utter);
    },
    []
  );

  /** Play a cached/object URL via a hidden <audio> element */
  const playAudioUrl = useCallback(
    (url: string, speakId: number) =>
      new Promise<void>((resolve, reject) => {
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.onended = () => {
          if (speakId === speakIdRef.current) setSpeaking(false);
          resolve();
        };
        audio.onerror = () => {
          setSpeaking(false);
          reject(new Error("audio playback error"));
        };
        audio.src = url;
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch((e) => {
            // Autoplay policy or interrupted playback → let caller fall back
            audio.onended = null;
            audio.onerror = null;
            reject(e);
          });
        } else {
          setSpeaking(true);
        }
      }),
    []
  );

  /** Fetch audio from the backend cloud TTS endpoint */
  const cloudSpeak = useCallback(
    async (text: string, langCode: LanguageCode, rate: number, speakId: number) => {
      try {
        const cacheKey = `${appLangForCloud(langCode)}|${text}`;
        let url = audioCache.get(cacheKey);

        if (!url) {
          const ctrl = new AbortController();
          abortRef.current = ctrl;
          const resp = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              language: appLangForCloud(langCode),
              pace: rate,
            }),
            signal: ctrl.signal,
          });
          if (resp.status === 422) throw new Error("no-cloud-voice");
          if (!resp.ok) throw new Error(`cloud TTS error ${resp.status}`);
          const json = (await resp.json()) as { audio?: string; mimeType?: string };
          if (!json.audio) throw new Error("cloud TTS empty response");
          const bytes = atob(json.audio);
          const u8 = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) u8[i] = bytes.charCodeAt(i);
          url = URL.createObjectURL(new Blob([u8], { type: json.mimeType || "audio/mpeg" }));
          cachePut(cacheKey, url);
        }

        if (speakId !== speakIdRef.current) return; // user pressed Stop mid-fetch
        await playAudioUrl(url, speakId);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          if (speakId === speakIdRef.current) setSpeaking(false);
          return;
        }
        // Cloud failed (network, no voice, autoplay blocked) → device voices
        if (speakId === speakIdRef.current) localSpeak(text, langCode, rate);
      }
    },
    [localSpeak, playAudioUrl]
  );

  const speak = useCallback(
    (text: string, opts?: { rate?: number; lang?: LanguageCode }) => {
      if (!text) return;
      stopSpeaking();
      const langCode = opts?.lang || language;
      const rate = opts?.rate ?? 0.92; // slightly slower = clearer for elderly users
      const speakId = speakIdRef.current + 1;
      speakIdRef.current = speakId;
      setSpeaking(true);

      if (CLOUD_LANGS.has(langCode)) {
        void cloudSpeak(text, langCode, rate, speakId);
      } else {
        localSpeak(text, langCode, rate);
      }
    },
    [language, stopSpeaking, cloudSpeak, localSpeak]
  );

  const openTour = useCallback(() => {
    stopSpeaking();
    setTourOpen(true);
  }, [stopSpeaking]);

  const closeTour = useCallback(() => {
    stopSpeaking();
    setTourOpen(false);
    setTourSeen(true);
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [stopSpeaking]);

  return (
    <AccessibilityContext.Provider
      value={{
        simpleMode,
        toggleSimpleMode,
        highContrast,
        toggleHighContrast,
        audioMode,
        toggleAudioMode,
        speaking,
        speak,
        stopSpeaking,
        tourSeen,
        tourOpen,
        openTour,
        closeTour,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
