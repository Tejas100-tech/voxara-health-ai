import { Router } from "express";
import { logger } from "../lib/logger";
import { connectMongoDB, hasMongoDB } from "../lib/mongodb";
import IntakeRecord from "../models/intake-record";
import { getGreeting, getTranslatedQuestions } from "../lib/translations";
import { getMCQOptions } from "../lib/mcq-options";
import { getDiseaseCategory, getDiseaseQuestions } from "../lib/disease-questions";

const router = Router();

// ── Storage ───────────────────────────────────────────────────────────────
// Primary store is MongoDB (IntakeRecord model) so intake sessions and the
// answers/documents inside them survive server restarts. The in-memory map
// stays as the live cache and as a fallback when MongoDB is unavailable.
const intakeSessions: Record<string, any> = {};

async function mongoAvailable(): Promise<boolean> {
  if (!hasMongoDB()) return false;
  try {
    await connectMongoDB();
    return true;
  } catch {
    return false;
  }
}

function toPlain(doc: any): Record<string, any> | undefined {
  if (!doc) return undefined;
  const obj = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const { _id, __v, ...rest } = obj;
  return rest as Record<string, any>;
}

async function findStoredSession(sessionId: string): Promise<Record<string, any> | undefined> {
  if (intakeSessions[sessionId]) return intakeSessions[sessionId];
  if (await mongoAvailable()) {
    try {
      const doc = await IntakeRecord.findOne({ id: sessionId }).lean();
      if (doc) {
        const plain = toPlain(doc);
        if (plain) intakeSessions[sessionId] = plain;
        return plain;
      }
    } catch (err) {
      logger.warn({ err }, "Failed to load intake session from MongoDB");
    }
  }
  return undefined;
}

async function listStoredSessions(patientId?: string): Promise<Record<string, any>[]> {
  if (await mongoAvailable()) {
    try {
      const q: Record<string, unknown> = {};
      if (patientId) q.patientId = patientId;
      const docs = await IntakeRecord.find(q).sort({ createdAt: -1 }).limit(200).lean();
      return docs.map((d: any) => toPlain(d)).filter(Boolean) as Record<string, any>[];
    } catch (err) {
      logger.warn({ err }, "Failed to list intake sessions from MongoDB");
    }
  }
  let sessions = Object.values(intakeSessions).sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (patientId) sessions = sessions.filter((s: any) => s.patientId === patientId);
  return sessions;
}

async function saveSession(session: Record<string, any>): Promise<void> {
  if (!session?.id) return;
  intakeSessions[session.id] = session;
  if (await mongoAvailable()) {
    try {
      await IntakeRecord.findOneAndUpdate({ id: session.id }, { $set: session }, { upsert: true });
    } catch (err) {
      logger.warn({ err: (err as Error)?.message }, "Failed to persist intake session");
    }
  }
}

async function removeSession(sessionId: string): Promise<void> {
  delete intakeSessions[sessionId];
  if (await mongoAvailable()) {
    try {
      await IntakeRecord.deleteOne({ id: sessionId });
    } catch (err) {
      logger.warn({ err: (err as Error)?.message }, "Failed to delete intake session from MongoDB");
    }
  }
}

interface HistoryAnswer {
  question: string;
  answer: string;
  category: string;
  timestamp: string;
}

