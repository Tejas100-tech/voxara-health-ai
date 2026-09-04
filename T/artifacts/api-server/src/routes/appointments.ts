import { Router } from "express";
import { logger } from "../lib/logger";
import { listDoctors } from "../lib/doctors";
import { broadcastAppointment } from "../lib/discovery";
import { connectMongoDB, hasMongoDB } from "../lib/mongodb";
import AppointmentModel from "../models/appointment";

const router = Router();

// ── Storage ───────────────────────────────────────────────────────────────
// Primary store is MongoDB (Appointment model) so bookings survive restarts
// and show up for both patient and clinician. When MongoDB is unavailable we
// fall back to an in-memory map so demo mode keeps working.
const memoryAppointments = new Map<string, Record<string, any>>();

async function mongoAvailable(): Promise<boolean> {
  if (!hasMongoDB()) return false;
  try {
    await connectMongoDB();
    return true;
  } catch {
    return false;
  }
}

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  try {
    return value instanceof Date ? value.toISOString() : new Date(String(value)).toISOString();
  } catch {
    return String(value);
  }
}

// Normalize a stored record (mongoose doc or memory record) to API shape.
function toApiAppointment(doc: Record<string, any>): Record<string, any> {
  return {
    id: doc.id ?? (doc._id ? String(doc._id) : doc._id),
    patientId: doc.patientId,
    patientName: doc.patientName,
    doctorId: doc.doctorId,
    doctorName: doc.doctorName,
    doctorSpecialty: doc.doctorSpecialty,
    urgency: doc.urgency,
    status: doc.status,
    scheduledAt: toIso(doc.scheduledAt),
    duration: doc.duration ?? 20,
    reason: doc.reason,
    notes: doc.notes,
    callRoomId: doc.callRoomId,
    joinedAt: toIso(doc.joinedAt),
    endedAt: toIso(doc.endedAt),
    createdAt: toIso(doc.createdAt),
  };
}

// ── List doctors (unified live roster — searchable AND bookable) ─────────
router.get("/appointments/doctors", async (_req, res) => {
  try {
    res.json(await listDoctors());
  } catch (err) {
    logger.error({ err }, "Failed to list doctors for booking");
    res.status(500).json({ error: "Failed to list doctors" });
  }
});

// ── List appointments ─────────────────────────────────────────────────────
router.get("/appointments", async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;

    let results: Record<string, any>[];
    if (await mongoAvailable()) {
      const q: Record<string, unknown> = {};
      if (typeof patientId === "string") q.patientId = patientId;
      if (typeof doctorId === "string") q.doctorId = doctorId;
      if (typeof status === "string") q.status = status;
      const docs = await AppointmentModel.find(q)
        .sort({ scheduledAt: -1 })
        .limit(50)
        .lean();
      results = docs.map((d) => toApiAppointment(d as Record<string, any>));
    } else {
      results = [...memoryAppointments.values()].map(toApiAppointment);
      if (typeof patientId === "string") results = results.filter((a) => a.patientId === patientId);
      if (typeof doctorId === "string") results = results.filter((a) => a.doctorId === doctorId);
      if (typeof status === "string") results = results.filter((a) => a.status === status);
      results.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
      results = results.slice(0, 50);
    }

    res.json(results);
  } catch (err) {
    logger.error({ err }, "Failed to list appointments");
    res.status(500).json({ error: "Failed to list appointments" });
  }
});

