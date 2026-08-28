import { Router } from "express";
import { logger } from "../lib/logger";
import crypto from "crypto";

const router = Router();

// ─── Types ─────────────────────────────────────────────────────────────────

interface HealthChatMessage {
  id: string;
  role: "patient" | "bot";
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  category?: string;
}

interface HealthChatSession {
  sessionId: string;
  patientId: string;
  patientName: string;
  language: string;
  mode: "general" | "symptom_checker" | "health_education";
  messages: HealthChatMessage[];
  extractedData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const healthSessions: Map<string, HealthChatSession> = new Map();

// ─── Knowledge Base ────────────────────────────────────────────────────────

const HEALTH_KNOWLEDGE: Record<string, { shortAnswer: string; details: string; keywords: string[] }> = {
  fever: {
    shortAnswer: "Fever is your body's response to infection or illness. A temperature above 100.4°F (38°C) is generally considered a fever.",
    details: "Fever can be caused by viral infections, bacterial infections, autoimmune conditions, or heat exhaustion. Stay hydrated, rest, and take paracetamol if needed. Seek medical attention if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe headache, rash, or difficulty breathing.",
    keywords: ["fever", "temperature", "hot", "burning up", "chills"],
  },
  headache: {
    shortAnswer: "Headaches can range from tension-type to migraines. Most are not serious but persistent or severe headaches should be evaluated.",
    details: "Common causes include stress, dehydration, poor sleep, eye strain, sinus issues, or medication overuse. Tension headaches feel like a band around the head. Migraines are throbbing, usually one-sided, with nausea and light sensitivity. Seek emergency care for sudden severe headache ('thunderclap'), headache with fever and stiff neck, or headache after head injury.",
    keywords: ["headache", "head pain", "migraine", "head ache", "head pressure"],
  },
  cough: {
    shortAnswer: "Coughing is a reflex to clear airways. Acute coughs often resolve within 2-3 weeks.",
    details: "Dry coughs may indicate allergies, asthma, or early viral infection. Wet/productive coughs suggest mucus in the airways, possibly from cold, flu, or pneumonia. See a doctor if cough lasts more than 3 weeks, produces blood, or is accompanied by high fever, wheezing, or difficulty breathing.",
    keywords: ["cough", "coughing", "dry cough", "wet cough", "phlegm"],
  },
  diabetes: {
    shortAnswer: "Diabetes is a chronic condition affecting blood sugar regulation. Type 1 is autoimmune; Type 2 is lifestyle-related.",
    details: "Common symptoms include increased thirst, frequent urination, unexplained weight loss, fatigue, and blurred vision. Management includes regular blood sugar monitoring, medication (metformin for Type 2), healthy diet, and regular exercise. Keep HbA1c below 7% as recommended. Always carry glucose tablets for hypoglycemia.",
    keywords: ["diabetes", "sugar", "blood sugar", "insulin", "glucose", "diabetic"],
  },
  bp: {
    shortAnswer: "Blood pressure measures the force of blood against artery walls. Normal is below 120/80 mmHg.",
    details: "Hypertension (high BP) increases risk of heart disease, stroke, and kidney damage. Lifestyle changes include reducing salt intake, regular exercise, maintaining healthy weight, limiting alcohol, and managing stress. Medications include ACE inhibitors, ARBs, calcium channel blockers, and diuretics. Monitor BP regularly at home.",
    keywords: ["blood pressure", "bp", "hypertension", "high pressure", "heart pressure"],
  },
  stomach: {
    shortAnswer: "Stomach issues can include pain, bloating, nausea, indigestion, or changes in bowel habits.",
    details: "Common causes include gastritis, GERD, food intolerance, infections (H. pylori), or stress. Eat small frequent meals, avoid spicy/acidic foods, don't lie down immediately after eating. Seek care for persistent pain, blood in stool, unexplained weight loss, or difficulty swallowing.",
    keywords: ["stomach", "gastric", "acidity", "indigestion", "bloating", "belly", "abdomen", "tummy"],
  },
  allergy: {
    shortAnswer: "Allergies are immune responses to harmless substances. Symptoms range from mild (sneezing, itching) to severe (anaphylaxis).",
    details: "Common allergens include pollen, dust mites, pet dander, certain foods (nuts, shellfish, dairy), and medications. Antihistamines help with mild symptoms. For severe allergies, always carry an epinephrine auto-injector (EpiPen). Allergy testing can identify specific triggers.",
    keywords: ["allergy", "allergic", "sneezing", "itching", "rash", "hives"],
  },
  sleep: {
    shortAnswer: "Adults need 7-9 hours of quality sleep. Sleep disorders can significantly impact health.",
    details: "Good sleep hygiene includes: consistent bedtime, cool dark room, no screens 1 hour before bed, limit caffeine after 2 PM, regular exercise (not close to bedtime). Insomnia, sleep apnea, and restless leg syndrome are common disorders. See a doctor if you consistently have trouble sleeping or feel tired despite adequate sleep time.",
    keywords: ["sleep", "insomnia", "can't sleep", "tired", "fatigue", "rest"],
  },
  exercise: {
    shortAnswer: "Regular physical activity is crucial for health. Aim for 150 minutes of moderate or 75 minutes of vigorous exercise weekly.",
    details: "Benefits include weight management, improved cardiovascular health, better mental health, stronger bones and muscles, and reduced risk of chronic diseases. Start slowly if new to exercise. Mix cardio (walking, swimming), strength training, and flexibility exercises. Consult a doctor before starting if you have existing health conditions.",
    keywords: ["exercise", "workout", "fitness", "physical activity", "gym", "walking"],
  },
  diet: {
    shortAnswer: "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats.",
    details: "Key guidelines: eat 5+ servings of fruits/vegetables daily, choose whole grains over refined, limit processed foods and added sugars, stay hydrated (8 glasses of water daily), moderate portion sizes. India-specific: traditional thali meals are well-balanced. Include turmeric, ginger, and garlic for anti-inflammatory benefits.",
    keywords: ["diet", "food", "nutrition", "eating", "healthy eating", "weight loss"],
  },
};

const EMERGENCY_KEYWORDS = [
  "chest pain", "severe pain", "difficulty breathing", "unconscious", "heavy bleeding",
  "stroke", "can't breathe", "heart attack", "severe allergic", "anaphylaxis",
  "seizure", "overdose", "suicide", "self harm",
  "छाती में दर्द", "सांस नहीं आ रही", "बेहोश", "दिल का दौरा",
];

const GENERAL_RESPONSES: Record<string, Record<string, string>> = {
  greeting: {
    en: "Hello! I'm your health assistant. I can help you with general health information, symptom guidance, and wellness tips. How can I help you today?",
    hi: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। मैं सामान्य स्वास्थ्य जानकारी, लक्षण मार्गदर्शन और कल्याण युक्तियों में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
  },
  emergency: {
    en: "⚠️ This may be a medical emergency. Please seek immediate medical attention. Call your local emergency number (108 in India) or go to the nearest hospital emergency room immediately. Do not wait for an online consultation.",
    hi: "⚠️ यह एक चिकित्सा आपातकाल हो सकता है। कृपया तुरंत चिकित्सा सहायता प्राप्त करें। अपनी स्थानीय आपातकालीन संख्या (भारत में 108) पर कॉल करें या तुरंत निकटतम अस्पताल के आपातकाल कक्ष में जाएं।",
  },
  general: {
    en: "I can help you with information about various health topics. You can ask me about:\n• Common symptoms (fever, headache, cough)\n• Chronic conditions (diabetes, blood pressure)\n• Diet and nutrition\n• Exercise and fitness\n• Sleep health\n• Allergies\n\nWhat would you like to know?",
    hi: "मैं विभिन्न स्वास्थ्य विषयों के बारे में जानकारी में मदद कर सकता हूं। आप मुझसे पूछ सकते हैं:\n• सामान्य लक्षण (बुखार, सिरदर्द, खांसी)\n• दीर्घकालिक स्थितियां (मधुमेह, रक्तचाप)\n• आहार और पोषण\n• व्यायाम और फिटनेस\n• नींद का स्वास्थ्य\n• एलर्जी\n\nआप क्या जानना चाहेंगे?",
  },
  disclaimer: {
    en: "\n\n⚕️ Disclaimer: This is general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.",
    hi: "\n\n⚕️ अस्वीकरण: यह केवल सामान्य स्वास्थ्य जानकारी है और पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। चिकित्सा चिंताओं के लिए हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।",
  },
};

// ─── AI Client (Anthropic Claude) ─────────────────────────────────────────

async function getClaude() {
  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) return null;
    return new Anthropic({ apiKey });
  } catch {
    return null;
  }
}

