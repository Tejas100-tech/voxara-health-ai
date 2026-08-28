import { Router } from "express";
import { logger } from "../lib/logger";
import crypto from "crypto";
import { generateChatResponse, PRE_CONSULTATION_QUESTIONS } from "../lib/ayush-knowledge";
import { generateAyushAnalysis, generateEnhancedChatResponse } from "../lib/ayush-ai-analysis";

const router = Router();

// ─── PostgreSQL Helper ───────────────────────────────────────────────────

async function getDb() {
  try {
    const { db } = await import("@workspace/db");
    return db;
  } catch {
    return null;
  }
}

// ─── In-memory stores ────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "patient" | "bot";
  content: string;
  timestamp: string;
  extractedEntities?: Record<string, unknown>;
}

interface ChatSession {
  sessionId: string;
  patientId: string;
  patientName: string;
  language: string;
  mode: "education" | "pre_consultation" | "practitioner";
  messages: ChatMessage[];
  extractedData: Record<string, unknown>;
  assessmentProgress: number;
  createdAt: string;
  updatedAt: string;
}

interface AyushAssessment {
  assessmentId: string;
  patientId: string;
  patientName: string;
  sessionId: string;
  // Basic info
  chiefComplaint?: string;
  duration?: string;
  previousAyushTreatment?: string;
  // Dashavidha Pariksha
  prakriti?: Record<string, string>;
  vikriti?: Record<string, string>;
  sara?: Record<string, string>;
  samhanana?: Record<string, string>;
  pramana?: Record<string, string>;
  satmya?: Record<string, string>;
  sattva?: Record<string, string>;
  aharaShakti?: Record<string, string>;
  vyayamaShakti?: Record<string, string>;
  vaya?: Record<string, string>;
  // Lifestyle assessments
  ahara?: Record<string, unknown>;
  vihara?: Record<string, unknown>;
  agni?: Record<string, unknown>;
  koshtha?: Record<string, unknown>;
  nidra?: Record<string, unknown>;
  // Status
  assessmentStatus: "in_progress" | "completed" | "verified";
  aiBrief?: string;
  practitionerVerified?: boolean;
  practitionerId?: string;
  practitionerVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface AyushDocument {
  documentId: string;
  patientId: string;
  assessmentId: string;
  fileName: string;
  fileType: string;
  documentType: "prescription" | "lab_report" | "treatment_notes" | "therapy_record" | "other";
  ocrText: string;
  extractedData: Record<string, unknown>;
  processingStatus: "processing" | "completed" | "failed";
  uploadedAt: string;
}

interface AyushTimelineEntry {
  entryId: string;
  patientId: string;
  date: string;
  type: "modern_medicine" | "ayush";
  category: string;
  title: string;
  description: string;
  documentId?: string;
  assessmentId?: string;
}

const chatSessions: Map<string, ChatSession> = new Map();
const ayushAssessments: Map<string, AyushAssessment> = new Map();
const ayushDocuments: Map<string, AyushDocument> = new Map();
const ayushTimeline: Map<string, AyushTimelineEntry> = new Map();

// ─── Chat API Routes ─────────────────────────────────────────────────────

// Create a new chat session
router.post("/ayush/chat/session", async (req, res) => {
  try {
    const { patientId, patientName, language, mode } = req.body;
    const sessionId = `CHAT-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const lang = (language || "en") as string;

    const session: ChatSession = {
      sessionId,
      patientId: patientId || "PT-001",
      patientName: patientName || "Patient",
      language: lang,
      mode: mode || "pre_consultation",
      messages: [],
      extractedData: {},
      assessmentProgress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    chatSessions.set(sessionId, session);

    // Generate greeting based on mode
    let greeting: string;
    const greetingMap: Record<string, Record<string, string>> = {
      education: {
        en: "Namaste! 🙏 I'm MediKiosk AyurBot. I can help you learn about Ayurveda — Prakriti, Vikriti, Agni, Dinacharya, and more. What would you like to know?",
        hi: "नमस्ते! 🙏 मैं MediKiosk AyurBot हूं। मैं आपको आयुर्वेद के बारे में जानने में मदद कर सकता हूं — प्रकृति, विकृति, अग्नि, दिनचर्या और बहुत कुछ। आप क्या जानना चाहेंगे?",
        mr: "नमस्कार! 🙏 मी MediKiosk AyurBot आहे. मी तुम्हाला आयुर्वेदाबद्दल जाणून घेण्यास मदत करू शकतो — प्रकृती, विकृती, अग्नी, दिनचर्या आणि बरेच काही. तुम्हाला काय जाणून आहे?",
      },
      pre_consultation: {
        en: "Namaste! 🙏 I'm MediKiosk AyurBot. I'll guide you through a brief Ayurvedic pre-consultation to prepare your information for the practitioner. Ready to begin?",
        hi: "नमस्ते! 🙏 मैं MediKiosk AyurBot हूं। मैं आपकी आयुर्वेदिक पूर्व-परामर्श जानकारी एकत्र करूंगा। आपकी जानकारी आपके वैद्य के लिए तैयार की जाएगी। शुरू करने के लिए तैयार हैं?",
        mr: "नमस्कार! 🙏 मी MediKiosk AyurBot आहे. मी तुम्हाला एक संक्षिप्त आयुर्वेदिक पूर्व-सल्ला मधून मार्गदर्शन करीन. तुमची माहिती वैद्यासाठी तयार केली जाईल. सुरू करायला तयार आहात?",
      },
      practitioner: {
        en: "Practitioner assistant mode active. I can help you review patient records, compare previous consultations, and identify missing information.",
        hi: "चिकित्सक सहायता मोड सक्रिय। मैं मरीज़ रिकॉर्ड की समीक्षा करने, पिछले परामर्शों की तुलना करने और गायब जानकारी पहचानने में मदद कर सकता हूं।",
        mr: "वैद्य सहाय्य मोड सक्रिय. मी रुग्ण नोंदींचे पुनरावलोकन करण्यात, मागील सल्लांची तुलना करण्यात आणि गायब माहिती ओळखण्यात मदत करू शकतो.",
      },
    };

    const greetingText = greetingMap[mode || "pre_consultation"]?.[lang] || greetingMap[mode || "pre_consultation"]?.["en"] || "Namaste! How can I help you today?";

    const botMessage: ChatMessage = {
      id: `MSG-${Date.now()}`,
      role: "bot",
      content: greetingText,
      timestamp: new Date().toISOString(),
    };

    session.messages.push(botMessage);
    chatSessions.set(sessionId, session);

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { ayushChatSessionsTable } = await import("@workspace/db");
        await db.insert(ayushChatSessionsTable).values({
          sessionId,
          patientId: session.patientId,
          patientName: session.patientName,
          language: session.language,
          mode: session.mode,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: session.messages as any,
          extractedData: session.extractedData,
          assessmentProgress: session.assessmentProgress,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        });
        logger.info({ sessionId }, "AYUSH chat session saved to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for chat session");
    }

    res.json({ sessionId, greeting: greetingText, mode: session.mode, language: session.language });
  } catch (err) {
    logger.error({ err }, "Failed to create chat session");
    res.status(500).json({ error: "Failed to create chat session" });
  }
});

// Send a message in a chat session
router.post("/ayush/chat/message", async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const session = chatSessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Chat session not found" });
      return;
    }

    // Add patient message
    const patientMsg: ChatMessage = {
      id: `MSG-${Date.now()}-p`,
      role: "patient",
      content: message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(patientMsg);

    // Generate bot response
    const conversationHistory = session.messages.map((m) => ({ role: m.role, content: m.content }));
    const response = generateChatResponse(
      message,
      session.mode,
      session.language,
      conversationHistory,
      session.assessmentProgress,
    );

    // Extract data if pre-consultation
    if (response.extractedData) {
      Object.assign(session.extractedData, response.extractedData);
      if (typeof response.extractedData.questionIndex === "number") {
        session.assessmentProgress = (response.extractedData.questionIndex as number) + 1;
      }
    }

    const botMsg: ChatMessage = {
      id: `MSG-${Date.now()}-b`,
      role: "bot",
      content: response.message,
      timestamp: new Date().toISOString(),
      extractedEntities: response.extractedData,
    };
    session.messages.push(botMsg);
    session.updatedAt = new Date().toISOString();
    chatSessions.set(sessionId, session);

    // Persist updated messages to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { ayushChatSessionsTable } = await import("@workspace/db");
        const { eq } = await import("drizzle-orm");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.update(ayushChatSessionsTable).set({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: session.messages as any,
          extractedData: session.extractedData,
          assessmentProgress: session.assessmentProgress,
          updatedAt: new Date(),
        }).where(eq(ayushChatSessionsTable.sessionId, sessionId));
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for chat message update");
    }

    res.json({
      messageId: botMsg.id,
      message: response.message,
      suggestedActions: response.suggestedActions,
      extractedData: response.extractedData,
      category: response.category,
    });
  } catch (err) {
    logger.error({ err }, "Failed to send chat message");
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get chat session (PostgreSQL-first, in-memory fallback)
router.get("/ayush/chat/session/:id", async (req, res) => {
  // Try PostgreSQL first
  try {
    const db = await getDb();
    if (db) {
      const { ayushChatSessionsTable } = await import("@workspace/db");
      const { eq } = await import("drizzle-orm");
      const rows = await db.select().from(ayushChatSessionsTable).where(eq(ayushChatSessionsTable.sessionId, req.params.id)).limit(1);
      if (rows.length > 0) {
        const row = rows[0];
        res.json({
          sessionId: row.sessionId,
          patientId: row.patientId,
          patientName: row.patientName,
          language: row.language,
          mode: row.mode,
          messages: row.messages || [],
          extractedData: row.extractedData || {},
          assessmentProgress: row.assessmentProgress,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        });
        return;
      }
    }
  } catch {
    // Fall through to in-memory
  }
  const session = chatSessions.get(req.params.id);
  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  res.json(session);
});

// Extract structured data from chat
router.post("/ayush/chat/extract", (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = chatSessions.get(sessionId);
    if (!session) { res.status(404).json({ error: "Session not found" }); return; }

    // Build structured data from chat messages
    const extracted: Record<string, unknown> = { ...session.extractedData };

    // Analyze messages for additional data
    for (const msg of session.messages) {
      if (msg.role === "patient") {
        const content = msg.content.toLowerCase();
        // Detect food preferences
        if (content.includes("vegetarian") || content.includes("शाकाहारी") || content.includes("शाकाहारी")) {
          extracted.foodPreference = "vegetarian";
        }
        if (content.includes("non-veg") || content.includes("मांसाहारी") || content.includes("मांसाहारी")) {
          extracted.foodPreference = "non-vegetarian";
        }
      }
    }

    res.json({ sessionId, extractedData: extracted, progress: session.assessmentProgress });
  } catch (err) {
    logger.error({ err }, "Failed to extract data");
    res.status(500).json({ error: "Failed to extract data" });
  }
});

// ─── Assessment API Routes ───────────────────────────────────────────────

// Create/update AYUSH assessment
router.post("/ayush/assessment", async (req, res) => {
  try {
    const {
      patientId, patientName, sessionId, chiefComplaint, duration,
      prakriti, vikriti, sara, samhanana, pramana, satmya, sattva,
      aharaShakti, vyayamaShakti, vaya, ahara, vihara, agni, koshtha, nidra,
      previousAyushTreatment,
    } = req.body;

    // Find existing or create new
    let assessment: AyushAssessment | undefined;
    for (const a of ayushAssessments.values()) {
      if (a.patientId === patientId && a.assessmentStatus !== "verified") {
        assessment = a;
        break;
      }
    }

    if (!assessment) {
      const assessmentId = `AYUSH-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      assessment = {
        assessmentId,
        patientId: patientId || "PT-001",
        patientName: patientName || "Patient",
        sessionId: sessionId || "",
        assessmentStatus: "in_progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ayushAssessments.set(assessmentId, assessment);
    }

    // Update fields
    if (chiefComplaint) assessment.chiefComplaint = chiefComplaint;
    if (duration) assessment.duration = duration;
    if (previousAyushTreatment) assessment.previousAyushTreatment = previousAyushTreatment;
    if (prakriti) assessment.prakriti = prakriti;
    if (vikriti) assessment.vikriti = vikriti;
    if (sara) assessment.sara = sara;
    if (samhanana) assessment.samhanana = samhanana;
    if (pramana) assessment.pramana = pramana;
    if (satmya) assessment.satmya = satmya;
    if (sattva) assessment.sattva = sattva;
    if (aharaShakti) assessment.aharaShakti = aharaShakti;
    if (vyayamaShakti) assessment.vyayamaShakti = vyayamaShakti;
    if (vaya) assessment.vaya = vaya;
    if (ahara) assessment.ahara = ahara;
    if (vihara) assessment.vihara = vihara;
    if (agni) assessment.agni = agni;
    if (koshtha) assessment.koshtha = koshtha;
    if (nidra) assessment.nidra = nidra;
    assessment.updatedAt = new Date().toISOString();

    // Check completeness
    const requiredSections = ["chiefComplaint", "ahara", "vihara", "agni", "koshtha", "nidra"];
    const filledSections = requiredSections.filter((s) => assessment![s as keyof AyushAssessment]);
    if (filledSections.length >= 4) {
      assessment.assessmentStatus = "completed";
    }

    ayushAssessments.set(assessment.assessmentId, assessment);

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { ayushAssessmentsTable } = await import("@workspace/db");
        const pgData = {
          assessmentId: assessment.assessmentId,
          patientId: assessment.patientId,
          patientName: assessment.patientName,
          sessionId: assessment.sessionId || "",
          chiefComplaint: assessment.chiefComplaint,
          duration: assessment.duration,
          previousAyushTreatment: assessment.previousAyushTreatment,
          prakriti: assessment.prakriti,
          vikriti: assessment.vikriti,
          sara: assessment.sara,
          samhanana: assessment.samhanana,
          pramana: assessment.pramana,
          satmya: assessment.satmya,
          sattva: assessment.sattva,
          aharaShakti: assessment.aharaShakti,
          vyayamaShakti: assessment.vyayamaShakti,
          vaya: assessment.vaya,
          ahara: assessment.ahara,
          vihara: assessment.vihara,
          agni: assessment.agni,
          koshtha: assessment.koshtha,
          nidra: assessment.nidra,
          assessmentStatus: assessment.assessmentStatus,
          aiBrief: assessment.aiBrief,
          practitionerVerified: assessment.practitionerVerified || false,
          practitionerId: assessment.practitionerId,
          createdAt: new Date(assessment.createdAt),
          updatedAt: new Date(assessment.updatedAt),
        };
        // Upsert: try insert, on conflict update
        try {
          await db.insert(ayushAssessmentsTable).values(pgData);
        } catch {
          // Update if exists
          const { eq } = await import("drizzle-orm");
          await db.update(ayushAssessmentsTable)
            .set({ ...pgData, updatedAt: new Date() })
            .where(eq(ayushAssessmentsTable.assessmentId, assessment.assessmentId));
        }
        logger.info({ assessmentId: assessment.assessmentId }, "AYUSH assessment saved to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for assessment");
    }

    res.json({ assessmentId: assessment.assessmentId, status: assessment.assessmentStatus });
  } catch (err) {
    logger.error({ err }, "Failed to save assessment");
    res.status(500).json({ error: "Failed to save assessment" });
  }
});

