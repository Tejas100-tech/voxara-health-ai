import { Router } from "express";
import { logger } from "../lib/logger";
import { connectMongoDB, hasMongoDB } from "../lib/mongodb";
import SummaryRecord from "../models/summary-record";
import { translateCode, searchNAMASTE } from "../lib/namaste-icd11";
import { generateWithAI } from "../lib/gpt-luna";

/**
 * AI models sometimes wrap JSON in prose/markdown. Extract the first JSON
 * object from the response before parsing so a greeting or code fence never
 * silently demotes a good summary to the template fallback.
 */
function parseJsonFromAi(text: string): any {
  if (!text) throw new Error("Empty AI response");
  try {
    return JSON.parse(text);
  } catch {
    /* fall through to extraction */
  }
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new Error("No JSON object found in AI response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

/**
 * Document-derived sections (investigations / prescriptions / discharge
 * summaries / abnormal flags). Kept identical for the template generator and
 * the AI path so a successful AI summary never loses structured doc data.
 */
function buildDocSections(documents: any[]) {
  const abnormalFlags = (documents || []).flatMap((d: any) => d.abnormalFlags || []);
  return {
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
    abnormalFlags,
  };
}

/**
 * Coerce the AI's free-form JSON into the exact flat schema the review UI
 * renders (chiefComplaint, histories and aiAssessment as plain strings;
 * doc-derived sections rebuilt from the uploaded documents).
 */
function shapeAiSummary(ai: any, isAyush: boolean, answers: any[], documents: any[], chiefComplaint: string): any {
  const asString = (v: any, fb = "") => {
    if (v == null || v === "") return fb;
    if (Array.isArray(v)) return v.filter((x) => x != null && x !== "").map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join("; ");
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };
  const chiefToString = (v: any, fb: string): string => {
    if (v == null || v === "") return fb;
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      const parts = [v.symptom, v.duration ? `duration: ${v.duration}` : "", v.severity ? `severity: ${v.severity}` : "", v.details].filter(Boolean);
      return parts.join(", ") || JSON.stringify(v);
    }
    return String(v);
  };
  const strings = (v: any): string[] =>
    Array.isArray(v) ? v.filter((x) => x != null && x !== "").map((x) => (typeof x === "string" ? x : JSON.stringify(x))) : [];

  const ayushTemplate = isAyush ? generateAyushSummary(answers, documents, chiefComplaint) : null;
  const out: any = {
    ...buildDocSections(documents),
    chiefComplaint: chiefToString(ai?.chiefComplaint, chiefComplaint || answers[0]?.answer || "Not specified"),
    historyOfPresentIllness: asString(ai?.historyOfPresentIllness, `Patient presents with ${chiefComplaint || "symptoms"}.`),
    pastMedicalHistory: asString(ai?.pastMedicalHistory),
    drugAllergyHistory: asString(ai?.drugAllergyHistory),
    familyHistory: asString(ai?.familyHistory),
    personalHistory: asString(ai?.personalHistory),
    redFlags: strings(ai?.redFlags),
    aiAssessment: asString(ai?.aiAssessment),
  };
  if (isAyush && ayushTemplate) {
    out.dashavidhaPariksha = ai?.dashavidhaPariksha && typeof ai.dashavidhaPariksha === "object" ? ai.dashavidhaPariksha : ayushTemplate.dashavidhaPariksha;
    out.aharaVihara = ai?.aharaVihara && typeof ai.aharaVihara === "object" ? ai.aharaVihara : ayushTemplate.aharaVihara;
    out.namasteIcd11Coding = ayushTemplate.namasteIcd11Coding;
  }
  return out;
}

const router = Router();

// ── Storage ───────────────────────────────────────────────────────────────
// Primary store is MongoDB (SummaryRecord model) so summaries — including the
// review status doctors set — survive server restarts. In-memory map is the
// live cache / fallback when MongoDB is unavailable.
const summaries: Record<string, any> = {};

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

async function findStoredSummary(sessionId: string): Promise<Record<string, any> | undefined> {
  if (summaries[sessionId]) return summaries[sessionId];
  if (await mongoAvailable()) {
    try {
      const doc = await SummaryRecord.findOne({ sessionId }).lean();
      if (doc) {
        const plain = toPlain(doc);
        if (plain) summaries[sessionId] = plain;
        return plain;
      }
    } catch (err) {
      logger.warn({ err }, "Failed to load summary from MongoDB");
    }
  }
  return undefined;
}

async function listStoredSummaries(patientId?: string): Promise<Record<string, any>[]> {
  if (await mongoAvailable()) {
    try {
      const q: Record<string, unknown> = {};
      if (patientId) q.patientId = patientId;
      const docs = await SummaryRecord.find(q).sort({ generatedAt: -1 }).limit(200).lean();
      return docs.map((d: any) => toPlain(d)).filter(Boolean) as Record<string, any>[];
    } catch (err) {
      logger.warn({ err }, "Failed to list summaries from MongoDB");
    }
  }
  let all = Object.values(summaries).sort(
    (a: any, b: any) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
  if (patientId) all = all.filter((s: any) => s.patientId === patientId);
  return all;
}

async function saveSummary(summary: Record<string, any>): Promise<void> {
  if (!summary?.sessionId) return;
  summaries[summary.sessionId] = summary;
  if (await mongoAvailable()) {
    try {
      await SummaryRecord.findOneAndUpdate({ sessionId: summary.sessionId }, { $set: summary }, { upsert: true });
    } catch (err) {
      logger.warn({ err: (err as Error)?.message }, "Failed to persist clinical summary");
    }
  }
}

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
    const { sessionId, patientName, patientId, abhaId, abhaVerification, chiefComplaint, answers, documents: docs, mode } = req.body;

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

      // Use Groq (fallback OpenAI Luna) for clinical summary generation
      try {
        const aiPrompt = isAyush
          ? `You are MediKiosk Ayurvedic AI expert. Generate a comprehensive AYUSH clinical summary and return it as ONE valid JSON object (no markdown fences, no text outside the JSON) with this exact flat schema: chiefComplaint (string), dashavidhaPariksha (object with keys prakriti/vikriti/sara/samhanana/pramana/satmya/sattva/aharaShakti/vyayamaShakti/vaya, each an object with title and finding), aharaVihara (object with ahara/vihara, each with title and finding), historyOfPresentIllness (string), pastMedicalHistory (string), drugAllergyHistory (string), familyHistory (string), personalHistory (string), redFlags (array of strings), aiAssessment (string naming the dominant dosha with personalized dinacharya and ahara guidance). Be extremely thorough and grounded only in the provided answers. Patient: ${patientName} (${patientId}). Chief Complaint: ${chiefComplaint || answers[0]?.answer || "Not specified"}. History: ${historyText}. Documents: ${docsText || "None"}`
          : `You are MediKiosk Clinical AI expert. Generate a comprehensive allopathic clinical summary and return it as ONE valid JSON object (no markdown fences, no text outside the JSON) with this exact flat schema: chiefComplaint (string including duration and severity), historyOfPresentIllness (string, detailed SOAP-style narrative referencing the answers), pastMedicalHistory (string), drugAllergyHistory (string listing current medications and known allergies), familyHistory (string), personalHistory (string), redFlags (array of strings), aiAssessment (string: comprehensive assessment with differential diagnosis, risk stratification and recommended next steps, explicitly referencing any abnormal lab values). Be extremely thorough and grounded only in the provided answers. Patient: ${patientName} (${patientId}). Chief Complaint: ${chiefComplaint || answers[0]?.answer || "Not specified"}. History: ${historyText}. Documents: ${docsText || "None"}`;

        const aiResponse = await generateWithAI("general" as any, aiPrompt, "en", undefined, { json: true });
        const rawSummary = parseJsonFromAi(aiResponse);
        summary = shapeAiSummary(rawSummary, isAyush, answers, docs || [], chiefComplaint || "");
        logger.info("Clinical summary generated using AI");
      } catch (aiError: any) {
        logger.info({ err: aiError.message }, "AI providers failed, using fallback summary generator");
        summary = isAyush ? generateAyushSummary(answers, docs || [], chiefComplaint || "") : generateAllopathicSummary(answers, docs || [], chiefComplaint || "");
      }
    } catch (aiError: any) {
        logger.info({ err: aiError.message }, "AI providers failed, using fallback summary generator");
        summary = isAyush ? generateAyushSummary(answers, docs || [], chiefComplaint || "") : generateAllopathicSummary(answers, docs || [], chiefComplaint || "");
      }

    const enrichedSummary = {
      ...summary,
      sessionId,
      patientName,
      patientId,
      abhaId: abhaId || "",
      // Persisted ABHA verification outcome (status, beneficiary name,
      // gateway txn id) shown to the clinician during review.
      abhaVerification: abhaVerification || null,
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

    await saveSummary(enrichedSummary);

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

router.get("/clinical-summary/:sessionId", async (req, res) => {
  try {
    const summary = await findStoredSummary(String(req.params.sessionId));
    if (!summary) { res.status(404).json({ error: "Summary not found" }); return; }
    res.json(summary);
  } catch (err) {
    logger.error({ err }, "Failed to fetch summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.patch("/clinical-summary/:sessionId/review", async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId);
    const summary = await findStoredSummary(sessionId);
    if (!summary) { res.status(404).json({ error: "Summary not found" }); return; }
    const { status, physicianNotes } = req.body;
    if (status) summary.status = status;
    if (physicianNotes !== undefined) summary.physicianNotes = physicianNotes;
    summary.reviewedAt = new Date().toISOString();
    await saveSummary(summary);
    res.json(summary);
  } catch (err) {
    logger.error({ err }, "Failed to review summary");
    res.status(500).json({ error: "Failed to review summary" });
  }
});

router.get("/clinical-summary", async (req, res) => {
  try {
    const { patientId } = req.query;
    const all = await listStoredSummaries(typeof patientId === "string" && patientId ? patientId : undefined);
    res.json(all);
  } catch (err) {
    logger.error({ err }, "Failed to list summaries");
    res.status(500).json({ error: "Failed to list summaries" });
  }
});

export default router;
