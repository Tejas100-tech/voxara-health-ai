// ─── MediKiosk Clinical Ontology ─────────────────────────────────────────────
// Shared constants for the MediKiosk patient intake flow

export interface IntakeStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
}

export const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "identify",
    number: 1,
    title: "Identify Patient",
    description: "Select language, mode, and verify ABHA ID",
    duration: "~30 sec",
  },
  {
    id: "consent",
    number: 2,
    title: "Consent",
    description: "DPDP Act 2023 privacy consent",
    duration: "~20 sec",
  },
  {
    id: "intake",
    number: 3,
    title: "Clinical Intake",
    description: "SOCRATES + guided history questions",
    duration: "~4 min",
  },
  {
    id: "scan",
    number: 4,
    title: "Document Scan",
    description: "Upload reports, prescriptions, lab results",
    duration: "~30 sec",
  },
  {
    id: "summary",
    number: 5,
    title: "AI Summary",
    description: "AI-generated clinical summary for physician",
    duration: "~15 sec",
  },
];

export interface SupportedLanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
];