// ── Create appointment ────────────────────────────────────────────────────
router.post("/appointments", async (req, res) => {
  try {
    const { patientId, patientName, doctorId, urgency, reason, scheduledAt } = req.body;

    if (!patientId || !patientName || !doctorId || !reason) {
      res.status(400).json({ error: "patientId, patientName, doctorId, and reason are required" });
      return;
    }

    // Resolve the doctor from the SAME unified roster used by search + the
    // booking modal, so any real (registered) doctor can be booked.
    const doctors = await listDoctors();
    const doctor = doctors.find((d) => d.doctorId === doctorId);
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    if (doctor.available === false) {
      res.status(409).json({ error: "This doctor is not currently accepting appointments" });
      return;
    }

    const id = `APT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const callRoomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const scheduledTime =
      urgency === "emergency"
        ? new Date(Date.now() + 5 * 60 * 1000).toISOString()
        : urgency === "urgent"
          ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
          : scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const record: Record<string, any> = {
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

    let saved: Record<string, any>;
    if (await mongoAvailable()) {
      const doc = await AppointmentModel.create({
        patientId,
        patientName,
        doctorId: doctor.doctorId,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        urgency: urgency || "routine",
        status: urgency === "emergency" ? "active" : "scheduled",
        scheduledAt: new Date(scheduledTime),
        duration: urgency === "emergency" ? 15 : 20,
        reason,
        callRoomId,
        createdAt: new Date(),
      });
      saved = toApiAppointment(doc.toObject() as Record<string, any>);
    } else {
      memoryAppointments.set(id, record);
      saved = record;
    }

    broadcastAppointment("appointment-created", saved);
    logger.info({ id: saved.id, patientName, doctorName: doctor.name }, "Appointment created");
    res.json(saved);
  } catch (err) {
    logger.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// ── Get single appointment ────────────────────────────────────────────────
router.get("/appointments/:id", async (req, res) => {
  try {
    if (await mongoAvailable()) {
      const doc = await AppointmentModel.findById(req.params.id).lean();
      if (!doc) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      res.json(toApiAppointment(doc as Record<string, any>));
      return;
    }
    const apt = memoryAppointments.get(String(req.params.id));
    if (!apt) {
      res.status(404).json({ error: "Appointment not found" });
      return;
    }
    res.json(toApiAppointment(apt));
  } catch (err) {
    logger.error({ err }, "Failed to fetch appointment");
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

// ── Update appointment status ─────────────────────────────────────────────
router.patch("/appointments/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    let updated: Record<string, any> | null = null;

    if (await mongoAvailable()) {
      const doc = await AppointmentModel.findById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      if (status) doc.status = status;
      if (notes) doc.notes = notes;
      if (status === "active") doc.joinedAt = new Date();
      if (status === "completed") doc.endedAt = new Date();
      await doc.save();
      updated = toApiAppointment(doc.toObject() as Record<string, any>);
    } else {
      const apt = memoryAppointments.get(String(req.params.id));
      if (!apt) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      if (status) apt.status = status;
      if (notes) apt.notes = notes;
      if (status === "active") apt.joinedAt = new Date().toISOString();
      if (status === "completed") apt.endedAt = new Date().toISOString();
      updated = toApiAppointment(apt);
    }

    broadcastAppointment("appointment-updated", updated);
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update appointment");
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

// ── Cancel appointment ────────────────────────────────────────────────────
router.delete("/appointments/:id", async (req, res) => {
  try {
    let cancelled: Record<string, any> | null = null;

    if (await mongoAvailable()) {
      const doc = await AppointmentModel.findById(req.params.id);
      if (!doc) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      doc.status = "cancelled";
      await doc.save();
      cancelled = toApiAppointment(doc.toObject() as Record<string, any>);
    } else {
      const apt = memoryAppointments.get(String(req.params.id));
      if (!apt) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      apt.status = "cancelled";
      cancelled = toApiAppointment(apt);
    }

    broadcastAppointment("appointment-cancelled", cancelled);
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Failed to cancel appointment");
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

// ── Get room info for video call ──────────────────────────────────────────
router.get("/appointments/room/:roomId", async (req, res) => {
  try {
    if (await mongoAvailable()) {
      const doc = await AppointmentModel.findOne({ callRoomId: req.params.roomId }).lean();
      if (!doc) {
        res.status(404).json({ error: "Room not found" });
        return;
      }
      res.json(toApiAppointment(doc as Record<string, any>));
      return;
    }
    const apt = [...memoryAppointments.values()].find((a: any) => a.callRoomId === req.params.roomId);
    if (!apt) {
      res.status(404).json({ error: "Room not found" });
      return;
    }
    res.json(toApiAppointment(apt));
  } catch (err) {
    logger.error({ err }, "Failed to fetch room");
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

export default router;
