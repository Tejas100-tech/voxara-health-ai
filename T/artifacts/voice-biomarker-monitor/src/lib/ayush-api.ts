/**
 * AYUSH API Client — MediKiosk AyurBot and Ayurvedic assessment
 */

const API_BASE = "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Chat ────────────────────────────────────────────────────────────────

export async function createAyushChatSession(data: {
  patientId?: string;
  patientName?: string;
  language?: string;
  mode?: string;
}): Promise<{ sessionId: string; greeting: string; mode: string; language: string }> {
  return apiFetch("/api/ayush/chat/session", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendAyushChatMessage(
  sessionId: string,
  message: string,
): Promise<{
  messageId: string;
  message: string;
  suggestedActions?: string[];
  extractedData?: Record<string, unknown>;
  category: string;
}> {
  return apiFetch("/api/ayush/chat/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}

export async function getAyushChatSession(sessionId: string) {
  return apiFetch(`/api/ayush/chat/session/${sessionId}`);
}

export async function extractAyushChatData(sessionId: string) {
  return apiFetch<{ extractedData: Record<string, unknown>; progress: number }>(
    "/api/ayush/chat/extract",
    { method: "POST", body: JSON.stringify({ sessionId }) },
  );
}

// ─── Assessment ──────────────────────────────────────────────────────────

export async function saveAyushAssessment(data: Record<string, unknown>) {
  return apiFetch<{ assessmentId: string; status: string }>("/api/ayush/assessment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPatientAyushData(patientId: string) {
  return apiFetch<{
    patientId: string;
    assessment: Record<string, unknown> | null;
    documents: unknown[];
    timeline: unknown[];
    hasAssessment: boolean;
  }>(`/api/patients/${patientId}/ayush`);
}

export async function getPatientAyushTimeline(patientId: string, type?: string) {
  const params = type ? `?type=${type}` : "";
  return apiFetch(`/api/patients/${patientId}/ayush/timeline${params}`);
}

// ─── Documents ───────────────────────────────────────────────────────────

export async function uploadAyushDocument(data: {
  patientId: string;
  assessmentId?: string;
  fileName: string;
  fileType?: string;
  documentType?: string;
  ocrText?: string;
  extractedData?: Record<string, unknown>;
}) {
  return apiFetch<{ documentId: string; status: string }>("/api/ayush/documents/upload", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAyushDocuments(patientId: string) {
  return apiFetch(`/api/ayush/documents/${patientId}`);
}

// ─── Practitioner ────────────────────────────────────────────────────────

export async function getPractitionerPatients() {
  return apiFetch<Array<{
    patientId: string;
    patientName: string;
    chiefComplaint?: string;
    assessmentStatus: string;
    documentCount: number;
    hasAiBrief: boolean;
    updatedAt: string;
  }>>("/api/ayush/practitioner/patients");
}

export async function getPractitionerPatientDetail(patientId: string) {
  return apiFetch<{
    patientId: string;
    assessment: Record<string, unknown> | null;
    documents: unknown[];
    timeline: unknown[];
    aiBrief: string;
  }>(`/api/ayush/practitioner/patient/${patientId}`);
}

export async function submitPractitionerReview(data: {
  patientId: string;
  practitionerId: string;
  action: "confirm" | "edit" | "reject";
  edits?: Record<string, unknown>;
}) {
  return apiFetch<{ assessmentId: string; status: string; verified: boolean }>("/api/ayush/practitioner-review", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Demo ────────────────────────────────────────────────────────────────

export async function seedAyushDemoData() {
  return apiFetch("/api/ayush/seed-demo", { method: "POST" });
}

export async function getPreConsultationQuestions(lang?: string) {
  return apiFetch(`/api/ayush/pre-consultation/questions?lang=${lang || "en"}`);
}

// ─── Health Chat (Allopathic Mode) ──────────────────────────────────────

export async function createHealthChatSession(data: {
  patientId?: string;
  patientName?: string;
  language?: string;
  mode?: string;
}): Promise<{ sessionId: string; greeting: string; mode: string; language: string }> {
  return apiFetch("/api/healthchat/session", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendHealthChatMessage(
  sessionId: string,
  message: string,
): Promise<{
  messageId: string;
  message: string;
  suggestedActions?: string[];
  category?: string;
}> {
  return apiFetch("/api/healthchat/message", {
    method: "POST",
    body: JSON.stringify({ sessionId, message }),
  });
}

export async function getHealthChatSession(sessionId: string) {
  return apiFetch(`/api/healthchat/session/${sessionId}`);
}
