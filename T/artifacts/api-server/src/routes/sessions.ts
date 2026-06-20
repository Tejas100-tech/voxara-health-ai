import { Router } from "express";
import multer from "multer";
import { connectMongoDB, demoNotifications, demoSessions, demoUsers, hasMongoDB } from "../lib/mongodb";
import cloudinary from "../lib/cloudinary-client";
import { Session } from "../models/session";
import { Notification } from "../models/notification";
import { logger } from "../lib/logger";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const THRESHOLDS = {
  clarity: { warn: 70, critical: 55 },
  tremor: { warn: 50, critical: 65 },
  breathlessness: { warn: 6.0, critical: 7.5 },
};

async function generateNotifications(session: InstanceType<typeof Session>) {
  const notes = [];

  if (session.clarity <= THRESHOLDS.clarity.critical) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Critical" as const,
      title: "Critically Low Voice Clarity",
      body: `Patient voice clarity dropped to ${session.clarity}% — well below the critical threshold of ${THRESHOLDS.clarity.critical}%. Immediate review recommended.`,
      metric: "clarity",
      value: session.clarity,
      threshold: THRESHOLDS.clarity.critical,
    });
  } else if (session.clarity <= THRESHOLDS.clarity.warn) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Watch" as const,
      title: "Low Voice Clarity Detected",
      body: `Patient voice clarity at ${session.clarity}% — below warning threshold of ${THRESHOLDS.clarity.warn}%. Monitor closely for further decline.`,
      metric: "clarity",
      value: session.clarity,
      threshold: THRESHOLDS.clarity.warn,
    });
  }

  if (session.tremor >= THRESHOLDS.tremor.critical) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Critical" as const,
      title: "Critical Tremor Level Detected",
      body: `Vocal tremor index at ${session.tremor}% exceeds critical threshold of ${THRESHOLDS.tremor.critical}%. This may indicate neurological deterioration.`,
      metric: "tremor",
      value: session.tremor,
      threshold: THRESHOLDS.tremor.critical,
    });
  } else if (session.tremor >= THRESHOLDS.tremor.warn) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Watch" as const,
      title: "Elevated Tremor Index",
      body: `Vocal tremor at ${session.tremor}% exceeds the ${THRESHOLDS.tremor.warn}% warning threshold. Consider scheduling a review.`,
      metric: "tremor",
      value: session.tremor,
      threshold: THRESHOLDS.tremor.warn,
    });
  }

  if (session.breathlessness >= THRESHOLDS.breathlessness.critical) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Critical" as const,
      title: "Severe Breathlessness Marker",
      body: `Breathlessness index at ${session.breathlessness}/10 exceeds critical level of ${THRESHOLDS.breathlessness.critical}. Respiratory compromise possible.`,
      metric: "breathlessness",
      value: session.breathlessness,
      threshold: THRESHOLDS.breathlessness.critical,
    });
  } else if (session.breathlessness >= THRESHOLDS.breathlessness.warn) {
    notes.push({
      sessionId: session.sessionId,
      kind: "Watch" as const,
      title: "Elevated Breathlessness Detected",
      body: `Breathlessness index at ${session.breathlessness}/10 has crossed the ${THRESHOLDS.breathlessness.warn} warning threshold.`,
      metric: "breathlessness",
      value: session.breathlessness,
      threshold: THRESHOLDS.breathlessness.warn,
    });
  }

  if (session.risk === "Elevated") {
    notes.push({
      sessionId: session.sessionId,
      kind: "Critical" as const,
      title: "Elevated Overall Risk Score",
      body: `Combined biomarker risk for session ${session.sessionId} is Elevated. Clarity: ${session.clarity}%, Tremor: ${session.tremor}%, Breathlessness: ${session.breathlessness}/10.`,
      metric: "risk",
      value: session.risk,
      threshold: "Moderate",
    });
  } else if (session.risk === "Moderate") {
    notes.push({
      sessionId: session.sessionId,
      kind: "Insight" as const,
      title: "Moderate Risk Session Logged",
      body: `Session ${session.sessionId} flagged as Moderate risk. Biomarkers are within watchable range but trending upward.`,
      metric: "risk",
      value: session.risk,
      threshold: "Low",
    });
  }

  if (notes.length > 0) {
    const enriched = notes.map(n => ({ ...n, patientId: session.patientId }));
    await Notification.insertMany(enriched);
    logger.info({ count: notes.length, sessionId: session.sessionId }, "Notifications generated");
  }

  return notes.length;
}

