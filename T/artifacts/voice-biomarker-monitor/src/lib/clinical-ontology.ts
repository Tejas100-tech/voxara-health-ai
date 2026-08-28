/**
 * MediKiosk Clinical Ontology
 * Covers SOCRATES pain assessment, general clinical history,
 * and AYUSH Dashavidha Pariksha framework.
 */

// ─── SOCRATES Framework ──────────────────────────────────────────────────────

export const SOCRATES_FIELDS = [
  { key: "site", label: "Site", description: "Where is the symptom located?" },
  { key: "onset", label: "Onset", description: "When and how did it start?" },
  { key: "character", label: "Character", description: "What does it feel like?" },
  { key: "radiation", label: "Radiation", description: "Does it spread anywhere?" },
  { key: "associated", label: "Associated symptoms", description: "Any other symptoms?" },
  { key: "timing", label: "Timing", description: "When does it happen?" },
  { key: "exacerbating", label: "Exacerbating factors", description: "What makes it worse?" },
  { key: "relieving", label: "Relieving factors", description: "What makes it better?" },
  { key: "severity", label: "Severity", description: "How bad is it (1-10)?" },
] as const;

// ─── Standard Clinical History Sections ──────────────────────────────────────

export const CLINICAL_HISTORY_SECTIONS = [
  {
    id: "chief_complaint",
    label: "Chief Complaint",
    icon: "Stethoscope",
    description: "Primary reason for the visit",
  },
  {
    id: "hpi",
    label: "History of Present Illness",
    icon: "Clock",
    description: "Detailed description using SOCRATES",
  },
  {
    id: "past_medical",
    label: "Past Medical History",
    icon: "FileText",
    description: "Existing conditions and diagnoses",
  },
  {
    id: "past_surgical",
    label: "Past Surgical History",
    icon: "Scissors",
    description: "Previous operations and procedures",
  },
  {
    id: "drug_history",
    label: "Drug & Medication History",
    icon: "Pill",
    description: "Current medications, dosages, compliance",
  },
  {
    id: "allergy_history",
    label: "Allergy History",
    icon: "ShieldAlert",
    description: "Known allergies and reactions",
  },
  {
    id: "family_history",
    label: "Family History",
    icon: "Users",
    description: "Conditions in immediate family",
  },
  {
    id: "personal_history",
    label: "Personal History",
    icon: "User",
    description: "Lifestyle, habits, occupation",
  },
  {
    id: "review_of_systems",
    label: "Review of Systems",
    icon: "ListChecks",
    description: "Systematic symptom review",
  },
] as const;

// ─── AYUSH Dashavidha Pariksha ──────────────────────────────────────────────

export interface AyushParameter {
  key: string;
  sanskritName: string;
  englishName: string;
  description: string;
  options: Array<{ value: string; label: string }>;
}

