import { logger } from "./logger";

// ─── AI Client Helper ──────────────────────────────────────────────────────

async function getAI() {
  try {
    const OpenAI = (await import("openai")).default;
    const baseURL = process.env["GROQ_BASE_URL"] || "https://api.groq.com/openai/v1";
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) return null;
    return new OpenAI({ baseURL, apiKey });
  } catch {
    return null;
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AyushAnalysisInput {
  patientName: string;
  chiefComplaint?: string;
  duration?: string;
  prakriti?: Record<string, string>;
  vikriti?: Record<string, string>;
  ahara?: Record<string, unknown>;
  vihara?: Record<string, unknown>;
  agni?: Record<string, unknown>;
  koshtha?: Record<string, unknown>;
  nidra?: Record<string, unknown>;
  sattva?: Record<string, unknown>;
  sara?: Record<string, string>;
  samhanana?: Record<string, string>;
  pramana?: Record<string, string>;
  satmya?: Record<string, string>;
  aharaShakti?: Record<string, string>;
  vyayamaShakti?: Record<string, string>;
  vaya?: Record<string, string>;
  previousTreatment?: string;
  documents?: Array<{ fileName: string; documentType: string }>;
  chatSummary?: string;
}

export interface AyushAnalysisResult {
  aiBrief: string;
  clinicalObservations: string[];
  doshaAnalysis: string;
  recommendedFocusAreas: string[];
  riskFlags: string[];
  confidence: "high" | "moderate" | "low";
  assessmentCompleteness: number;
  missingInformation: string[];
  aiGenerated: boolean;
  disclaimer: string;
}

// ─── AI-Powered Analysis ───────────────────────────────────────────────────

export async function generateAyushAnalysis(input: AyushAnalysisInput): Promise<AyushAnalysisResult> {
  const ai = await getAI();

  if (ai) {
    try {
      return await generateWithAI(ai, input);
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "AI AYUSH analysis failed, using template fallback");
    }
  }

  return generateTemplateAnalysis(input);
}

async function generateWithAI(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ai: any,
  input: AyushAnalysisInput,
): Promise<AyushAnalysisResult> {
  const systemPrompt = `You are an expert Ayurvedic clinical analysis system. Analyze the patient's AYUSH assessment data and generate a structured clinical brief for a qualified Ayurvedic practitioner.

IMPORTANT RULES:
- You are an AI assistant, NOT a practitioner
- Do NOT diagnose conditions
- Do NOT prescribe medicines or treatments
- Present observations that require practitioner verification
- Use clear, professional medical language
- Identify dosha patterns based on provided data
- Flag areas needing more information

Respond ONLY with valid JSON matching this schema:
{
  "aiBrief": "string — complete clinical brief in markdown",
  "clinicalObservations": ["string — key observations"],
  "doshaAnalysis": "string — dosha pattern analysis",
  "recommendedFocusAreas": ["string — areas for practitioner to assess"],
  "riskFlags": ["string — potential concerns"],
  "confidence": "high|moderate|low",
  "assessmentCompleteness": number 0-100,
  "missingInformation": ["string — what data is missing"]
}`;

  const dataSummary = buildDataSummary(input);

  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 2000,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze this AYUSH patient assessment:\n\n${dataSummary}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  const parsed = JSON.parse(content) as Omit<AyushAnalysisResult, "aiGenerated" | "disclaimer">;
  return {
    ...parsed,
    aiGenerated: true,
    disclaimer: "AI-generated summary. All findings require practitioner verification. This is not a diagnosis.",
  };
}

