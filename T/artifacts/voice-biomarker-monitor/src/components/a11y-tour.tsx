import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ClipboardList,
  FileText,
  Globe,
  HandHeart,
  Search,
  Volume2,
  VolumeX,
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { useAccessibility } from "@/lib/accessibility";
import { useLanguage } from "@/lib/language";
import { useAuth } from "@/lib/auth";
import type { LanguageCode } from "@/lib/translations";

// ── Guided tour content (icon-driven + spoken aloud) ──────────────────────
// English, Hindi, Tamil, Telugu & Bengali; other languages fall back to
// English. "Hear" uses the chosen app language's voice so the audio prompt
// still feels local.

interface TourStrings {
  welcomeTitle: string;
  welcomeBody: (firstName: string) => string;
  speak: string;
  stop: string;
  back: string;
  next: string;
  finish: string;
  skip: string;
  tip: string;
  steps: Array<{ icon: LucideIcon; title: string; body: string }>;
}

function makeCopy(lang: "en" | "hi"): TourStrings {
  const en = {
    welcomeTitle: "Welcome to MediKiosk 👋",
    welcomeBody: (n: string) =>
      `Hello ${n || "friend"}! I will show you around — you need no training at all. You will record your health story by speaking or by tapping buttons, before you meet your doctor.`,
    speak: "🔊 Hear",
    stop: "⏹ Stop",
    back: "Back",
    next: "Next",
    finish: "Start My Health Story",
    skip: "Skip guide",
    tip: "No account setup needed — you are ready.",
    steps: [
      {
        icon: ClipboardList,
        title: "1. Start New Intake",
        body: "Press the big green button “Start New Intake” to tell us why you came today — by voice or by tapping answers. It takes about five minutes.",
      },
      {
        icon: Search,
        title: "2. Find Doctors",
        body: "Press “Find Doctors” to see nearby doctors and book an appointment with one tap.",
      },
      {
        icon: FileText,
        title: "3. My Records",
        body: "Press “My Records” any time to see your past health summaries and reports.",
      },
      {
        icon: Globe,
        title: "4. Your Language",
        body: "At the top of every page, choose your language. I will then speak and show everything in your language.",
      },
    ],
  };
  if (lang !== "hi") return en as TourStrings;
  return {
    welcomeTitle: "मेडीकियोस्क में आपका स्वागत है 👋",
    welcomeBody: (n: string) =>
      `नमस्ते ${n || "मित्र"}! मैं आपको सब कुछ दिखाऊँगा — आपको किसी प्रशिक्षण की ज़रूरत नहीं है। डॉक्टर से मिलने से पहले आप बोलकर या बटन दबाकर अपनी स्वास्थ्य कहानी दर्ज करेंगे।`,
    speak: "🔊 सुनें",
    stop: "⏹ रोकें",
    back: "पीछे",
    next: "आगे",
    finish: "मेरी स्वास्थ्य कहानी शुरू करें",
    skip: "गाइड छोड़ें",
    tip: "कोई खाता सेटअप ज़रूरी नहीं — आप तैयार हैं।",
    steps: [
      {
        icon: ClipboardList,
        title: "1. नई जानकारी शुरू करें",
        body: "हरा बटन “नई जानकारी शुरू करें” दबाएँ — बोलकर या जवाब चुनकर बताएँ कि आप आज क्यों आए हैं। इसमें लगभग पाँच मिनट लगते हैं।",
      },
      {
        icon: Search,
        title: "2. डॉक्टर खोजें",
        body: "“डॉक्टर खोजें” दबाएँ — पास के डॉक्टर देखें और एक टैप में अपॉइंटमेंट बुक करें।",
      },
      {
        icon: FileText,
        title: "3. मेरे रिकॉर्ड",
        body: "कभी भी “मेरे रिकॉर्ड” दबाकर अपनी पुरानी स्वास्थ्य रिपोर्ट और सारांश देखें।",
      },
      {
        icon: Globe,
        title: "4. आपकी भाषा",
        body: "हर पेज के ऊपर अपनी भाषा चुनें। मैं सब कुछ आपकी भाषा में बोलूँगा और दिखाऊँगा।",
      },
    ],
  };
}

