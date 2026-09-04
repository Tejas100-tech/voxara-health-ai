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
    city: "Mumbai",
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
    city: "Delhi",
  },
  {
    id: "demo-ankit",
    email: "ankit@medikiosk.ai",
    password: "patient123",
    name: "Ankit Verma",
    role: "patient",
    patientId: "PT-003",
    abhaId: "56-7890-1234-5678",
    age: 28,
    dob: "1997-11-03",
    phone: "+91 76543 21098",
    department: "General Medicine",
    city: "Bangalore",
  },
  {
    id: "demo-priya",
    email: "priya@medikiosk.ai",
    password: "patient123",
    name: "Priya Nair",
    role: "patient",
    patientId: "PT-004",
    age: 34,
    dob: "1992-04-18",
    phone: "+91 65432 10987",
    department: "Dermatology",
    city: "Chennai",
  },
  {
    id: "demo-doctor",
    email: "doctor@medikiosk.ai",
    password: "doctor123",
    name: "Dr. Priya Sharma",
    role: "clinician",
    patientId: "CL-001",
    department: "General Medicine",
    city: "Mumbai",
  },
  {
    id: "demo-doctor2",
    email: "dr.rajesh@medikiosk.ai",
    password: "doctor123",
    name: "Dr. Rajesh Gupta",
    role: "clinician",
    patientId: "CL-002",
    department: "Cardiology",
    city: "Delhi",
  },
] as const;

