import { Router } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";
import { transcribeWithSarvam, mapLanguageCode } from "../lib/sarvam-voice";
import { getDiseaseCategory, getDiseaseQuestions, type DiseaseQuestion } from "../lib/disease-questions";

const router = Router();

function getOpenAIClient() {
  const baseURL = process.env["GROQ_BASE_URL"] || "https://api.groq.com/openai/v1";
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new Error("Groq integration env var not set (GROQ_API_KEY)");
  return new OpenAI({ baseURL, apiKey });
}

// Language instructions for AI prompts — supports ALL Indian languages
const LANG_INSTRUCTIONS: Record<string, string> = {
  en: "Respond in English.",
  hi: "Respond in Hindi (Devanagari script) mixed with English medical terms.",
  ta: "Respond in Tamil mixed with English medical terms.",
  te: "Respond in Telugu mixed with English medical terms.",
  bn: "Respond in Bengali mixed with English medical terms.",
  mr: "Respond in Marathi mixed with English medical terms.",
  gu: "Respond in Gujarati mixed with English medical terms.",
  kn: "Respond in Kannada mixed with English medical terms.",
  ml: "Respond in Malayalam mixed with English medical terms.",
  pa: "Respond in Punjabi (Gurmukhi script) mixed with English medical terms.",
  or: "Respond in Odia mixed with English medical terms.",
  as: "Respond in Assamese mixed with English medical terms.",
  ur: "Respond in Urdu (Nastaliq script) mixed with English medical terms.",
  sa: "Respond in Sanskrit mixed with English medical terms.",
  ne: "Respond in Nepali mixed with English medical terms.",
  ks: "Respond in Kashmiri mixed with English medical terms.",
  sd: "Respond in Sindhi mixed with English medical terms.",
  mai: "Respond in Maithili mixed with English medical terms.",
  doi: "Respond in Dogri mixed with English medical terms.",
  kok: "Respond in Konkani mixed with English medical terms.",
  mni: "Respond in Manipuri mixed with English medical terms.",
  si: "Respond in Sinhala mixed with English medical terms.",
};

