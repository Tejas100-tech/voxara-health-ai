import { Router } from "express";
import { logger } from "../lib/logger";
import crypto from "crypto";
import { checkDrugInteractions, getIcd10Mapping, analyzeLabValue, identifyDrug } from "../lib/clinical-knowledge";

const router = Router();

// ─── Helper: check if PostgreSQL is available ───────────────────────────────

async function getDb() {
  try {
    const { db } = await import("@workspace/db");
    return db;
  } catch {
    return null;
  }
}

async function hasPostgres(): Promise<boolean> {
  return (await getDb()) !== null;
}

// ─── In-memory fallback stores ──────────────────────────────────────────────

interface IntakeData {
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  language: string;
  mode: "allopathic" | "ayush";
  step: string;
  consentGranted: boolean;
  chiefComplaint?: string;
  historyAnswers: Record<string, unknown>;
  redFlags: string[];
  summaryGenerated: boolean;
  summaryContent?: string;
  documents: DocumentData[];
  startedAt: string;
  completedAt?: string;
}

interface DocumentData {
  documentId: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  documentType: string;
  ocrText: string;
  extractedData: Record<string, unknown>;
  processingStatus: string;
  chronologicalOrder: number;
  uploadedAt: string;
}

interface HistoryRecord {
  historyId: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  hpi: Record<string, unknown>;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  drugHistory: unknown[];
  allergyHistory: unknown[];
  familyHistory: string[];
  personalHistory: Record<string, string>;
  reviewOfSystems: Record<string, string>;
  ayushHistory?: Record<string, string>;
  priorInvestigations: unknown[];
  aiSummary: string;
  redFlags: string[];
  completenessScore: number;
  physicianReviewed: boolean;
  physicianEdits?: Record<string, unknown>;
  createdAt: string;
}

const intakeSessions: Map<string, IntakeData> = new Map();
const clinicalHistories: Map<string, HistoryRecord> = new Map();

// ─── SOCRATES Question Framework ─────────────────────────────────────────────

const CHIEF_COMPLAINT_OPTIONS = [
  { id: "chest_pain", label: "Chest Pain", icon: "Heart" },
  { id: "breathlessness", label: "Breathlessness", icon: "Wind" },
  { id: "headache", label: "Headache", icon: "Brain" },
  { id: "abdominal_pain", label: "Abdominal Pain", icon: "Activity" },
  { id: "joint_pain", label: "Joint Pain", icon: "Bone" },
  { id: "fever", label: "Fever", icon: "Thermometer" },
  { id: "fatigue", label: "Fatigue", icon: "Battery" },
  { id: "cough", label: "Cough", icon: "Mic" },
  { id: "dizziness", label: "Dizziness", icon: "Circle" },
  { id: "skin_issues", label: "Skin Issues", icon: "Sparkles" },
  { id: "mood_changes", label: "Mood Changes", icon: "BrainCircuit" },
  { id: "digestive_issues", label: "Digestive Issues", icon: "Utensils" },
  { id: "other", label: "Other", icon: "MessageSquare" },
];