// ── Rapid Track: 3 questions for routine/follow-up (90-second target) ─────
const rapidTrackQuestions: Record<string, string[]> = {
  en: [
    "What is the main problem that brought you here today? Please describe briefly.",
    "Are there any warning signs — severe pain, difficulty breathing, bleeding, high fever, or chest tightness?",
    "Are you taking any current medications or have any known allergies?",
  ],
  hi: [
    "आज आपको यहाँ लाने वाली मुख्य समस्या क्या है? संक्षेप में बताएं।",
    "क्या कोई चेतावनी संकेत हैं — तीव्र दर्द, सांस लेने में कठिनाई, खून बहना, तेज बुखार, या सीने में जकड़न?",
    "क्या आप कोई मौजूदा दवाएँ ले रहे हैं या किसी ज्ञात एलर्जी है?",
  ],
  ta: [
    "இன்று உங்களை இங்கு அழைத்து வந்த முதன்மை பிரச்சனை என்ன? சுருக்கமாகக் கூறுங்கள்.",
    "எந்த எச்சரிக்கை அறிகுறிகள் உள்ளதா — கடுமையான வலி, மூச்சுத் திணறல், இரத்தப்போக்கு, அதிக காய்ச்சல்?",
    "தற்போது ஏதேனும் மருந்துகள் எடுத்துக்கொள்கிறீர்களா அல்லது தெரிந்த ஒவ்வாமை உள்ளதா?",
  ],
  te: [
    "ఈ రోజు మిమ్మల్ని ఇక్కడికి తీసుకువచ్చిన ముఖ్య సమస్య ఏమిటి? సంక్షిప్తంగా చెప్పండి.",
    "హెచ్చరిక సంకేతాలు ఉన్నాయా — తీవ్రమైన నొప్పి, శ్వాసక్రియలో ఇబ్బంది, రక్తస్రావం, ఎక్కువ జ్వరం?",
    "ప్రస్తుతం ఏవైనా మందులు తీసుకుంటున్నారా లేదా తెలిసిన అలర్జీ ఉందా?",
  ],
  bn: [
    "আজ আপনাকে এখানে নিয়ে এসেছে মূল সমস্যা কী? সংক্ষেপে বলুন।",
    "কোনো সতর্কতা লক্ষণ আছে কি — তীব্র ব্যথা, শ্বাসকষ্ট, রক্তপাত, জ্বর?",
    "বর্তমানে কোনো ওষুধ খাচ্ছেন বা পরিচিত অ্যালার্জি আছে?",
  ],
  mr: [
    "आज तुम्हाला इथे आणणारी मुख्य समस्या काय? संक्षिप्त सांगा.",
    "कोणतीही चेतावनी लक्षणे आहेत का — तीव्र दुखणे, श्वास घेण्यास त्रास, रक्तस्राव, ताप?",
    "सध्या कोणत्या औषधे घेत आहात किंवा ओळखीची अॅलर्जी आहे का?",
  ],
  gu: [
    "આજે તમને અહીં લાવવાની મુખ્ય સમસ્યા શું છે? સંક્ષિપ્તમાં કહો.",
    "કોઈ ચેતવણી સંકેતો છે — તીવ્ર દુખાવો, શ્વાસ લેવામાં તકલીફ, રક્તસ્રાવ, તાવ?",
    "હાલમાં કોઈ દવાઓ લઈ રહ્યા છો અથવા જાણીતી એલર્જી છે?",
  ],
  kn: [
    "ಇಂದು ನಿಮ್ಮನ್ನು ಇಲ್ಲಿಗೆ ಕರೆದುಕೊಂಡು ಬಂದ ಮುಖ್ಯ ಸಮಸ್ಯೆ ಯಾವುದು? ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಹೇಳಿ.",
    "ಯಾವುದಾದರೂ ಎಚ್ಚರಿಕೆ ಸಂಕೇತಗಳಿವೆಯೇ — ತೀವ್ರ ನೋವು, ಉಸಿರಾಟ ಕಷ್ಟ, ರಕ್ತಸ್ರಾವ, ಜ್ವರ?",
    "ಪ್ರಸ್ತುತ ಯಾವುದಾದರೂ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ ಅಥವಾ ತಿಳಿದ ಅಲರ್ಜಿ ಇದೆಯೇ?",
  ],
  ml: [
    "ഇന്ന് നിങ്ങളെ ഇവിടേക്ക് കൊണ്ടുവന്ന പ്രധാന പ്രശ്നം എന്താണ്? സംക്ഷിപ്തമായി പറയൂ.",
    "ഏതെങ്കിലും മുന്നറിയിപ്പ് ലക്ഷണങ്ങൾ ഉണ്ടോ — കഠിനമായ വേദന, ശ്വാസതടസ്സം, രക്തസ്രാവം, കടുത്ത പനി?",
    "നിലവിൽ ഏതെങ്കിലും മരുന്നുകൾ കഴിക്കുന്നുണ്ടോ അല്ലെങ്കിൽ അറിയാവുന്ന അലർജി ഉണ്ടോ?",
  ],
  pa: [
    "ਅੱਜ ਤੁਹਾਨੂੰ ਇੱਥੇ ਲਿਆਉਣ ਵਾਲੀ ਮੁੱਖ ਸਮੱਸਿਆ ਕੀ ਹੈ? ਸੰਖੇਪ ਵਿੱਚ ਦੱਸੋ।",
    "ਕੋਈ ਚੇਤਾਵਨੀ ਸੰਕੇਤ ਹਨ — ਤੀਬਰ ਦਰਦ, ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼, ਖ਼ੂਨ ਵਹਿਣਾ, ਤੇਜ਼ ਬੁਖ਼ਾਰ?",
    "ਇਸ ਵੇਲੇ ਕੋਈ ਦਵਾਈਆਂ ਲੈ ਰਹੇ ਹੋ ਜਾਂ ਜਾਣੀ-ਪਛਾਣੀ ਐਲਰਜੀ ਹੈ?",
  ],
  or: [
    "ଆଜି ଆପଣଙ୍କୁ ଏଠାକୁ ଆଣିବାର ମୁଖ୍ୟ ସମସ୍ୟା କଣ? ସଂକ୍ଷେପରେ କୁହନ୍ତୁ।",
    "କୌଣସି ସତର୍କ ଲକ୍ଷଣ ଅଛି — ତୀବ୍ର ଯନ୍ତ୍ରଣା, ଶ୍ୱାସ କଷ୍ଟ, ରକ୍ତସ୍ରାବ, ଜ୍ୱର?",
    "ବର୍ତ୍ତମାନ କୌଣସି ଔଷଧ ଖାଉଛନ୍ତି ବା ଜ୍ଞାତ ଆଲର୍ଜି ଅଛି?",
  ],
  as: [
    "আজি আপোনাক ইয়ালৈ আনি লৈ আহা মূল সমস্যা কি? সংক্ষেপত কওক।",
    "কোনো সতৰ্কতা লক্ষণ আছে — তীব্ৰ যন্ত্ৰণা, শ্বাস কষ্ট, ৰক্তস্ৰাব, জ্বৰ?",
    "বৰ্তমানত কোনো ওষুধ খাইছে বা জ্ঞাত এলাৰ্জি আছে?",
  ],
  ur: [
    "آج آپ کو یہاں لانے والی بنیادی مسئلہ کیا ہے؟ مختصر میں بتائیں۔",
    "کوئی انتباہی علامتیں ہیں — شدید درد، سانس لینے میں مشکل، خون بہنا، تیز بخار؟",
    "فی الحال کوئی ادویات لے رہے ہیں یا معلوم الرجی ہے؟",
  ],
  sa: [
    "अद्य भवन्तं अत्र आनयितुं प्रमुखः समस्या का? संक्षिप्तं वदतु।",
    "के चित् चेतावनी-लक्षणानि सन्ति — तीव्रः वेदना, श्वास-कष्टः, रक्त-स्रावः, ज्वरः?",
    "अद्य काञ्चिन्नौषधानि पिबति वा ज्ञाता अलर्जी अस्ति?",
  ],
  ne: [
    "आज तपाईंलाई यहाँ ल्याउने मुख्य समस्या के हो? संक्षेपमा भन्नुहोस्।",
    "कुनै चेतावनी संकेत छन् — तीव्र पीडा, साँस फेर्न कठिन, रक्तस्राव, ज्वर?",
    "हाल कुनै औषधि खाइरहनुहुन्छ वा थाहा भएको एलर्जी छ?",
  ],
};

