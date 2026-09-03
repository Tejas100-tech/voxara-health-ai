import { Router } from "express";
import { logger } from "../lib/logger";
import { translateCode, searchNAMASTE } from "../lib/namaste-icd11";
import { generateWithGemini } from "../lib/gemini";

const router = Router();

const summaries: Record<string, any> = {};

// ── Allopathic fallback summary ───────────────────────────────────────────
function generateAllopathicSummary(answers: any[], documents: any[], chiefComplaint: string) {
  const allMedications: any[] = [];
  const allDiagnoses: string[] = [];
  const labFlags: string[] = [];

  for (const doc of documents || []) {
    if (doc.extractedEntities?.medications) allMedications.push(...doc.extractedEntities.medications);
    if (doc.extractedEntities?.diagnoses) allDiagnoses.push(...doc.extractedEntities.diagnoses);
    if (doc.abnormalFlags) labFlags.push(...doc.abnormalFlags);
  }

  const findAnswer = (category: string) =>
    answers.find((a: any) => a.category?.includes(category))?.answer || "Not documented";

  return {
    chiefComplaint: chiefComplaint || answers[0]?.answer || "Not specified",
    historyOfPresentIllness: `Patient presents with ${chiefComplaint || "symptoms"}. ${answers.slice(1, 3).map((a: any) => a.answer).join(". ")}.`,
    pastMedicalHistory: allDiagnoses.length > 0 ? allDiagnoses.join(", ") : findAnswer("Past Medical"),
    drugAllergyHistory: allMedications.length > 0
      ? allMedications.map((m: any) => `${m.name} ${m.dosage} ${m.frequency}`).join("; ")
      : findAnswer("Drug & Allergy"),
    familyHistory: findAnswer("Family"),
    personalHistory: findAnswer("Personal"),
    priorInvestigations: (documents || []).filter((d: any) => d.type === "Lab Report").map((d: any) => ({
      date: d.date, facility: d.facility,
      values: d.extractedEntities?.labValues || [], flags: d.abnormalFlags || [],
    })),
    priorPrescriptions: (documents || []).filter((d: any) => d.type === "Prescription").map((d: any) => ({
      date: d.date, facility: d.facility, doctor: d.doctor,
      medications: d.extractedEntities?.medications || [],
    })),
    dischargeSummaries: (documents || []).filter((d: any) => d.type === "Discharge Summary").map((d: any) => ({
      date: d.date, facility: d.facility, summary: d.summary || "No summary available.",
    })),
    abnormalFlags: labFlags,
    redFlags: [],
    aiAssessment: `Allopathic clinical history captured for ${chiefComplaint || "patient concerns"}. Total answers: ${answers.length}. Documents scanned: ${(documents || []).length}. Please review and confirm during consultation.`,
  };
}