async function generateHealthResponse(
  userMessage: string,
  mode: string,
  language: string,
  conversationHistory: Array<{ role: "user" | "assistant" | "system"; content: string }>,
): Promise<{ message: string; category?: string; suggestedActions?: string[]; extractedData?: Record<string, unknown> }> {
  const msg = userMessage.toLowerCase().trim();

  // Emergency check
  if (EMERGENCY_KEYWORDS.some((k) => msg.includes(k))) {
    return {
      message: GENERAL_RESPONSES.emergency[language as keyof typeof GENERAL_RESPONSES.emergency] || GENERAL_RESPONSES.emergency.en,
      category: "safety",
      suggestedActions: ["Call Emergency (108)", "Go to Hospital"],
    };
  }

  // Try Claude AI first
  const claude = await getClaude();
  if (claude) {
    try {
      const langName = language === "hi" ? "Hindi" : "English";
      const systemPrompt = `You are a helpful healthcare assistant for MediKiosk. You provide general health information, symptom guidance, and wellness tips. Respond in ${langName}.

RULES:
- Be warm, professional, and empathetic
- Provide accurate general health information
- Do NOT diagnose diseases or prescribe medicines
- Always recommend consulting a doctor for serious concerns
- Keep responses concise (3-5 sentences)
- For emergencies, immediately tell the user to seek medical help
- Include a brief disclaimer when giving health advice`;

      const response = await claude.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: systemPrompt,
        messages: [
          ...conversationHistory.slice(-6).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user", content: userMessage },
        ],
      });

      const text = response.content[0]?.type === "text" ? response.content[0].text : null;
      if (text) {
        return {
          message: text + (GENERAL_RESPONSES.disclaimer[language as keyof typeof GENERAL_RESPONSES.disclaimer] || ""),
          category: "health_info",
          suggestedActions: ["Ask Another Question", "Symptom Checker", "Health Tips"],
        };
      }
    } catch {
      // Fall through to template
    }
  }

  // Template fallback — search knowledge base
  for (const [, entry] of Object.entries(HEALTH_KNOWLEDGE)) {
    if (entry.keywords.some((kw) => msg.includes(kw))) {
      const langKey = language as keyof typeof entry;
      return {
        message: entry.shortAnswer + "\n\n" + entry.details + (GENERAL_RESPONSES.disclaimer[language as keyof typeof GENERAL_RESPONSES.disclaimer] || ""),
        category: "health_info",
        suggestedActions: ["Learn More", "Ask Another Question", "Health Tips"],
      };
    }
  }

  // Default response
  return {
    message: GENERAL_RESPONSES.general[language as keyof typeof GENERAL_RESPONSES.general] || GENERAL_RESPONSES.general.en,
    category: "general",
    suggestedActions: ["Common Symptoms", "Chronic Conditions", "Diet & Nutrition", "Exercise"],
  };
}

