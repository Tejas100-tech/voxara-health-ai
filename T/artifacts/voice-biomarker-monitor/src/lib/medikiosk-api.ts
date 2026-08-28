const API = "/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChiefComplaintOption {
  id: string;
  label: string;
  icon: string;
}

export interface IntakeQuestion {
  id: string;
  question: string;
  options?: string[];
  type: "single_choice" | "multiple_choice" | "free_text" | "scale";
}

export interface IntakeSession {
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  language: string;
  mode: "allopathic" | "ayush";
  step: string;
  consentGranted: boolean;
  chiefComplaint?: string;
  historyAnswers: Record<string, unknown>;
  redFlags: string[];
  summaryGenerated: boolean;
  summaryContent?: string;
  documents: MedicalDocument[];
  startedAt: string;
  completedAt?: string;
  completeness?: number;
  totalQuestions?: number;
  answeredQuestions?: number;
}

export interface MedicalDocument {
  documentId: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  documentType: string;
  ocrText: string;
  extractedData: Record<string, unknown>;
  processingStatus: string;
  chronologicalOrder: number;
  uploadedAt: string;
}

export interface ClinicalHistoryRecord {
  historyId: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  hpi: Record<string, unknown>;
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  drugHistory: unknown[];
  allergyHistory: unknown[];
  familyHistory: string[];
  personalHistory: Record<string, string>;
  reviewOfSystems: Record<string, string>;
  ayushHistory?: Record<string, string>;
  priorInvestigations: unknown[];
  aiSummary: string;
  redFlags: string[];
  completenessScore: number;
  physicianReviewed: boolean;
  physicianEdits?: Record<string, unknown>;
  createdAt: string;
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function startIntakeSession(params: {
  patientId?: string;
  patientName?: string;
  language?: string;
  mode?: string;
  abhaId?: string;
}): Promise<{
  sessionId: string;
  step: string;
  currentPhase: string;
  chiefComplaintOptions: ChiefComplaintOption[];
  mode: string;
  language: string;
}> {
  const res = await fetch(`${API}/medikiosk/intake/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to start intake session");
  return res.json();
}

export async function getIntakeQuestions(
  sessionId: string,
  chiefComplaint?: string
): Promise<{
  socratesQuestions: IntakeQuestion[];
  generalHistoryQuestions: IntakeQuestion[];
  ayushQuestions: IntakeQuestion[];
  existingAnswers: Record<string, unknown>;
  redFlags: string[];
}> {
  const params = chiefComplaint ? `?chiefComplaint=${encodeURIComponent(chiefComplaint)}` : "";
  const res = await fetch(`${API}/medikiosk/intake/${sessionId}/questions${params}`);
  if (!res.ok) throw new Error("Failed to fetch questions");
  return res.json();
}

export async function submitIntakeAnswer(
  sessionId: string,
  questionId: string,
  answer: unknown,
  chiefComplaint?: string
): Promise<{ saved: boolean; redFlags: string[]; progress: number }> {
  const res = await fetch(`${API}/medikiosk/intake/${sessionId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answer, chiefComplaint }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function submitVoiceAnswer(
  sessionId: string,
  questionId: string,
  transcript: string
): Promise<{ saved: boolean; transcript: string }> {
  const res = await fetch(`${API}/medikiosk/intake/${sessionId}/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, transcript }),
  });
  if (!res.ok) throw new Error("Failed to submit voice answer");
  return res.json();
}

export async function getIntakeSession(sessionId: string): Promise<IntakeSession> {
  const res = await fetch(`${API}/medikiosk/intake/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function finalizeIntake(sessionId: string): Promise<{ step: string }> {
  const res = await fetch(`${API}/medikiosk/intake/${sessionId}/finalize`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to finalize intake");
  return res.json();
}

export async function uploadDocument(doc: {
  sessionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  ocrText?: string;
  extractedData?: Record<string, unknown>;
}): Promise<{ documentId: string; status: string }> {
  const res = await fetch(`${API}/medikiosk/documents/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error("Failed to upload document");
  return res.json();
}

export async function getDocuments(sessionId: string): Promise<{ documents: MedicalDocument[] }> {
  const res = await fetch(`${API}/medikiosk/documents/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function generateSummary(
  sessionId: string
): Promise<{ historyId: string; summary: ClinicalHistoryRecord; completenessScore: number }> {
  const res = await fetch(`${API}/medikiosk/summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) throw new Error("Failed to generate summary");
  return res.json();
}

export async function getSummary(historyId: string): Promise<ClinicalHistoryRecord> {
  const res = await fetch(`${API}/medikiosk/summary/${historyId}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function reviewSummary(
  historyId: string,
  edits?: Record<string, unknown>,
  approved?: boolean
): Promise<{ reviewed: boolean }> {
  const res = await fetch(`${API}/medikiosk/summary/${historyId}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ edits, approved }),
  });
  if (!res.ok) throw new Error("Failed to save review");
  return res.json();
}

export async function getHistories(patientId?: string): Promise<ClinicalHistoryRecord[]> {
  const params = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
  const res = await fetch(`${API}/medikiosk/histories${params}`);
  if (!res.ok) throw new Error("Failed to fetch histories");
  return res.json();
}

export async function recordConsent(
  sessionId: string,
  consentType: string,
  abhaId?: string
): Promise<{ consentGranted: boolean }> {
  const res = await fetch(`${API}/medikiosk/consent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, consentType, abhaId }),
  });
  if (!res.ok) throw new Error("Failed to record consent");
  return res.json();
}

export async function validateABHA(abhaId: string): Promise<{
  valid: boolean;
  linkedFacility?: string;
  lastVisit?: string;
  message: string;
}> {
  const res = await fetch(`${API}/medikiosk/abha/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ abhaId }),
  });
  if (!res.ok) throw new Error("Failed to validate ABHA");
  return res.json();
}

export async function registerABHA(params: {
  name: string;
  phone: string;
  dob: string;
}): Promise<{ abhaId: string; success: boolean; message: string }> {
  const res = await fetch(`${API}/medikiosk/abha/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to register ABHA");
  return res.json();
}