// ── AYUSH fallback summary (Dashavidha Pariksha) ─────────────────────────
function generateAyushSummary(answers: any[], documents: any[], chiefComplaint: string) {
  const findAnswer = (category: string) =>
    answers.find((a: any) => a.category?.includes(category))?.answer || "Not assessed";

  const prakritiAnswer = findAnswer("Prakriti");
  const agniAnswer = findAnswer("Agni");
  const saraAnswer = findAnswer("Sara");
  const samhananaAnswer = findAnswer("Samhanana");
  const pramanaAnswer = findAnswer("Pramana");
  const satmyaAnswer = findAnswer("Satmya");
  const sattvaAnswer = findAnswer("Sattva");
  const aharaShaktiAnswer = findAnswer("Ahara Shakti");
  const vyayamaShaktiAnswer = findAnswer("Vyayama Shakti");
  const vayaAnswer = findAnswer("Vaya");
  const aharaAnswer = findAnswer("Ahara");
  const viharaAnswer = findAnswer("Vihara");
  const dietAnswer = findAnswer("Daily Habits") !== "Not assessed" ? findAnswer("Daily Habits") : findAnswer("Dietary");
  const chiefAnswer = findAnswer("Chief Complaint") !== "Not assessed" ? findAnswer("Chief Complaint") : findAnswer("Nidana");

  // Determine Prakriti dosha from constitution description
  let dominantDosha = "Unable to determine";
  const lowerPrakriti = prakritiAnswer.toLowerCase();
  if (lowerPrakriti.includes("thin") || lowerPrakriti.includes("light") || lowerPrakriti.includes("vata")) {
    dominantDosha = "Vata";
  } else if (lowerPrakriti.includes("medium") || lowerPrakriti.includes("sharp") || lowerPrakriti.includes("pitta")) {
    dominantDosha = "Pitta";
  } else if (lowerPrakriti.includes("heavy") || lowerPrakriti.includes("large") || lowerPrakriti.includes("kapha")) {
    dominantDosha = "Kapha";
  }

  // NAMASTE-ICD11 Dual-Coding for AYUSH conditions
  let namasteIcd11Coding: any[] = [];
  try {
    // Search for NAMASTE codes matching the chief complaint
    const namasteMatches = searchNAMASTE(chiefComplaint || chiefAnswer, undefined, 3);
    for (const match of namasteMatches) {
      const translations = translateCode(
        "http://terminology.mohayush.gov.in/namaste",
        match.code,
        "both"
      );
      namasteIcd11Coding.push({
        namaste: { code: match.code, display: match.display },
        icd11Translations: translations,
      });
    }
  } catch (err) {
    logger.info({ err }, "NAMASTE-ICD11 translation skipped");
  }

  return {
    mode: "ayush",
    chiefComplaint: chiefComplaint || chiefAnswer,
    namasteIcd11Coding,

    // Dashavidha Pariksha (10-fold examination)
    dashavidhaPariksha: {
      prakriti: { title: "Prakriti (Constitution)", finding: prakritiAnswer, dominantDosha },
      vikriti: { title: "Vikriti (Current Imbalance)", finding: chiefAnswer },
      sara: { title: "Sara (Tissue Quality)", finding: saraAnswer },
      samhanana: { title: "Samhanana (Body Compactness)", finding: samhananaAnswer },
      pramana: { title: "Pramana (Body Measurements)", finding: pramanaAnswer },
      satmya: { title: "Satmya (Adaptability)", finding: satmyaAnswer },
      sattva: { title: "Sattva (Mental Strength)", finding: sattvaAnswer },
      aharaShakti: { title: "Ahara Shakti (Digestive Capacity)", finding: aharaShaktiAnswer },
      vyayamaShakti: { title: "Vyayama Shakti (Exercise Capacity)", finding: vyayamaShaktiAnswer },
      vaya: { title: "Vaya (Age Assessment)", finding: vayaAnswer },
    },

    // Ahara-Vihara (Diet & Lifestyle)
    aharaVihara: {
      ahara: { title: "Ahara (Diet)", finding: aharaAnswer !== "Not assessed" ? aharaAnswer : dietAnswer },
      vihara: { title: "Vihara (Lifestyle & Routine)", finding: viharaAnswer },
    },

    // Standard clinical sections for physician reference
    historyOfPresentIllness: `Patient presents with ${chiefComplaint || "symptoms"}. Vikriti assessment: ${chiefAnswer}.`,
    pastMedicalHistory: findAnswer("Past Medical"),
    drugAllergyHistory: findAnswer("Drug & Allergy"),
    familyHistory: findAnswer("Family"),
    personalHistory: findAnswer("Personal"),

    priorInvestigations: (documents || []).filter((d: any) => d.type === "Lab Report").map((d: any) => ({
      date: d.date, facility: d.facility,
      values: d.extractedEntities?.labValues || [], flags: d.abnormalFlags || [],
    })),
    abnormalFlags: (documents || []).flatMap((d: any) => d.abnormalFlags || []),
    redFlags: [],

    aiAssessment: `AYUSH clinical history captured using Dashavidha Pariksha framework. Dominant dosha: ${dominantDosha}. Chief complaint: ${chiefComplaint || "patient concerns"}. Total answers: ${answers.length}. Documents scanned: ${(documents || []).length}. The Dashavidha Pariksha provides a comprehensive Ayurvedic assessment for personalized treatment planning.`,
  };
}

