import mongoose from "mongoose";
import { logger } from "./logger";

let connected = false;
let unavailableReason: string | null = null;

export const hasMongoDB = () => Boolean(process.env["MONGODB_URI"]);
export const isMongoDBReady = () => connected;
export const getMongoDBStatus = () => ({
  configured: hasMongoDB(),
  connected,
  unavailableReason,
});

export const demoUsers = [
  {
    id: "demo-ram",
    email: "ram@medikiosk.ai",
    password: "patient123",
    name: "Ram Kumar",
    role: "patient",
    patientId: "PT-001",
    abhaId: "12-3456-7890-1234",
    age: 56,
    dob: "1970-05-15",
    phone: "+91 98765 43210",
    department: "General Medicine",
  },
  {
    id: "demo-sunita",
    email: "sunita@medikiosk.ai",
    password: "patient123",
    name: "Sunita Devi",
    role: "patient",
    patientId: "PT-002",
    abhaId: "98-7654-3210-9876",
    age: 45,
    dob: "1981-08-22",
    phone: "+91 87654 32109",
    department: "Cardiology",
  },
  {
    id: "demo-doctor",
    email: "doctor@medikiosk.ai",
    password: "doctor123",
    name: "Dr. Priya Sharma",
    role: "clinician",
    patientId: "CL-001",
    department: "General Medicine",
  },
] as const;

export const demoDoctors = [
  { doctorId: "DR-001", name: "Dr. Priya Sharma", specialty: "General Medicine", department: "General Medicine", email: "doctor@medikiosk.ai", phone: "+91 99999 11111", available: true },
  { doctorId: "DR-002", name: "Dr. Rajesh Gupta", specialty: "Cardiology", department: "Cardiology", email: "rajesh@medikiosk.ai", phone: "+91 99999 22222", available: true },
  { doctorId: "DR-003", name: "Dr. Ananya Reddy", specialty: "Neurology", department: "Neurology", email: "ananya@medikiosk.ai", phone: "+91 99999 33333", available: true },
  { doctorId: "DR-004", name: "Dr. Suresh Patel", specialty: "Orthopedics", department: "Orthopedics", email: "suresh@medikiosk.ai", phone: "+91 99999 44444", available: false },
  { doctorId: "DR-005", name: "Dr. Meena Iyer", specialty: "AYUSH / Ayurveda", department: "AYUSH", email: "meena@medikiosk.ai", phone: "+91 99999 55555", available: true },
  { doctorId: "DR-006", name: "Dr. Arjun Singh", specialty: "Pediatrics", department: "Pediatrics", email: "arjun@medikiosk.ai", phone: "+91 99999 66666", available: true },
] as const;

export const demoSessions: any[] = [];
export const demoNotifications: any[] = [];

export async function connectMongoDB() {
  if (connected) return;

  const uri = normalizeMongoURI(process.env["MONGODB_URI"]);
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    connected = true;
    unavailableReason = null;
    logger.info("Connected to MongoDB");
  } catch (err) {
    connected = false;
    unavailableReason = err instanceof Error ? err.message : "MongoDB connection failed";
    throw err;
  }
}

export default mongoose;

function normalizeMongoURI(value: string | undefined) {
  if (!value) return "";
  return value
    .trim()
    .replace(/^MONGODB_URI\s*=\s*/i, "")
    .replace(/^['"]|['"]$/g, "")
    .trim();
}