const SOCRATES_QUESTIONS: Record<string, Array<{ id: string; question: string; options?: string[]; type: string }>> = {
  chest_pain: [
    { id: "socol_onset", question: "When did the chest pain start?", options: ["Just now", "Hours ago", "Days ago", "Weeks ago", "Months ago"], type: "single_choice" },
    { id: "socol_character", question: "How would you describe the pain?", options: ["Sharp", "Dull", "Burning", "Crushing", "Tearing", "Colicky"], type: "single_choice" },
    { id: "socol_radiation", question: "Does the pain spread anywhere else?", options: ["Left arm", "Right arm", "Jaw", "Back", "Shoulder", "No radiation"], type: "multiple_choice" },
    { id: "socol_associated", question: "Are there any other symptoms along with the pain?", options: ["Shortness of breath", "Sweating", "Nausea", "Dizziness", "Palpitations", "None"], type: "multiple_choice" },
    { id: "socol_timing", question: "When does the pain typically occur?", options: ["At rest", "During exertion", "After meals", "At night", "Constant"], type: "single_choice" },
    { id: "socol_exacerbating", question: "What makes the pain worse?", options: ["Walking", "Deep breathing", "Lying down", "Eating", "Stress", "Nothing specific"], type: "multiple_choice" },
    { id: "socol_relieving", question: "What relieves the pain?", options: ["Rest", "Medication", "Sitting up", "Antacids", "Nothing", "Applying pressure"], type: "multiple_choice" },
    { id: "socol_severity", question: "On a scale of 1-10, how severe is the pain?", type: "scale" },
  ],
  breathlessness: [
    { id: "socol_onset", question: "When did the breathlessness begin?", options: ["Suddenly", "Gradually over days", "Gradually over weeks", "Gradually over months"], type: "single_choice" },
    { id: "socol_character", question: "How does the breathlessness feel?", options: ["Cannot get enough air", "Tightness in chest", "Air hunger", "Weight on chest"], type: "single_choice" },
    { id: "socol_severity", question: "Can you rate the breathlessness 1-10?", type: "scale" },
    { id: "socol_timing", question: "When does it happen?", options: ["At rest", "Walking", "Climbing stairs", "At night while lying down", "Constant"], type: "single_choice" },
    { id: "socol_associated", question: "Any other symptoms?", options: ["Cough", "Wheezing", "Chest pain", "Swollen ankles", "Fever"], type: "multiple_choice" },
  ],
  headache: [
    { id: "socol_onset", question: "When did the headache start?", options: ["Suddenly (thunderclap)", "Over hours", "Over days", "Recurring for weeks/months"], type: "single_choice" },
    { id: "socol_location", question: "Where is the headache located?", options: ["Frontal", "Temporal", "Back of head", "All over", "One side"], type: "single_choice" },
    { id: "socol_character", question: "What type of headache?", options: ["Throbbing", "Pressing/squeezing", "Sharp/stabbing", "Dull/aching"], type: "single_choice" },
    { id: "socol_severity", question: "Rate the headache 1-10:", type: "scale" },
    { id: "socol_associated", question: "Any associated symptoms?", options: ["Nausea/vomiting", "Light sensitivity", "Sound sensitivity", "Visual changes", "Stiff neck", "None"], type: "multiple_choice" },
  ],
  default: [
    { id: "socol_onset", question: "When did this problem start?", options: ["Today", "Yesterday", "This week", "This month", "Longer"], type: "single_choice" },
    { id: "socol_duration", question: "How long have you had this symptom?", options: ["Less than 1 hour", "1-24 hours", "1-7 days", "1-4 weeks", "More than a month"], type: "single_choice" },
    { id: "socol_severity", question: "How severe is it on a scale of 1-10?", type: "scale" },
    { id: "socol_progression", question: "Is it getting better, worse, or staying the same?", options: ["Getting better", "Getting worse", "Staying the same", "Comes and goes"], type: "single_choice" },
    { id: "socol_treatment", question: "Have you taken anything for it?", options: ["Home remedies", "Over-the-counter medication", "Prescription medication", "Nothing yet"], type: "multiple_choice" },
  ],
};

const GENERAL_HISTORY_QUESTIONS = [
  { id: "past_medical", question: "Do you have any existing medical conditions?", options: ["Diabetes", "Hypertension", "Heart disease", "Asthma", "Thyroid problems", "None of these", "Other"], type: "multiple_choice" },
  { id: "past_surgical", question: "Have you had any surgeries?", options: ["Yes", "No"], type: "single_choice" },
  { id: "current_medications", question: "Are you currently taking any medications?", options: ["Yes", "No"], type: "single_choice" },
  { id: "allergies", question: "Do you have any known allergies?", options: ["Drug allergies", "Food allergies", "Environmental allergies", "No known allergies"], type: "multiple_choice" },
  { id: "family_history", question: "Any significant conditions in your immediate family?", options: ["Heart disease", "Diabetes", "Cancer", "Asthma", "Mental health conditions", "None known"], type: "multiple_choice" },
  { id: "smoking", question: "Do you smoke?", options: ["Never", "Former smoker", "Current smoker"], type: "single_choice" },
  { id: "alcohol", question: "Do you consume alcohol?", options: ["Never", "Occasionally", "Regularly"], type: "single_choice" },
  { id: "occupation", question: "What is your occupation?", type: "free_text" },
];