const rapidCategories: Record<number, string> = {
  0: "Chief Complaint",
  1: "Red Flag Screening",
  2: "Medication & Allergies",
};

function getRapidQuestions(language: string): string[] {
  return rapidTrackQuestions[language] || rapidTrackQuestions.en;
}

// ── Allopathic question templates (full track) ────────────────────────────
const allopathicTemplates: Record<string, string[]> = {
  chest_pain: [
    "Can you describe the chest pain? Is it sharp, dull, burning, or pressure-like?",
    "When did the chest pain start? Was it sudden or gradual?",
    "Does the pain spread to your arm, jaw, neck, or back?",
    "What makes it worse? What makes it better?",
    "Do you feel breathless, nauseous, or sweaty with the pain?",
    "Do you have any history of heart disease or high blood pressure?",
    "Are you currently taking any medications?",
  ],
  general: [
    "What is the main problem that brought you here today?",
    "When did this problem start?",
    "Have you had this problem before?",
    "Do you have any known allergies?",
    "Are you currently taking any medications? Please list them.",
    "Do you have diabetes, hypertension, or heart disease?",
    "Is there any illness in your family — parents, siblings?",
    "Do you smoke or drink alcohol?",
    "Have you had any surgeries in the past?",
    "What is your occupation?",
  ],
};

