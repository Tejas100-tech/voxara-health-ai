import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

// ── In-memory demo store ──────────────────────────────────────────────────
const appointments: Record<string, any> = {};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  urgency: "emergency" | "urgent" | "routine";
  status: "scheduled" | "active" | "completed" | "cancelled";
  scheduledAt: string;
  duration: number;
  reason: string;
  notes?: string;
  callRoomId: string;
  joinedAt?: string;
  endedAt?: string;
  createdAt: string;
}

// ── Demo doctors ──────────────────────────────────────────────────────────
const demoDoctors = [
  { doctorId: "DR-001", name: "Dr. Priya Sharma", specialty: "General Medicine", department: "General Medicine", available: true },
  { doctorId: "DR-002", name: "Dr. Rajesh Gupta", specialty: "Cardiology", department: "Cardiology", available: true },
  { doctorId: "DR-003", name: "Dr. Ananya Reddy", specialty: "Neurology", department: "Neurology", available: true },
  { doctorId: "DR-004", name: "Dr. Suresh Patel", specialty: "Orthopedics", department: "Orthopedics", available: false },
  { doctorId: "DR-005", name: "Dr. Meena Iyer", specialty: "AYUSH / Ayurveda", department: "AYUSH", available: true },
  { doctorId: "DR-006", name: "Dr. Arjun Singh", specialty: "Pediatrics", department: "Pediatrics", available: true },
];

// ── List doctors ──────────────────────────────────────────────────────────
router.get("/appointments/doctors", (_req, res) => {
  res.json(demoDoctors);
});

// ── List appointments ─────────────────────────────────────────────────────
router.get("/appointments", (req, res) => {
  const { patientId, doctorId, status } = req.query;
  let results = Object.values(appointments) as Appointment[];

  if (typeof patientId === "string") results = results.filter((a) => a.patientId === patientId);
  if (typeof doctorId === "string") results = results.filter((a) => a.doctorId === doctorId);
  if (typeof status === "string") results = results.filter((a) => a.status === status);

  results.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  res.json(results.slice(0, 50));
});

// ── Create appointment ────────────────────────────────────────────────────
router.post("/appointments", (req, res) => {
  try {
    const { patientId, patientName, doctorId, urgency, reason, scheduledAt } = req.body;

    if (!patientId || !patientName || !doctorId || !reason) {
      res.status(400).json({ error: "patientId, patientName, doctorId, and reason are required" });
      return;
    }

    const doctor = demoDoctors.find((d) => d.doctorId === doctorId);
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    const id = `APT-${Date.now().toString(36).toUpperCase()}`;
    const callRoomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const scheduledTime = urgency === "emergency"
      ? new Date(Date.now() + 5 * 60 * 1000).toISOString()
      : urgency === "urgent"
      ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      : scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const appointment: Appointment = {
      id,
      patientId,
      patientName,
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      urgency: urgency || "routine",
      status: urgency === "emergency" ? "active" : "scheduled",
      scheduledAt: scheduledTime,
      duration: urgency === "emergency" ? 15 : 20,
      reason,
      callRoomId,
      createdAt: new Date().toISOString(),
    };

    appointments[id] = appointment;
    logger.info({ id, patientName, doctorName: doctor.name }, "Appointment created");
    res.json(appointment);
  } catch (err) {
    logger.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// ── Get single appointment ────────────────────────────────────────────────
router.get("/appointments/:id", (req, res) => {
  const apt = appointments[String(req.params.id)];
  if (!apt) { res.status(404).json({ error: "Appointment not found" }); return; }
  res.json(apt);
});

// ── Update appointment status ─────────────────────────────────────────────
router.patch("/appointments/:id/status", (req, res) => {
  const apt = appointments[String(req.params.id)];
  if (!apt) { res.status(404).json({ error: "Appointment not found" }); return; }

  const { status, notes } = req.body;
  if (status) apt.status = status;
  if (notes) apt.notes = notes;
  if (status === "active") apt.joinedAt = new Date().toISOString();
  if (status === "completed") apt.endedAt = new Date().toISOString();

  appointments[apt.id] = apt;
  res.json(apt);
});

// ── Cancel appointment ────────────────────────────────────────────────────
router.delete("/appointments/:id", (req, res) => {
  const apt = appointments[String(req.params.id)];
  if (!apt) { res.status(404).json({ error: "Appointment not found" }); return; }
  apt.status = "cancelled";
  appointments[apt.id] = apt;
  res.json({ ok: true });
});

// ── Get room info for video call ──────────────────────────────────────────
router.get("/appointments/room/:roomId", (req, res) => {
  const apt = Object.values(appointments).find((a: any) => a.callRoomId === req.params.roomId);
  if (!apt) { res.status(404).json({ error: "Room not found" }); return; }
  res.json(apt);
});

export default router;
