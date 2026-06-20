import type { AIAnalysis, MFCCFeatures, VoiceSession } from "./realtime";

const API_BASE = "/api";

export interface Notification {
  _id: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  kind: "Critical" | "Watch" | "Insight";
  title: string;
  body: string;
  metric: string;
  value: number | string;
  threshold: number | string;
  acknowledged: boolean;
  createdAt: string;
}

export interface AppointmentPayload {
  patientId: string;
  patientName: string;
  doctorId: string;
  urgency: "emergency" | "urgent" | "routine";
  reason: string;
  riskScore?: number;
  biomarkerTrigger?: string;
  scheduledAt?: string;
}

export async function saveSessionToServer(session: VoiceSession, patientId?: string): Promise<{ notificationsGenerated: number }> {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...session, patientId: patientId || "PT-001" }),
  });
  if (!res.ok) throw new Error("Failed to save session");
  return res.json();
}

export async function uploadAudioToServer(sessionId: string, blob: Blob): Promise<{ audioUrl: string }> {
  const formData = new FormData();
  formData.append("audio", blob, `session_${sessionId}.webm`);
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/audio`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to upload audio");
  return res.json();
}

export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/notifications/unread-count`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/notifications/${id}/acknowledge`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await fetch(`${API_BASE}/notifications/acknowledge-all`, { method: "PATCH" });
}

export async function acknowledgeNotification(id: string): Promise<void> {
  return markNotificationRead(id);
}

export async function acknowledgeAllNotifications(): Promise<void> {
  return markAllNotificationsRead();
}

export async function fetchAIAnalysis(params: {
  session: VoiceSession;
  patientConditions?: string[];
  previousSessions?: Partial<VoiceSession>[];
}): Promise<AIAnalysis> {
  const { session, patientConditions, previousSessions } = params;
  const res = await fetch(`${API_BASE}/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session.id,
      clarity: session.clarity,
      tremor: session.tremor,
      breathlessness: session.breathlessness,
      pitchConsistency: session.pitchConsistency,
      speechRate: session.speechRate,
      noiseFloor: session.noiseFloor,
      risk: session.risk,
      confidence: session.confidence,
      transcript: session.transcript,
      mfccFeatures: session.mfcc?.coefficients,
      spectralCentroid: session.mfcc?.spectralCentroid,
      zeroCrossingRate: session.mfcc?.zeroCrossingRate,
      patientConditions: patientConditions ?? [],
      previousSessions: previousSessions ?? [],
    }),
  });
  if (!res.ok) throw new Error("AI analysis request failed");
  const data = await res.json();
  return data.analysis as AIAnalysis;
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const res = await fetch(`${API_BASE}/ai/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioBase64: base64, mimeType: blob.type }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.transcript ?? "";
}

export async function fetchPatientSessions(patientId: string): Promise<Partial<VoiceSession>[]> {
  try {
    const res = await fetch(`${API_BASE}/sessions?patientId=${encodeURIComponent(patientId)}&limit=5`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.sessions ?? [];
  } catch {
    return [];
  }
}

export async function fetchAppointments(patientId?: string, doctorId?: string, clinicianPatientId?: string): Promise<unknown[]> {
  const params = new URLSearchParams();
  if (clinicianPatientId) params.set("clinicianPatientId", clinicianPatientId);
  else if (doctorId) params.set("doctorId", doctorId);
  else if (patientId) params.set("patientId", patientId);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}/appointments${query}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function bookAppointment(payload: AppointmentPayload): Promise<unknown> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to book appointment");
  return res.json();
}

export async function cancelAppointment(id: string): Promise<void> {
  await fetch(`${API_BASE}/appointments/${id}`, { method: "DELETE" });
}

export async function updateAppointmentStatus(id: string, status: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update appointment");
  return res.json();
}

export async function fetchDoctors(): Promise<unknown[]> {
  const res = await fetch(`${API_BASE}/appointments/doctors`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function registerDoctor(payload: {
  doctorName: string;
  doctorSpecialty: string;
  available?: boolean;
  email?: string;
  phone?: string;
  bio?: string;
}): Promise<unknown> {
  const res = await fetch(`${API_BASE}/appointments/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to register doctor");
  return res.json();
}

export async function fetchAppointmentByRoom(roomId: string): Promise<unknown> {
  const res = await fetch(`${API_BASE}/appointments/room/${encodeURIComponent(roomId)}`);
  if (!res.ok) throw new Error("Room not found");
  return res.json();
}

export { type AIAnalysis, type MFCCFeatures };