// ─── Routes ────────────────────────────────────────────────────────────────

router.post("/healthchat/session", (req, res) => {
  try {
    const { patientId, patientName, language, mode } = req.body;
    const sessionId = `HLTH-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const lang = (language || "en") as string;

    const session: HealthChatSession = {
      sessionId,
      patientId: patientId || "PT-001",
      patientName: patientName || "Patient",
      language: lang,
      mode: mode || "general",
      messages: [],
      extractedData: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    healthSessions.set(sessionId, session);

    const greeting = GENERAL_RESPONSES.greeting[lang] || GENERAL_RESPONSES.greeting.en;
    const botMsg: HealthChatMessage = {
      id: `MSG-${Date.now()}`,
      role: "bot",
      content: greeting,
      timestamp: new Date().toISOString(),
      suggestedActions: ["Common Symptoms", "Chronic Conditions", "Diet & Nutrition", "Exercise Tips"],
    };
    session.messages.push(botMsg);
    healthSessions.set(sessionId, session);

    res.json({ sessionId, greeting, mode: session.mode, language: session.language });
  } catch (err) {
    logger.error({ err }, "Failed to create health chat session");
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.post("/healthchat/message", async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const session = healthSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const patientMsg: HealthChatMessage = {
      id: `MSG-${Date.now()}-p`,
      role: "patient",
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(patientMsg);

    const conversationHistory = session.messages.map((m) => ({ role: m.role as "user" | "assistant" | "system", content: m.content }));
    const response = await generateHealthResponse(message, session.mode, session.language, conversationHistory);

    const botMsg: HealthChatMessage = {
      id: `MSG-${Date.now()}-b`,
      role: "bot",
      content: response.message,
      timestamp: new Date().toISOString(),
      suggestedActions: response.suggestedActions,
      category: response.category,
    };
    session.messages.push(botMsg);
    session.updatedAt = new Date().toISOString();
    healthSessions.set(sessionId, session);

    res.json({
      messageId: botMsg.id,
      message: response.message,
      suggestedActions: response.suggestedActions,
      category: response.category,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send health chat message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/healthchat/session/:id", (req, res) => {
  const session = healthSessions.get(req.params.id);
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  res.json(session);
});

export default router;
