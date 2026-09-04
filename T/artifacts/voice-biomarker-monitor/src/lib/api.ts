const API_BASE = "/api";

// ---- Intake Session ----
export interface HistoryAnswer {
  question: string;
  answer: string;
  category: string;
  timestamp: string;
}

export interface IntakeSession {
  id: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  language: string;
  mode: "allopathic" | "ayush";
  status: "identity" | "history" | "documents" | "summary" | "complete" | "completed";
  chiefComplaint: string;
  answers: HistoryAnswer[];
  documents: any[];
  createdAt: string;
  updatedAt: string;
}

export async function startIntakeSession(params: {
  patientId: string;
  patientName: string;
  abhaId?: string;
  language?: string;
  mode?: string;
  track?: string;
}): Promise<{ sessionId: string; session: IntakeSession; greeting: string; nextQuestion: any; track?: string; totalQuestions?: number; noise?: { level: string; db: number; recommendation: string } }> {
  const res = await fetch(`${API_BASE}/intake/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to start intake session");
  return res.json();
}

export async function submitAnswer(
  sessionId: string,
  answer: string,
  question?: string,
  category?: string,
  chiefComplaint?: string
): Promise<{ session: IntakeSession; nextQuestion: any; isComplete: boolean; progress?: number; remaining?: number }> {
  const res = await fetch(`${API_BASE}/intake/${sessionId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer, chiefComplaint, question, category }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function getIntakeSession(sessionId: string): Promise<IntakeSession> {
  const res = await fetch(`${API_BASE}/intake/${sessionId}`);
  if (!res.ok) throw new Error("Session not found");
  return res.json();
}

export async function getAllIntakeSessions(): Promise<IntakeSession[]> {
  const res = await fetch(`${API_BASE}/intake`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function updateSessionStatus(
  sessionId: string,
  status: string
): Promise<{ success: boolean; session: any }> {
  const res = await fetch(`${API_BASE}/intake/${sessionId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update session status");
  return res.json();
}

// ---- Voice Transcription ----
export async function transcribeAudio(blob: Blob, language?: string): Promise<{ transcript: string; language?: string; provider?: string; fallback?: boolean; message?: string }> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const res = await fetch(`${API_BASE}/ai/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64: base64, mimeType: blob.type, language }),
  });
  if (!res.ok) return { transcript: "", fallback: true };
  return res.json();
}

// ---- Clinical Summary ----
export interface ClinicalSummary {
  sessionId: string;
  patientName: string;
  patientId: string;
  abhaId?: string;
  mode?: string;
  chiefComplaint: string;
  dashavidhaPariksha?: Record<string, { title: string; finding: string }>;
  aharaVihara?: Record<string, { title: string; finding: string }>;
  namasteIcd11Coding?: { namaste: { code: string; display: string }; icd11Translations: MappingResult[] }[];
  historyOfPresentIllness: string;
  pastMedicalHistory?: string;
  drugAllergyHistory?: string;
  familyHistory?: string;
  personalHistory?: string;
  priorInvestigations: any[];
  priorPrescriptions?: any[];
  dischargeSummaries?: any[];
  abnormalFlags: string[];
  redFlags?: string[];
  aiAssessment: string;
  generatedAt: string;
  status: string;
  physicianNotes: string;
  documents?: { id: string; filename: string; mimetype?: string; type: string; date?: string; facility?: string; abnormalFlags?: string[]; extractedEntities?: any; summary?: string; ocrConfidence?: number; confidenceLabel?: string; unconfirmedItems?: string[]; url?: string; publicId?: string }[];
}

export async function generateClinicalSummary(params: {
  sessionId: string;
  patientName: string;
  patientId: string;
  abhaId?: string;
  chiefComplaint: string;
  answers: HistoryAnswer[];
  documents: any[];
  mode?: string;
}): Promise<{ summary: ClinicalSummary }> {
  const res = await fetch(`${API_BASE}/clinical-summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to generate summary");
  return res.json();
}

export async function getClinicalSummary(sessionId: string): Promise<ClinicalSummary> {
  const res = await fetch(`${API_BASE}/clinical-summary/${sessionId}`);
  if (!res.ok) throw new Error("Summary not found");
  return res.json();
}

export async function getAllClinicalSummaries(): Promise<ClinicalSummary[]> {
  const res = await fetch(`${API_BASE}/clinical-summary`);
  if (!res.ok) throw new Error("Failed to fetch summaries");
  return res.json();
}

export async function reviewClinicalSummary(
  sessionId: string,
  data: { status?: string; physicianNotes?: string }
): Promise<ClinicalSummary> {
  const res = await fetch(`${API_BASE}/clinical-summary/${sessionId}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update review");
  return res.json();
}

// ---- Documents ----
export interface UploadedDocument {
  id: string;
  sessionId: string;
  filename: string;
  mimetype: string;
  size: number;
  type: string;
  date: string;
  facility?: string;
  doctor?: string;
  extractedEntities?: any;
  abnormalFlags?: string[];
  summary?: string;
  ocrConfidence?: number;
  confidenceLabel?: string;
  unconfirmedItems?: string[];
  url?: string;
  publicId?: string;
}

export async function uploadDocuments(
  sessionId: string,
  files: File[]
): Promise<{ documents: UploadedDocument[]; totalDocuments: number }> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  const res = await fetch(`${API_BASE}/documents/${sessionId}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload documents");
  return res.json();
}

export async function getDocuments(sessionId: string): Promise<UploadedDocument[]> {
  const res = await fetch(`${API_BASE}/documents/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

// ---- Consent ----
export async function recordConsent(params: {
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  consentGranted: boolean;
  consentTypes?: string[];
  language?: string;
}): Promise<{ consent: any; canProceed: boolean }> {
  const res = await fetch(`${API_BASE}/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to record consent");
  return res.json();
}

export async function getConsentText(language: string = "en"): Promise<any> {
  const res = await fetch(`${API_BASE}/consent/text/${language}`);
  if (!res.ok) throw new Error("Failed to fetch consent text");
  return res.json();
}

// ---- Auth ----
export async function loginUser(email: string, password: string): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Login failed");
  }
  return res.json();
}

export async function registerUser(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Registration failed");
  }
  return res.json();
}

// ---- Doctors ----
export interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  department: string;
  available: boolean;
  city?: string;
  region?: string;
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

export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${API_BASE}/doctors`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  const data = await res.json();
  return data.doctors || data;
}

export async function searchDoctors(params: {
  city?: string;
  specialty?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  available?: boolean;
}): Promise<{ doctors: Doctor[]; total: number; filters: any }> {
  const qs = new URLSearchParams();
  if (params.city) qs.set("city", params.city);
  if (params.specialty) qs.set("specialty", params.specialty);
  if (params.lat) qs.set("lat", String(params.lat));
  if (params.lng) qs.set("lng", String(params.lng));
  if (params.radius) qs.set("radius", String(params.radius));
  if (params.available) qs.set("available", "true");
  const res = await fetch(`${API_BASE}/doctors?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to search doctors");
  return res.json();
}

export async function getDoctorSpecialties(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/doctors/specialties`);
  if (!res.ok) throw new Error("Failed to fetch specialties");
  const data = await res.json();
  return data.specialties;
}

export async function getDoctorCities(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/doctors/cities`);
  if (!res.ok) throw new Error("Failed to fetch cities");
  const data = await res.json();
  return data.cities;
}

export async function getMCQs(sessionId: string): Promise<{ mcqs: (string[] | null)[]; totalQuestions: number }> {
  const res = await fetch(`${API_BASE}/intake/${sessionId}/mcqs`);
  if (!res.ok) throw new Error("Failed to fetch MCQs");
  return res.json();
}

// Get disease-specific MCQ options based on chief complaint and language
export async function getDiseaseMCQs(chiefComplaint: string, language: string, answeredCategories: string[] = []): Promise<{ mcqs: (string[] | null)[]; diseaseCategory: string | null; availableQuestions: number }> {
  const res = await fetch(`${API_BASE}/ai/disease-mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chiefComplaint, language, answeredCategories }),
  });
  if (!res.ok) throw new Error("Failed to fetch disease MCQs");
  return res.json();
}

