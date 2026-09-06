import OpenAI from "openai";

// ── MediKiosk Chat AI Client ─────────────────────────────────────────────
// Generates conversational replies for the General Health + AYUSH chatbots
// and (as structured JSON) the clinical summaries.
//
// Provider order:
//   1. Google Gemini (GEMINI_API_KEY) — `gemini-2.5-flash` by default
//   2. Groq (GROQ_API_KEY) — open-weight models (gpt-oss / qwen)
//   3. OpenAI "Luna" tier model `gpt-5.6-luna` (OPENAI_API_KEY)
// If every provider fails, `generateWithAI` throws and the caller falls back
// to its built-in knowledge base / template responses.
//
// Notes:
//   - `max_completion_tokens` (not `max_tokens`) is required by the OpenAI
//     tier model and the Groq API.
//   - Current Groq reasoning models and OpenAI's Luna model only accept the
//     default temperature, so no temperature is sent.
// Read env lazily so esbuild doesn't capture empty value at bundle time

type ProviderClient = { client: OpenAI; baseURL?: string; apiKey?: string };

type GenerateOptions = {
  /** Ask the provider for strictly-valid JSON output (used for clinical summaries). */
  json?: boolean;
};

// Terse system prompt used when the caller needs a structured JSON payload
// (clinical summaries) instead of conversational prose.
const JSON_SYSTEM_PROMPT =
  "You are a clinical documentation engine. Respond with ONLY a single valid JSON object — no markdown fences, no commentary, and no text outside the JSON. Match the exact JSON schema the user describes. Keep clinical language precise and complete.";

function getClient(opts: { apiKeyVar: string; baseURLVar?: string }): OpenAI {
  const apiKey = process.env[opts.apiKeyVar];
  const baseURL = opts.baseURLVar ? process.env[opts.baseURLVar] : undefined;
  return new OpenAI({ apiKey: apiKey || "", baseURL });
}

function getGroqClient(): OpenAI {
  return getClient({
    apiKeyVar: "GROQ_API_KEY",
    baseURLVar: "GROQ_BASE_URL",
  });
}

function getLunaClient(): OpenAI {
  return getClient({ apiKeyVar: "OPENAI_API_KEY" });
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
🌿 Ayurvedic herb recommendations (Ashwagandha, Brahmi, Triphala, Shatavati, Guduchi, etc.)
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
4. Keep responses comprehensive and well-organized.
5. Always include Ayurvedic disclaimers.
6. You can discuss ANY Ayurvedic topic — herbs, treatments, lifestyle, diet, yoga, detox, seasonal routines, etc.
7. For casual conversation (greetings, jokes, small talk), respond warmly and naturally, then gently guide toward Ayurvedic wellness topics.`;
}

function buildMessages(
  chatType: "general" | "ayush",
  userMessage: string,
  language: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const langName = LANGUAGE_NAMES[language] || "English";
  const systemPrompt = chatType === "ayush"
    ? getAyushSystemPrompt(langName, language)
    : getGeneralSystemPrompt(langName, language);

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    const recentHistory = conversationHistory.slice(-10);
    // Sessions often open with the assistant greeting; providers (especially
    // Gemini) require the first content turn to be from the user — so drop
    // any leading assistant turns before appending history.
    const firstUserIdx = recentHistory.findIndex((m) => m.role === "user");
    const start = firstUserIdx >= 0 ? firstUserIdx : 0;
    for (let i = start; i < recentHistory.length; i++) {
      const msg = recentHistory[i];
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
    }
  }

  messages.push({ role: "user", content: userMessage });
  return messages;
}

/** Run one chat-completion attempt against a provider client/model. */
async function runCompletion(
  client: OpenAI,
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  opts?: GenerateOptions
): Promise<string> {
  const response = await client.chat.completions.create({
    model,
    messages: opts?.json
      ? [{ role: "system" as const, content: JSON_SYSTEM_PROMPT }, ...messages.slice(1)]
      : messages,
    // Note: current Groq reasoning models (gpt-oss / qwen) and the OpenAI
    // Luna tier model only support the default temperature (1) — so we do
    // NOT send a temperature field here.
    max_completion_tokens: opts?.json ? 4096 : 2048,
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Empty response from ${model}`);
  return text;
}

