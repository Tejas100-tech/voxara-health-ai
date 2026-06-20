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
    id: "demo-alex",
    email: "alex@voxara.ai",
    password: "patient123",
    name: "Alex Carter",
    role: "patient",
    patientId: "PT-001",
    conditions: ["Asthma", "Mild Depression"],
    age: 34,
    dob: "1990-03-12",
    phone: "+1 (555) 291-4820",
    clinicianName: "Dr. Priya Mehta",
  },
  {
    id: "demo-sofia",
    email: "sofia@voxara.ai",
    password: "patient123",
    name: "Sofia Reyes",
    role: "patient",
    patientId: "PT-002",
    conditions: ["Parkinson's (Early Stage)"],
    age: 62,
    dob: "1962-07-28",
    phone: "+1 (555) 838-3710",
    clinicianName: "Dr. James Osei",
  },
  {
    id: "demo-doctor",
    email: "doctor@voxara.ai",
    password: "doctor123",
    name: "Dr. Priya Mehta",
    role: "clinician",
    patientId: "CL-001",
    conditions: [],
  },
  {
    id: "demo-james",
    email: "james@voxara.ai",
    password: "doctor123",
    name: "Dr. James Osei",
    role: "clinician",
    patientId: "CL-002",
    conditions: [],
  },
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