function buildDataSummary(input: AyushAnalysisInput): string {
  const parts: string[] = [];
  parts.push(`Patient: ${input.patientName}`);
  parts.push(`Chief Complaint: ${input.chiefComplaint || "Not recorded"}`);
  parts.push(`Duration: ${input.duration || "Not recorded"}`);

  if (input.prakriti) parts.push(`Prakriti: ${JSON.stringify(input.prakriti)}`);
  if (input.vikriti) parts.push(`Vikriti: ${JSON.stringify(input.vikriti)}`);
  if (input.ahara) parts.push(`Ahara (Diet): ${JSON.stringify(input.ahara)}`);
  if (input.vihara) parts.push(`Vihara (Lifestyle): ${JSON.stringify(input.vihara)}`);
  if (input.agni) parts.push(`Agni (Digestion): ${JSON.stringify(input.agni)}`);
  if (input.koshtha) parts.push(`Koshtha (Bowel): ${JSON.stringify(input.koshtha)}`);
  if (input.nidra) parts.push(`Nidra (Sleep): ${JSON.stringify(input.nidra)}`);
  if (input.sattva) parts.push(`Sattva (Well-being): ${JSON.stringify(input.sattva)}`);
  if (input.sara) parts.push(`Sara: ${JSON.stringify(input.sara)}`);
  if (input.samhanana) parts.push(`Samhanana: ${JSON.stringify(input.samhanana)}`);
  if (input.pramana) parts.push(`Pramana: ${JSON.stringify(input.pramana)}`);
  if (input.satmya) parts.push(`Satmya: ${JSON.stringify(input.satmya)}`);
  if (input.aharaShakti) parts.push(`Ahara Shakti: ${JSON.stringify(input.aharaShakti)}`);
  if (input.vyayamaShakti) parts.push(`Vyayama Shakti: ${JSON.stringify(input.vyayamaShakti)}`);
  if (input.vaya) parts.push(`Vaya: ${JSON.stringify(input.vaya)}`);
  if (input.previousTreatment) parts.push(`Previous Treatment: ${input.previousTreatment}`);
  if (input.documents?.length) parts.push(`Documents: ${input.documents.map((d) => `${d.fileName} (${d.documentType})`).join(", ")}`);
  if (input.chatSummary) parts.push(`Chat Summary: ${input.chatSummary}`);

  return parts.join("\n");
}

// ─── Template Fallback (no AI key needed) ──────────────────────────────────