export const demoDoctors = [
  {
    doctorId: "DR-001", name: "Dr. Priya Sharma", specialty: "General Medicine", department: "General Medicine",
    email: "doctor@medikiosk.ai", phone: "+91 99999 11111", available: true,
    city: "Mumbai", region: "Maharashtra", lat: 19.076, lng: 72.8777,
    clinic: "Lilavati Hospital, Bandra", experience: 14, consultationFee: 800,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.8, totalPatients: 2340, languages: ["English", "Hindi", "Marathi"],
    availableSlots: ["09:00-10:00", "11:00-12:00", "15:00-16:00", "18:00-19:00"],
  },
  {
    doctorId: "DR-002", name: "Dr. Rajesh Gupta", specialty: "Cardiology", department: "Cardiology",
    email: "dr.rajesh@medikiosk.ai", phone: "+91 99999 22222", available: true,
    city: "Delhi", region: "Delhi", lat: 28.6139, lng: 77.209,
    clinic: "Apollo Hospital, Sarita Vihar", experience: 20, consultationFee: 1200,
    consultationTypes: ["in-person", "video"],
    rating: 4.9, totalPatients: 3100, languages: ["English", "Hindi", "Punjabi"],
    availableSlots: ["10:00-11:00", "14:00-15:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-003", name: "Dr. Ananya Reddy", specialty: "Neurology", department: "Neurology",
    email: "ananya@medikiosk.ai", phone: "+91 99999 33333", available: true,
    city: "Hyderabad", region: "Telangana", lat: 17.385, lng: 78.4867,
    clinic: "KIMS Hospital, Secunderabad", experience: 12, consultationFee: 1000,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.7, totalPatients: 1890, languages: ["English", "Hindi", "Telugu"],
    availableSlots: ["09:30-10:30", "13:00-14:00", "16:00-17:00"],
  },
  {
    doctorId: "DR-004", name: "Dr. Suresh Patel", specialty: "Orthopedics", department: "Orthopedics",
    email: "suresh@medikiosk.ai", phone: "+91 99999 44444", available: true,
    city: "Ahmedabad", region: "Gujarat", lat: 23.0225, lng: 72.5714,
    clinic: "Sterling Hospital, Navrangpura", experience: 18, consultationFee: 900,
    consultationTypes: ["in-person", "video"],
    rating: 4.6, totalPatients: 2100, languages: ["English", "Hindi", "Gujarati"],
    availableSlots: ["08:00-09:00", "11:00-12:00", "16:00-17:00"],
  },
  {
    doctorId: "DR-005", name: "Dr. Meena Iyer", specialty: "AYUSH / Ayurveda", department: "AYUSH",
    email: "meena@medikiosk.ai", phone: "+91 99999 55555", available: true,
    city: "Chennai", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707,
    clinic: "Arya Vaidya Sala, T. Nagar", experience: 15, consultationFee: 600,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.8, totalPatients: 1560, languages: ["English", "Tamil", "Malayalam"],
    availableSlots: ["09:00-10:00", "11:00-12:00", "15:00-16:00"],
  },
  {
    doctorId: "DR-006", name: "Dr. Arjun Singh", specialty: "Pediatrics", department: "Pediatrics",
    email: "arjun@medikiosk.ai", phone: "+91 99999 66666", available: true,
    city: "Jaipur", region: "Rajasthan", lat: 26.9124, lng: 75.7873,
    clinic: "Fortis Escorts Hospital, Malviya Nagar", experience: 10, consultationFee: 700,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.5, totalPatients: 1340, languages: ["English", "Hindi", "Rajasthani"],
    availableSlots: ["10:00-11:00", "13:00-14:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-007", name: "Dr. Kavita Deshmukh", specialty: "Dermatology", department: "Dermatology",
    email: "kavita@medikiosk.ai", phone: "+91 99999 77777", available: true,
    city: "Pune", region: "Maharashtra", lat: 18.5204, lng: 73.8567,
    clinic: "Deccan Clinic, Shivajinagar", experience: 8, consultationFee: 800,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.7, totalPatients: 1780, languages: ["English", "Hindi", "Marathi"],
    availableSlots: ["09:00-10:00", "12:00-13:00", "16:00-17:00"],
  },
  {
    doctorId: "DR-008", name: "Dr. Amit Chatterjee", specialty: "Psychiatry", department: "Psychiatry",
    email: "amit@medikiosk.ai", phone: "+91 99999 88888", available: true,
    city: "Kolkata", region: "West Bengal", lat: 22.5726, lng: 88.3639,
    clinic: "CMRI Hospital, Park Street", experience: 16, consultationFee: 1100,
    consultationTypes: ["in-person", "video"],
    rating: 4.8, totalPatients: 2200, languages: ["English", "Hindi", "Bengali"],
    availableSlots: ["10:00-11:00", "15:00-16:00", "18:00-19:00"],
  },
  {
    doctorId: "DR-009", name: "Dr. Nandini Rao", specialty: "Gynecology", department: "Gynecology",
    email: "nandini@medikiosk.ai", phone: "+91 99999 99999", available: true,
    city: "Bangalore", region: "Karnataka", lat: 12.9716, lng: 77.5946,
    clinic: "Manipal Hospital, Whitefield", experience: 13, consultationFee: 900,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.9, totalPatients: 2800, languages: ["English", "Kannada", "Hindi", "Tamil"],
    availableSlots: ["09:00-10:00", "11:00-12:00", "14:00-15:00"],
  },
  {
    doctorId: "DR-010", name: "Dr. Vikram Joshi", specialty: "ENT", department: "ENT",
    email: "vikram@medikiosk.ai", phone: "+91 88888 11111", available: true,
    city: "Lucknow", region: "Uttar Pradesh", lat: 26.8467, lng: 80.9462,
    clinic: "Medanta Hospital, Gomti Nagar", experience: 11, consultationFee: 700,
    consultationTypes: ["in-person", "video"],
    rating: 4.5, totalPatients: 1450, languages: ["English", "Hindi", "Urdu"],
    availableSlots: ["10:00-11:00", "14:00-15:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-011", name: "Dr. Simran Kaur", specialty: "Ophthalmology", department: "Ophthalmology",
    email: "simran@medikiosk.ai", phone: "+91 88888 22222", available: true,
    city: "Chandigarh", region: "Chandigarh", lat: 30.7333, lng: 76.7794,
    clinic: "Max Hospital, Sector 32", experience: 9, consultationFee: 600,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.6, totalPatients: 1120, languages: ["English", "Hindi", "Punjabi"],
    availableSlots: ["09:00-10:00", "12:00-13:00", "16:00-17:00"],
  },
  {
    doctorId: "DR-012", name: "Dr. Ramesh Babu", specialty: "Pulmonology", department: "Pulmonology",
    email: "ramesh@medikiosk.ai", phone: "+91 88888 33333", available: true,
    city: "Chennai", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707,
    clinic: "Apollo Specialty Hospital, Nungambakkam", experience: 17, consultationFee: 1000,
    consultationTypes: ["in-person", "video"],
    rating: 4.7, totalPatients: 2050, languages: ["English", "Tamil", "Hindi"],
    availableSlots: ["08:30-09:30", "11:00-12:00", "15:00-16:00"],
  },
  {
    doctorId: "DR-013", name: "Dr. Fatima Khan", specialty: "Endocrinology", department: "Endocrinology",
    email: "fatima@medikiosk.ai", phone: "+91 77777 11111", available: true,
    city: "Mumbai", region: "Maharashtra", lat: 19.076, lng: 72.8777,
    clinic: "Breach Candy Hospital, Cumbala Hill", experience: 12, consultationFee: 1100,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.8, totalPatients: 1670, languages: ["English", "Hindi", "Marathi", "Urdu"],
    availableSlots: ["10:00-11:00", "13:00-14:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-014", name: "Dr. Manoj Tiwari", specialty: "Gastroenterology", department: "Gastroenterology",
    email: "manoj@medikiosk.ai", phone: "+91 77777 22222", available: true,
    city: "Delhi", region: "Delhi", lat: 28.6139, lng: 77.209,
    clinic: "Sir Ganga Ram Hospital, Rajinder Nagar", experience: 19, consultationFee: 1200,
    consultationTypes: ["in-person", "video"],
    rating: 4.9, totalPatients: 3200, languages: ["English", "Hindi"],
    availableSlots: ["09:00-10:00", "14:00-15:00", "18:00-19:00"],
  },
  {
    doctorId: "DR-015", name: "Dr. Lakshmi Menon", specialty: "Nephrology", department: "Nephrology",
    email: "lakshmi@medikiosk.ai", phone: "+91 77777 33333", available: true,
    city: "Kochi", region: "Kerala", lat: 9.9312, lng: 76.2673,
    clinic: "Amrita Hospital, Edappally", experience: 14, consultationFee: 900,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.7, totalPatients: 1890, languages: ["English", "Malayalam", "Hindi", "Tamil"],
    availableSlots: ["09:00-10:00", "11:30-12:30", "15:00-16:00"],
  },
  {
    doctorId: "DR-016", name: "Dr. Sanjay Kulkarni", specialty: "Urology", department: "Urology",
    email: "sanjay@medikiosk.ai", phone: "+91 66666 11111", available: true,
    city: "Pune", region: "Maharashtra", lat: 18.5204, lng: 73.8567,
    clinic: "Ruby Hall Clinic, Sangamvadi", experience: 15, consultationFee: 1000,
    consultationTypes: ["in-person", "video"],
    rating: 4.6, totalPatients: 2340, languages: ["English", "Hindi", "Marathi"],
    availableSlots: ["10:00-11:00", "14:00-15:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-017", name: "Dr. Pooja Agarwal", specialty: "Oncology", department: "Oncology",
    email: "pooja@medikiosk.ai", phone: "+91 66666 22222", available: true,
    city: "Jaipur", region: "Rajasthan", lat: 26.9124, lng: 75.7873,
    clinic: "Narayana Multispecialty Hospital, Rabsa", experience: 11, consultationFee: 1500,
    consultationTypes: ["in-person", "video"],
    rating: 4.8, totalPatients: 1430, languages: ["English", "Hindi", "Rajasthani"],
    availableSlots: ["09:00-10:00", "13:00-14:00"],
  },
  {
    doctorId: "DR-018", name: "Dr. Arvind Patel", specialty: "Cardiology", department: "Cardiology",
    email: "arvind@medikiosk.ai", phone: "+91 55555 11111", available: true,
    city: "Ahmedabad", region: "Gujarat", lat: 23.0225, lng: 72.5714,
    clinic: "CIMS Hospital, Sola", experience: 22, consultationFee: 1300,
    consultationTypes: ["in-person", "video"],
    rating: 4.9, totalPatients: 3500, languages: ["English", "Hindi", "Gujarati"],
    availableSlots: ["10:00-11:00", "15:00-16:00", "18:00-19:00"],
  },
  {
    doctorId: "DR-019", name: "Dr. Sangeeta Banerjee", specialty: "Psychiatry", department: "Psychiatry",
    email: "sangeeta@medikiosk.ai", phone: "+91 55555 22222", available: true,
    city: "Kolkata", region: "West Bengal", lat: 22.5726, lng: 88.3639,
    clinic: "Narayana Health, Salt Lake", experience: 10, consultationFee: 800,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.6, totalPatients: 1250, languages: ["English", "Bengali", "Hindi"],
    availableSlots: ["09:00-10:00", "12:00-13:00", "16:00-17:00"],
  },
  {
    doctorId: "DR-020", name: "Dr. Krishna Prasad", specialty: "General Medicine", department: "General Medicine",
    email: "krishna@medikiosk.ai", phone: "+91 55555 33333", available: true,
    city: "Bangalore", region: "Karnataka", lat: 12.9716, lng: 77.5946,
    clinic: "St. John's Medical College, Koramangala", experience: 16, consultationFee: 700,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.7, totalPatients: 2600, languages: ["English", "Kannada", "Hindi", "Telugu"],
    availableSlots: ["08:00-09:00", "11:00-12:00", "15:00-16:00", "18:00-19:00"],
  },
  {
    doctorId: "DR-021", name: "Dr. Aisha Begum", specialty: "Pediatrics", department: "Pediatrics",
    email: "aisha@medikiosk.ai", phone: "+91 44444 11111", available: true,
    city: "Hyderabad", region: "Telangana", lat: 17.385, lng: 78.4867,
    clinic: "Rainbow Children's Hospital, Banjara Hills", experience: 8, consultationFee: 800,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.8, totalPatients: 1680, languages: ["English", "Telugu", "Hindi", "Urdu"],
    availableSlots: ["09:00-10:00", "11:00-12:00", "15:00-16:00"],
  },
  {
    doctorId: "DR-022", name: "Dr. Deepak Verma", specialty: "General Medicine", department: "General Medicine",
    email: "deepak@medikiosk.ai", phone: "+91 44444 22222", available: true,
    city: "Lucknow", region: "Uttar Pradesh", lat: 26.8467, lng: 80.9462,
    clinic: "Medanta Hospital, Gomti Nagar", experience: 20, consultationFee: 600,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.6, totalPatients: 2890, languages: ["English", "Hindi", "Urdu"],
    availableSlots: ["09:00-10:00", "11:00-12:00", "14:00-15:00", "17:00-18:00"],
  },
  {
    doctorId: "DR-023", name: "Dr. Meera Joshi", specialty: "Dermatology", department: "Dermatology",
    email: "meera@medikiosk.ai", phone: "+91 44444 33333", available: true,
    city: "Chandigarh", region: "Chandigarh", lat: 30.7333, lng: 76.7794,
    clinic: "PGI Hospital, Sector 12", experience: 7, consultationFee: 500,
    consultationTypes: ["in-person", "video", "chat"],
    rating: 4.5, totalPatients: 980, languages: ["English", "Hindi", "Punjabi"],
    availableSlots: ["10:00-11:00", "14:00-15:00"],
  },
] as const;

export const demoSessions: any[] = [];
export const demoNotifications: any[] = [];

// ── Indian cities database ───────────────────────────────────────────────
export const INDIAN_CITIES = [
  { name: "Mumbai", region: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Delhi", region: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Bangalore", region: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", region: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Chennai", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", region: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", region: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", region: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", region: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", region: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", region: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Kochi", region: "Kerala", lat: 9.9312, lng: 76.2673 },
] as const;

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
