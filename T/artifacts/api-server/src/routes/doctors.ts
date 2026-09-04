import { Router } from "express";
import { INDIAN_CITY_NAMES } from "../lib/cities";
import { listDoctors, toPublicDoctor, type PublicDoctor } from "../lib/doctors";
import { Doctor } from "../models/doctor";
import { connectMongoDB, hasMongoDB } from "../lib/mongodb";
import { broadcastDoctorStatus, broadcastDoctorUpdated } from "../lib/discovery";
import { logger } from "../lib/logger";

const router = Router();

// In-memory store for doctor assignments
const doctorAssignments: Record<string, string> = {}; // sessionId -> doctorId

// ── Haversine distance (km) ────────────────────────────────────────────
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ── Search / list doctors ───────────────────────────────────────────────
// GET /api/doctors?city=X&specialty=Y&lat=L&lng=N&radius=R&available=true
// Serves the MongoDB-backed roster (registered + seeded doctors), so a newly
// registered clinician appears here even after a page refresh.
router.get("/doctors", async (req, res) => {
  try {
    const { city, specialty, lat, lng, radius, available, limit } = req.query;

    let doctors: PublicDoctor[] = await listDoctors();

    // Filter by availability
    if (available === "true") {
      doctors = doctors.filter((d) => d.available);
    }

    // Filter by city (fuzzy — matches if doctor city contains query or vice versa)
    if (city && typeof city === "string") {
      const q = city.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          (d.city || "").toLowerCase().includes(q) ||
          (d.region || "").toLowerCase().includes(q) ||
          q.includes((d.city || "").toLowerCase())
      );
    }

    // Filter by specialty
    if (specialty && typeof specialty === "string") {
      const q = specialty.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.specialty.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q)
      );
    }

    // Proximity sort if lat/lng provided
    if (lat && lng) {
      const userLat = parseFloat(String(lat));
      const userLng = parseFloat(String(lng));
      if (!isNaN(userLat) && !isNaN(userLng)) {
        const maxRadius = radius ? parseFloat(String(radius)) : 500; // default 500km
        doctors = doctors
          .map((d) => ({
            ...d,
            distance: haversineDistance(userLat, userLng, d.lat ?? 19.076, d.lng ?? 72.8777),
          }))
          .filter((d) => d.distance <= maxRadius)
          .sort((a, b) => a.distance - b.distance);
      }
    }

    // Limit results
    const maxResults = limit ? parseInt(String(limit), 10) : 50;
    doctors = doctors.slice(0, maxResults);

    res.json({
      doctors,
      total: doctors.length,
      filters: { city: city || null, specialty: specialty || null },
    });
  } catch (err) {
    logger.error({ err }, "Failed to search doctors");
    res.status(500).json({ error: "Failed to search doctors" });
  }
});

// ── Get all unique specialties ─────────────────────────────────────────
router.get("/doctors/specialties", async (_req, res) => {
  try {
    const doctors = await listDoctors();
    const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
    res.json({ specialties });
  } catch (err) {
    logger.error({ err }, "Failed to list specialties");
    res.status(500).json({ error: "Failed to list specialties" });
  }
});

// ── Get all supported cities (all over India) ───────────────────────────
// Returns the full city registry (every Indian city a patient can search or a
// doctor can register in) merged with any extra cities already on the roster.
router.get("/doctors/cities", async (_req, res) => {
  try {
    const doctors = await listDoctors();
    const rosterCities = doctors.map((d) => d.city).filter(Boolean) as string[];
    const cities = [...new Set([...INDIAN_CITY_NAMES, ...rosterCities])].sort();
    res.json({ cities });
  } catch (err) {
    logger.error({ err }, "Failed to list cities");
    res.status(500).json({ error: "Failed to list cities" });
  }
});

// ── Get single doctor by ID ────────────────────────────────────────────
router.get("/doctors/:doctorId", async (req, res) => {
  try {
    const doctors = await listDoctors();
    const doctor = doctors.find((d) => d.doctorId === req.params.doctorId);
    if (!doctor) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }
    res.json(doctor);
  } catch (err) {
    logger.error({ err }, "Failed to fetch doctor");
    res.status(500).json({ error: "Failed to fetch doctor" });
  }
});

// ── Doctor self-management ─────────────────────────────────────────────
// Lets a doctor update their own availability, appointment slots, fee,
// hospital/clinic, address, consultation types, and other profile fields.
// Changes are persisted to MongoDB and pushed live to open find-doctors pages.
const DOCTOR_UPDATABLE_FIELDS = [
  "available",
  "availableSlots",
  "consultationFee",
  "clinic",
  "address",
  "city",
  "region",
  "phone",
  "consultationTypes",
  "languages",
  "experience",
  "bio",
  "specialty",
] as const;

router.patch("/doctors/:doctorId", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.status(503).json({ error: "Profile updates require a database connection" });
      return;
    }
    await connectMongoDB();

    const doctorId = String(req.params.doctorId);
    const doc = await Doctor.findOne({ doctorId });
    if (!doc) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    const previousAvailable = doc.available;
    for (const field of DOCTOR_UPDATABLE_FIELDS) {
      const value = req.body[field];
      if (value === undefined) continue;
      if (field === "specialty") {
        doc.doctorSpecialty = String(value);
      } else if (field === "consultationFee" || field === "experience") {
        (doc as any)[field] = Number(value);
      } else {
        (doc as any)[field] = value;
      }
    }
    await doc.save();

    const updated = toPublicDoctor(doc.toObject() as Record<string, any>);

    if (updated.available !== previousAvailable) {
      broadcastDoctorStatus(doctorId, updated.available);
    }
    broadcastDoctorUpdated(updated);
    logger.info({ doctorId }, "Doctor profile updated");
    res.json(updated);
  } catch (err) {
    logger.error({ err }, "Failed to update doctor profile");
    res.status(500).json({ error: "Failed to update doctor profile" });
  }
});

// ── Assign a doctor to a session ───────────────────────────────────────
router.post("/doctors/assign", async (req, res) => {
  try {
    const { sessionId, doctorId } = req.body;
    if (!sessionId || !doctorId) {
      res.status(400).json({ error: "sessionId and doctorId are required" });
      return;
    }

    const doctors = await listDoctors();
    const doctor = doctors.find((d) => d.doctorId === doctorId);
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

// ── Get doctor assignment for a session ────────────────────────────────
router.get("/doctors/assignment/:sessionId", async (req, res) => {
  try {
    const doctorId = doctorAssignments[String(req.params.sessionId)];
    if (!doctorId) {
      res.status(404).json({ error: "No doctor assigned" });
      return;
    }
    const doctors = await listDoctors();
    const doctor = doctors.find((d) => d.doctorId === doctorId);
    res.json({ doctorId, doctor: doctor || null });
  } catch (err) {
    logger.error({ err }, "Failed to fetch assignment");
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
});

export default router;