function saveDemoSession(data: any) {
  const session = {
    ...data,
    _id: data.id,
    sessionId: data.id,
    patientId: data.patientId || "PT-001",
    createdAt: new Date().toISOString(),
  };
  const index = demoSessions.findIndex((item) => item.sessionId === session.sessionId);
  if (index >= 0) demoSessions[index] = session;
  else demoSessions.unshift(session);
  const patient = demoUsers.find((user) => user.patientId === session.patientId);
  if (session.risk !== "Low") {
    demoNotifications.unshift({
      _id: `note-${Date.now()}`,
      sessionId: session.sessionId,
      patientId: session.patientId,
      patientName: patient?.name || "Patient",
      kind: session.risk === "Elevated" ? "Critical" : "Insight",
      title: `${session.risk} ML Risk Session`,
      body: `The local ML model scored ${session.ml?.riskScore ?? "this"} risk from clarity, tremor, breathlessness, and pause-density features.`,
      metric: "mlRisk",
      value: session.ml?.riskScore ?? session.risk,
      threshold: session.risk === "Elevated" ? 70 : 42,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    });
  }
  return { session, notificationsGenerated: session.risk === "Low" ? 0 : 1 };
}

router.post("/sessions", async (req, res) => {
  try {
    const data = req.body;

    if (!hasMongoDB()) {
      const result = saveDemoSession(data);
      res.json({ success: true, sessionId: result.session.sessionId, notificationsGenerated: result.notificationsGenerated, storage: "demo" });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, saving session to demo memory");
      const result = saveDemoSession(data);
      res.json({ success: true, sessionId: result.session.sessionId, notificationsGenerated: result.notificationsGenerated, storage: "demo", warning: "MongoDB unavailable; using demo storage" });
      return;
    }

    const session = await Session.findOneAndUpdate(
      { sessionId: data.id },
      {
        sessionId: data.id,
        patientId: data.patientId || "PT-001",
        capturedAt: data.capturedAt,
        duration: data.duration,
        clarity: data.clarity,
        tremor: data.tremor,
        breathlessness: data.breathlessness,
        pitchConsistency: data.pitchConsistency,
        speechRate: data.speechRate,
        confidence: data.confidence,
        noiseFloor: data.noiseFloor,
        risk: data.risk,
        transcript: data.transcript,
        waveform: data.waveform,
      },
      { upsert: true, new: true }
    );

    const notifCount = await generateNotifications(session);

    res.json({ success: true, sessionId: session.sessionId, notificationsGenerated: notifCount });
  } catch (err) {
    logger.error({ err }, "Failed to save session");
    res.status(500).json({ error: "Failed to save session" });
  }
});

router.post("/sessions/:id/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json({ success: true, audioUrl: "", publicId: "" });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, skipping audio persistence");
      res.json({ success: true, audioUrl: "", publicId: "", storage: "demo", warning: "MongoDB unavailable; audio upload skipped" });
      return;
    }
    const sessionId = req.params.id;

    if (!req.file) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "video",
      folder: "voxara/sessions",
      public_id: `session_${sessionId}_${Date.now()}`,
      tags: ["voice", "biomarker", sessionId],
    });

    await Session.findOneAndUpdate(
      { sessionId },
      { audioUrl: result.secure_url, audioPublicId: result.public_id }
    );

    logger.info({ sessionId, url: result.secure_url }, "Audio uploaded to Cloudinary");
    res.json({ success: true, audioUrl: result.secure_url, publicId: result.public_id });
  } catch (err) {
    logger.error({ err }, "Failed to upload audio");
    res.status(500).json({ error: "Failed to upload audio" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json(demoSessions.slice(0, 20));
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo sessions");
      res.json(demoSessions.slice(0, 20));
      return;
    }
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(20);
    res.json(sessions);
  } catch (err) {
    logger.error({ err }, "Failed to fetch sessions");
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;