// Get patient's AYUSH data
router.get("/patients/:id/ayush", (req, res) => {
  try {
    const patientId = req.params.id;
    let assessment: AyushAssessment | undefined;
    for (const a of ayushAssessments.values()) {
      if (a.patientId === patientId) {
        if (!assessment || new Date(a.updatedAt) > new Date(assessment.updatedAt)) {
          assessment = a;
        }
      }
    }

    const documents = Array.from(ayushDocuments.values()).filter((d) => d.patientId === patientId);
    const timeline = Array.from(ayushTimeline.values())
      .filter((t) => t.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      patientId,
      assessment: assessment || null,
      documents,
      timeline,
      hasAssessment: !!assessment,
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch AYUSH data");
    res.status(500).json({ error: "Failed to fetch AYUSH data" });
  }
});

// Get patient timeline
router.get("/patients/:id/ayush/timeline", (req, res) => {
  try {
    const patientId = req.params.id;
    const { type } = req.query;
    let timeline = Array.from(ayushTimeline.values()).filter((t) => t.patientId === patientId);
    if (type && type !== "all") {
      timeline = timeline.filter((t) => t.type === type);
    }
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(timeline);
  } catch (err) {
    logger.error({ err }, "Failed to fetch timeline");
    res.status(500).json({ error: "Failed to fetch timeline" });
  }
});

// ─── Document Routes ──────────────────────────────────────────────────────

router.post("/ayush/documents/upload", async (req, res) => {
  try {
    const { patientId, assessmentId, fileName, fileType, documentType, ocrText, extractedData } = req.body;
    const documentId = `AYUSH-DOC-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const doc: AyushDocument = {
      documentId,
      patientId: patientId || "PT-001",
      assessmentId: assessmentId || "",
      fileName: fileName || "Untitled",
      fileType: fileType || "image/jpeg",
      documentType: documentType || "other",
      ocrText: ocrText || "",
      extractedData: extractedData || {},
      processingStatus: "completed",
      uploadedAt: new Date().toISOString(),
    };

    ayushDocuments.set(documentId, doc);

    // Add to timeline
    const timelineId = `TL-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    ayushTimeline.set(timelineId, {
      entryId: timelineId,
      patientId: doc.patientId,
      date: doc.uploadedAt,
      type: "ayush",
      category: "document",
      title: `AYUSH Document: ${doc.fileName}`,
      description: `Uploaded ${doc.documentType} — ${doc.processingStatus}`,
      documentId,
    });

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { ayushDocumentsTable, ayushTimelineTable } = await import("@workspace/db");
        await db.insert(ayushDocumentsTable).values({
          documentId,
          patientId: doc.patientId,
          assessmentId: doc.assessmentId,
          fileName: doc.fileName,
          fileType: doc.fileType,
          documentType: doc.documentType,
          ocrText: doc.ocrText,
          extractedData: doc.extractedData,
          processingStatus: doc.processingStatus,
          uploadedAt: new Date(doc.uploadedAt),
        });
        await db.insert(ayushTimelineTable).values({
          entryId: timelineId,
          patientId: doc.patientId,
          date: doc.uploadedAt,
          type: "ayush",
          category: "document",
          title: `AYUSH Document: ${doc.fileName}`,
          description: `Uploaded ${doc.documentType} — ${doc.processingStatus}`,
          documentId,
        });
        logger.info({ documentId }, "AYUSH document saved to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for document");
    }

    res.json({ documentId, status: "completed" });
  } catch (err) {
    logger.error({ err }, "Document upload failed");
    res.status(500).json({ error: "Failed to upload document" });
  }
});

