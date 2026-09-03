import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("Anthropic API key not configured (ANTHROPIC_API_KEY)");
    }
    client = new Anthropic({ apiKey });
    logger.info("Anthropic client initialized");
  }
  return client;
}

export async function generateWithClaude(
  systemPrompt: string,
  userMessage: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<string> {
  const anthropic = getAnthropicClient();

  try {
    const response = await anthropic.messages.create({
      model: options.model || "claude-3-5-sonnet-20241022",
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature || 0.3,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type === "text") {
      return content.text;
    }
    throw new Error("Unexpected response type from Claude");
  } catch (error: any) {
    logger.error({ error: error.message }, "Claude API error");
    throw error;
  }
}

export async function generateClinicalSummaryWithClaude(
  historyText: string,
  docsText: string,
  patientInfo: {
    name: string;
    id: string;
    abhaId?: string;
    chiefComplaint: string;
  },
  mode: "allopathic" | "ayush"
): Promise<any> {
  const systemPrompt =
    mode === "ayush"
      ? `You are MediKiosk Ayurvedic AI, an expert in Ayurvedic clinical history structuring.
Generate a structured clinical history summary using Dashavidha Pariksha (10-fold examination) and Ahara-Vihara assessment.
Respond ONLY with a valid JSON object.`
      : `You are MediKiosk Clinical AI, an expert medical history structuring system.
Generate a structured, physician-ready clinical history summary in standard medical format.
Respond ONLY with a valid JSON object.`;

  const userMessage =
    mode === "ayush"
      ? `Patient: ${patientInfo.name} (${patientInfo.id})
${patientInfo.abhaId ? `ABHA ID: ${patientInfo.abhaId}` : ""}
Chief Complaint: ${patientInfo.chiefComplaint}

AYUSH HISTORY (Dashavidha Pariksha):
${historyText}

DOCUMENTED MEDICAL RECORDS:
${docsText || "No documents uploaded."}

Generate a structured AYUSH clinical summary with:
1. chiefComplaint
2. dashavidhaPariksha (object with prakriti, vikriti, sara, samhanana, pramana, satmya, sattva, aharaShakti, vyayamaShakti, vaya — each with title and finding)
3. aharaVihara (object with ahara and vihara — each with title and finding)
4. historyOfPresentIllness
5. priorInvestigations
6. abnormalFlags
7. aiAssessment (including dominant dosha determination)
8. namasteIcd11Recommendations (suggest relevant NAMASTE codes if applicable)`
      : `Patient: ${patientInfo.name} (${patientInfo.id})
Chief Complaint: ${patientInfo.chiefComplaint}

PATIENT HISTORY:
${historyText}

DOCUMENTS:
${docsText || "No documents uploaded."}

Generate a structured clinical summary with:
1. chiefComplaint
2. historyOfPresentIllness (SOAP-style)
3. pastMedicalHistory
4. drugAllergyHistory
5. familyHistory
6. personalHistory
7. priorInvestigations
8. redFlags
9. aiAssessment`;

  const response = await generateWithClaude(systemPrompt, userMessage, {
    model: "claude-3-5-sonnet-20241022",
    maxTokens: 4096,
    temperature: 0.3,
  });

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found in response");
  } catch {
    // If JSON parsing fails, return a structured fallback
    return {
      chiefComplaint: patientInfo.chiefComplaint,
      historyOfPresentIllness: response.substring(0, 500),
      aiAssessment: response,
    };
  }
}