// ── Tamil ─────────────────────────────────────────────────────────────────
const TA: TourStrings = {
  welcomeTitle: "மெடிகியோஸ்க்கு வரவேற்கிறோம் 👋",
  welcomeBody: (n: string) =>
    `வணக்கம் ${n || "நண்பரே"}! நான் உங்களுக்கு எல்லாவற்றையும் காட்டுகிறேன் — உங்களுக்கு எந்தப் பயிற்சியும் தேவையில்லை. மருத்துவரைச் சந்திக்கும் முன், பேசியோ அல்லது பொத்தான்களை அழுத்தியோ உங்கள் உடல்நலக் கதையைப் பதிவு செய்வீர்கள்.`,
  speak: "🔊 கேளுங்கள்",
  stop: "⏹ நிறுத்து",
  back: "பின்",
  next: "அடுத்து",
  finish: "என் உடல்நலக் கதையைத் தொடங்கு",
  skip: "வழிகாட்டியைத் தவிர்",
  tip: "கணக்கு அமைப்பு தேவையில்லை — நீங்கள் தயார்.",
  steps: [
    {
      icon: ClipboardList,
      title: "1. புதிய பதிவைத் தொடங்கு",
      body: "பச்சை நிற “புதிய பதிவைத் தொடங்கு” பொத்தானை அழுத்தவும் — பேசியோ அல்லது பதில்களைத் தேர்ந்தெடுத்தோ இன்று நீங்கள் ஏன் வந்தீர்கள் என்று சொல்லுங்கள். இதற்கு ஐந்து நிமிடங்கள் ஆகும்.",
    },
    {
      icon: Search,
      title: "2. மருத்துவர்களைக் கண்டறிய",
      body: "“மருத்துவர்களைக் கண்டறிய” என்பதை அழுத்தவும் — அருகிலுள்ள மருத்துவர்களைப் பார்த்து ஒரே தட்டினால் சந்திப்பை முன்பதிவு செய்யுங்கள்.",
    },
    {
      icon: FileText,
      title: "3. எனது பதிவுகள்",
      body: "உங்கள் பழைய உடல்நல அறிக்கைகளையும் சுருக்கங்களையும் எப்போது வேண்டுமானாலும் “எனது பதிவுகள்” என்பதை அழுத்திப் பார்க்கவும்.",
    },
    {
      icon: Globe,
      title: "4. உங்கள் மொழி",
      body: "ஒவ்வொரு பக்கத்தின் மேலேயும் உங்கள் மொழியைத் தேர்ந்தெடுக்கவும். நான் எல்லாவற்றையும் உங்கள் மொழியில் பேசி, காட்டுவேன்.",
    },
  ],
};

// ── Telugu ────────────────────────────────────────────────────────────────
const TE: TourStrings = {
  welcomeTitle: "మెడికియోస్క్‌కు స్వాగతం 👋",
  welcomeBody: (n: string) =>
    `నమస్కారం ${n || "మిత్రమా"}! నేను మీకు అన్నీ చూపిస్తాను — మీకు శిక్షణ అవసరం లేదు. డాక్టర్‌ను కలిసే ముందు మాట్లాడి లేదా బటన్‌లు నొక్కి మీ ఆరోగ్య కథను నమోదు చేస్తారు.`,
  speak: "🔊 వినండి",
  stop: "⏹ ఆపండి",
  back: "వెనుకకు",
  next: "తదుపరి",
  finish: "నా ఆరోగ్య కథను ప్రారంభించండి",
  skip: "గైడ్‌ను దాటవేయి",
  tip: "ఖాతా సెటప్ అవసరం లేదు — మీరు సిద్ధంగా ఉన్నారు.",
  steps: [
    {
      icon: ClipboardList,
      title: "1. కొత్త ఇన్‌టేక్ ప్రారంభించండి",
      body: "ఆకుపచ్చ “కొత్త ఇన్‌టేక్ ప్రారంభించండి” బటన్‌ను నొక్కండి — మాట్లాడి లేదా సమాధానాలు ఎంచుకుని ఈరోజు ఎందుకు వచ్చారో చెప్పండి. దీనికి దాదాపు ఐదు నిమిషాలు పడుతుంది.",
    },
    {
      icon: Search,
      title: "2. డాక్టర్లను కనుగొనండి",
      body: "“డాక్టర్లను కనుగొనండి” నొక్కండి — సమీపంలోని డాక్టర్లను చూసి ఒక ట్యాప్‌లో అపాయింట్‌మెంట్ బుక్ చేసుకోండి.",
    },
    {
      icon: FileText,
      title: "3. నా రికార్డులు",
      body: "మీ పాత ఆరోగ్య నివేదికలను మరియు సారాంశాలను ఎప్పుడైనా “నా రికార్డులు” నొక్కి చూడండి.",
    },
    {
      icon: Globe,
      title: "4. మీ భాష",
      body: "ప్రతి పేజీ పైన మీ భాషను ఎంచుకోండి. నేను ప్రతిదీ మీ భాషలో మాట్లాడి చూపిస్తాను.",
    },
  ],
};

