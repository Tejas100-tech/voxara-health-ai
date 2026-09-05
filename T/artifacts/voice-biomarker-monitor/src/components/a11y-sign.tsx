import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { useAccessibility } from "@/lib/accessibility";
import { useLanguage } from "@/lib/language";

// Official ISL dictionaries opened from the sign panel
const ISLRTC_DICT = "https://divyangjan.depwd.gov.in/islrtc/";
const RKMVERI_DICT = "https://indiansignlanguage.org/search-dictionary/";

// ── Sign-language avatar helper (ISL gloss, stretch goal) ─────────────────
// A friendly animated avatar + Indian Sign Language (ISL) gloss chips that
// let a deaf / hard-of-hearing patient ask for common things without typing.
// Each chip animates the avatar and also speaks the phrase (audio channel),
// so the same control works for hearing users too.

type PhraseId = "hello" | "wait" | "yes" | "no" | "thank" | "start" | "pain";

interface Phrase {
  id: PhraseId;
  gloss: string;
  anim: string;
  /** Deep link to the word's sign page where verified; else the A–Z dictionary */
  dictUrl: string;
  copy: Record<string, string>; // language code → spoken line
}

const PHRASES: Phrase[] = [
  {
  id: "hello",
  gloss: "HELLO",
  anim: "hello",
  dictUrl: RKMVERI_DICT,
  copy: {
      en: "Hello! Welcome to MediKiosk.",
      hi: "नमस्ते! मेडीकियोस्क में आपका स्वागत है।",
      ta: "வணக்கம்! மெடிகியோஸ்க்கு வரவேற்கிறோம்.",
      te: "నమస్కారం! మెడికియోస్క్‌కు స్వాగతం.",
      bn: "নমস্কার! মেডিকিয়স্ক-এ স্বাগতম।",
    },
  },
  {
  id: "wait",
  gloss: "PLEASE WAIT",
  anim: "wait",
  dictUrl: "https://indiansignlanguage.org/wait-1/",
  copy: {
      en: "Please wait a moment.",
      hi: "कृपया एक क्षण प्रतीक्षा करें।",
      ta: "சிறிது காத்திருங்கள்.",
      te: "కాసేపు వేచి ఉండండి.",
      bn: "একটু অপেক্ষা করুন।",
    },
  },
  {
  id: "yes",
  gloss: "YES",
  anim: "yes",
  dictUrl: RKMVERI_DICT,
  copy: {
      en: "Yes.",
      hi: "हाँ।",
      ta: "ஆம்.",
      te: "అవును.",
      bn: "হ্যাঁ।",
    },
  },
  {
  id: "no",
  gloss: "NO",
  anim: "no",
  dictUrl: RKMVERI_DICT,
  copy: {
      en: "No.",
      hi: "नहीं।",
      ta: "இல்லை.",
      te: "లేదు.",
      bn: "না।",
    },
  },
  {
  id: "thank",
  gloss: "THANK YOU",
  anim: "thank",
  dictUrl: "https://indiansignlanguage.org/thank-you/",
  copy: {
      en: "Thank you.",
      hi: "धन्यवाद।",
      ta: "நன்றி.",
      te: "ధన్యవాదాలు.",
      bn: "ধন্যবাদ।",
    },
  },
  {
  id: "start",
  gloss: "START",
  anim: "start",
  dictUrl: "https://indiansignlanguage.org/start-1/",
  copy: {
      en: "Let us start now.",
      hi: "चलिए अभी शुरू करते हैं।",
      ta: "இப்போது தொடங்குவோம்.",
      te: "ఇప్పుడు ప్రారంభిద్దాం.",
      bn: "এখন শুরু করা যাক।",
    },
  },
  {
  id: "pain",
  gloss: "PAIN / HURT",
  anim: "pain",
  dictUrl: "https://indiansignlanguage.org/pain/",
  copy: {
      en: "Where does it hurt?",
      hi: "कहाँ दर्द है?",
      ta: "எங்கே வலிக்கிறது?",
      te: "ఎక్కడ నొప్పిగా ఉంది?",
      bn: "কোথায় ব্যথা করছে?",
    },
  },
];

function phraseLine(p: Phrase, lang: string): string {
  return p.copy[lang] || p.copy.en;
}