// ── Generate clinical summary ─────────────────────────────────────────────
router.post("/clinical-summary/generate", async (req, res) => {
  try {
    const { sessionId, patientName, patientId, abhaId, chiefComplaint, answers, documents: docs, mode } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ error: "answers array is required" });
      return;
    }

    const isAyush = mode === "ayush";

    let summary;
    try {
      const historyText = answers.map((a: any) => `${a.category}: ${a.answer}`).join("\n");
      const docsText = (docs || []).map((d: any) => {
        let text = `Document Type: ${d.type}\nDate: ${d.date}\nFacility: ${d.facility || "Unknown"}`;
        if (d.extractedEntities?.medications?.length) {
          text += `\nMedications: ${d.extractedEntities.medications.map((m: any) => `${m.name} ${m.dosage} ${m.frequency}`).join(", ")}`;
        }
        if (d.extractedEntities?.labValues?.length) {
          text += `\nLab Values: ${d.extractedEntities.labValues.map((l: any) => `${l.name}: ${l.value} ${l.unit} (${l.status})`).join(", ")}`;
        }
        return text;
      }).join("\n\n");

      // Use Google Gemini for clinical summary generation
      try {
        const aiPrompt = isAyush
          ? `You are MediKiosk Ayurvedic AI expert. Generate a comprehensive AYUSH clinical summary as a JSON object with keys: chiefComplaint (object with symptom/duration/severity), dashavidhaPariksha (object with prakriti/vikriti/sara/samhanana/pramana/satatmya/sattva/aharaShakti/vyayamaShakti/vaya each with title and finding), aharaVihara (object with ahara/vihara each with title and finding), historyOfPresentIllness (string), priorInvestigations (array), abnormalFlags (array), aiAssessment (string with dominant dosha). Be extremely thorough and detailed. Patient: ${patientName} (${patientId}). Chief Complaint: ${chiefComplaint || answers[0]?.answer || "Not specified"}. History: ${historyText}. Documents: ${docsText || "None"}`
          : `You are MediKiosk Clinical AI expert. Generate a comprehensive clinical summary as a JSON object with keys: chiefComplaint (object with symptom/duration/severity), historyOfPresentIllness (detailed SOAP narrative), pastMedicalHistory (array), drugAllergyHistory (array), familyHistory (array), personalHistory (array), priorInvestigations (array), redFlags (array), aiAssessment (comprehensive with differential diagnosis and risk stratification). Be extremely thorough. Patient: ${patientName} (${patientId}). Chief Complaint: ${chiefComplaint || answers[0]?.answer || "Not specified"}. History: ${historyText}. Documents: ${docsText || "None"}`;

        const aiResponse = await generateWithGemini("general" as any, aiPrompt, "en");
        summary = JSON.parse(aiResponse);
        logger.info("Clinical summary generated using Gemini");
      } catch (aiError: any) {
        logger.info({ err: aiError.message }, "Gemini failed, using fallback summary generator");
        summary = isAyush ? generateAyushSummary(answers, docs || [], chiefComplaint || "") : generateAllopathicSummary(answers, docs || [], chiefComplaint || "");
      }
    } catch (aiError: any) {
        logger.info({ err: aiError.message }, "Gemini failed, using fallback summary generator");
        summary = isAyush ? generateAyushSummary(answers, docs || [], chiefComplaint || "") : generateAllopathicSummary(answers, docs || [], chiefComplaint || "");
      }

    const enrichedSummary = {
      ...summary,
      sessionId,
      patientName,
      patientId,
      abhaId: abhaId || "",
      mode: isAyush ? "ayush" : "allopathic",
      generatedAt: new Date().toISOString(),
      status: "pending_review",
      physicianNotes: "",
      priorInvestigations: summary.priorInvestigations || [],
      priorPrescriptions: summary.priorPrescriptions || [],
      dischargeSummaries: summary.dischargeSummaries || [],
      abnormalFlags: summary.abnormalFlags || [],
      // Store document references so doctors can view the actual uploaded files
      documents: (docs || []).map((d: any) => ({
        id: d.id,
        filename: d.filename,
        mimetype: d.mimetype,
        type: d.type,
        date: d.date,
        facility: d.facility,
        doctor: d.doctor,
        abnormalFlags: d.abnormalFlags,
        extractedEntities: d.extractedEntities,
        summary: d.summary,
        // Cloudinary URL for doctor to view the actual document image
        url: d.url || "",
        publicId: d.publicId || "",
        ocrConfidence: d.ocrConfidence,
        confidenceLabel: d.confidenceLabel,
        unconfirmedItems: d.unconfirmedItems,
      })),
    };

    summaries[sessionId] = enrichedSummary;

    res.json({
      summary: enrichedSummary,
      message: isAyush
        ? "AYUSH clinical summary generated with Dashavidha Pariksha. Ready for physician review."
        : "Clinical summary generated. Ready for physician review.",
    });
  } catch (err) {
    logger.error({ err }, "Clinical summary generation failed");
    res.status(500).json({ error: "Summary generation failed" });
  }
});

router.get("/clinical-summary/:sessionId", (req, res) => {
  const summary = summaries[String(req.params.sessionId)];
  if (!summary) { res.status(404).json({ error: "Summary not found" }); return; }
  res.json(summary);
});

router.patch("/clinical-summary/:sessionId/review", (req, res) => {
  const sessionId = String(req.params.sessionId);
  const summary = summaries[sessionId];
  if (!summary) { res.status(404).json({ error: "Summary not found" }); return; }
  const { status, physicianNotes } = req.body;
  if (status) summary.status = status;
  if (physicianNotes !== undefined) summary.physicianNotes = physicianNotes;
  summary.reviewedAt = new Date().toISOString();
  summaries[sessionId] = summary;
  res.json(summary);
});

router.get("/clinical-summary", (_req, res) => {
  const all = Object.values(summaries).sort(
    (a: any, b: any) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
  res.json(all);
});

export default router;
