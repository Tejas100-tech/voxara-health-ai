/**
 * MediKiosk AI Analysis Service
 * Provides clinical analysis for both Modern Medicine and AYUSH pathways.
 * Uses Groq API with Llama 3.1 when available, falls back to template-based analysis.
 */

import { logger } from "./logger";

// ─── AI Client ──────────────────────────────────────────────────────────

async function getOpenAIClient() {
  try {
    const { default: OpenAI } = await import("openai");
    const apiKey = process.env["GROQ_API_KEY"] || process.env["OPENAI_API_KEY"];
    if (!apiKey) return null;
    return new OpenAI({
      apiKey,
      baseURL: process.env["GROQ_API_KEY"] ? "https://api.groq.com/openai/v1" : undefined,
    });
  } catch {
    return null;
  }
}

// ─── Types ──────────────────────────────────────────────────────────────

export interface ClinicalAnalysisResult {
  summary: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
  urgencyLevel: "routine" | "soon" | "urgent" | "emergency";
  confidenceScore: number;
  modelUsed: "ai" | "template";
}

export interface AyushAnalysisResult {
  brief: string;
  doshaObservations: string[];
  lifestyleAssessment: string;
  dietaryAssessment: string;
  recommendations: string[];
  practitionerNotes: string[];
  confidenceScore: number;
  modelUsed: "ai" | "template";
}

// ─── Modern Medicine Analysis ───────────────────────────────────────────

export async function analyzeClinicalData(data: {
  chiefComplaint?: string;
  hpi?: Record<string, unknown>;
  pastMedicalHistory?: string[];
  allergies?: unknown[];
  familyHistory?: string[];
  personalHistory?: Record<string, string>;
  redFlags?: string[];
  labResults?: Array<{ testName: string; value: number | string; unit?: string }>;
  documents?: Array<{ ocrText: string; documentType: string }>;
}): Promise<ClinicalAnalysisResult> {
  const openai = await getOpenAIClient();

  if (openai) {
    try {
      const systemPrompt = `You are MediKiosk Clinical AI, an expert medical analysis system. 
Analyze the patient data and provide a structured clinical analysis.
Always be conservative - flag concerning findings but do not diagnose.
End with "⚠ AI-generated analysis. Practitioner verification required."`;

      const patientData = JSON.stringify(data, null, 2);

      const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 2000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this clinical data:\n\n${patientData}` },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        // Parse AI response
        const lines = content.split("\n").filter((l) => l.trim());
        return {
          summary: content.substring(0, 500),
          keyFindings: lines.filter((l) => l.includes("•") || l.includes("-")).slice(0, 5),
          riskFactors: data.redFlags || [],
          recommendations: lines.filter((l) => l.toLowerCase().includes("recommend")).slice(0, 3),
          urgencyLevel: data.redFlags && data.redFlags.length > 0 ? "urgent" : "routine",
          confidenceScore: 85,
          modelUsed: "ai",
        };
      }
    } catch (aiErr) {
      logger.warn({ err: aiErr }, "AI analysis failed, using template");
    }
  }

  // Template fallback
  return generateTemplateAnalysis(data);
}

function generateTemplateAnalysis(data: {
  chiefComplaint?: string;
  hpi?: Record<string, unknown>;
  redFlags?: string[];
}): ClinicalAnalysisResult {
  const findings: string[] = [];
  const risks: string[] = [];
  const recs: string[] = [];

  if (data.chiefComplaint) {
    findings.push(`Chief complaint: ${data.chiefComplaint}`);
  }

  if (data.hpi) {
    const hpiFields = Object.entries(data.hpi);
    if (hpiFields.length > 0) {
      findings.push(`HPI details captured: ${hpiFields.length} fields`);
    }
  }

  if (data.redFlags && data.redFlags.length > 0) {
    risks.push(...data.redFlags);
  }

  recs.push("Complete full clinical history");
  recs.push("Review with qualified practitioner");
  recs.push("Consider relevant investigations");

  return {
    summary: `Clinical data analysis for: ${data.chiefComplaint || "General consultation"}. ${findings.length} findings identified. ${risks.length > 0 ? "Red flags detected - urgent review recommended." : "No immediate red flags."}`,
    keyFindings: findings,
    riskFactors: risks,
    recommendations: recs,
    urgencyLevel: risks.length > 0 ? "urgent" : "routine",
    confidenceScore: 70,
    modelUsed: "template",
  };
}

// ─── AYUSH Analysis ────────────────────────────────────────────────────

export async function analyzeAyushData(data: {
  chiefComplaint?: string;
  duration?: string;
  ahara?: Record<string, unknown>;
  vihara?: Record<string, unknown>;
  agni?: Record<string, unknown>;
  koshtha?: Record<string, unknown>;
  nidra?: Record<string, unknown>;
  sattva?: Record<string, unknown>;
  prakriti?: Record<string, string>;
  vikriti?: Record<string, string>;
  previousTreatment?: string;
}): Promise<AyushAnalysisResult> {
  const openai = await getOpenAIClient();

  if (openai) {
    try {
      const systemPrompt = `You are MediKiosk AyushBot Clinical AI, an expert in Ayurvedic analysis.
Analyze the patient's Ayurvedic data and provide a structured pre-consultation brief.
Focus on:
1. Dosha observations based on lifestyle, diet, and symptoms
2. Agni (digestive fire) assessment
3. Lifestyle and dietary recommendations
4. Areas requiring practitioner verification
Always end with "⚠ AI-generated analysis. Qualified Vaidya verification required."`;

      const patientData = JSON.stringify(data, null, 2);

      const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 2000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this AYUSH patient data:\n\n${patientData}` },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const lines = content.split("\n").filter((l) => l.trim());
        return {
          brief: content.substring(0, 800),
          doshaObservations: lines.filter((l) => l.toLowerCase().includes("dosha") || l.toLowerCase().includes("vata") || l.toLowerCase().includes("pitta") || l.toLowerCase().includes("kapha")).slice(0, 3),
          lifestyleAssessment: `Based on reported activities and routines`,
          dietaryAssessment: `Based on reported dietary patterns`,
          recommendations: lines.filter((l) => l.includes("•") || l.includes("-")).slice(0, 4),
          practitionerNotes: ["AI-generated analysis - requires practitioner verification"],
          confidenceScore: 80,
          modelUsed: "ai",
        };
      }
    } catch (aiErr) {
      logger.warn({ err: aiErr }, "AYUSH AI analysis failed, using template");
    }
  }

  // Template fallback
  return generateTemplateAyushAnalysis(data);
}