// ── Bengali ───────────────────────────────────────────────────────────────
const BN: TourStrings = {
  welcomeTitle: "মেডিকিয়স্ক-এ স্বাগতম 👋",
  welcomeBody: (n: string) =>
    `নমস্কার ${n || "বন্ধু"}! আমি আপনাকে সব দেখাব — আপনার কোনো প্রশিক্ষণের দরকার নেই। ডাক্তারের সঙ্গে দেখা করার আগে আপনি কথা বলে বা বাটন চেপে আপনার স্বাস্থ্য-কাহিনি লিখে রাখবেন।`,
  speak: "🔊 শুনুন",
  stop: "⏹ থামান",
  back: "পিছনে",
  next: "পরবর্তী",
  finish: "আমার স্বাস্থ্য-কাহিনি শুরু করুন",
  skip: "গাইড এড়িয়ে যান",
  tip: "কোনো অ্যাকাউন্ট সেটআপ দরকার নেই — আপনি প্রস্তুত।",
  steps: [
    {
      icon: ClipboardList,
      title: "1. নতুন ইনটেক শুরু করুন",
      body: "সবুজ “নতুন ইনটেক শুরু করুন” বাটনটি টিপুন — কথা বলে বা উত্তর বেছে নিয়ে বলুন আজ আপনি কেন এসেছেন। এতে প্রায় পাঁচ মিনিট সময় লাগে।",
    },
    {
      icon: Search,
      title: "2. ডাক্তার খুঁজুন",
      body: "“ডাক্তার খুঁজুন” টিপুন — কাছের ডাক্তার দেখুন এবং এক ট্যাপেই অ্যাপয়েন্টমেন্ট বুক করুন।",
    },
    {
      icon: FileText,
      title: "3. আমার রেকর্ড",
      body: "আপনার পুরনো স্বাস্থ্য রিপোর্ট ও সারাংশ যে-কোনো সময় “আমার রেকর্ড” টিপে দেখুন।",
    },
    {
      icon: Globe,
      title: "4. আপনার ভাষা",
      body: "প্রতিটি পেজের উপরে আপনার ভাষা বেছে নিন। আমি সবকিছু আপনার ভাষায় বলব এবং দেখাব।",
    },
  ],
};

// ── Language picker (defaults to English) ─────────────────────────────────
const TRANSLATED: Record<string, TourStrings> = {
  hi: makeCopy("hi"),
  ta: TA,
  te: TE,
  bn: BN,
};

function tourStrings(lang: string): TourStrings {
  return TRANSLATED[lang] || makeCopy("en");
}