// ── AYUSH Dashavidha Pariksha question templates ──────────────────────────
const ayushTemplates: string[] = [
  "What is your body build — thin, medium, or heavy? Do you tend to gain or lose weight easily?",
  "How is your appetite normally? Do you eat quickly or slowly? How is your digestion — any bloating, gas, or heaviness after meals?",
  "What is the main problem that brought you here today? Please describe your symptoms in detail.",
  "When did this problem start? What do you think caused it — diet, stress, season change, or something else?",
  "How is your skin — dry, oily, or normal? How are your nails, hair, and eyes — do they feel strong and healthy?",
  "How is your physical endurance? Can you walk long distances or do heavy work without getting tired? How do you recover after exertion?",
  "What is your approximate height and weight? Are your body proportions balanced — are your hands and feet proportionate to your body?",
  "How well do you adapt to changes in weather, food, or routine? Are there specific climates, foods, or seasons that suit you better than others?",
  "How is your mental state — do you feel calm, anxious, or irritable? How is your memory and concentration? Do you sleep well?",
  "How is your Agni (digestive fire)? Do you feel hungry at regular times? Can you eat a variety of foods, or are there things that always cause problems?",
  "How much physical activity do you do daily? How does your body respond to exercise — do you feel energized or exhausted afterward?",
  "What is your age? How does your age seem to affect your energy and health — do you feel your age is reflected in your body?",
  "What does your daily diet look like — breakfast, lunch, dinner, snacks? Do you eat at regular times?",
  "What is your daily routine like — when do you wake up, sleep, exercise? How many hours of sleep do you get?",
  "What is your occupation and activity level during the day? How much water do you drink daily?",
  "Do you follow any specific dietary rules — vegetarian, fasting, seasonal eating? Do you consume spicy, oily, sweet, or cold foods regularly?",
];

const allopathicCategories: Record<number, string> = {
  0: "Chief Complaint",
  1: "History of Present Illness",
  2: "Review of Systems",
  3: "Past Medical History",
  4: "Drug & Allergy History",
  5: "Family History",
  6: "Personal History",
};

const ayushCategories: Record<number, string> = {
  0: "Prakriti (Constitution)",
  1: "Agni & Digestion",
  2: "Chief Complaint",
  3: "Nidana (Causative Factors)",
  4: "Sara (Tissue Quality)",
  5: "Samhanana (Body Compactness)",
  6: "Pramana (Body Measurements)",
  7: "Satmya (Adaptability)",
  8: "Sattva (Mental Strength)",
  9: "Ahara Shakti (Digestive Capacity)",
  10: "Vyayama Shakti (Exercise Capacity)",
  11: "Vaya (Age)",
  12: "Ahara (Diet)",
  13: "Vihara (Lifestyle & Routine)",
  14: "Daily Habits",
  15: "Dietary Patterns",
};

function getTemplates(mode: string): string[] {
  return mode === "ayush" ? ayushTemplates : allopathicTemplates["general"];
}