// ---- Appointments ----
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  urgency: string;
  status: string;
  scheduledAt: string;
  duration: number;
  reason: string;
  notes?: string;
  callRoomId: string;
  joinedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export async function getAppointments(params?: { patientId?: string; doctorId?: string; status?: string }): Promise<Appointment[]> {
  const qs = new URLSearchParams();
  if (params?.patientId) qs.set("patientId", params.patientId);
  if (params?.doctorId) qs.set("doctorId", params.doctorId);
  if (params?.status) qs.set("status", params.status);
  const res = await fetch(`${API_BASE}/appointments?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function createAppointment(data: {
  patientId: string;
  patientName: string;
  doctorId: string;
  urgency: string;
  reason: string;
  scheduledAt?: string;
}): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

export async function updateAppointmentStatus(id: string, status: string, notes?: string): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error("Failed to update appointment");
  return res.json();
}

export async function cancelAppointment(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/appointments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to cancel appointment");
  return res.json();
}

// ---- Video Call ----
export async function joinVideoRoom(roomId: string, participantId: string, participantName: string): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, participantId, participantName }),
  });
  if (!res.ok) throw new Error("Failed to join room");
  return res.json();
}

export async function leaveVideoRoom(roomId: string, participantId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantId }),
  });
  if (!res.ok) throw new Error("Failed to leave room");
  return res.json();
}

export async function endVideoCall(roomId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/end`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to end call");
  return res.json();
}

export async function postVideoOffer(roomId: string, from: string, sdp: any): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/offer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, sdp }),
  });
  if (!res.ok) throw new Error("Failed to post offer");
  return res.json();
}

