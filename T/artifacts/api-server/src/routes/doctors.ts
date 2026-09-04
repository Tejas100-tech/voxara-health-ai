import { Router } from "express";
import { demoDoctors } from "../lib/mongodb";
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
router.get("/doctors", (req, res) => {
  try {
    const { city, specialty, lat, lng, radius, available, limit } = req.query;

    let doctors = [...demoDoctors] as any[];

    // Filter by availability
    if (available === "true") {
      doctors = doctors.filter((d) => d.available);
    }

    // Filter by city (fuzzy — matches if doctor city contains query or vice versa)
    if (city && typeof city === "string") {
      const q = city.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.city.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          q.includes(d.city.toLowerCase())
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
            distance: haversineDistance(userLat, userLng, d.lat, d.lng),
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
router.get("/doctors/specialties", (_req, res) => {
  const specialties = [...new Set(demoDoctors.map((d) => d.specialty))].sort();
  res.json({ specialties });
});

// ── Get all unique cities ──────────────────────────────────────────────
router.get("/doctors/cities", (_req, res) => {
  const cities = [...new Set(demoDoctors.map((d) => d.city))].sort();
  res.json({ cities });
});

// ── Get single doctor by ID ────────────────────────────────────────────
router.get("/doctors/:doctorId", (req, res) => {
  const doctor = demoDoctors.find((d) => d.doctorId === req.params.doctorId);
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }
  res.json(doctor);
});

// ── Assign a doctor to a session ───────────────────────────────────────
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

// ── Get doctor assignment for a session ────────────────────────────────
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