function getTranslatedTemplate(mode: string, language: string): string[] {
  const translated = getTranslatedQuestions(mode, language);
  return translated.length > 0 ? translated : getTemplates(mode);
}

function getCategoryMap(mode: string): Record<number, string> {
  return mode === "ayush" ? ayushCategories : allopathicCategories;
}

function generateNextQuestion(
  answers: HistoryAnswer[],
  mode: string,
  chiefComplaint?: string,
  language?: string,
  track?: string
): { question: string; category: string; isComplete: boolean; mcqOptions: string[] | null } {
  // Rapid track: only 3 questions then done
  if (track === "rapid") {
    const rapidQs = getRapidQuestions(language || "en");
    const idx = answers.length;
    if (idx >= rapidQs.length) {
      return { question: "", category: "complete", isComplete: true, mcqOptions: null };
    }
    return {
      question: rapidQs[idx],
      category: rapidCategories[idx] || "Quick History",
      isComplete: false,
      mcqOptions: getMCQOptions(language || "en", mode, "rapid", idx),
    };
  }

  // ── Full track: try disease-specific questions first ──────────────────
  const langCode = language || "en";
  const answeredCategories = new Set(answers.map((a) => a.category));

  // After the first answer (chief complaint), try disease-specific questions
  if (chiefComplaint && mode !== "ayush") {
    const diseaseCategory = getDiseaseCategory(chiefComplaint);
    if (diseaseCategory) {
      const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
      // Find unanswered disease-specific questions
      const unanswered = diseaseQuestions.filter((q) => !answeredCategories.has(q.category));
      if (unanswered.length > 0) {
        const q = unanswered[0];
        return {
          question: q.question,
          category: q.category,
          isComplete: false,
          mcqOptions: q.mcqOptions || null,
        };
      }
    }
  }

  // AYUSH mode: disease-specific Ayurvedic questions
  if (chiefComplaint && mode === "ayush") {
    const diseaseCategory = getDiseaseCategory(chiefComplaint);
    if (diseaseCategory) {
      const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
      const unanswered = diseaseQuestions.filter((q) => !answeredCategories.has(q.category));
      if (unanswered.length > 0) {
        const q = unanswered[0];
        return {
          question: q.question,
          category: q.category,
          isComplete: false,
          mcqOptions: q.mcqOptions || null,
        };
      }
    }
  }

  // Fallback: use translated templates (general questions)
  const templates = getTranslatedTemplate(mode, langCode);
  const idx = answers.length;

  if (idx >= templates.length) {
    return { question: "", category: "complete", isComplete: true, mcqOptions: null };
  }

  const catMap = getCategoryMap(mode);

  return {
    question: templates[idx],
    category: catMap[idx] || "Additional History",
    isComplete: false,
    mcqOptions: getMCQOptions(langCode, mode, "full", idx),
  };
}

function getTrackTotalQuestions(mode: string, track?: string): number {
  if (track === "rapid") return 3;
  return getTemplates(mode).length;
}

// ── Noise level estimation (simulated for demo) ───────────────────────────
function estimateNoiseLevel(): { level: "low" | "medium" | "high"; db: number; recommendation: string } {
  // In a real system, this would use Web Audio API analyser node
  // For demo, we simulate random noise levels
  const db = Math.round(40 + Math.random() * 45);
  if (db < 55) return { level: "low", db, recommendation: "Voice input optimal" };
  if (db < 70) return { level: "medium", db, recommendation: "Voice may need repetition — touch input available" };
  return { level: "high", db, recommendation: "High ambient noise — recommend touch input with large tap cards" };
}