export async function getVideoOffer(roomId: string, from: string): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/offer/${from}`);
  if (!res.ok) return null;
  return res.json();
}

export async function postVideoAnswer(roomId: string, from: string, sdp: any): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, sdp }),
  });
  if (!res.ok) throw new Error("Failed to post answer");
  return res.json();
}

export async function getVideoAnswer(roomId: string, from: string): Promise<any> {
  const res = await fetch(`${API_BASE}/video/room/${roomId}/answer/${from}`);
  if (!res.ok) return null;
  return res.json();
}

export async function assignDoctor(sessionId: string, doctorId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/doctors/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, doctorId }),
  });
  if (!res.ok) throw new Error("Failed to assign doctor");
  return res.json();
}

// ---- PDF Download ----
export function downloadSummaryAsPDF(summary: ClinicalSummary) {
  const mode = summary.mode || "allopathic";
  const isAyush = mode === "ayush";

  let sectionsHtml = "";

  sectionsHtml += `<div class="section"><h3>Chief Complaint</h3><p>${summary.chiefComplaint}</p></div>`;
  sectionsHtml += `<div class="section"><h3>History of Present Illness</h3><p>${summary.historyOfPresentIllness}</p></div>`;

  if (isAyush && summary.dashavidhaPariksha) {
    sectionsHtml += `<div class="section ayush"><h3>Dashavidha Pariksha (10-Fold Examination)</h3><table>`;
    for (const val of Object.values(summary.dashavidhaPariksha)) {
      sectionsHtml += `<tr><td class="label">${val.title}</td><td>${val.finding}</td></tr>`;
    }
    sectionsHtml += `</table></div>`;
  }

  if (isAyush && summary.aharaVihara) {
    sectionsHtml += `<div class="section ayush"><h3>Ahara-Vihara (Diet & Lifestyle)</h3><table>`;
    for (const val of Object.values(summary.aharaVihara)) {
      sectionsHtml += `<tr><td class="label">${val.title}</td><td>${val.finding}</td></tr>`;
    }
    sectionsHtml += `</table></div>`;
  }

  sectionsHtml += `<div class="section"><h3>Past Medical History</h3><p>${summary.pastMedicalHistory || "Not documented"}</p></div>`;
  sectionsHtml += `<div class="section"><h3>Drug & Allergy History</h3><p>${summary.drugAllergyHistory || "Not documented"}</p></div>`;
  sectionsHtml += `<div class="section"><h3>Family History</h3><p>${summary.familyHistory || "Not documented"}</p></div>`;
  sectionsHtml += `<div class="section"><h3>Personal History</h3><p>${summary.personalHistory || "Not documented"}</p></div>`;

  if (summary.abnormalFlags?.length) {
    sectionsHtml += `<div class="section flags"><h3>Abnormal Findings</h3><ul>`;
    summary.abnormalFlags.forEach((f) => { sectionsHtml += `<li>⚠ ${f}</li>`; });
    sectionsHtml += `</ul></div>`;
  }

  sectionsHtml += `<div class="section assessment"><h3>${isAyush ? "Ayurvedic Assessment" : "AI Clinical Assessment"}</h3><p>${summary.aiAssessment}</p></div>`;

  const html = `<!DOCTYPE html>