function generateTemplateAnalysis(input: AyushAnalysisInput): AyushAnalysisResult {
  const observations: string[] = [];
  const focusAreas: string[] = [];
  const riskFlags: string[] = [];
  const missing: string[] = [];
  let completeness = 0;
  const sectionsPresent: string[] = [];

  // Chief complaint
  if (input.chiefComplaint) {
    observations.push(`Chief complaint: ${input.chiefComplaint} for ${input.duration || "unknown duration"}`);
    completeness += 15;
    sectionsPresent.push("chiefComplaint");
  } else {
    missing.push("Chief complaint not recorded");
  }

  // Prakriti
  if (input.prakriti && Object.keys(input.prakriti).length > 0) {
    const constitution = input.prakriti["constitution"] || input.prakriti["predominant_dosha"] || "Not assessed";
    observations.push(`Prakriti constitution: ${constitution}`);
    completeness += 12;
    sectionsPresent.push("prakriti");
    if (constitution.toLowerCase().includes("pitta")) {
      focusAreas.push("Pitta-dominant characteristics noted — assess inflammatory tendencies");
    } else if (constitution.toLowerCase().includes("vata")) {
      focusAreas.push("Vata-dominant characteristics — assess movement and nervous system patterns");
    } else if (constitution.toLowerCase().includes("kapha")) {
      focusAreas.push("Kapha-dominant characteristics — assess congestion and metabolic patterns");
    }
  } else {
    missing.push("Prakriti assessment");
  }

  // Vikriti
  if (input.vikriti && Object.keys(input.vikriti).length > 0) {
    observations.push(`Current imbalance (Vikriti) changes: ${Object.values(input.vikriti).join(", ")}`);
    completeness += 10;
    sectionsPresent.push("vikriti");
    const vikritiStr = JSON.stringify(input.vikriti).toLowerCase();
    if (vikritiStr.includes("weak") || vikritiStr.includes("sluggish")) {
      riskFlags.push("Reduced vitality patterns detected — practitioner should assess dosha imbalance");
    }
  } else {
    missing.push("Vikriti assessment");
  }

  // Ahara
  if (input.ahara && Object.keys(input.ahara).length > 0) {
    const aharaData = input.ahara as Record<string, unknown>;
    observations.push(`Diet: ${aharaData.foodPreference || "Not specified"}, meal pattern: ${aharaData.mealPattern || "Not specified"}`);
    completeness += 10;
    sectionsPresent.push("ahara");
    if (aharaData.mealPattern === "Irregular" || aharaData.mealPattern === "irregular") {
      riskFlags.push("Irregular meal pattern — may impact Agni and digestive fire");
    }
  } else {
    missing.push("Ahara (dietary) assessment");
  }

  // Vihara
  if (input.vihara && Object.keys(input.vihara).length > 0) {
    const viharaData = input.vihara as Record<string, unknown>;
    observations.push(`Lifestyle: Activity — ${viharaData.physicalActivity || "Not specified"}, Screen time — ${viharaData.screenTime || "Not specified"}`);
    completeness += 10;
    sectionsPresent.push("vihara");
    const activity = String(viharaData.physicalActivity || "").toLowerCase();
    if (activity.includes("sedentary") || activity.includes("light")) {
      riskFlags.push("Low physical activity — consider Vyayama Shakti assessment");
    }
  } else {
    missing.push("Vihara (lifestyle) assessment");
  }

  // Agni
  if (input.agni && Object.keys(input.agni).length > 0) {
    const agniData = input.agni as Record<string, unknown>;
    observations.push(`Agni: Appetite — ${agniData.appetite || "Not specified"}, Digestion — ${agniData.digestion || "Not specified"}`);
    completeness += 10;
    sectionsPresent.push("agni");
    const appetite = String(agniData.appetite || "").toLowerCase();
    if (appetite.includes("irregular") || appetite.includes("variable") || appetite.includes("reduced")) {
      riskFlags.push("Agni irregularity detected — assess Jatharagni status");
    }
  } else {
    missing.push("Agni assessment");
  }

  // Koshtha
  if (input.koshtha && Object.keys(input.koshtha).length > 0) {
    const koshthaData = input.koshtha as Record<string, unknown>;
    observations.push(`Koshtha: ${koshthaData.regularity || "Not specified"}, consistency — ${koshthaData.consistency || "Not specified"}`);
    completeness += 8;
    sectionsPresent.push("koshtha");
    const koshthaStr = JSON.stringify(input.koshtha).toLowerCase();
    if (koshthaStr.includes("constipation") || koshthaStr.includes("hard")) {
      riskFlags.push("Bowel irregularity — may indicate Vata aggravation in the GI tract");
    }
  } else {
    missing.push("Koshtha assessment");
  }

  // Nidra
  if (input.nidra && Object.keys(input.nidra).length > 0) {
    const nidraData = input.nidra as Record<string, unknown>;
    observations.push(`Nidra: Duration — ${nidraData.duration || "Not specified"}, Quality — ${nidraData.quality || "Not specified"}`);
    completeness += 8;
    sectionsPresent.push("nidra");
    const quality = String(nidraData.quality || "").toLowerCase();
    if (quality.includes("poor") || quality.includes("disturbed")) {
      riskFlags.push("Sleep disturbance — significant factor in dosha assessment");
    }
  } else {
    missing.push("Nidra (sleep) assessment");
  }

  // Sattva
  if (input.sattva && Object.keys(input.sattva).length > 0) {
    completeness += 5;
    sectionsPresent.push("sattva");
    observations.push(`Sattva: ${JSON.stringify(input.sattva)}`);
  } else {
    missing.push("Sattva (well-being) assessment");
  }

  // Dashavidha extras
  if (input.sara) { completeness += 4; sectionsPresent.push("sara"); }
  if (input.samhanana) { completeness += 4; sectionsPresent.push("samhanana"); }
  if (input.pramana) { completeness += 3; sectionsPresent.push("pramana"); }
  if (input.satmya) { completeness += 3; sectionsPresent.push("satmya"); }

  completeness = Math.min(100, completeness);

  // Build brief
  const briefLines: string[] = [];
  briefLines.push(`# AYUSH Patient Brief — ${input.patientName}`);
  briefLines.push("");
  briefLines.push(`**Chief Concern:** ${input.chiefComplaint || "Not recorded"}`);
  briefLines.push(`**Duration:** ${input.duration || "Not recorded"}`);
  briefLines.push("");
  briefLines.push("## Clinical Observations");
  for (const obs of observations) {
    briefLines.push(`- ${obs}`);
  }
  if (focusAreas.length > 0) {
    briefLines.push("");
    briefLines.push("## Focus Areas for Practitioner");
    for (const fa of focusAreas) {
      briefLines.push(`- ${fa}`);
    }
  }
  if (riskFlags.length > 0) {
    briefLines.push("");
    briefLines.push("## ⚠ Observations Requiring Review");
    for (const rf of riskFlags) {
      briefLines.push(`- ${rf}`);
    }
  }
  briefLines.push("");
  briefLines.push(`**Assessment Completeness:** ${completeness}%`);
  briefLines.push("");
  if (missing.length > 0) {
    briefLines.push("## Missing Information");
    for (const m of missing) {
      briefLines.push(`- ${m}`);
    }
  }
  if (input.previousTreatment) {
    briefLines.push("");
    briefLines.push(`**Previous Treatment:** ${input.previousTreatment}`);
  }
  if (input.documents && input.documents.length > 0) {
    briefLines.push("");
    briefLines.push(`**Documents:** ${input.documents.length} uploaded`);
  }
  briefLines.push("");
  briefLines.push("---");
  briefLines.push("⚠ AI-generated summary. Practitioner verification required.");

  return {
    aiBrief: briefLines.join("\n"),
    clinicalObservations: observations,
    doshaAnalysis: buildDoshaAnalysis(input),
    recommendedFocusAreas: focusAreas,
    riskFlags,
    confidence: completeness >= 70 ? "high" : completeness >= 40 ? "moderate" : "low",
    assessmentCompleteness: completeness,
    missingInformation: missing,
    aiGenerated: false,
    disclaimer: "Template-based summary. All findings require practitioner verification. This is not a diagnosis.",
  };
}

