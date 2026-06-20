import { Router } from "express";
import { connectMongoDB } from "../lib/mongodb";
import { User } from "../models/user";
import { Session } from "../models/session";
import { Notification } from "../models/notification";
import { ClinicalNote } from "../models/clinical-note";
import { logger } from "../lib/logger";

const router = Router();

// Get all patients for a clinician
router.get("/clinician/:clinicianId/patients", async (req, res) => {
  try {
    await connectMongoDB();
    const clinician = await User.findOne({ patientId: req.params.clinicianId, role: "clinician" });
    if (!clinician) {
      res.status(404).json({ error: "Clinician not found" });
      return;
    }

    const patients = await User.find({
      role: "patient",
      clinicianName: clinician.name,
    }, { passwordHash: 0 });

    // Fetch latest session and notification counts for each patient
    const enriched = await Promise.all(
      patients.map(async (p) => {
        const latestSession = await Session.findOne({ patientId: p.patientId }).sort({ createdAt: -1 });
        const sessionCount = await Session.countDocuments({ patientId: p.patientId });
        const unreadAlerts = await Notification.countDocuments({ patientId: p.patientId, acknowledged: false });
        const criticalAlerts = await Notification.countDocuments({ patientId: p.patientId, kind: "Critical", acknowledged: false });
        return {
          patientId: p.patientId,
          name: p.name,
          email: p.email,
          age: p.age,
          conditions: p.conditions,
          phone: p.phone,
          latestSession: latestSession ? {
            risk: latestSession.risk,
            clarity: latestSession.clarity,
            tremor: latestSession.tremor,
            breathlessness: latestSession.breathlessness,
            capturedAt: latestSession.capturedAt,
          } : null,
          sessionCount,
          unreadAlerts,
          criticalAlerts,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    logger.error({ err }, "Failed to get clinician patients");
    res.status(500).json({ error: "Failed" });
  }
});

// Get clinician stats overview
router.get("/clinician/:clinicianId/stats", async (req, res) => {
  try {
    await connectMongoDB();
    const clinician = await User.findOne({ patientId: req.params.clinicianId, role: "clinician" });
    if (!clinician) {
      res.status(404).json({ error: "Clinician not found" });
      return;
    }

    const patients = await User.find({ role: "patient", clinicianName: clinician.name });
    const patientIds = patients.map((p) => p.patientId);

    const [totalSessions, totalAlerts, criticalAlerts, recentNotes] = await Promise.all([
      Session.countDocuments({ patientId: { $in: patientIds } }),
      Notification.countDocuments({ patientId: { $in: patientIds }, acknowledged: false }),
      Notification.countDocuments({ patientId: { $in: patientIds }, kind: "Critical", acknowledged: false }),
      ClinicalNote.find({ clinicianId: req.params.clinicianId }).sort({ createdAt: -1 }).limit(5),
    ]);

    const elevatedPatients = await Session.distinct("patientId", {
      patientId: { $in: patientIds },
      risk: "Elevated",
    });

    res.json({
      totalPatients: patients.length,
      totalSessions,
      totalAlerts,
      criticalAlerts,
      elevatedPatients: elevatedPatients.length,
      recentNotes,
    });
  } catch (err) {
    logger.error({ err }, "Failed to get clinician stats");
    res.status(500).json({ error: "Failed" });
  }
});

// Get full patient profile for clinician
router.get("/clinician/patient/:patientId/profile", async (req, res) => {
  try {
    await connectMongoDB();
    const patient = await User.findOne({ patientId: req.params.patientId }, { passwordHash: 0 });
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    const [sessions, alerts, notes] = await Promise.all([
      Session.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }).limit(30),
      Notification.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }).limit(20),
      ClinicalNote.find({ patientId: req.params.patientId }).sort({ createdAt: -1 }).limit(20),
    ]);

    const avgClarity = sessions.length ? Math.round(sessions.reduce((s, x) => s + x.clarity, 0) / sessions.length) : 0;
    const avgTremor = sessions.length ? Math.round(sessions.reduce((s, x) => s + x.tremor, 0) / sessions.length) : 0;
    const avgBreath = sessions.length ? Number((sessions.reduce((s, x) => s + x.breathlessness, 0) / sessions.length).toFixed(1)) : 0;
    const riskTrend = sessions.slice(0, 5).map((s) => ({ risk: s.risk, capturedAt: s.capturedAt }));
    const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

    res.json({
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        dob: patient.dob,
        phone: patient.phone,
        conditions: patient.conditions,
        clinicianName: patient.clinicianName,
      },
      sessions,
      alerts,
      notes,
      stats: {
        totalSessions: sessions.length,
        avgClarity,
        avgTremor,
        avgBreath,
        riskTrend,
        unreadAlerts,
        lastSession: sessions[0] || null,
      },
    });
  } catch (err) {
    logger.error({ err }, "Failed to get patient profile" );
    res.status(500).json({ error: "Failed" });
  }
});

// Add clinical note
router.post("/patients/:patientId/notes", async (req, res) => {
  try {
    await connectMongoDB();
    const { clinicianId, clinicianName, content, sessionId, noteType, priority } = req.body;
    const patient = await User.findOne({ patientId: req.params.patientId });
    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    const note = await ClinicalNote.create({
      patientId: req.params.patientId,
      patientName: patient.name,
      clinicianId: clinicianId || "CL-001",
      clinicianName: clinicianName || "Dr. Priya Mehta",
      content,
      sessionId,
      noteType: noteType || "observation",
      priority: priority || "routine",
    });

    res.json({ success: true, note });
  } catch (err) {
    logger.error({ err }, "Failed to create note");
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Get notes for a patient
router.get("/patients/:patientId/notes", async (req, res) => {
  try {
    await connectMongoDB();
    const notes = await ClinicalNote.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    logger.error({ err }, "Failed to get notes");
    res.status(500).json({ error: "Failed" });
  }
});

// Acknowledge alert
router.patch("/clinician/alerts/:id/acknowledge", async (req, res) => {
  try {
    await connectMongoDB();
    await Notification.findByIdAndUpdate(req.params.id, { acknowledged: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