const AYUSH_QUESTIONS = [
  { id: "prakriti", question: "What is your constitution type (Prakriti)?", options: ["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha", "Tridoshic", "Not sure"], type: "single_choice" },
  { id: "agni", question: "How is your digestive fire (Agni)?", options: ["Strong and regular", "Variable/sometimes weak", "Weak/slow digestion", "Excessively strong/rapid"], type: "single_choice" },
  { id: "koshtha", question: "What is your bowel nature (Koshtha)?", options: ["Regular", "Loose tendency", "Hard tendency", "Irregular"], type: "single_choice" },
  { id: "ahara_vihara", question: "Describe your diet and lifestyle:", options: ["Balanced, routine lifestyle", "Irregular eating, moderate activity", "Irregular, sedentary", "Very disciplined, active"], type: "single_choice" },
  { id: "sattva", question: "How would you describe your mental state (Sattva)?", options: ["Clear and calm", "Mostly calm, occasional anxiety", "Often anxious/restless", "Frequently agitated"], type: "single_choice" },
];

// ─── Routes ──────────────────────────────────────────────────────────────────

// Start a new intake session
router.post("/medikiosk/intake/start", async (req, res) => {
  try {
    const { patientId, patientName, language, mode, abhaId } = req.body;
    const sessionId = `INT-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const sessionData = {
      sessionId,
      patientId: patientId || "PT-001",
      patientName: patientName || "Patient",
      abhaId,
      language: language || "en",
      mode: mode || "allopathic",
      step: "converse",
      consentGranted: true,
      historyAnswers: {},
      redFlags: [],
      summaryGenerated: false,
      documents: [],
      startedAt: new Date().toISOString(),
    };

    // Always save to in-memory Map for current-process lookups
    intakeSessions.set(sessionId, sessionData);

    // Also persist to PostgreSQL for durability
    try {
      const db = await getDb();
      if (db) {
        const { intakeSessionsTable } = await import("@workspace/db");
        await db.insert(intakeSessionsTable).values({
          sessionId,
          patientId: sessionData.patientId,
          patientName: sessionData.patientName,
          abhaId: sessionData.abhaId,
          language: sessionData.language,
          mode: sessionData.mode,
          step: sessionData.step,
          consentGranted: sessionData.consentGranted,
          historyAnswers: sessionData.historyAnswers,
          redFlags: sessionData.redFlags,
          summaryGenerated: sessionData.summaryGenerated,
          startedAt: new Date(sessionData.startedAt),
        });
        logger.info({ sessionId }, "Intake session saved to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL save failed, using in-memory only");
    }

    res.json({
      sessionId,
      step: "converse",
      currentPhase: "chief_complaint",
      chiefComplaintOptions: CHIEF_COMPLAINT_OPTIONS,
      mode,
      language,
    });
  } catch (err) {
    logger.error({ err }, "MediKiosk intake start failed");
    res.status(500).json({ error: "Failed to start intake session" });
  }
});

// Get intake questions for current phase
router.get("/medikiosk/intake/:sessionId/questions", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const { chiefComplaint } = req.query;
    const complaint = chiefComplaint as string || session.chiefComplaint || "default";

    const socratesQuestions = SOCRATES_QUESTIONS[complaint] || SOCRATES_QUESTIONS["default"];
    const generalQuestions = GENERAL_HISTORY_QUESTIONS;
    const ayushQuestions = session.mode === "ayush" ? AYUSH_QUESTIONS : [];

    res.json({
      sessionId,
      socratesQuestions,
      generalHistoryQuestions: generalQuestions,
      ayushQuestions,
      existingAnswers: session.historyAnswers,
      redFlags: session.redFlags,
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch intake questions");
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Submit answers to intake questions
router.post("/medikiosk/intake/:sessionId/answer", (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer, chiefComplaint } = req.body;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (chiefComplaint) {
      session.chiefComplaint = chiefComplaint;
    }

    session.historyAnswers[questionId] = answer;

    // Red flag detection
    const redFlagKeywords = ["chest pain", "sudden", "severe", "thunderclap", "cannot breathe", "unconscious"];
    const answerStr = typeof answer === "string" ? answer.toLowerCase() : JSON.stringify(answer).toLowerCase();
    for (const keyword of redFlagKeywords) {
      if (answerStr.includes(keyword) && !session.redFlags.includes(keyword)) {
        session.redFlags.push(keyword);
      }
    }

    intakeSessions.set(sessionId, session);

    res.json({
      sessionId,
      saved: true,
      redFlags: session.redFlags,
      progress: Object.keys(session.historyAnswers).length,
    });
  } catch (err) {
    logger.error({ err }, "Failed to save intake answer");
    res.status(500).json({ error: "Failed to save answer" });
  }
});

// Submit voice transcript as answer
router.post("/medikiosk/intake/:sessionId/voice", (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionId, transcript } = req.body;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    session.historyAnswers[questionId] = transcript;
    intakeSessions.set(sessionId, session);

    res.json({ sessionId, saved: true, transcript });
  } catch (err) {
    logger.error({ err }, "Failed to save voice answer");
    res.status(500).json({ error: "Failed to save voice answer" });
  }
});

// Get current intake session state
router.get("/medikiosk/intake/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const totalQuestions = SOCRATES_QUESTIONS[session.chiefComplaint || "default"].length + GENERAL_HISTORY_QUESTIONS.length + (session.mode === "ayush" ? AYUSH_QUESTIONS.length : 0);
    const answered = Object.keys(session.historyAnswers).length;
    const completeness = Math.min(100, Math.round((answered / totalQuestions) * 100));

    res.json({ ...session, completeness, totalQuestions, answeredQuestions: answered });
  } catch (err) {
    logger.error({ err }, "Failed to fetch intake session");
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

// Finalize intake session
router.post("/medikiosk/intake/:sessionId/finalize", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    session.step = "summarize";
    session.completedAt = new Date().toISOString();
    intakeSessions.set(sessionId, session);

    res.json({ sessionId, step: "summarize" });
  } catch (err) {
    logger.error({ err }, "Failed to finalize intake");
    res.status(500).json({ error: "Failed to finalize intake" });
  }
});

// ─── Document Routes ─────────────────────────────────────────────────────────

router.post("/medikiosk/documents/upload", async (req, res) => {
  try {
    const { sessionId, fileName, fileType, fileSize, documentType, ocrText, extractedData } = req.body;

    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const documentId = `DOC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const document: DocumentData = {
      documentId,
      sessionId,
      fileName: fileName || "Untitled",
      fileType: fileType || "image/jpeg",
      documentType: documentType || "other",
      ocrText: ocrText || "",
      extractedData: extractedData || {},
      processingStatus: "completed",
      chronologicalOrder: session.documents.length,
      uploadedAt: new Date().toISOString(),
    };

    session.documents.push(document);
    session.step = "scan";
    intakeSessions.set(sessionId, session);

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { medicalDocumentsTable } = await import("@workspace/db");
        await db.insert(medicalDocumentsTable).values({
          documentId,
          sessionId,
          fileName: document.fileName,
          fileType: document.fileType,
          documentType: document.documentType,
          ocrText: document.ocrText,
          extractedData: document.extractedData,
          processingStatus: document.processingStatus,
          chronologicalOrder: document.chronologicalOrder,
          uploadedAt: new Date(document.uploadedAt),
        });
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "Failed to persist document to PostgreSQL");
    }

    res.json({ documentId, sessionId, status: "completed" });
  } catch (err) {
    logger.error({ err }, "Document upload failed");
    res.status(500).json({ error: "Failed to upload document" });
  }
});

