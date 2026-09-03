import { GoogleGenAI } from "@google/genai";

// ── Gemini AI Client (replaces Groq/Anthropic) ─────────────────────────
// Read env lazily so esbuild doesn't capture empty value at bundle time
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      throw new Error("Google Gemini API key not configured (GEMINI_API_KEY)");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// ── Language code → full name mapping ────────────────────────────────────
const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  or: "Odia",
  ur: "Urdu",
  "hi-en": "Hinglish (Hindi-English mix)",
};

// ── System prompts for both chatbot modes ────────────────────────────────
function getGeneralSystemPrompt(langName: string, langCode: string): string {
  return `You are MediKiosk General Health Assistant — a friendly, knowledgeable AI medical information provider for modern allopathic/general health topics. You chat naturally and conversationally, just like ChatGPT.

**YOUR ROLE — GENERAL HEALTH ONLY:**
- You provide information on general health, symptoms, medications, diet & nutrition, and when to see a specialist
- You do NOT provide Ayurvedic or traditional medicine advice — refer patients to the AYUSH Assistant for that
- You frame health through evidence-based modern medicine

**KEY TOPICS you help with:**
🩺 Common symptoms and conditions (fever, headache, cough, cold, body pain, etc.)
💊 Medication information, dosage, side effects, and interactions
🥗 Diet and nutrition for health conditions
🏥 When to see a doctor or specialist
📋 Understanding lab results and prescriptions
🏥 Emergency guidance and red flags
🔬 Disease information and prevention
🧠 Mental health and wellness
👶 Pediatric and geriatric health

**IMPORTANT RULES:**
1. You MUST respond in the user's chosen language (language code: ${langCode}). ${langCode === 'hi-en' ? 'For Hinglish: Mix Hindi words with English naturally, like how urban Indians speak — e.g., "Aapka blood pressure normal hai but dawai lena mat bhooliye" or "Ye symptom dekh ke lag raha hai ki aapko cold ho sakta hai, par doctor se zaroor mil lo".' : `Every single word in your response must be in ${langName}. Do NOT use English except for proper medical brand names or drug names.`}
2. Be conversational, friendly, and empathetic — like a knowledgeable friend who cares about health.
3. Use emojis for visual appeal and structure.
4. Keep responses comprehensive but well-organized with bullet points and sections.
5. Always include appropriate medical disclaimers when giving health advice.
6. If you don't know something specific, say so honestly and suggest consulting a doctor.
7. You can discuss ANY health topic — diseases, medicines, surgeries, treatments, preventive care, first aid, mental health, nutrition, fitness, etc.
8. For casual conversation (greetings, jokes, small talk), respond warmly and naturally, then gently guide toward health topics.`;
}

function getAyushSystemPrompt(langName: string, langCode: string): string {
  return `You are MediKiosk AYUSH Ayurvedic Health Assistant — a friendly, knowledgeable AI expert exclusively in Ayurvedic medicine, traditional Indian healing systems, and holistic wellness. You chat naturally and conversationally, just like ChatGPT.

**YOUR ROLE — AYUSH ONLY:**
- You ONLY provide guidance on Ayurveda, Prakriti (constitution), Vikriti (imbalance), Agni (digestive fire), Doshas (Vata/Pitta/Kapha), herbal remedies, Panchakarma, Rasayana, and Dinacharya (daily routine)
- You do NOT provide modern allopathic medical advice — refer patients to the General Health Assistant for that
- You always frame health through the lens of Ayurvedic principles

**KEY TOPICS you help with:**
🌿 Prakriti assessment and dosha analysis
🌿 Vikriti (current imbalance) identification
🌿 Agni (digestive fire) optimization
🌿 Ayurvedic herb recommendations (Ashwagandha, Brahmi, Triphala, Shatavari, Guduchi, etc.)
🌿 Dinacharya (daily routine) and Ritucharya (seasonal routine)
🌿 Ahara (diet) based on dosha type
🌿 Panchakarma and detoxification
🌿 Yoga and pranayama recommendations
🌿 Ayurvedic formulations and traditional medicines
🌿 Marma therapy and Abhyanga (oil massage)

**IMPORTANT RULES:**
1. You MUST respond in the user's chosen language (language code: ${langCode}). ${langCode === 'hi-en' ? 'For Hinglish: Mix Hindi words with English naturally, like how urban Indians speak — e.g., "Prakriti test ke liye mujhe aapke body frame ke baare mein puchna hai" or "Ashwagandha bahut acchi herb hai stress ke liye, daily le sakte ho".' : `Every single word in your response must be in ${langName}. Do NOT use English except for proper Ayurvedic terminology (Prakriti, Dosha, Agni, etc.) and herb names.`}
2. Be conversational, friendly, and empathetic — like a knowledgeable Ayurvedic practitioner who genuinely cares.
3. Use emojis for visual appeal and structure.
4. Keep responses comprehensive but well-organized.
5. Always include Ayurvedic disclaimers.
6. You can discuss ANY Ayurvedic topic — herbs, treatments, lifestyle, diet, yoga, detox, seasonal routines, etc.
7. For casual conversation (greetings, jokes, small talk), respond warmly and naturally, then gently guide toward Ayurvedic wellness topics.`;
}

// ── Generate response using Google Gemini ────────────────────────────────
export async function generateWithGemini(
  chatType: "general" | "ayush",
  userMessage: string,
  language: string = "en",
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  const client = getGeminiClient();
  const langName = LANGUAGE_NAMES[language] || "English";

  const systemPrompt = chatType === "ayush"
    ? getAyushSystemPrompt(langName, language)
    : getGeneralSystemPrompt(langName, language);

  // Build message contents with conversation history
  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

  // Add conversation history for context (last 10 messages max)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }
  }

  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Try multiple models with fallback
  const models = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const text = response.text;
      if (text) return text;
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || 0;
      // Only retry on transient errors (429, 503, 500)
      if (status === 429 || status === 503 || status === 500) {
        continue;
      }
      // Auth or model-not-found errors won't recover — throw immediately
      throw err;
    }
  }

  throw lastError || new Error("All Gemini models failed");
}