router.get("/ayush/documents/:patientId", (req, res) => {
  const docs = Array.from(ayushDocuments.values()).filter((d) => d.patientId === req.params.patientId);
  res.json(docs);
});

// ─── Practitioner Routes ──────────────────────────────────────────────────

// Get all AYUSH patients for practitioner dashboard
router.get("/ayush/practitioner/patients", async (req, res) => {
  try {
    // Try PostgreSQL first
    try {
      const db = await getDb();
      if (db) {
        const { ayushAssessmentsTable, ayushDocumentsTable } = await import("@workspace/db");
        const rows = await db.select().from(ayushAssessmentsTable);
        if (rows.length > 0) {
          const patientsMap = new Map<string, typeof rows[0]>();
          for (const row of rows) {
            const existing = patientsMap.get(row.patientId);
            if (!existing || new Date(row.updatedAt) > new Date(existing.updatedAt)) {
              patientsMap.set(row.patientId, row);
            }
          }
          const { eq } = await import("drizzle-orm");
          const result = [];
          for (const row of patientsMap.values()) {
            const docRows = await db.select().from(ayushDocumentsTable).where(
              eq(ayushDocumentsTable.patientId, row.patientId)
            );
            result.push({
              patientId: row.patientId,
              patientName: row.patientName,
              chiefComplaint: row.chiefComplaint,
              assessmentStatus: row.assessmentStatus,
              documentCount: docRows.length,
              hasAiBrief: !!row.aiBrief,
              updatedAt: row.updatedAt?.toISOString() || "",
            });
          }
          res.json(result);
          return;
        }
      }
    } catch {
      // Fall through to in-memory
    }

    // In-memory fallback
    const patients = new Map<string, {
      patientId: string;
      patientName: string;
      chiefComplaint?: string;
      assessmentStatus: string;
      documentCount: number;
      hasAiBrief: boolean;
      updatedAt: string;
    }>();

    for (const assessment of ayushAssessments.values()) {
      const existing = patients.get(assessment.patientId);
      const docCount = Array.from(ayushDocuments.values()).filter((d) => d.patientId === assessment.patientId).length;
      if (!existing || new Date(assessment.updatedAt) > new Date(existing.updatedAt)) {
        patients.set(assessment.patientId, {
          patientId: assessment.patientId,
          patientName: assessment.patientName,
          chiefComplaint: assessment.chiefComplaint,
          assessmentStatus: assessment.assessmentStatus,
          documentCount: docCount,
          hasAiBrief: !!assessment.aiBrief,
          updatedAt: assessment.updatedAt,
        });
      }
    }

    res.json(Array.from(patients.values()));
  } catch (err) {
    logger.error({ err }, "Failed to fetch practitioner patients");
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// Get specific patient detail for practitioner
router.get("/ayush/practitioner/patient/:patientId", async (req, res) => {
  try {
    const patientId = req.params.patientId;
    let assessment: AyushAssessment | undefined;
    let documents: AyushDocument[] = [];
    let timeline: AyushTimelineEntry[] = [];

    // Try PostgreSQL first
    try {
      const db = await getDb();
      if (db) {
        const { ayushAssessmentsTable, ayushDocumentsTable, ayushTimelineTable } = await import("@workspace/db");
        const { eq, desc } = await import("drizzle-orm");
        const rows = await db.select().from(ayushAssessmentsTable).where(eq(ayushAssessmentsTable.patientId, patientId));
        if (rows.length > 0) {
          // Pick latest
          const row = rows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
          assessment = {
            assessmentId: row.assessmentId, patientId: row.patientId, patientName: row.patientName,
            sessionId: row.sessionId || "", chiefComplaint: row.chiefComplaint || undefined,
            duration: row.duration || undefined, previousAyushTreatment: row.previousAyushTreatment || undefined,
            prakriti: row.prakriti || undefined, vikriti: row.vikriti || undefined,
            sara: row.sara || undefined, samhanana: row.samhanana || undefined,
            pramana: row.pramana || undefined, satmya: row.satmya || undefined,
            sattva: row.sattva || undefined, aharaShakti: row.aharaShakti || undefined,
            vyayamaShakti: row.vyayamaShakti || undefined, vaya: row.vaya || undefined,
            ahara: row.ahara || undefined, vihara: row.vihara || undefined,
            agni: row.agni || undefined, koshtha: row.koshtha || undefined,
            nidra: row.nidra || undefined,
            assessmentStatus: row.assessmentStatus as AyushAssessment["assessmentStatus"], aiBrief: row.aiBrief || undefined,
            practitionerVerified: row.practitionerVerified,
            practitionerId: row.practitionerId || undefined,
            practitionerVerifiedAt: row.practitionerVerifiedAt?.toISOString(),
            createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
          };
          const docRows = await db.select().from(ayushDocumentsTable).where(eq(ayushDocumentsTable.patientId, patientId));
          documents = docRows.map((d) => ({
            documentId: d.documentId, patientId: d.patientId, assessmentId: d.assessmentId || "",
            fileName: d.fileName, fileType: d.fileType || "", documentType: d.documentType as AyushDocument["documentType"],
            ocrText: d.ocrText || "", extractedData: (d.extractedData || {}) as Record<string, unknown>,
            processingStatus: d.processingStatus as AyushDocument["processingStatus"],
            uploadedAt: d.uploadedAt?.toISOString() || "",
          }));
          const tlRows = await db.select().from(ayushTimelineTable).where(eq(ayushTimelineTable.patientId, patientId)).orderBy(desc(ayushTimelineTable.date));
          timeline = tlRows.map((t) => ({
            entryId: t.entryId, patientId: t.patientId, date: t.date, type: t.type as AyushTimelineEntry["type"],
            category: t.category, title: t.title, description: t.description || "",
            documentId: t.documentId || undefined, assessmentId: t.assessmentId || undefined,
          }));
          logger.info({ patientId }, "Loaded patient data from PostgreSQL");
        }
      }
    } catch {
      // Fall through to in-memory
    }

    // Fallback to in-memory
    if (!assessment) {
      for (const a of ayushAssessments.values()) {
        if (a.patientId === patientId) {
          if (!assessment || new Date(a.updatedAt) > new Date(assessment.updatedAt)) {
            assessment = a;
          }
        }
      }
    }
    if (documents.length === 0) {
      documents = Array.from(ayushDocuments.values()).filter((d) => d.patientId === patientId);
    }
    if (timeline.length === 0) {
      timeline = Array.from(ayushTimeline.values())
        .filter((t) => t.patientId === patientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Generate AI-powered AYUSH Brief
    let aiBriefResult: { aiBrief: string; clinicalObservations: string[]; doshaAnalysis: string; recommendedFocusAreas: string[]; riskFlags: string[]; confidence: string; assessmentCompleteness: number; missingInformation: string[] } | null = null;
    if (assessment) {
      try {
        aiBriefResult = await generateAyushAnalysis({
          patientName: assessment.patientName,
          chiefComplaint: assessment.chiefComplaint,
          duration: assessment.duration,
          prakriti: assessment.prakriti,
          vikriti: assessment.vikriti,
          ahara: assessment.ahara,
          vihara: assessment.vihara,
          agni: assessment.agni,
          koshtha: assessment.koshtha,
          nidra: assessment.nidra,
          sattva: assessment.sattva,
          sara: assessment.sara,
          samhanana: assessment.samhanana,
          pramana: assessment.pramana,
          satmya: assessment.satmya,
          aharaShakti: assessment.aharaShakti,
          vyayamaShakti: assessment.vyayamaShakti,
          vaya: assessment.vaya,
          previousTreatment: assessment.previousAyushTreatment,
          documents: documents.map((d) => ({ fileName: d.fileName, documentType: d.documentType })),
        });
        assessment.aiBrief = aiBriefResult.aiBrief;
      } catch (err) {
        logger.warn({ err: (err as Error).message }, "AI brief generation failed, using basic brief");
        aiBriefResult = null;
      }
    }

    res.json({
      patientId,
      assessment: assessment || null,
      documents,
      timeline,
      aiBrief: aiBriefResult?.aiBrief || assessment?.aiBrief || "",
      aiAnalysis: aiBriefResult,
    });
  } catch (err) {
    logger.error({ err }, "Failed to fetch patient detail");
    res.status(500).json({ error: "Failed to fetch patient detail" });
  }
});

// Practitioner verify/edit assessment
router.post("/ayush/practitioner-review", async (req, res) => {
  try {
    const { patientId, practitionerId, action, edits } = req.body;
    let assessment: AyushAssessment | undefined;
    for (const a of ayushAssessments.values()) {
      if (a.patientId === patientId) {
        if (!assessment || new Date(a.updatedAt) > new Date(assessment.updatedAt)) {
          assessment = a;
        }
      }
    }

    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    if (action === "confirm") {
      assessment.practitionerVerified = true;
      assessment.practitionerId = practitionerId;
      assessment.practitionerVerifiedAt = new Date().toISOString();
      assessment.assessmentStatus = "verified";
    } else if (action === "edit" && edits) {
      // Apply edits to specific section
      for (const [key, value] of Object.entries(edits)) {
        if (key in assessment) {
          (assessment as unknown as Record<string, unknown>)[key] = value;
        }
      }
      assessment.practitionerId = practitionerId;
      assessment.updatedAt = new Date().toISOString();
    } else if (action === "reject") {
      assessment.assessmentStatus = "in_progress";
      assessment.practitionerId = practitionerId;
      assessment.updatedAt = new Date().toISOString();
    }

    ayushAssessments.set(assessment.assessmentId, assessment);

    // Persist review to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { practitionerReviewsTable, ayushAssessmentsTable } = await import("@workspace/db");
        const { eq } = await import("drizzle-orm");
        // Record the review
        const reviewId = `REV-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
        await db.insert(practitionerReviewsTable).values({
          reviewId,
          patientId,
          assessmentId: assessment.assessmentId,
          practitionerId,
          action,
          reviewedAt: new Date(),
        });
        // Update assessment status in PG
        await db.update(ayushAssessmentsTable)
          .set({
            assessmentStatus: assessment.assessmentStatus,
            practitionerVerified: assessment.practitionerVerified || false,
            practitionerId: assessment.practitionerId,
            practitionerVerifiedAt: assessment.practitionerVerifiedAt ? new Date(assessment.practitionerVerifiedAt) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(ayushAssessmentsTable.assessmentId, assessment.assessmentId));
        logger.info({ reviewId, patientId }, "Practitioner review saved to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for review");
    }

    res.json({ assessmentId: assessment.assessmentId, status: assessment.assessmentStatus, verified: assessment.practitionerVerified });
  } catch (err) {
    logger.error({ err }, "Practitioner review failed");
    res.status(500).json({ error: "Failed to process review" });
  }
});

// ─── Demo Data Route ──────────────────────────────────────────────────────

router.post("/ayush/seed-demo", async (req, res) => {
  try {
    // Patient A — Routine AYUSH consultation
    const paId = "PT-AYUSH-001";
    const paAssessmentId = `AYUSH-DEMO-001`;
    ayushAssessments.set(paAssessmentId, {
      assessmentId: paAssessmentId,
      patientId: paId,
      patientName: "Lakshmi Devi",
      sessionId: "CHAT-DEMO-001",
      chiefComplaint: "Digestive discomfort and irregular appetite",
      duration: "2-4 weeks",
      previousAyushTreatment: "Yes, previously but not now",
      prakriti: { constitution: "Pitta-Kapha", bodyFrame: "Medium build", appetite: "Strong", sleep: "Moderate" },
      vikriti: { currentDigestion: "Irregular", recentChanges: "Increased stress", sleepChange: "Lighter sleep" },
      ahara: { mealPattern: "Irregular", foodPreference: "Vegetarian", preferredTastes: ["Sweet", "Sour", "Salty"], waterIntake: "6-8 glasses" },
      vihara: { sleepSchedule: "10 PM - 6 AM", physicalActivity: "Moderate (walk regularly)", sittingHours: "6-8 hours", screenTime: "4-6 hours" },
      agni: { appetite: "Variable", hungerTiming: "Regular", digestion: "Moderate", postMealDiscomfort: "Mild bloating reported" },
      koshtha: { frequency: "Once daily", regularity: "Mostly regular", consistency: "Medium", recentChanges: "Slightly harder recently" },
      nidra: { bedtime: "10 PM", wakeTime: "6 AM", duration: "8 hours", quality: "Moderate", difficulties: "Occasional difficulty falling asleep" },
      sattva: { stressLevel: "Moderate", relaxationDifficulty: "Sometimes", mentalState: "Mostly calm with occasional anxiety" },
      assessmentStatus: "completed",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    });

    // Patient B — Previous Ayurvedic treatment + documents
    const pbId = "PT-AYUSH-002";
    const pbAssessmentId = `AYUSH-DEMO-002`;
    ayushAssessments.set(pbAssessmentId, {
      assessmentId: pbAssessmentId,
      patientId: pbId,
      patientName: "Rajesh Kumar",
      sessionId: "CHAT-DEMO-002",
      chiefComplaint: "Chronic joint pain and stiffness",
      duration: "3-6 months",
      previousAyushTreatment: "Yes, currently taking",
      prakriti: { constitution: "Vata", bodyFrame: "Thin build", appetite: "Variable", sleep: "Light, interrupted" },
      vikriti: { currentDigestion: "Weak", recentChanges: "Cold weather worsening", sleepChange: "More disturbed" },
      ahara: { mealPattern: "Regular", foodPreference: "Non-vegetarian", preferredTastes: ["Pungent", "Salty"], waterIntake: "4-6 glasses" },
      vihara: { sleepSchedule: "11 PM - 7 AM", physicalActivity: "Light (occasional walks)", sittingHours: "8+ hours", screenTime: "6-8 hours" },
      agni: { appetite: "Reduced", hungerTiming: "Late", digestion: "Slow", postMealDiscomfort: "Heaviness after meals" },
      koshtha: { frequency: "Once every 2 days", regularity: "Irregular", consistency: "Hard", recentChanges: "Increased constipation" },
      nidra: { bedtime: "11 PM", wakeTime: "7 AM", duration: "7 hours", quality: "Poor", difficulties: "Frequent awakenings, joint pain at night" },
      sattva: { stressLevel: "High", relaxationDifficulty: "Yes", mentalState: "Often anxious about health" },
      assessmentStatus: "completed",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    });

    // Patient C — Mixed modern + AYUSH
    const pcId = "PT-AYUSH-003";
    const pcAssessmentId = `AYUSH-DEMO-003`;
    ayushAssessments.set(pcAssessmentId, {
      assessmentId: pcAssessmentId,
      patientId: pcId,
      patientName: "Ananya Sharma",
      sessionId: "CHAT-DEMO-003",
      chiefComplaint: "Fatigue and frequent colds",
      duration: "1-3 months",
      previousAyushTreatment: "No, first-time consultation",
      prakriti: { constitution: "Kapha", bodyFrame: "Larger build", appetite: "Moderate", sleep: "Deep, long" },
      vikriti: { currentDigestion: "Sluggish", recentChanges: "Winter season", sleepChange: "Oversleeping" },
      ahara: { mealPattern: "Regular", foodPreference: "Vegetarian", preferredTastes: ["Sweet", "Salty"], waterIntake: "4-6 glasses" },
      vihara: { sleepSchedule: "10:30 PM - 7:30 AM", physicalActivity: "Sedentary (mostly sitting)", sittingHours: "8+ hours", screenTime: "8+ hours" },
      agni: { appetite: "Moderate", hungerTiming: "Regular", digestion: "Slow", postMealDiscomfort: "Lethargy after meals" },
      koshtha: { frequency: "Once daily", regularity: "Regular", consistency: "Medium-soft", recentChanges: "None" },
      nidra: { bedtime: "10:30 PM", wakeTime: "7:30 AM", duration: "9 hours", quality: "Good but excessive", difficulties: "Difficulty waking up" },
      sattva: { stressLevel: "Low", relaxationDifficulty: "No", mentalState: "Calm but lethargic" },
      assessmentStatus: "completed",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 14400000).toISOString(),
    });

    // Timeline entries
    const timelineEntries = [
      { patientId: paId, date: "2024-06-15", type: "ayush" as const, category: "consultation", title: "AYUSH Consultation", description: "Initial digestive complaint assessment" },
      { patientId: pbId, date: "2023-11-10", type: "modern_medicine" as const, category: "lab_report", title: "Lab Report — Blood Panel", description: "CBC, ESR, CRP completed" },
      { patientId: pbId, date: "2024-02-20", type: "ayush" as const, category: "treatment", title: "AYUSH Treatment Record", description: "Panchakarma therapy — Basti course" },
      { patientId: pbId, date: "2024-08-05", type: "ayush" as const, category: "consultation", title: "AYUSH Follow-up", description: "Joint pain follow-up — improved" },
      { patientId: pbId, date: "2025-01-15", type: "modern_medicine" as const, category: "prescription", title: "Modern Medicine Prescription", description: "Analgesic prescribed for flare" },
      { patientId: pbId, date: "2025-06-20", type: "ayush" as const, category: "consultation", title: "Current AYUSH Consultation", description: "Ongoing joint pain management" },
      { patientId: pcId, date: "2024-12-01", type: "modern_medicine" as const, category: "prescription", title: "Modern Medicine — Vitamin D", description: "Supplementation for deficiency" },
      { patientId: pcId, date: "2025-06-22", type: "ayush" as const, category: "consultation", title: "First AYUSH Consultation", description: "Fatigue and immunity assessment" },
    ];

    for (const entry of timelineEntries) {
      const id = `TL-DEMO-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      ayushTimeline.set(id, {
        entryId: id,
        ...entry,
      });
    }

    // Persist to PostgreSQL
    try {
      const db = await getDb();
      if (db) {
        const { ayushAssessmentsTable, ayushTimelineTable } = await import("@workspace/db");
        // Upsert all 3 assessments
        const assessmentData = [
          ayushAssessments.get(paAssessmentId)!,
          ayushAssessments.get(pbAssessmentId)!,
          ayushAssessments.get(pcAssessmentId)!,
        ];
        for (const a of assessmentData) {
          try {
            await db.insert(ayushAssessmentsTable).values({
              assessmentId: a.assessmentId, patientId: a.patientId, patientName: a.patientName,
              sessionId: a.sessionId, chiefComplaint: a.chiefComplaint, duration: a.duration,
              previousAyushTreatment: a.previousAyushTreatment,
              prakriti: a.prakriti, vikriti: a.vikriti, ahara: a.ahara, vihara: a.vihara,
              agni: a.agni, koshtha: a.koshtha, nidra: a.nidra, sattva: a.sattva,
              assessmentStatus: a.assessmentStatus,
              createdAt: new Date(a.createdAt), updatedAt: new Date(a.updatedAt),
            });
          } catch {
            const { eq } = await import("drizzle-orm");
            await db.update(ayushAssessmentsTable).set({
              assessmentStatus: a.assessmentStatus, updatedAt: new Date(),
            }).where(eq(ayushAssessmentsTable.assessmentId, a.assessmentId));
          }
        }
        // Insert timeline entries
        for (const entry of ayushTimeline.values()) {
          try {
            await db.insert(ayushTimelineTable).values({
              entryId: entry.entryId, patientId: entry.patientId, date: entry.date,
              type: entry.type, category: entry.category, title: entry.title,
              description: entry.description,
            });
          } catch { /* ignore duplicates */ }
        }
        logger.info({}, "Demo data persisted to PostgreSQL");
      }
    } catch (pgErr) {
      logger.warn({ err: pgErr }, "PostgreSQL unavailable for seeding");
    }

    res.json({ message: "Demo data seeded", patients: [paId, pbId, pcId], assessments: 3, timelineEntries: timelineEntries.length });
  } catch (err) {
    logger.error({ err }, "Failed to seed demo data");
    res.status(500).json({ error: "Failed to seed demo data" });
  }
});

// ─── Pre-consultation Questions Route ─────────────────────────────────────

router.get("/ayush/pre-consultation/questions", (req, res) => {
  const lang = (req.query.lang as string) || "en";
  const questions = PRE_CONSULTATION_QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question[lang as keyof typeof q.question] || q.question.en,
    options: q.options ? (q.options[lang as keyof typeof q.options] || q.options.en) : undefined,
    type: q.type,
    category: q.category,
  }));
  res.json(questions);
});

export default router;