/** Gemini generateContent call against the stable v1beta REST API. */
async function runGeminiCompletion(
  model: string,
  systemPrompt: string,
  contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
  opts?: GenerateOptions
): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  const baseURL = process.env["GEMINI_BASE_URL"] || "https://generativelanguage.googleapis.com/v1beta";
  const res = await fetch(`${baseURL}/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey || "",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: opts?.json ? 4096 : 2048,
        ...(opts?.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini ${model} ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  };
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || "")
    .join("")
    .trim();
  if (!text) {
    throw new Error(`Empty Gemini response (${data.candidates?.[0]?.finishReason || "unknown"})`);
  }
  return text;
}

/** Generate with Google Gemini (system prompt extracted from the shared builder). */
async function generateWithGemini(
  chatType: "general" | "ayush",
  userMessage: string,
  language: string,
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>,
  opts?: GenerateOptions
): Promise<string> {
  // JSON mode: skip the chatty persona prompt so the model focuses purely on
  // emitting the structured payload the caller asked for.
  const messages = opts?.json
    ? [{ role: "system" as const, content: JSON_SYSTEM_PROMPT }, ...buildMessages(chatType, userMessage, language, conversationHistory).slice(1)]
    : buildMessages(chatType, userMessage, language, conversationHistory);
  const systemPrompt = messages[0].content;
  const contents = messages.slice(1).map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const geminiModels = [
    process.env["GEMINI_CHAT_MODEL"],
    "gemini-3.5-flash",
    "gemini-2.5-flash-lite",
  ].filter((m): m is string => Boolean(m));

  let lastError: Error | null = null;
  for (const model of geminiModels) {
    try {
      return await runGeminiCompletion(model, systemPrompt, contents, opts);
    } catch (err) {
      lastError = err as Error;
    }
  }
  throw lastError || new Error("Gemini generation failed");
}

/**
 * Generate an AI response, trying providers in order until one succeeds:
 *   1. Google Gemini (GEMINI_API_KEY)
 *   2. Groq (GROQ_API_KEY)
 *   3. OpenAI Luna tier model (OPENAI_API_KEY)
 * Throws when no provider is configured or all attempts fail — callers
 * should fall back to their built-in knowledge base / templates.
 */
export async function generateWithAI(
  chatType: "general" | "ayush",
  userMessage: string,
  language: string = "en",
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>,
  opts?: GenerateOptions
): Promise<string> {
  const lastError: Error[] = [];

  // 1. Google Gemini — primary provider
  if (process.env["GEMINI_API_KEY"]) {
    try {
      return await generateWithGemini(chatType, userMessage, language, conversationHistory, opts);
    } catch (err) {
      lastError.push(err as Error);
    }
  }

  // 2. Groq — fast open-weight models
  if (process.env["GROQ_API_KEY"]) {
    const messages = buildMessages(chatType, userMessage, language, conversationHistory);
    const groqModels = [
      process.env["GROQ_CHAT_MODEL"],
      "openai/gpt-oss-120b",
      "qwen/qwen3.6-27b",
      "openai/gpt-oss-20b",
    ].filter((m): m is string => Boolean(m));

    for (const model of groqModels) {
      try {
        return await runCompletion(getGroqClient(), model, messages, opts);
      } catch (err) {
        lastError.push(err as Error);
      }
    }
  }

  // 3. OpenAI Luna — original premium tier model
  if (process.env["OPENAI_API_KEY"]) {
    const messages = buildMessages(chatType, userMessage, language, conversationHistory);
    const lunaModels = ["gpt-5.6-luna"];
    for (const model of lunaModels) {
      try {
        return await runCompletion(getLunaClient(), model, messages, opts);
      } catch (err) {
        lastError.push(err as Error);
      }
    }
  }

  throw lastError[lastError.length - 1] || new Error("No AI provider configured (GEMINI_API_KEY, GROQ_API_KEY or OPENAI_API_KEY)");
}