<html><head><title>Clinical Summary - ${summary.patientName}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
  .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 30px; }
  .header h1 { font-size: 24px; color: #059669; margin-bottom: 5px; }
  .header h2 { font-size: 18px; color: #374151; font-weight: normal; margin-top: 5px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #6b7280; margin-top: 15px; }
  .section { margin-bottom: 20px; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
  .section h3 { font-size: 14px; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
  .section p { font-size: 13px; line-height: 1.6; margin: 0; }
  .section table { width: 100%; font-size: 13px; }
  .section table td { padding: 6px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .section table .label { font-weight: 600; color: #374151; width: 40%; }
  .section.ayush { border-color: #f59e0b; background: #fffbeb; }
  .section.ayush h3 { color: #d97706; }
  .section.flags { border-color: #f59e0b; background: #fffbeb; }
  .section.flags h3 { color: #d97706; }
  .section.flags ul { margin: 0; padding-left: 20px; }
  .section.flags li { font-size: 13px; color: #92400e; margin-bottom: 4px; }
  .section.assessment { border-color: #059669; background: #f0fdf4; }
  .section.assessment h3 { color: #059669; }
  .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px; }
  @media print { body { padding: 0; } .section { break-inside: avoid; } }
</style></head><body>
<div class="header">
  <h1>MediKiosk — ${isAyush ? "AYUSH Clinical Summary" : "Clinical History Summary"}</h1>
  <h2>${summary.patientName}</h2>
  <div class="meta">
    <div>Patient ID: ${summary.patientId}</div>
    <div>${summary.abhaId ? `ABHA: ${summary.abhaId}` : ""}</div>
    <div>Mode: ${isAyush ? "AYUSH (Ayurvedic)" : "Allopathic"}</div>
    <div>Generated: ${new Date(summary.generatedAt).toLocaleString()}</div>
  </div>
</div>
${sectionsHtml}
<div class="footer">Generated by MediKiosk — AI Clinical History Platform · ${new Date().toLocaleDateString()}</div>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (w) {
    w.onload = () => { w.print(); };
  }
}

// ---- Chatbot ----
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  language?: string;
}

export interface ChatSession {
  sessionId: string;
  chatType: "general" | "ayush";
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export async function createChatSession(userId: string, chatType: "general" | "ayush" = "general", language: string = "en"): Promise<{ sessionId: string; chatType: string; greeting: ChatMessage }> {
  const res = await fetch(`${API_BASE}/chat/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, chatType, language }),
  });
  if (!res.ok) throw new Error("Failed to create chat session");
  return res.json();
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  language: string = "en"
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage; messageCount: number }> {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, message, language }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function getChatHistory(sessionId: string): Promise<ChatSession> {
  const res = await fetch(`${API_BASE}/chat/session/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch chat history");
  return res.json();
}

export async function getUserChatSessions(userId: string): Promise<ChatSession[]> {
  const res = await fetch(`${API_BASE}/chat/sessions/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

// ---- NAMASTE-ICD11 Integration ----
export interface NAMASTECODE {
  code: string;
  display: string;
  definition: string;
  system: string;
  category: string;
  bodySystem: string;
}

export interface ICD11Code {
  code: string;
  display: string;
  system: string;
  chapter: string;
}

export interface MappingResult {
  sourceCode: string;
  sourceDisplay: string;
  sourceSystem: string;
  targetCode: string;
  targetDisplay: string;
  targetSystem: string;
  equivalence: string;
  confidence: number;
  method: string;
}

export async function searchNAMASTE(query: string, system?: string, limit?: number): Promise<NAMASTECODE[]> {
  const params = new URLSearchParams({ q: query });
  if (system) params.set("system", system);
  if (limit) params.set("limit", limit.toString());
  const res = await fetch(`${API_BASE}/namaste/search?${params.toString()}`);
  if (!res.ok) throw new Error("NAMASTE search failed");
  const data = await res.json();
  return data.results;
}

export async function searchICD11(query: string, system?: string, limit?: number): Promise<ICD11Code[]> {
  const params = new URLSearchParams({ q: query });
  if (system) params.set("system", system);
  if (limit) params.set("limit", limit.toString());
  const res = await fetch(`${API_BASE}/icd11/search?${params.toString()}`);
  if (!res.ok) throw new Error("ICD-11 search failed");
  const data = await res.json();
  return data.results;
}

export async function translateCode(
  sourceSystem: string,
  sourceCode: string,
  target?: string
): Promise<MappingResult[]> {
  const params = new URLSearchParams({ system: sourceSystem, code: sourceCode });
  if (target) params.set("target", target);
  const res = await fetch(`${API_BASE}/translate?${params.toString()}`);
  if (!res.ok) throw new Error("Translation failed");
  const data = await res.json();
  return data.mappings;
}

export async function getConceptMap(): Promise<any> {
  const res = await fetch(`${API_BASE}/conceptmap`);
  if (!res.ok) throw new Error("ConceptMap generation failed");
  return res.json();
}

export async function getNAMASTECodes(): Promise<NAMASTECODE[]> {
  const res = await fetch(`${API_BASE}/namaste/codes`);
  if (!res.ok) throw new Error("Failed to fetch NAMASTE codes");
  const data = await res.json();
  return data.codes;
}
