import { Router } from "express";
import Appointment from "../models/appointment";
import { Doctor } from "../models/doctor";
import { User } from "../models/user";
import { connectMongoDB } from "../lib/mongodb";

const router = Router();

const DEFAULT_DOCTORS = [
  { doctorId: "DR-001", doctorName: "Dr. Sarah Chen", doctorSpecialty: "Neurology", available: true },
  { doctorId: "DR-002", doctorName: "Dr. Marcus Webb", doctorSpecialty: "Pulmonology", available: true },
  { doctorId: "DR-003", doctorName: "Dr. Priya Mehta", doctorSpecialty: "General Practice", available: true, email: "doctor@voxara.ai" },
  { doctorId: "DR-004", doctorName: "Dr. James Okafor", doctorSpecialty: "Psychiatry", available: false, email: "james@voxara.ai" },
];

async function seedDoctors() {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(DEFAULT_DOCTORS);
  } else {
    // Patch emails onto existing default doctor records that are missing them
    for (const d of DEFAULT_DOCTORS) {
      if (d.email) {
        await Doctor.updateOne({ doctorId: d.doctorId, email: { $exists: false } }, { $set: { email: d.email } });
      }
    }
  }
}

async function getDoctors() {
  try {
    await connectMongoDB();
    await seedDoctors();
    return await Doctor.find().sort({ available: -1, doctorName: 1 });
  } catch {
    return DEFAULT_DOCTORS;
  }
}

router.get("/appointments/doctors", async (_req, res) => {
  res.json(await getDoctors());
});

router.post("/appointments/doctors", async (req, res) => {
  try {
    await connectMongoDB();
    const { doctorName, doctorSpecialty, available, email, phone, bio } = req.body;
    if (!doctorName || !doctorSpecialty) {
      res.status(400).json({ error: "doctorName and doctorSpecialty are required" });
      return;
    }
    const count = await Doctor.countDocuments();
    const doctorId = `DR-${String(count + 1).padStart(3, "0")}`;
    const doctor = await Doctor.create({ doctorId, doctorName, doctorSpecialty, available: available ?? true, email, phone, bio });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: "Failed to register doctor" });
  }
});

router.patch("/appointments/doctors/:doctorId", async (req, res) => {
  try {
    await connectMongoDB();
    const doctor = await Doctor.findOneAndUpdate(
      { doctorId: req.params.doctorId },
      req.body,
      { new: true }
    );
    if (!doctor) { res.status(404).json({ error: "Doctor not found" }); return; }
    res.json(doctor);
  } catch {
    res.status(500).json({ error: "Failed to update doctor" });
  }
});

router.get("/appointments/room/:roomId", async (req, res) => {
  try {
    await connectMongoDB();
    const appt = await Appointment.findOne({ callRoomId: req.params.roomId });
    if (!appt) { res.status(404).json({ error: "Room not found" }); return; }
    res.json(appt);
  } catch {
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    await connectMongoDB();
    const { patientId, doctorId, clinicianPatientId, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (typeof clinicianPatientId === "string" && clinicianPatientId) {
      // Resolve the doctorId server-side from the clinician's patientId
      const clinicianUser = await User.findOne({ patientId: clinicianPatientId, role: "clinician" });
      if (clinicianUser) {
        const doctorRecord = await Doctor.findOne({ email: clinicianUser.email });
        if (doctorRecord) {
          filter.doctorId = doctorRecord.doctorId;
        } else {
          // Fallback: match by name
          const nameRecord = await Doctor.findOne({ doctorName: clinicianUser.name });
          if (nameRecord) filter.doctorId = nameRecord.doctorId;
        }
      }
    } else if (typeof doctorId === "string" && doctorId) {
      filter.doctorId = doctorId;
    } else if (typeof patientId === "string" && patientId) {
      filter.patientId = patientId;
    }

    if (typeof status === "string" && status) filter.status = status;
    const appointments = await Appointment.find(filter).sort({ scheduledAt: -1 }).limit(50);
    res.json(appointments);
  } catch {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

router.post("/appointments", async (req, res) => {
  try {
    await connectMongoDB();
    const { patientId, patientName, doctorId, urgency, reason, riskScore, biomarkerTrigger, scheduledAt } = req.body;

    const doctors = await getDoctors();
    const doctor = doctors.find((d: any) => d.doctorId === doctorId) ?? doctors[0];
    const callRoomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const scheduledTime = urgency === "emergency"
      ? new Date(Date.now() + 5 * 60 * 1000)
      : urgency === "urgent"
      ? new Date(Date.now() + 2 * 60 * 60 * 1000)
      : new Date(scheduledAt || Date.now() + 24 * 60 * 60 * 1000);

    const appointment = await Appointment.create({
      patientId, patientName,
      doctorId: (doctor as any).doctorId,
      doctorName: (doctor as any).doctorName,
      doctorSpecialty: (doctor as any).doctorSpecialty,
      urgency, status: urgency === "emergency" ? "active" : "scheduled",
      scheduledAt: scheduledTime, duration: urgency === "emergency" ? 15 : 20,
      reason, riskScore, biomarkerTrigger, callRoomId,
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

router.patch("/appointments/:id/status", async (req, res) => {
  try {
    await connectMongoDB();
    const { status } = req.body;
    const update: Record<string, unknown> = { status };
    if (status === "active") update.joinedAt = new Date();
    if (status === "completed") update.endedAt = new Date();
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!appointment) { res.status(404).json({ error: "Not found" }); return; }
    res.json(appointment);
  } catch {
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

router.delete("/appointments/:id", async (req, res) => {
  try {
    await connectMongoDB();
    await Appointment.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

export default router;