// ── Conversational clinical follow-up generation ──────────────────────────
router.post("/ai/clinical-followup", async (req, res) => {
  try {
    const { chiefComplaint, answers, language, step, mode } = req.body;

    let followUp;
    try {
      const openai = getOpenAIClient();

      const historyText = (answers || []).map((a: any) => `${a.category}: ${a.answer}`).join("\n");
      const langCode = language || "en";
      const langInstruction = LANG_INSTRUCTIONS[langCode] || LANG_INSTRUCTIONS["en"];

      // Get disease-specific questions if chief complaint matches a known disease
      const diseaseCategory = getDiseaseCategory(chiefComplaint || "");
      let diseaseContext = "";
      if (diseaseCategory) {
        const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
        if (diseaseQuestions.length > 0) {
          const unansweredCategories = diseaseQuestions
            .filter((q) => !(answers || []).some((a: any) => a.category === q.category))
            .map((q) => `- ${q.category}: ${q.question}`);
          
          if (unansweredCategories.length > 0) {
            diseaseContext = `\nDisease-specific follow-up for "${diseaseCategory}" (ask these in the selected language):\n${unansweredCategories.join("\n")}`;
          }
        }
      }

      const isAyush = mode === "ayush";
      const systemPrompt = isAyush
        ? `You are MediKiosk Ayurvedic AI, an expert in Ayurvedic clinical history-taking for Indian hospital OPDs.
You conduct Dashavidha Pariksha (ten-fold examination) interviews — Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Sattva, Ahara Shakti, Vyayama Shakti, and Vaya.
You also assess Ahara-Vihara (diet and lifestyle), Agni (digestive capacity), and Samprapti (pathogenesis).
${langInstruction}
Respond ONLY with a valid JSON object.`
        : `You are MediKiosk Clinical AI, an expert clinical history-taking assistant for Indian hospital OPDs.
You conduct structured clinical interviews following standard medical history-taking frameworks.
${langInstruction}
Respond ONLY with a valid JSON object.`;

      const userMessage = `Chief complaint: ${chiefComplaint || "Not yet specified"}
Current step: ${step || 0}
Mode: ${isAyush ? "AYUSH (Ayurvedic)" : "Allopathic"}
History so far:
${historyText || "No answers yet."}

Generate the next clinical follow-up question.${isAyush ? `\nConsider Ayurvedic assessment frameworks:
1. Dashavidha Pariksha (10 qualities) — which pariksha hasn't been covered yet
2. Prakriti assessment — body type, mental constitution
3. Vikriti assessment — current imbalance and its causes
4. Agni — digestive fire and capacity
5. Ahara-Vihara — diet and lifestyle patterns
6. Samprapti — disease pathogenesis chain` : `\nConsider:
1. SOCRATES framework for pain (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving factors, Severity)
2. Systematic review if chief complaint is clear
3. Red flag screening for emergency symptoms`}${diseaseContext}

Return JSON with:
{
  "question": "The next question to ask the patient (in the selected language)",
  "category": "Which part of history this covers",
  "hint": "Brief explanation of why this question is being asked",
  "isEmergency": true/false,
  "emergencyMessage": "If emergency, the alert message for triage staff"
}`;

      const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      followUp = content ? JSON.parse(content) : null;
    } catch (apiError: any) {
      logger.info({ err: apiError.message }, "Cloud AI failed, using fallback follow-up");
      followUp = null;
    }

    // Fallback follow-up logic — disease-specific or generic
    if (!followUp) {
      const diseaseCategory = getDiseaseCategory(chiefComplaint || "");
      const langCode = language || "en";

      if (diseaseCategory) {
        // Use disease-specific questions as fallback
        const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
        const answeredCategories = new Set((answers || []).map((a: any) => a.category));
        const unanswered = diseaseQuestions.filter((q) => !answeredCategories.has(q.category));
        
        if (unanswered.length > 0) {
          const q = unanswered[0];
          followUp = {
            question: q.question,
            category: q.category,
            hint: `Disease-specific question for ${diseaseCategory}`,
            isEmergency: false,
          };
        }
      }

      // Generic fallbacks if no disease match or all disease questions answered
      if (!followUp) {
        const alloFallbacks = [
          "When did this problem start? Was it sudden or gradual?",
          "Can you describe the severity on a scale of 1 to 10?",
          "Do you have any other symptoms along with this?",
          "Do you have any known allergies?",
          "Are you currently taking any medications?",
          "Is there any similar illness in your family?",
          "Do you smoke or consume alcohol?",
          "Have you had any surgeries before?",
        ];
        const ayushFallbacks = [
          "What is your body type — thin (Vata), medium (Pitta), or heavy (Kapha)?",
          "How is your digestion? Do you feel hungry at regular times?",
          "Describe your main symptom — when did it start and what caused it?",
          "How is your skin, hair, and nail quality?",
          "How is your physical endurance and recovery after exercise?",
          "How well do you adapt to changes in weather and food?",
          "How is your mental state — calm, anxious, or irritable?",
          "What does your daily diet and routine look like?",
        ];
        const isAyush = mode === "ayush";
        const pool = isAyush ? ayushFallbacks : alloFallbacks;
        const idx = (step || 0) % pool.length;
        const cats = isAyush
          ? ["Prakriti", "Agni", "Chief Complaint", "Sara", "Vyayama Shakti", "Satmya", "Sattva", "Ahara-Vihara"]
          : ["HPI", "Pain Assessment", "Review of Systems", "Drug & Allergy", "Medication History", "Family History", "Personal History", "Past Surgical History"];
        followUp = {
          question: pool[idx],
          category: cats[idx] || "Additional History",
          hint: "Standard clinical follow-up",
          isEmergency: false,
        };
      }
    }

    // Also return MCQ options for the question if available
    const diseaseCategory = getDiseaseCategory(chiefComplaint || "");
    let mcqOptions: string[] | null = null;
    if (diseaseCategory) {
      const langCode = language || "en";
      const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
      const matchingQ = diseaseQuestions.find((q) => q.category === followUp.category);
      if (matchingQ?.mcqOptions) {
        mcqOptions = matchingQ.mcqOptions;
      }
    }

    res.json({ ...followUp, mcqOptions });
  } catch (err) {
    logger.error({ err }, "Clinical follow-up generation failed");
    res.status(500).json({ error: "Follow-up generation failed" });
  }
});