export function A11yTour() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { tourOpen, closeTour, speak, stopSpeaking, speaking, simpleMode } = useAccessibility();
  const [step, setStep] = useState(0);

  const copy = tourStrings(language);
  const isWelcome = step === 0;

  // Welcome page shows the app icon; later steps show their step icon
  const Icon = isWelcome ? HandHeart : copy.steps[step - 1].icon;

  // Build the spoken text for the current step
  const stepText = isWelcome
    ? `${copy.welcomeTitle}. ${copy.welcomeBody(user?.name?.split(" ")[0] || "")}`
    : `${copy.steps[step - 1].title}. ${copy.steps[step - 1].body}`;

  // Audio prompt: read each new step aloud (conversational guidance)
  useEffect(() => {
    if (!tourOpen) return;
    // short delay lets the panel render & voices settle
    const timer = setTimeout(() => speak(stepText, { lang: language as LanguageCode }), 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourOpen, step]);

  if (!tourOpen) return null;

  const total = copy.steps.length + 1; // welcome + 4 steps
  const onLast = step === total - 1;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTour} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.welcomeTitle}
        className={`relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#021B3D] border border-[#54ACBF]/40 shadow-2xl p-6 md:p-8 text-center ${simpleMode ? "space-y-5" : "space-y-4"}`}
      >
        {/* skip */}
        <button
          onClick={closeTour}
          className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-[#26658C] dark:text-cyan-200/70 hover:bg-[#A7EBF2]/40 dark:hover:bg-white/10"
        >
          <X size={16} />
          {copy.skip}
        </button>

        {/* progress dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-[#54ACBF]" : i < step ? "w-2 bg-[#54ACBF]/50" : "w-2 bg-slate-200 dark:bg-white/15"
              }`}
            />
          ))}
        </div>

        {/* big icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl luna-brand-gradient text-white flex items-center justify-center shadow-xl shadow-[#54ACBF]/30">
          <Icon size={simpleMode ? 44 : 38} />
        </div>

        {/* text */}
        {isWelcome ? (
          <>
            <h2 className="text-2xl font-extrabold text-[#023859] dark:text-white font-[Manrope] leading-snug">
              {copy.welcomeTitle}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#26658C]/90 dark:text-cyan-100/80 font-medium">
              {copy.welcomeBody(user?.name?.split(" ")[0] || "")}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-extrabold text-[#023859] dark:text-white font-[Manrope] leading-snug">
              {copy.steps[step - 1].title}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#26658C]/90 dark:text-cyan-100/80 font-medium">
              {copy.steps[step - 1].body}
            </p>
          </>
        )}

        {/* actions */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => (speaking ? stopSpeaking() : speak(stepText, { lang: language as LanguageCode }))}
            className="flex items-center gap-2 rounded-2xl border-2 border-[#54ACBF]/60 px-4 py-3 font-bold text-[#26658C] dark:text-cyan-200 hover:bg-[#A7EBF2]/40 dark:hover:bg-white/10 transition-all"
          >
            {speaking ? <VolumeX size={22} /> : <Volume2 size={22} />}
            {speaking ? copy.stop : copy.speak}
          </button>
        </div>

        {/* nav buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {step > 0 ? (
            <button
              onClick={() => {
                stopSpeaking();
                setStep((s) => Math.max(0, s - 1));
              }}
              className="flex items-center gap-1 rounded-2xl px-4 py-3 font-bold text-[#26658C] dark:text-cyan-200 hover:bg-[#A7EBF2]/40 dark:hover:bg-white/10"
            >
              <ChevronLeft size={20} />
              {copy.back}
            </button>
          ) : (
            <span />
          )}

          {!isWelcome && !onLast ? (
            <button
              onClick={() => {
                stopSpeaking();
                setStep((s) => s + 1);
              }}
              className="flex items-center gap-1 rounded-2xl bg-[#54ACBF] text-white px-5 py-3 font-bold shadow-lg shadow-[#54ACBF]/30 hover:brightness-105"
            >
              {copy.next}
              <ChevronRight size={20} />
            </button>
          ) : onLast ? (
            <Link href="/intake">
              <button
                onClick={() => {
                  stopSpeaking();
                  closeTour();
                }}
                className="flex items-center gap-2 rounded-2xl luna-btn-teal text-white px-5 py-3.5 font-bold shadow-lg shadow-[#54ACBF]/30 hover:brightness-105"
              >
                <Stethoscope size={22} />
                {copy.finish}
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                stopSpeaking();
                setStep(1);
              }}
              className="flex items-center gap-1 rounded-2xl bg-[#54ACBF] text-white px-5 py-3 font-bold shadow-lg shadow-[#54ACBF]/30 hover:brightness-105"
            >
              {copy.next}
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* tiny reminder */}
        {isWelcome && (
          <p className="text-xs text-[#26658C]/60 dark:text-cyan-100/50 font-semibold">💡 {copy.tip}</p>
        )}
      </div>
    </div>
  );
}