// ── Start a new intake session ────────────────────────────────────────────
router.post("/intake/start", async (req, res) => {
  try {
    const { patientId, patientName, abhaId, language, mode, track } = req.body;

    if (!patientId || !patientName) {
      res.status(400).json({ error: "patientId and patientName are required" });
      return;
    }

    const sessionId = `INT-${Date.now().toString(36).toUpperCase()}`;
    const sessionMode = mode === "ayush" ? "ayush" : "allopathic";
    const sessionTrack = track === "rapid" ? "rapid" : "full";
    const totalQ = getTrackTotalQuestions(sessionMode, sessionTrack);

    const session = {
      id: sessionId,
      patientId,
      patientName,
      abhaId: abhaId || "",
      language: language || "en",
      mode: sessionMode,
      track: sessionTrack,
      totalQuestions: totalQ,
      status: "history",
      chiefComplaint: "",
      answers: [] as HistoryAnswer[],
      documents: [],
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSession(session);

    const greeting = getGreeting(language, sessionMode);
    const noise = estimateNoiseLevel();

    // Rapid track gets a different greeting
    const rapidGreeting: Record<string, string> = {
      en: "Quick intake mode — just 3 questions. What is your main problem today?",
      hi: "त्वरित जानकारी मोड — केवल 3 प्रश्न। आज आपकी मुख्य समस्या क्या है?",
      ta: "விரைவு பதிவு பயன்முறை — வெறும் 3 கேள்விகள். இன்று உங்கள் முதன்மை பிரச்சனை என்ன?",
      te: "త్వరిత ఇన్‌టేక్ మోడ్ — కేవలం 3 ప్రశ్నలు. ఈ రోజు మీ ముఖ్య సమస్య ఏమిటి?",
      bn: "দ্রুত ইনটেক মোড — মাত্র ৩টি প্রশ্ন। আজ আপনার মূল সমস্যা কী?",
      mr: "झटपट माहिती मोड — केवळ ३ प्रश्ने। आज तुमची मुख्य समस्या काय?",
      gu: "ઝડપી ઇન્ટેક મોડ — ફક્ત ૩ પ્રશ્નો। આજે તમારી મુખ્ય સમસ્યા શું છે?",
      kn: "ವೇಗದ ಇನ್‌ಟೇಕ್ ಮೋಡ್ — ಕೇವಲ ೩ ಪ್ರಶ್ನೆಗಳು. ಇಂದು ನಿಮ್ಮ ಮುಖ್ಯ ಸಮಸ್ಯೆ ಯಾವುದು?",
      ml: "വേഗത്തിലുള്ള ഇൻ്റേക്ക് മോഡ് — വെറും 3 ചോദ്യങ്ങൾ. ഇന്ന് നിങ്ങളുടെ പ്രധാന പ്രശ്നം എന്താണ്?",
      pa: "ਤੇਜ਼ ਇੰਟੇਕ ਮੋਡ — ਸਿਰਫ਼ 3 ਸਵਾਲ। ਅੱਜ ਤੁਹਾਡੀ ਮੁੱਖ ਸਮੱਸਿਆ ਕੀ ਹੈ?",
      or: "ଦ୍ରୁତ ଇଣ୍ଟେକ୍ ମୋଡ୍ — କେବଳ ୩ଟି ପ୍ରଶ୍ନ। ଆଜି ଆପଣଙ୍କ ମୁଖ୍ୟ ସମସ୍ୟା କଣ?",
    };

    const firstQuestion = sessionTrack === "rapid"
      ? (rapidGreeting[language || "en"] || rapidGreeting.en)
      : greeting;

    const firstCategory = sessionTrack === "rapid"
      ? "Chief Complaint"
      : (sessionMode === "ayush" ? "Prakriti (Constitution)" : "Chief Complaint");

    res.json({
      sessionId,
      session,
      greeting: firstQuestion,
      mode: sessionMode,
      track: sessionTrack,
      totalQuestions: totalQ,
      noise,
      nextQuestion: {
        question: firstQuestion,
        category: firstCategory,
        isComplete: false,
        mcqOptions: getMCQOptions(language || "en", sessionMode, sessionTrack, 0),
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to start intake session");
    res.status(500).json({ error: "Failed to start intake session" });
  }
});

// ── Get noise level ───────────────────────────────────────────────────────
router.get("/intake/noise-level", (_req, res) => {
  res.json(estimateNoiseLevel());
});

// ── Pre-load all MCQs for a session ──────────────────────────────────────
router.get("/intake/:sessionId/mcqs", async (req, res) => {
  const session = await findStoredSession(String(req.params.sessionId));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }

  const { getAllMCQOptions } = require("../lib/mcq-options");
  const allMcqs = getAllMCQOptions(session.language || "en", session.mode || "allopathic", session.track || "full");
  res.json({ mcqs: allMcqs, totalQuestions: session.totalQuestions });
});

// ── Submit an answer ──────────────────────────────────────────────────────
router.post("/intake/:sessionId/answer", async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId);
    const { answer, chiefComplaint, question, category } = req.body;

    const session = await findStoredSession(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const mode = session.mode || "allopathic";
    const track = session.track || "full";

    if (chiefComplaint && !session.chiefComplaint) {
      session.chiefComplaint = chiefComplaint;
      // Recalculate total questions based on disease-specific questions
      if (track === "full") {
        const diseaseCategory = getDiseaseCategory(chiefComplaint);
        if (diseaseCategory) {
          const diseaseQuestions = getDiseaseQuestions(diseaseCategory, session.language || "en");
          const templateCount = getTemplates(mode).length;
          session.totalQuestions = Math.max(templateCount, diseaseQuestions.length);
        }
      }
    }

    const catMap = getCategoryMap(mode);
    const answerIdx = session.answers.length;

    session.answers.push({
      question: question || (track === "rapid" ? rapidCategories[answerIdx] : catMap[answerIdx]) || "History",
      answer,
      category: category || (track === "rapid" ? rapidCategories[answerIdx] : catMap[answerIdx]) || "History",
      timestamp: new Date().toISOString(),
    });

    session.updatedAt = new Date().toISOString();

    const next = generateNextQuestion(session.answers, mode, session.chiefComplaint, session.language, track);
    const totalQ = session.totalQuestions || getTrackTotalQuestions(mode, track);
    const progress = Math.min(100, Math.round((session.answers.length / totalQ) * 100));

    if (next.isComplete) {
      session.status = "documents";
      await saveSession(session);
      res.json({
        session,
        message: track === "rapid"
          ? "Quick intake complete! You can now scan documents or skip to summary."
          : "History interview complete! You can now upload your medical documents.",
        nextStep: "documents",
        isComplete: true,
        progress: 100,
      });
    } else {
      await saveSession(session);
      res.json({
        session,
        nextQuestion: next,
        isComplete: false,
        progress,
        remaining: totalQ - session.answers.length,
      });
    }
  } catch (err) {
    logger.error({ err }, "Failed to submit answer");
    res.status(500).json({ error: "Failed to submit answer" });
  }
});

// ── Get / List / Delete sessions ──────────────────────────────────────────
router.get("/intake/:sessionId", async (req, res) => {
  const session = await findStoredSession(String(req.params.sessionId));
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  res.json(session);
});

router.get("/intake", async (req, res) => {
  try {
    const { patientId } = req.query;
    const sessions = await listStoredSessions(typeof patientId === "string" && patientId ? patientId : undefined);
    res.json(sessions);
  } catch (err) {
    logger.error({ err }, "Failed to list intake sessions");
    res.status(500).json({ error: "Failed to list intake sessions" });
  }
});

router.delete("/intake/:sessionId", async (req, res) => {
  const sessionId = String(req.params.sessionId);
  const session = await findStoredSession(sessionId);
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  await removeSession(sessionId);
  res.json({ success: true });
});

// Update session status (for doctors to mark patients as completed)
router.patch("/intake/:sessionId/status", async (req, res) => {
  const sessionId = String(req.params.sessionId);
  const { status, completedBy, completedAt } = req.body;
  const session = await findStoredSession(sessionId);
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  session.status = status || "completed";
  session.completedBy = completedBy || "doctor";
  session.completedAt = completedAt || new Date().toISOString();
  session.updatedAt = new Date().toISOString();
  await saveSession(session);
  res.json({ success: true, session });
});

export default router;