export const AYUSH_DASHAVIDHA: AyushParameter[] = [
  {
    key: "prakriti",
    sanskritName: "Prakriti",
    englishName: "Constitution Type",
    description: "Your innate physical and mental constitution determined at conception",
    options: [
      { value: "vata", label: "Vata (Air + Space)" },
      { value: "pitta", label: "Pitta (Fire + Water)" },
      { value: "kapha", label: "Kapha (Earth + Water)" },
      { value: "vata_pitta", label: "Vata-Pitta" },
      { value: "pitta_kapha", label: "Pitta-Kapha" },
      { value: "vata_kapha", label: "Vata-Kapha" },
      { value: "tridoshic", label: "Tridoshic (Balanced)" },
    ],
  },
  {
    key: "vikriti",
    sanskritName: "Vikriti",
    englishName: "Current Imbalance",
    description: "Your current state of dosha imbalance compared to your Prakriti",
    options: [
      { value: "vata_dominant", label: "Vata Predominant" },
      { value: "pitta_dominant", label: "Pitta Predominant" },
      { value: "kapha_dominant", label: "Kapha Predominant" },
      { value: "balanced", label: "Balanced (No significant imbalance)" },
    ],
  },
  {
    key: "sara",
    sanskritName: "Sara",
    englishName: "Tissue Vitality",
    description: "Quality and lustre of body tissues indicating overall vitality",
    options: [
      { value: "excellent", label: "Excellent — firm, strong, lustrous" },
      { value: "good", label: "Good — generally healthy" },
      { value: "moderate", label: "Moderate — some weakness" },
      { value: "poor", label: "Poor — noticeable weakness" },
    ],
  },
  {
    key: "samhanana",
    sanskritName: "Samhanana",
    englishName: "Body Compactness",
    description: "Compactness and firmness of the body structure",
    options: [
      { value: "compact", label: "Compact and firm" },
      { value: "normal", label: "Normal" },
      { value: "loose", label: "Loose or underdeveloped" },
    ],
  },
  {
    key: "pramana",
    sanskritName: "Pramana",
    englishName: "Body Measurements",
    description: "Physical measurements — height, weight, chest circumference",
    options: [
      { value: "small", label: "Small (Laghu)" },
      { value: "medium", label: "Medium (Madhyama)" },
      { value: "large", label: "Large (Brihat)" },
    ],
  },
  {
    key: "satmya",
    sanskritName: "Satmya",
    englishName: "Adaptability",
    description: "Your body's tolerance and adaptability to changes in diet, climate, and routine",
    options: [
      { value: "high", label: "High — adapts easily to any changes" },
      { value: "moderate", label: "Moderate — needs some adjustment time" },
      { value: "low", label: "Low — sensitive to changes" },
    ],
  },
  {
    key: "sattva",
    sanskritName: "Sattva",
    englishName: "Mental Constitution",
    description: "Mental strength and capacity for knowledge, emotional balance",
    options: [
      { value: "sattvika", label: "Sattvika — Calm, clear, balanced mind" },
      { value: "rajastika", label: "Rajastika — Active, passionate, sometimes restless" },
      { value: "tamastika", label: "Tamastika — Prone to lethargy, confusion" },
    ],
  },
  {
    key: "ahara_shakti",
    sanskritName: "Ahara Shakti",
    englishName: "Digestive Capacity",
    description: "Your appetite, digestion strength, and eating capacity",
    options: [
      { value: "strong", label: "Strong — regular, large appetite" },
      { value: "moderate", label: "Moderate — normal appetite" },
      { value: "weak", label: "Weak — poor appetite, irregular eating" },
    ],
  },
  {
    key: "vyayama_shakti",
    sanskritName: "Vyayama Shakti",
    englishName: "Exercise Capacity",
    description: "Physical endurance, stamina, and capacity for exertion",
    options: [
      { value: "high", label: "High — can exercise vigorously without fatigue" },
      { value: "moderate", label: "Moderate — tolerates regular exercise" },
      { value: "low", label: "Low — fatigues easily with minimal exertion" },
    ],
  },
  {
    key: "vaya",
    sanskritName: "Vaya",
    englishName: "Age Assessment",
    description: "Ayurvedic age assessment based on physical and mental vitality",
    options: [
      { value: "kumarera", label: "Kumarera — Childhood to Puberty (0-16)" },
      { value: "yauvana", label: "Yauvana — Youth (16-70)" },
      { value: "jara", label: "Jara — Old Age (70+)" },
    ],
  },
];

// ─── Red Flag Symptoms ──────────────────────────────────────────────────────

export const RED_FLAG_SYMPTOMS: Record<string, string[]> = {
  chest_pain: [
    "Acute chest pain with dyspnoea",
    "Chest pain with sudden onset (thunderclap)",
    "Chest pain with diaphoresis and vomiting",
    "Chest pain radiating to jaw with syncope",
  ],
  breathlessness: [
    "Sudden severe breathlessness at rest",
    "Breathlessness with stridor",
    "Breathlessness with cyanosis",
    "Breathlessness with hemoptysis",
  ],
  headache: [
    "Sudden thunderclap headache",
    "Headache with stiff neck and fever",
    "Headache with visual loss",
    "Worst headache of life",
  ],
  neurological: [
    "Sudden facial drooping",
    "Sudden weakness in one arm",
    "Difficulty speaking or understanding speech",
    "Sudden severe dizziness with ataxia",
  ],
  general: [
    "Unexplained weight loss > 10%",
    "Persistent unexplained fever",
    "Unexplained bleeding",
    "Severe unrelenting pain",
  ],
};

// ─── Step Definitions for the Patient Journey ───────────────────────────────

export const INTAKE_STEPS = [
  {
    id: "identify",
    number: 1,
    title: "Identify",
    description: "Enter ABHA ID or register",
    icon: "Fingerprint",
    duration: "~1 min",
  },
  {
    id: "converse",
    number: 2,
    title: "History Interview",
    description: "Voice & touch clinical history",
    icon: "MessageCircle",
    duration: "~5 min",
  },
  {
    id: "scan",
    number: 3,
    title: "Document Scan",
    description: "Upload prior medical records",
    icon: "ScanLine",
    duration: "~2 min",
  },
  {
    id: "summarize",
    number: 4,
    title: "Summary",
    description: "AI-generated clinical summary",
    icon: "FileCheck",
    duration: "~30 sec",
  },
  {
    id: "complete",
    number: 5,
    title: "Complete",
    description: "Routed to physician",
    icon: "CheckCircle",
    duration: "Done",
  },
] as const;

// ─── Document Type Definitions ──────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  { id: "prescription", label: "Prescription", icon: "Pill", color: "text-blue-500" },
  { id: "lab_report", label: "Lab Report", icon: "FlaskConical", color: "text-green-500" },
  { id: "discharge_summary", label: "Discharge Summary", icon: "FileText", color: "text-purple-500" },
  { id: "imaging", label: "Imaging / X-Ray", icon: "ScanLine", color: "text-orange-500" },
  { id: "other", label: "Other Document", icon: "File", color: "text-gray-500" },
] as const;

// ─── Supported Languages ────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
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
] as const;
