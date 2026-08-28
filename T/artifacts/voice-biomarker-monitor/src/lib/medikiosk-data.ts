/**
 * MediKiosk helper data and utilities
 */

export const CHIEF_COMPLAINT_ICONS: Record<string, string> = {
  chest_pain: "❤️",
  breathlessness: "🫁",
  headache: "🧠",
  abdominal_pain: "🔵",
  joint_pain: "🦴",
  fever: "🌡️",
  fatigue: "😴",
  cough: "🗣️",
  dizziness: "💫",
  skin_issues: "✨",
  mood_changes: "🧠",
  digestive_issues: "🍽️",
  other: "📝",
};

export function getQuestionPhase(questionId: string): string {
  if (questionId.startsWith("socol_")) return "socrates";
  if (["prakriti", "agni", "koshtha", "ahara_vihara", "sattva"].includes(questionId)) return "ayush";
  return "general";
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function getDocumentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    prescription: "Prescription",
    lab_report: "Lab Report",
    discharge_summary: "Discharge Summary",
    imaging: "Imaging / X-Ray",
    other: "Other Document",
  };
  return labels[type] || "Document";
}

export function getDocumentTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    prescription: "💊",
    lab_report: "🧪",
    discharge_summary: "📄",
    imaging: "📷",
    other: "📋",
  };
  return icons[type] || "📋";
}