function AvatarFigure({ animKey }: { animKey: string }) {
  const active = animKey !== "idle";
  return (
    <div className="sig-avatar relative mx-auto w-44 h-40 select-none" aria-hidden>
      {/* head */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-1 w-12 h-12 rounded-full bg-[#F6C8A0] border-2 border-[#26658C]/60 overflow-hidden ${
          active ? (animKey === "no" || animKey === "yes" ? `sign-head-${animKey}` : "") : ""
        }`}
      >
        {/* hair */}
        <div className="absolute top-0 inset-x-0 h-3.5 bg-[#5a3a22] rounded-t-full" />
        {/* eyes */}
        <div className="absolute top-5 left-2.5 w-1.5 h-2 rounded-full bg-[#023859]" />
        <div className="absolute top-5 right-2.5 w-1.5 h-2 rounded-full bg-[#023859]" />
        {/* smile */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-b-full border-b-2 border-[#023859]/70" />
      </div>
      {/* body */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[54px] w-12 h-14 rounded-2xl bg-gradient-to-b from-[#54ACBF] to-[#26658C]" />
      {/* arms (rotating capsules pivoted at the shoulders) */}
      <div className={`arm-l ${active ? `sign-arm-l-${animKey}` : ""}`} />
      <div className={`arm-r ${active ? `sign-arm-r-${animKey}` : ""}`} />
      {/* gloss caption */}
      <div className="absolute -bottom-1 inset-x-0 text-center">
        <span className="inline-block rounded-full bg-[#023859] text-white text-[10px] font-black tracking-widest px-2.5 py-1">
          {animKey.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function SignHelp() {
  const { speak, stopSpeaking, speaking } = useAccessibility();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [animKey, setAnimKey] = useState("idle");

  const play = (p: Phrase) => {
    stopSpeaking();
    setAnimKey(p.id);
    speak(phraseLine(p, language), { lang: language });
    window.setTimeout(() => setAnimKey((cur) => (cur === p.id ? "idle" : cur)), 4200);
  };

  const titleLine =
    (language === "hi" ? "सांकेतिक भाषा सहायता" : language === "ta" ? "சைகை மொழி உதவி" : language === "te" ? "సంకేత భాష సహాయం" : language === "bn" ? "সাংকেতিক ভাষা সাহায্য" : "Sign Language Help (ISL)");

  return (
    <>
      {/* floating trigger */}
      <button
        onClick={() => {
          stopSpeaking();
          setOpen((v) => !v);
          setAnimKey("idle");
        }}
        title={titleLine}
        aria-label={titleLine}
        className={`fixed bottom-4 right-4 z-[80] flex items-center gap-2 rounded-full px-4 py-3 font-bold text-sm shadow-xl transition-all ${
          open ? "bg-[#023859] text-white" : "bg-[#26658C] text-white hover:brightness-110"
        }`}
      >
        <span className="text-lg leading-none">🤟</span>
        <span className="hidden sm:inline">{open ? (language === "hi" ? "बंद करें" : "Close") : (language === "hi" ? "साइन भाषा" : "Sign help")}</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 z-[80] w-[21rem] max-w-[calc(100vw-2rem)] rounded-3xl bg-white dark:bg-[#021B3D] border border-[#54ACBF]/50 shadow-2xl p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-[#023859] dark:text-white text-sm">{titleLine}</h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#A7EBF2]/40 text-[#26658C]"
              aria-label="Close sign help"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-[11px] text-[#26658C]/70 dark:text-cyan-100/60 font-semibold mb-2">
            {language === "hi"
              ? "नीचे दिए चिह्न (ग्लॉस) पर दबाएँ — कहानी सुनाई भी जाएगी।"
              : "Tap a sign — the phrase is also spoken aloud."}
          </p>

          <AvatarFigure animKey={animKey} />

          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {PHRASES.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl border text-[11px] leading-tight transition-all overflow-hidden ${
                  animKey === p.id
                    ? "bg-[#54ACBF] text-white border-transparent"
                    : "border-[#54ACBF]/50 text-[#26658C] dark:text-cyan-200"
                }`}
              >
                <button onClick={() => play(p)} className="w-full px-1 pt-2 pb-0.5 font-black">
                  {p.gloss}
                </button>
                <a
                  href={p.dictUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={language === "hi" ? "असली ISL वीडियो देखें" : "See the real ISL sign video"}
                  className={`flex items-center justify-center gap-1 pb-1.5 text-[9px] font-bold underline underline-offset-1 ${
                    animKey === p.id ? "text-white/90" : "text-[#26658C]/80 dark:text-cyan-300/80"
                  }`}
                >
                  Sign video <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>

          <p className="mt-2 text-[10px] text-[#26658C]/50 dark:text-cyan-100/40 font-semibold text-center">
            {speaking ? (language === "hi" ? "🔊 बोला जा रहा है…" : "🔊 Speaking…") : "🤟 ISL gloss helper (demo avatar)"}
          </p>

          <div className="mt-2 grid grid-cols-1 gap-1.5">
            <a
              href={ISLRTC_DICT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#26658C]/60 px-2 py-2 text-[11px] font-bold text-[#26658C] dark:text-cyan-200 hover:bg-[#A7EBF2]/30"
            >
              {language === "hi" ? "🇮🇳 सरकारी ISLRTC ISL डिक्शनरी खोलें" : "🇮🇳 Open official ISLRTC dictionary (Govt. of India)"}
              <ExternalLink size={12} />
            </a>
            <a
              href={RKMVERI_DICT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#54ACBF]/60 px-2 py-2 text-[11px] font-bold text-[#26658C] dark:text-cyan-200 hover:bg-[#A7EBF2]/30"
            >
              {language === "hi" ? "📖 RKMVERI ISL डिक्शनरी (A–Z) खोलें" : "📖 Open RKMVERI ISL dictionary (A–Z)"}
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
