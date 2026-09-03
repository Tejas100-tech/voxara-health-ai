import { Router } from "express";
import { demoDoctors } from "../lib/mongodb";
import { logger } from "../lib/logger";

const router = Router();

// In-memory store for doctor assignments
const doctorAssignments: Record<string, string> = {}; // sessionId -> doctorId

// ── List available doctors ─────────────────────────────────────────────────
router.get("/doctors", (_req, res) => {
  try {
    // In a real system, this would query the Doctor model
    // For demo, use demo doctors list
    const doctors = demoDoctors.map((d) => ({
      doctorId: d.doctorId,
      name: d.name,
      specialty: d.specialty,
      department: d.department,
      available: d.available,
    }));
    res.json(doctors);
  } catch (err) {
    logger.error({ err }, "Failed to list doctors");
    res.status(500).json({ error: "Failed to list doctors" });
  }
});

// ── Assign a doctor to a session ───────────────────────────────────────────
router.post("/doctors/assign", (req, res) => {
  try {
    const { sessionId, doctorId } = req.body;
    if (!sessionId || !doctorId) {
      res.status(400).json({ error: "sessionId and doctorId are required" });
      return;
    }

    const doctor = demoDoctors.find((d) => d.doctorId === doctorId);
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    doctorAssignments[sessionId] = doctorId;
    res.json({
      assigned: true,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
    });
  } catch (err) {
    logger.error({ err }, "Failed to assign doctor");
    res.status(500).json({ error: "Failed to assign doctor" });
  }
});

// ── Get doctor assignment for a session ────────────────────────────────────
router.get("/doctors/assignment/:sessionId", (req, res) => {
  const doctorId = doctorAssignments[String(req.params.sessionId)];
  if (!doctorId) {
    res.status(404).json({ error: "No doctor assigned" });
    return;
  }
  const doctor = demoDoctors.find((d) => d.doctorId === doctorId);
  res.json({ doctorId, doctor: doctor || null });
});

export default router;
