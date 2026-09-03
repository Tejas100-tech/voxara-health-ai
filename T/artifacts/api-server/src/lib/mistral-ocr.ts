import { Mistral } from "@mistralai/mistralai";
import { logger } from "./logger";
import { matchMedicine, extractMedicinesFromText, loadMedicineDatabase } from "./prescription-ocr-training";

let client: Mistral | null = null;

function getMistralClient(): Mistral {
  if (!client) {
    const apiKey = process.env["MISTRAL_API_KEY"];
    if (!apiKey) {
      throw new Error("Mistral API key not configured (MISTRAL_API_KEY)");
    }
    client = new Mistral({ apiKey });
    logger.info("Mistral client initialized");
  }
  return client;
}

interface MedicalDocumentResult {
  documentType: string;
  patientName?: string;
  patientId?: string;
  doctorName?: string;
  date?: string;
  facility?: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
    instructions?: string;
  }[];
  diagnoses: string[];
  labValues: {
    name: string;
    value: string;
    unit: string;
    referenceRange?: string;
    status: "normal" | "abnormal" | "critical";
  }[];
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
  };
  notes?: string;
  confidence: number;
  rawText?: string;
}

/**
 * Process a medical document (prescription, lab report, discharge summary)
 * using Mistral AI's multimodal capabilities
 */
export async function processMedicalDocument(
  base64Image: string,
  documentType?: "prescription" | "lab_report" | "discharge_summary" | "auto"
): Promise<MedicalDocumentResult> {
  const mistral = getMistralClient();

  const prompt = documentType === "prescription"
    ? `Extract all information from this prescription. Return a JSON object with:
      - patientName, doctorName, date, facility
      - medications: array of {name, dosage, frequency, duration, instructions}
      - diagnoses: array of diagnosis strings
      - notes: any additional instructions
      - confidence: 0-1 score for extraction confidence`
    : documentType === "lab_report"
    ? `Extract all information from this lab report. Return a JSON object with:
      - patientName, date, facility, doctorName
      - labValues: array of {name, value, unit, referenceRange, status: "normal"/"abnormal"/"critical"}
      - diagnoses: any findings or diagnoses
      - notes: any comments
      - confidence: 0-1 score`
    : documentType === "discharge_summary"
    ? `Extract all information from this discharge summary. Return a JSON object with:
      - patientName, patientId, date, facility, doctorName
      - diagnoses: array of diagnoses
      - medications: array of {name, dosage, frequency}
      - notes: key discharge instructions
      - confidence: 0-1 score`
    : `Analyze this medical document and extract all relevant information. Determine the document type (prescription, lab_report, or discharge_summary) and extract:
      - patientName, patientId, doctorName, date, facility
      - medications: array of {name, dosage, frequency, duration, instructions}
      - diagnoses: array of diagnosis strings
      - labValues: array of {name, value, unit, referenceRange, status}
      - vitalSigns: if present
      - notes: any additional information
      - confidence: 0-1 score
      - documentType: the detected type`;

  try {
    const response = await mistral.chat.complete({
      model: "pixtral-12b-latest",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              imageUrl: `data:image/jpeg;base64,${base64Image}`,
            },
          ],
        },
      ],
      responseFormat: {
        type: "json_object",
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in response");
    }

    const parsed = JSON.parse(content as string);

    // Enhance medications with medicine database matching
    const enhancedMedications = (parsed.medications || []).map((med: any) => {
      const matchResult = matchMedicine(med.name || "");
      return {
        ...med,
        matchedGeneric: matchResult.medicine?.genericName,
        matchedCategory: matchResult.medicine?.category,
        matchConfidence: matchResult.confidence,
        suggestions: matchResult.suggestions,
      };
    });

    // Extract additional medicines from raw text if available
    let additionalMedicines: any[] = [];
    if (parsed.rawText) {
      const extracted = extractMedicinesFromText(parsed.rawText);
      additionalMedicines = extracted.medicines
        .filter((m) => !enhancedMedications.some((em: any) => em.name?.toLowerCase() === m.text.toLowerCase()))
        .map((m) => ({
          name: m.text,
          matchedGeneric: m.medicine?.genericName,
          matchedCategory: m.medicine?.category,
          matchConfidence: m.confidence,
          source: "database_match",
        }));
    }

    return {
      documentType: parsed.documentType || documentType || "unknown",
      patientName: parsed.patientName,
      patientId: parsed.patientId,
      doctorName: parsed.doctorName,
      date: parsed.date,
      facility: parsed.facility,
      medications: [...enhancedMedications, ...additionalMedicines],
      diagnoses: parsed.diagnoses || [],
      labValues: parsed.labValues || [],
      vitalSigns: parsed.vitalSigns,
      notes: parsed.notes,
      confidence: parsed.confidence || 0.8,
      rawText: parsed.rawText,
    };
  } catch (error: any) {
    logger.error({ error: error.message }, "Mistral OCR failed");
    throw error;
  }
}

/**
 * Process a prescription image specifically
 */
export async function processPrescription(
  base64Image: string
): Promise<MedicalDocumentResult> {
  return processMedicalDocument(base64Image, "prescription");
}

/**
 * Process a lab report image specifically
 */
export async function processLabReport(
  base64Image: string
): Promise<MedicalDocumentResult> {
  return processMedicalDocument(base64Image, "lab_report");
}

/**
 * Process a discharge summary image specifically
 */
export async function processDischargeSummary(
  base64Image: string
): Promise<MedicalDocumentResult> {
  return processMedicalDocument(base64Image, "discharge_summary");
}

/**
 * Check OCR confidence and flag low-confidence extractions
 */
export function assessExtractionQuality(
  result: MedicalDocumentResult
): {
  overallConfidence: "high" | "medium" | "low";
  warnings: string[];
  unconfirmedItems: string[];
} {
  const warnings: string[] = [];
  const unconfirmedItems: string[] = [];

  // Check confidence level
  let overallConfidence: "high" | "medium" | "low";
  if (result.confidence >= 0.85) {
    overallConfidence = "high";
  } else if (result.confidence >= 0.7) {
    overallConfidence = "medium";
    warnings.push("Extraction confidence is moderate - verify critical information");
  } else {
    overallConfidence = "low";
    warnings.push("Low extraction confidence - manual verification recommended");
  }

  // Check medications for incomplete information
  for (const med of result.medications) {
    if (!med.dosage || med.dosage === "unknown") {
      unconfirmedItems.push(`Medication dosage unknown: ${med.name}`);
    }
    if (!med.frequency || med.frequency === "unknown") {
      unconfirmedItems.push(`Medication frequency unknown: ${med.name}`);
    }
  }

  // Check lab values for missing references
  for (const lab of result.labValues) {
    if (!lab.referenceRange) {
      warnings.push(`Missing reference range for ${lab.name}`);
    }
    if (lab.status === "critical") {
      warnings.push(`Critical lab value detected: ${lab.name} = ${lab.value} ${lab.unit}`);
    }
  }

  // Handwritten document warning
  if (result.confidence < 0.8) {
    warnings.push("Document may be handwritten - verify extracted values with patient");
  }

  return {
    overallConfidence,
    warnings,
    unconfirmedItems,
  };
}