// ── Get disease-specific MCQs ────────────────────────────────────────────
router.post("/ai/disease-mcqs", (req, res) => {
  try {
    const { chiefComplaint, language, answeredCategories } = req.body;
    const langCode = language || "en";
    const diseaseCategory = getDiseaseCategory(chiefComplaint || "");
    
    if (!diseaseCategory) {
      // Return generic MCQs in the selected language for EVERY question slot
      const genericMcqs: Record<string, string[]> = {
        en: ["Yes", "No", "Not sure", "Sometimes"],
        hi: ["हाँ", "नहीं", "पता नहीं", "कभी-कभी"],
        ta: ["ஆம்", "இல்லை", "தெரியவில்லை", "சில நேரங்களில்"],
        te: ["అవును", "కాదు", "తెలియదు", "కొన్నిసార్లు"],
        bn: ["হ্যাঁ", "না", "জানি না", "মাঝে মাঝে"],
        mr: ["हो", "नाही", "माहीत नाही", "कधी कधी"],
        gu: ["હા", "ના", "ખબર નથી", "ક્યારેક"],
        kn: ["ಹೌದು", "ಇಲ್ಲ", "ಗೊತ್ತಿಲ್ಲ", "ಕೆಲವೊಮ್ಮೆ"],
        ml: ["അതെ", "ഇല്ല", "അറിയില്ല", "ചിലപ്പോൾ"],
        pa: ["ਹਾਂ", "ਨਹੀਂ", "ਪਤਾ ਨਹੀਂ", "ਕਦੇ ਕਦੇ"],
        or: ["ହଁ", "ନାହିଁ", "ଜଣା ନାହିଁ", "କେତେବେଳେ"],
        as: ["হয়", "নহয়", "জানো নাই", "কেতিয়াবা"],
        ur: ["ہاں", "نہیں", "پتا نہیں", "کبھی کبھی"],
        sa: ["आम्", "न", "ज्ञातं नास्ति", "कदाचित्"],
        ne: ["हो", "होइन", "थाहा छैन", "कहिलेकाहीं"],
      };
      
      const options = genericMcqs[langCode] || genericMcqs["en"];
      // Return generic MCQs for every question slot (up to 15 questions)
      const numSlots = Math.max((answeredCategories?.length || 0) + 1, 15);
      return res.json({
        mcqs: Array.from({ length: numSlots }, () => options),
        diseaseCategory: null,
        availableQuestions: numSlots - (answeredCategories?.length || 0),
      });
    }

    const diseaseQuestions = getDiseaseQuestions(diseaseCategory, langCode);
    const allMcqs = diseaseQuestions.map((q) => q.mcqOptions || null);
    const answered = new Set(answeredCategories || []);

    return res.json({
      mcqs: allMcqs,
      diseaseCategory,
      availableQuestions: diseaseQuestions.filter((q) => !answered.has(q.category)).length,
    });
  } catch (err) {
    logger.error({ err }, "Disease MCQ generation failed");
    return res.status(500).json({ error: "MCQ generation failed" });
  }
});

// ── Transcribe audio input ────────────────────────────────────────────────
router.post("/ai/transcribe", async (req, res) => {
  try {
    const { audioBase64, mimeType, language } = req.body;
    if (!audioBase64) {
      res.status(400).json({ error: "audioBase64 is required" });
      return;
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    // Try Sarvam AI first (best for Indian languages)
    try {
      const sarvamLang = language ? mapLanguageCode(language) : undefined;
      const result = await transcribeWithSarvam(audioBuffer, {
        languageCode: sarvamLang,
        model: "saaras:v4",
        mode: "transcribe",
        mimeType: mimeType || "audio/webm",
      });

      logger.info({ language: result.languageCode, requestedLang: language }, "Sarvam transcription successful");
      res.json({
        transcript: result.transcript,
        language: result.languageCode,
        provider: "sarvam",
      });
    } catch (sarvamError: any) {
      logger.info({ err: sarvamError.message, language }, "Sarvam failed, trying Groq/Whisper");

      // Fallback to Groq/Whisper
      try {
        const openai = getOpenAIClient();
        const ext = mimeType?.includes("ogg") ? "ogg" : "webm";
        const file = new File([audioBuffer], `recording.${ext}`, { type: mimeType || "audio/webm" });

        const transcription = await openai.audio.transcriptions.create({
          file,
          model: "whisper-large-v3",
          response_format: "json",
        });

        res.json({ transcript: transcription.text, provider: "groq-whisper" });
      } catch (apiError: any) {
        logger.info({ err: apiError.message }, "All transcription services failed");
        res.json({ transcript: "", fallback: true, message: "Voice transcription unavailable. Please type your answer." });
      }
    }
  } catch (err) {
    logger.error({ err }, "AI transcription failed");
    res.json({ transcript: "", fallback: true, message: "Transcription unavailable. Please type your answer." });
  }
});

// ── Extract clinical entities from text ───────────────────────────────────
router.post("/ai/extract-clinical", async (req, res) => {
  try {
    const { text, documentType } = req.body;
    if (!text) {
      res.status(400).json({ error: "text is required" });
      return;
    }

    let extraction;
    try {
      const openai = getOpenAIClient();

      const systemPrompt = `You are MediKiosk Document Intelligence, an expert at extracting clinical entities from medical documents.
Respond ONLY with a valid JSON object.`;

      const userMessage = `Extract clinical entities from this ${documentType || "medical document"}:

"${text}"

Return JSON with:
{
  "diagnoses": ["list of diagnoses found"],
  "medications": [{"name": "...", "dosage": "...", "frequency": "..."}],
  "labValues": [{"name": "...", "value": "...", "unit": "...", "referenceRange": "...", "status": "Normal|High|Low"}],
  "procedures": ["list of procedures/surgeries"],
  "allergies": ["list of allergies"],
  "dates": {"admission": "...", "discharge": "...", "visit": "..."}
}`;

      const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      extraction = content ? JSON.parse(content) : null;
    } catch (apiError: any) {
      logger.info({ err: apiError.message }, "Cloud AI failed for entity extraction");
      extraction = null;
    }

    if (!extraction) {
      extraction = {
        diagnoses: [],
        medications: [],
        labValues: [],
        procedures: [],
        allergies: [],
        dates: {},
      };
    }

    res.json({ extraction });
  } catch (err) {
    logger.error({ err }, "Clinical entity extraction failed");
    res.status(500).json({ error: "Entity extraction failed" });
  }
});

export default router;
