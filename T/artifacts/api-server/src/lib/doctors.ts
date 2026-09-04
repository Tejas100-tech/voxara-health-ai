import { connectMongoDB, demoDoctors } from "./mongodb";
import { Doctor } from "../models/doctor";
import { logger } from "./logger";

// ── Frontend-facing doctor shape ──────────────────────────────────────────
// The Doctor collection stores doctorName/doctorSpecialty while the API and
// UI use name/specialty. This module is the single source of truth so that
// find-a-doctor search, the booking modal, and appointment creation all see
// the SAME roster — including doctors who register while the app is running
// (they are persisted in MongoDB, not just broadcast over WebSocket).
export interface PublicDoctor {
  doctorId: string;
  name: string;
  specialty: string;
  department: string;
  available: boolean;
  email?: string;
  phone?: string;
  city?: string;
  region?: string;
  address?: string;
  lat?: number;
  lng?: number;
  clinic?: string;
  experience?: number;
  consultationFee?: number;
  consultationTypes?: string[];
  rating?: number;
  totalPatients?: number;
  languages?: string[];
  availableSlots?: string[];
  distance?: number;
}

// The static demo roster already uses the public shape.
export function demoDoctorList(): PublicDoctor[] {
  return demoDoctors.map((d) => ({
    ...d,
    consultationTypes: [...d.consultationTypes],
    languages: [...d.languages],
    availableSlots: [...d.availableSlots],
  })) as unknown as PublicDoctor[];
}

// DB docs (doctorName/doctorSpecialty) → public shape.
export function toPublicDoctor(d: Record<string, any>): PublicDoctor {
  const specialty = d.doctorSpecialty ?? d.specialty ?? "General Medicine";
  return {
    doctorId: d.doctorId,
    name: d.doctorName ?? d.name ?? "Doctor",
    specialty,
    department: d.department ?? specialty,
    available: d.available !== false,
    email: d.email,
    phone: d.phone,
    city: d.city,
    region: d.region,
    address: d.address,
    lat: d.lat,
    lng: d.lng,
    clinic: d.clinic ?? "",
    experience: d.experience ?? 5,
    consultationFee: d.consultationFee ?? 500,
    consultationTypes: Array.isArray(d.consultationTypes)
      ? d.consultationTypes
      : ["in-person", "video", "chat"],
    rating: d.rating ?? 4.5,
    totalPatients: d.totalPatients ?? 0,
    languages: Array.isArray(d.languages) ? d.languages : ["English", "Hindi"],
    availableSlots: Array.isArray(d.availableSlots) ? d.availableSlots : [],
  };
}

// ── Seed the curated demo roster into MongoDB (idempotent) ───────────────
// Only inserts doctors that are missing — real registered doctors (Abhinav,
// Tejas, …) are never touched or overwritten.
let seedPromise: Promise<void> | null = null;

async function seedDemoDoctorsIntoDB(): Promise<void> {
  await connectMongoDB();
  const ops = demoDoctors.map((d) => ({
    updateOne: {
      filter: { doctorId: d.doctorId },
      update: {
        $setOnInsert: {
          doctorId: d.doctorId,
          doctorName: d.name,
          doctorSpecialty: d.specialty,
          department: d.department,
          email: d.email,
          phone: d.phone,
          available: d.available,
          city: d.city,
          region: d.region,
          lat: d.lat,
          lng: d.lng,
          clinic: d.clinic,
          experience: d.experience,
          consultationFee: d.consultationFee,
          consultationTypes: [...d.consultationTypes],
          rating: d.rating,
          totalPatients: d.totalPatients,
          languages: [...d.languages],
          availableSlots: [...d.availableSlots],
        },
      },
      upsert: true,
    },
  }));
  const result = await Doctor.bulkWrite(ops as any, { ordered: false });
  logger.info(
    { upserted: result.upsertedCount ?? 0 },
    "Demo doctors seeded into MongoDB"
  );
}

export function seedDemoDoctors(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedDemoDoctorsIntoDB().catch((err) => {
      // Allow a retry on the next call (e.g. Mongo was briefly unreachable).
      seedPromise = null;
      logger.warn({ err }, "Skipped seeding demo doctors into MongoDB");
    });
  }
  return seedPromise;
}

// ── List every bookable/searchable doctor ────────────────────────────────
export async function listDoctors(): Promise<PublicDoctor[]> {
  if (!process.env["MONGODB_URI"]) {
    return demoDoctorList();
  }

  try {
    await connectMongoDB();
    await seedDemoDoctors();
    const docs = await Doctor.find({}).lean();
    if (docs && docs.length > 0) {
      return docs.map((d) => toPublicDoctor(d as Record<string, any>));
    }
    return demoDoctorList();
  } catch (err) {
    logger.warn({ err }, "MongoDB doctor listing unavailable — using demo doctors");
    return demoDoctorList();
  }
}