router.get("/medikiosk/documents/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    res.json({ sessionId, documents: session.documents });
  } catch (err) {
    logger.error({ err }, "Failed to fetch documents");
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// ─── Summary Routes ──────────────────────────────────────────────────────────

router.post("/medikiosk/summary/generate", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = intakeSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    const answers = session.historyAnswers;
    const chiefComplaint = session.chiefComplaint || "General consultation";

    // Build structured history from answers
    const hpi: Record<string, unknown> = {};
    const pastMedical: string[] = [];
    const pastSurgical: string[] = [];
    const drugHistory: unknown[] = [];
    const allergyHistory: unknown[] = [];
    const familyHistory: string[] = [];
    const personalHistory: Record<string, string> = {};
    const reviewOfSystems: Record<string, string> = {};
    const priorInvestigations: unknown[] = [];

    for (const [key, value] of Object.entries(answers)) {
      if (key.startsWith("socol_")) {
        const field = key.replace("socol_", "");
        hpi[field] = value;
      } else if (key === "past_medical") {
        const vals = Array.isArray(value) ? value : [value];
        pastMedical.push(...vals.map(String));
      } else if (key === "past_surgical" && value === "Yes") {
        pastSurgical.push("Previous surgery (details pending)");
      } else if (key === "allergies") {
        const vals = Array.isArray(value) ? value : [value];
        allergyHistory.push(...vals.filter((v: unknown) => v !== "No known allergies").map((v: unknown) => ({
          allergen: String(v), reaction: "Not specified", severity: "Unknown",
        })));
      } else if (key === "family_history") {
        const vals = Array.isArray(value) ? value : [value];
        familyHistory.push(...vals.map(String));
      } else if (key === "smoking") {
        personalHistory.smoking = String(value);
      } else if (key === "alcohol") {
        personalHistory.alcohol = String(value);
      } else if (key === "occupation") {
        personalHistory.occupation = String(value);
      } else if (["prakriti", "agni", "koshtha", "ahara_vihara", "sattva"].includes(key)) {
        reviewOfSystems[`ayush_${key}`] = String(value);
      }
    }

    for (const doc of session.documents) {
      const extracted = doc.extractedData as Record<string, unknown>;
      if (extracted.labResults && Array.isArray(extracted.labResults)) {
        priorInvestigations.push(...extracted.labResults);
      }
    }

    const requiredFields = ["onset", "character", "severity"];
    const filledFields = requiredFields.filter((f) => hpi[f]);
    const completenessScore = Math.round(
      ((filledFields.length / requiredFields.length) * 60) +
      (pastMedical.length > 0 ? 10 : 0) +
      (allergyHistory.length > 0 ? 10 : 0) +
      (familyHistory.length > 0 ? 5 : 0) +
      (Object.keys(personalHistory).length > 0 ? 5 : 0) +
      (priorInvestigations.length > 0 ? 10 : 0)
    );

    // ─── AI-enhanced summary generation ────────────────────────────────────
    let aiSummary = "";
    try {
      const openai = await getOpenAIClient();
      if (openai) {
        const systemPrompt = `You are MediKiosk Clinical AI, an expert medical scribe. Given structured patient intake data, generate a concise, physician-ready clinical summary in standard medical format. Use professional medical terminology. Format with clear sections. Include differential diagnoses if findings are ambiguous. Always end with recommended investigations.`;

        const patientData = JSON.stringify({
          chiefComplaint,
          hpi,
          pastMedical,
          pastSurgical,
          allergyHistory,
          familyHistory,
          personalHistory,
          priorInvestigations,
          redFlags: session.redFlags,
        }, null, 2);

        const response = await openai.chat.completions.create({
          model: "llama-3.1-8b-instant",
          max_completion_tokens: 2000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate a clinical history summary for this patient intake:\n\n${patientData}` },
          ],
        });

        aiSummary = response.choices[0]?.message?.content || "";
      }
    } catch (aiErr) {
      logger.warn({ err: aiErr }, "AI summary generation failed, using template");
    }

    // Fallback to template if AI didn't produce output
    if (!aiSummary) {
      const summaryParts = [
        `**Chief Complaint:** ${chiefComplaint}`,
        "",
        "**History of Present Illness:**",
        ...Object.entries(hpi).map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(value) ? value.join(", ") : value}`),
      ];
      if (pastMedical.length > 0) summaryParts.push("", "**Past Medical History:**", ...pastMedical.map((m) => `- ${m}`));
      if (allergyHistory.length > 0) summaryParts.push("", "**Allergies:**", ...allergyHistory.map((a) => `- ${(a as Record<string, string>).allergen} (Reaction: ${(a as Record<string, string>).reaction})`));
      if (familyHistory.length > 0) summaryParts.push("", "**Family History:**", ...familyHistory.map((f) => `- ${f}`));
      if (Object.keys(personalHistory).length > 0) {
        summaryParts.push("", "**Personal History:**");
        for (const [key, value] of Object.entries(personalHistory)) {
          summaryParts.push(`- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);
        }
      }
      if (session.redFlags.length > 0) summaryParts.push("", "**⚠ RED FLAGS:**", ...session.redFlags.map((r) => `- ${r}`));
      aiSummary = summaryParts.join("\n");
    }

    // ─── Clinical Knowledge Enrichment ────────────────────────────────────
    const clinicalNotes: string[] = [];

    // 1. ICD-10 code mapping for chief complaint
    const icdMapping = getIcd10Mapping(session.chiefComplaint || "");
    if (icdMapping) {
      clinicalNotes.push(`ICD-10: ${icdMapping.code} — ${icdMapping.description}`);
      clinicalNotes.push(`Differential Diagnoses: ${icdMapping.differentialDiagnoses.join(", ")}`);
      clinicalNotes.push(`Urgency: ${icdMapping.urgencyLevel.toUpperCase()}`);
    }

    // 2. Drug interaction checking
    const medicationsFromHistory = Object.values(answers)
      .filter((v): v is string => typeof v === "string" && v.toLowerCase().includes("medication"))
      .map(String);
    // Also check if past_medical answer mentions specific drugs
    const medAnswer = answers["current_medications"];
    if (medAnswer === "Yes" && pastMedical.length > 0) {
      // Look for common drug names in all answers
      const allAnswersStr = JSON.stringify(answers).toLowerCase();
      const knownMeds = ["metformin", "amlodipine", "lisinopril", "atorvastatin", "aspirin", "omeprazole", "clopidogrel", "levothyroxine", "paracetamol", "ibuprofen"];
      const foundMeds = knownMeds.filter((m) => allAnswersStr.includes(m));
      if (foundMeds.length > 1) {
        const interactions = checkDrugInteractions(foundMeds);
        if (interactions.length > 0) {
          clinicalNotes.push("");
          clinicalNotes.push("⚠ DRUG INTERACTIONS DETECTED:");
          for (const interaction of interactions) {
            clinicalNotes.push(`  ${interaction.severity.toUpperCase()}: ${interaction.description}`);
            clinicalNotes.push(`  Effect: ${interaction.clinicalEffect}`);
            clinicalNotes.push(`  Recommendation: ${interaction.recommendation}`);
          }
        }
      }
    }

    // 3. Lab value analysis from uploaded documents
    for (const doc of session.documents) {
      const extracted = doc.extractedData as Record<string, unknown>;
      if (extracted.labResults && Array.isArray(extracted.labResults)) {
        for (const lab of extracted.labResults as Array<Record<string, unknown>>) {
          const testValue = Number(lab.value?.toString().replace(/[^0-9.]/g, ""));
          if (!isNaN(testValue) && lab.testName) {
            const analysis = analyzeLabValue(String(lab.testName), testValue);
            if (analysis.status !== "normal" && analysis.status !== "unknown") {
              clinicalNotes.push(`Lab: ${analysis.clinicalNote}`);
            }
          }
        }
      }
    }

    // Append clinical notes to the summary
    if (clinicalNotes.length > 0) {
      aiSummary += "\n\n---\n**CLINICAL DECISION SUPPORT:**\n" + clinicalNotes.join("\n");
    }

    // Save clinical history
    const historyId = `CH-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const record: HistoryRecord = {
      historyId, sessionId,
      patientId: session.patientId, patientName: session.patientName,
      chiefComplaint, hpi,
      pastMedicalHistory: pastMedical, pastSurgicalHistory: pastSurgical,
      drugHistory, allergyHistory, familyHistory, personalHistory,
      reviewOfSystems, priorInvestigations,
      aiSummary, redFlags: session.redFlags,
      completenessScore, physicianReviewed: false,
      createdAt: new Date().toISOString(),
    };

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { clinicalHistoriesTable } = await import("@workspace/db");
        await db.insert(clinicalHistoriesTable).values({
          historyId, sessionId,
          patientId: record.patientId, patientName: record.patientName,
          chiefComplaint: record.chiefComplaint,
          hpi: record.hpi,
          pastMedicalHistory: record.pastMedicalHistory,
          pastSurgicalHistory: record.pastSurgicalHistory,
          drugHistory: record.drugHistory,
          allergyHistory: record.allergyHistory,
          familyHistory: record.familyHistory,
          personalHistory: record.personalHistory,
          reviewOfSystems: record.reviewOfSystems,
          priorInvestigations: record.priorInvestigations,
          aiSummary: record.aiSummary,
          redFlags: record.redFlags,
          completenessScore: record.completenessScore,
          physicianReviewed: record.physicianReviewed,
          createdAt: new Date(record.createdAt),
        });
        logger.info({ historyId }, "Clinical history saved to PostgreSQL");
      } else {
        clinicalHistories.set(historyId, record);
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "Failed to persist clinical history to PostgreSQL");
      clinicalHistories.set(historyId, record);
    }

    session.summaryGenerated = true;
    session.summaryContent = aiSummary;
    session.step = "complete";
    intakeSessions.set(sessionId, session);

    res.json({ historyId, sessionId, summary: record, completenessScore });
  } catch (err) {
    logger.error({ err }, "Summary generation failed");
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// Helper: get OpenAI client (Groq-compatible)
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

router.get("/medikiosk/summary/:historyId", (req, res) => {
  try {
    const { historyId } = req.params;
    const record = clinicalHistories.get(historyId);
    if (!record) { res.status(404).json({ error: "Summary not found" }); return; }
    res.json(record);
  } catch (err) {
    logger.error({ err }, "Failed to fetch summary");
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

router.post("/medikiosk/summary/:historyId/review", (req, res) => {
  try {
    const { historyId } = req.params;
    const { edits, approved } = req.body;
    const record = clinicalHistories.get(historyId);
    if (!record) { res.status(404).json({ error: "Summary not found" }); return; }
    record.physicianReviewed = true;
    if (edits) record.physicianEdits = edits;
    if (approved) record.physicianEdits = { ...record.physicianEdits, approved: true };
    clinicalHistories.set(historyId, record);
    res.json({ historyId, reviewed: true });
  } catch (err) {
    logger.error({ err }, "Failed to save review");
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.get("/medikiosk/histories", (req, res) => {
  try {
    const { patientId } = req.query;
    let histories = Array.from(clinicalHistories.values());
    if (patientId) histories = histories.filter((h) => h.patientId === patientId);
    histories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(histories);
  } catch (err) {
    logger.error({ err }, "Failed to fetch histories");
    res.status(500).json({ error: "Failed to fetch histories" });
  }
});

// ─── Consent & ABHA Routes ───────────────────────────────────────────────────

router.post("/medikiosk/consent", (req, res) => {
  try {
    const { sessionId, consentType, abhaId } = req.body;
    const session = intakeSessions.get(sessionId);
    if (!session) { res.status(404).json({ error: "Session not found" }); return; }
    session.consentGranted = true;
    if (abhaId) session.abhaId = abhaId;
    intakeSessions.set(sessionId, session);
    res.json({ sessionId, consentGranted: true, consentType, timestamp: new Date().toISOString(), message: "Consent recorded successfully. Your data is protected under DPDP Act 2023." });
  } catch (err) {
    logger.error({ err }, "Failed to record consent");
    res.status(500).json({ error: "Failed to record consent" });
  }
});

router.post("/medikiosk/abha/validate", (req, res) => {
  try {
    const { abhaId } = req.body;
    const isValid = /^\d{14}$/.test(abhaId);
    if (isValid) {
      res.json({ valid: true, abhaId, linkedFacility: "Demo Hospital — Ayurvedic OPD", lastVisit: "2025-12-15", message: "ABHA ID verified successfully" });
    } else {
      res.json({ valid: false, message: "ABHA ID format: 14 digits. You can also register as a new patient." });
    }
  } catch (err) {
    logger.error({ err }, "ABHA validation failed");
    res.status(500).json({ error: "Failed to validate ABHA ID" });
  }
});

router.post("/medikiosk/abha/register", (req, res) => {
  try {
    const { name, phone, dob } = req.body;
    const abhaId = `14${Date.now().toString().slice(-12)}`;
    res.json({ success: true, abhaId, name, message: "ABHA ID generated successfully" });
  } catch (err) {
    logger.error({ err }, "ABHA registration failed");
    res.status(500).json({ error: "Failed to register ABHA" });
  }
});

// ─── Clinical Knowledge API Routes ──────────────────────────────────────────

// Lookup a drug by name (local database + RxNorm API)
router.get("/medikiosk/drug/lookup", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Drug name is required" });
      return;
    }

    // Local lookup first
    const localResult = identifyDrug(name);

    // RxNorm API lookup (free, no key needed)
    let rxnormResults: Array<{ rxcui: string; name: string; tty: string }> = [];
    try {
      const { lookupDrugRxNorm } = await import("../lib/clinical-knowledge");
      rxnormResults = await lookupDrugRxNorm(name);
    } catch {
      // RxNorm is best-effort
    }

    res.json({
      query: name,
      localMatch: localResult,
      rxnormMatches: rxnormResults,
    });
  } catch (err) {
    logger.error({ err }, "Drug lookup failed");
    res.status(500).json({ error: "Failed to look up drug" });
  }
});

// Check drug interactions for a list of medications
router.post("/medikiosk/drug/interactions", (req, res) => {
  try {
    const { medications } = req.body;
    if (!Array.isArray(medications)) {
      res.status(400).json({ error: "medications array is required" });
      return;
    }

    const interactions = checkDrugInteractions(medications);
    res.json({ medications, interactions, count: interactions.length });
  } catch (err) {
    logger.error({ err }, "Drug interaction check failed");
    res.status(500).json({ error: "Failed to check interactions" });
  }
});

// Get ICD-10 mapping for a chief complaint
router.get("/medikiosk/icd10/:complaintId", (req, res) => {
  try {
    const mapping = getIcd10Mapping(req.params.complaintId);
    if (mapping) {
      res.json(mapping);
    } else {
      res.status(404).json({ error: "No ICD-10 mapping for this complaint" });
    }
  } catch (err) {
    logger.error({ err }, "ICD-10 lookup failed");
    res.status(500).json({ error: "Failed to look up ICD-10 code" });
  }
});

export default router;