function buildDoshaAnalysis(input: AyushAnalysisInput): string {
  const parts: string[] = [];

  if (input.prakriti?.["constitution"]) {
    parts.push(`Constitution: ${input.prakriti["constitution"]}`);
  }

  // Aggregate Vikriti signals
  const vikritiSignals: string[] = [];
  if (input.agni) {
    const agni = input.agni as Record<string, unknown>;
    const appetite = String(agni.appetite || "").toLowerCase();
    if (appetite.includes("variable") || appetite.includes("irregular")) vikritiSignals.push("Variable appetite suggests Agni imbalance");
  }
  if (input.koshtha) {
    const koshtha = input.koshtha as Record<string, unknown>;
    const consistency = String(koshtha.consistency || "").toLowerCase();
    if (consistency.includes("hard")) vikritiSignals.push("Hard stool consistency may indicate Vata in Pakvashaya");
    if (consistency.includes("soft") || consistency.includes("loose")) vikritiSignals.push("Loose stool may indicate Pitta or Kapha involvement");
  }
  if (input.nidra) {
    const nidra = input.nidra as Record<string, unknown>;
    const quality = String(nidra.quality || "").toLowerCase();
    if (quality.includes("poor") || quality.includes("disturbed")) vikritiSignals.push("Sleep disturbance is a significant Vikriti indicator");
  }

  if (vikritiSignals.length > 0) {
    parts.push("");
    parts.push("Vikriti observations:");
    for (const s of vikritiSignals) {
      parts.push(`- ${s}`);
    }
  }

  if (parts.length === 0) {
    return "Insufficient data for dosha pattern analysis. Complete Prakriti and Vikriti assessments for detailed analysis.";
  }

  return parts.join("\n");
}

// ─── AI Chat Response Enhancement ──────────────────────────────────────────

export async function generateEnhancedChatResponse(
  userMessage: string,
  mode: string,
  language: string,
  assessmentProgress: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractedData: Record<string, any>,
): Promise<{ message: string; extractedData?: Record<string, unknown>; category?: string; suggestedActions?: string[] }> {
  const ai = await getAI();

  if (ai && mode === "pre_consultation") {
    try {
      return await generateAIChatResponse(ai, userMessage, language, assessmentProgress, extractedData);
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "AI chat response failed, using template");
    }
  }

  // Return null to let the caller use the knowledge-base fallback
  return { message: "" };
}

async function generateAIChatResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ai: any,
  userMessage: string,
  language: string,
  _assessmentProgress: number,
  extractedData: Record<string, unknown>,
): Promise<{ message: string; extractedData?: Record<string, unknown>; category?: string; suggestedActions?: string[] }> {
  const langNames: Record<string, string> = { en: "English", hi: "Hindi", mr: "Marathi" };
  const langName = langNames[language] || "English";

  const systemPrompt = `You are MediKiosk AyurBot, a compassionate Ayurvedic pre-consultation assistant. You guide patients through collecting their health information in a warm, respectful manner.

RULES:
- Respond in ${langName}
- Ask ONE question at a time
- Be warm, culturally appropriate (use Namaste/Namaskar)
- Do NOT diagnose or prescribe
- For emergency symptoms, immediately tell the patient to seek hospital staff
- For medicine questions, say you cannot prescribe and they should consult the practitioner
- Keep responses short (2-4 sentences max)
- Extract structured data from patient responses
- Focus on: chief complaint, ahara (diet), vihara (lifestyle), agni (digestion), koshtha (bowel), nidra (sleep)

Previously collected data: ${JSON.stringify(extractedData)}

Respond ONLY with valid JSON:
{
  "message": "your response to the patient",
  "extractedData": { any new data points extracted },
  "category": "category of the question you're asking next",
  "suggestedActions": ["action buttons to show"]
}`;

  const response = await ai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    max_completion_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty AI response");

  return JSON.parse(content);
}