function generateTemplateAyushAnalysis(data: {
  chiefComplaint?: string;
  ahara?: Record<string, unknown>;
  vihara?: Record<string, unknown>;
  agni?: Record<string, unknown>;
}): AyushAnalysisResult {
  const observations: string[] = [];
  const recs: string[] = [];

  if (data.chiefComplaint) {
    observations.push(`Chief complaint: ${data.chiefComplaint}`);
  }

  if (data.agni) {
    const agniData = data.agni as Record<string, unknown>;
    if (agniData.appetite) observations.push(`Appetite: ${String(agniData.appetite)}`);
    if (agniData.digestion) observations.push(`Digestion: ${String(agniData.digestion)}`);
  }

  if (data.ahara) {
    const aharaData = data.ahara as Record<string, unknown>;
    if (aharaData.meal_pattern) observations.push(`Meal pattern: ${String(aharaData.meal_pattern)}`);
    if (aharaData.food_preference) observations.push(`Diet: ${String(aharaData.food_preference)}`);
  }

  if (data.vihara) {
    const viharaData = data.vihara as Record<string, unknown>;
    if (viharaData.physical_activity) observations.push(`Activity: ${String(viharaData.physical_activity)}`);
  }

  recs.push("Follow regular meal times");
  recs.push("Maintain consistent sleep schedule");
  recs.push("Regular physical activity recommended");
  recs.push("Consult qualified Vaidya for personalized treatment");

  return {
    brief: `AYUSH Pre-consultation Brief\n\nChief Complaint: ${data.chiefComplaint || "Not recorded"}\n\nKey Observations:\n${observations.map((o) => "• " + o).join("\n")}\n\n⚠ AI-generated brief. Practitioner verification required.`,
    doshaObservations: observations.filter((o) => o.toLowerCase().includes("appetite") || o.toLowerCase().includes("digestion")),
    lifestyleAssessment: data.vihara ? "Lifestyle data captured" : "Not yet assessed",
    dietaryAssessment: data.ahara ? "Dietary data captured" : "Not yet assessed",
    recommendations: recs,
    practitionerNotes: ["AI-generated analysis - requires practitioner verification"],
    confidenceScore: 65,
    modelUsed: "template",
  };
}

// ─── Document Analysis (OCR Enhancement) ────────────────────────────────

export async function analyzeDocumentContent(text: string, documentType: string): Promise<{
  extractedEntities: Record<string, unknown>;
  summary: string;
  confidenceScore: number;
}> {
  const openai = await getOpenAIClient();

  if (openai && text.length > 50) {
    try {
      const systemPrompt = `You are a medical document analysis AI. Extract structured information from the provided medical document text. Return a JSON object with extracted entities.`;

      const response = await openai.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 1000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract information from this ${documentType}:\n\n${text.substring(0, 2000)}` },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          return {
            extractedEntities: parsed,
            summary: `Document analyzed: ${documentType}`,
            confidenceScore: 75,
          };
        } catch {
          return {
            extractedEntities: { rawAnalysis: content },
            summary: content.substring(0, 200),
            confidenceScore: 60,
          };
        }
      }
    } catch (aiErr) {
      logger.warn({ err: aiErr }, "Document AI analysis failed");
    }
  }

  // Template fallback
  return {
    extractedEntities: { documentType, textLength: text.length },
    summary: `Document uploaded: ${documentType} (${text.length} characters)`,
    confidenceScore: 50,
  };
}
