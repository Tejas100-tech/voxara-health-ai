// ═══════════════════════════════════════════════════════════════════════════
// MediKiosk Training Knowledge Base
// Generated from:
//   1. MedOCR Vision Dataset (naazimsnh02/medocr-vision-dataset) - 1969 medical documents
//   2. Doctor-Patient Indic Speech Dataset (bala-ceg/doctor-patient-indic-speech-dataset)
// ═══════════════════════════════════════════════════════════════════════════

export interface MedicationKnowledge {
  name: string;
  category: string;
  uses: string;
  doses: string;
  instructions: string;
  sideEffects: string;
  keywords: string[];
  response: Record<string, string>;
}

export interface LabTestKnowledge {
  name: string;
  unit: string;
  normalRange: string;
  description: string;
  keywords: string[];
  response: Record<string, string>;
}

// ── Medication Knowledge (from MedOCR Dataset) ──────────────────────────
export const TRAINING_MEDICATIONS: MedicationKnowledge[] = [
  {
    name: "Gabapentin",
    category: "Anticonvulsant/Neuropathic Pain",
    uses: "Neuropathic pain, seizures, postherpetic neuralgia",
    doses: "100mg-800mg",
    instructions: "Take with or without food. Do not stop suddenly.",
    sideEffects: "Dizziness, drowsiness, swelling",
    keywords: ["gabapentin", "anticonvulsant/neuropathic pain", "neuropathic pain"],
    response: {
      en: "**Gabapentin** (Anticonvulsant/Neuropathic Pain)\n\n**Uses:** Neuropathic pain, seizures, postherpetic neuralgia\n**Available Doses:** 100mg-800mg\n**How to Take:** Take with or without food. Do not stop suddenly.\n**Common Side Effects:** Dizziness, drowsiness, swelling\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Gabapentin** (Anticonvulsant/Neuropathic Pain)\n\n**उपयोग:** Neuropathic pain, seizures, postherpetic neuralgia\n**उपलब्ध खुराक:** 100mg-800mg\n**सेवन विधि:** Take with or without food. Do not stop suddenly.\n**सामान्य दुष्प्रभाव:** Dizziness, drowsiness, swelling\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Metformin",
    category: "Antidiabetic",
    uses: "Type 2 diabetes, blood sugar control",
    doses: "500mg-2550mg",
    instructions: "Take with meals to reduce stomach upset",
    sideEffects: "Nausea, diarrhea, stomach pain",
    keywords: ["metformin", "antidiabetic", "type 2 diabetes"],
    response: {
      en: "**Metformin** (Antidiabetic)\n\n**Uses:** Type 2 diabetes, blood sugar control\n**Available Doses:** 500mg-2550mg\n**How to Take:** Take with meals to reduce stomach upset\n**Common Side Effects:** Nausea, diarrhea, stomach pain\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Metformin** (Antidiabetic)\n\n**उपयोग:** Type 2 diabetes, blood sugar control\n**उपलब्ध खुराक:** 500mg-2550mg\n**सेवन विधि:** Take with meals to reduce stomach upset\n**सामान्य दुष्प्रभाव:** Nausea, diarrhea, stomach pain\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Omeprazole",
    category: "Proton Pump Inhibitor",
    uses: "Acid reflux, GERD, stomach ulcers",
    doses: "10mg-40mg",
    instructions: "Take 30 minutes before meals",
    sideEffects: "Headache, stomach pain, nausea",
    keywords: ["omeprazole", "proton pump inhibitor", "acid reflux"],
    response: {
      en: "**Omeprazole** (Proton Pump Inhibitor)\n\n**Uses:** Acid reflux, GERD, stomach ulcers\n**Available Doses:** 10mg-40mg\n**How to Take:** Take 30 minutes before meals\n**Common Side Effects:** Headache, stomach pain, nausea\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Omeprazole** (Proton Pump Inhibitor)\n\n**उपयोग:** Acid reflux, GERD, stomach ulcers\n**उपलब्ध खुराक:** 10mg-40mg\n**सेवन विधि:** Take 30 minutes before meals\n**सामान्य दुष्प्रभाव:** Headache, stomach pain, nausea\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Prednisone",
    category: "Corticosteroid",
    uses: "Inflammation, allergies, autoimmune conditions",
    doses: "5mg-60mg",
    instructions: "Take with food. Do not stop suddenly.",
    sideEffects: "Weight gain, mood changes, increased appetite",
    keywords: ["prednisone", "corticosteroid", "inflammation"],
    response: {
      en: "**Prednisone** (Corticosteroid)\n\n**Uses:** Inflammation, allergies, autoimmune conditions\n**Available Doses:** 5mg-60mg\n**How to Take:** Take with food. Do not stop suddenly.\n**Common Side Effects:** Weight gain, mood changes, increased appetite\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Prednisone** (Corticosteroid)\n\n**उपयोग:** Inflammation, allergies, autoimmune conditions\n**उपलब्ध खुराक:** 5mg-60mg\n**सेवन विधि:** Take with food. Do not stop suddenly.\n**सामान्य दुष्प्रभाव:** Weight gain, mood changes, increased appetite\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Hydrochlorothiazide",
    category: "Diuretic",
    uses: "High blood pressure, fluid retention",
    doses: "12.5mg-50mg",
    instructions: "Take in the morning",
    sideEffects: "Dizziness, increased urination, electrolyte imbalance",
    keywords: ["hydrochlorothiazide", "diuretic", "high blood pressure"],
    response: {
      en: "**Hydrochlorothiazide** (Diuretic)\n\n**Uses:** High blood pressure, fluid retention\n**Available Doses:** 12.5mg-50mg\n**How to Take:** Take in the morning\n**Common Side Effects:** Dizziness, increased urination, electrolyte imbalance\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Hydrochlorothiazide** (Diuretic)\n\n**उपयोग:** High blood pressure, fluid retention\n**उपलब्ध खुराक:** 12.5mg-50mg\n**सेवन विधि:** Take in the morning\n**सामान्य दुष्प्रभाव:** Dizziness, increased urination, electrolyte imbalance\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Simvastatin",
    category: "Statin",
    uses: "High cholesterol, heart disease prevention",
    doses: "5mg-80mg",
    instructions: "Take at bedtime. Avoid grapefruit.",
    sideEffects: "Muscle pain, headache, nausea",
    keywords: ["simvastatin", "statin", "high cholesterol"],
    response: {
      en: "**Simvastatin** (Statin)\n\n**Uses:** High cholesterol, heart disease prevention\n**Available Doses:** 5mg-80mg\n**How to Take:** Take at bedtime. Avoid grapefruit.\n**Common Side Effects:** Muscle pain, headache, nausea\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Simvastatin** (Statin)\n\n**उपयोग:** High cholesterol, heart disease prevention\n**उपलब्ध खुराक:** 5mg-80mg\n**सेवन विधि:** Take at bedtime. Avoid grapefruit.\n**सामान्य दुष्प्रभाव:** Muscle pain, headache, nausea\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Lisinopril",
    category: "ACE Inhibitor",
    uses: "High blood pressure, heart failure",
    doses: "2.5mg-40mg",
    instructions: "Take at the same time daily",
    sideEffects: "Dry cough, dizziness, headache",
    keywords: ["lisinopril", "ace inhibitor", "high blood pressure"],
    response: {
      en: "**Lisinopril** (ACE Inhibitor)\n\n**Uses:** High blood pressure, heart failure\n**Available Doses:** 2.5mg-40mg\n**How to Take:** Take at the same time daily\n**Common Side Effects:** Dry cough, dizziness, headache\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Lisinopril** (ACE Inhibitor)\n\n**उपयोग:** High blood pressure, heart failure\n**उपलब्ध खुराक:** 2.5mg-40mg\n**सेवन विधि:** Take at the same time daily\n**सामान्य दुष्प्रभाव:** Dry cough, dizziness, headache\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Amlodipine",
    category: "Calcium Channel Blocker",
    uses: "High blood pressure, angina",
    doses: "2.5mg-10mg",
    instructions: "Take at the same time daily",
    sideEffects: "Swelling, dizziness, flushing",
    keywords: ["amlodipine", "calcium channel blocker", "high blood pressure"],
    response: {
      en: "**Amlodipine** (Calcium Channel Blocker)\n\n**Uses:** High blood pressure, angina\n**Available Doses:** 2.5mg-10mg\n**How to Take:** Take at the same time daily\n**Common Side Effects:** Swelling, dizziness, flushing\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Amlodipine** (Calcium Channel Blocker)\n\n**उपयोग:** High blood pressure, angina\n**उपलब्ध खुराक:** 2.5mg-10mg\n**सेवन विधि:** Take at the same time daily\n**सामान्य दुष्प्रभाव:** Swelling, dizziness, flushing\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Levothyroxine",
    category: "Thyroid Hormone",
    uses: "Hypothyroidism, thyroid hormone replacement",
    doses: "25mcg-300mcg",
    instructions: "Take on empty stomach, 30-60 min before food",
    sideEffects: "Tremors, rapid heartbeat, weight changes",
    keywords: ["levothyroxine", "thyroid hormone", "hypothyroidism"],
    response: {
      en: "**Levothyroxine** (Thyroid Hormone)\n\n**Uses:** Hypothyroidism, thyroid hormone replacement\n**Available Doses:** 25mcg-300mcg\n**How to Take:** Take on empty stomach, 30-60 min before food\n**Common Side Effects:** Tremors, rapid heartbeat, weight changes\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Levothyroxine** (Thyroid Hormone)\n\n**उपयोग:** Hypothyroidism, thyroid hormone replacement\n**उपलब्ध खुराक:** 25mcg-300mcg\n**सेवन विधि:** Take on empty stomach, 30-60 min before food\n**सामान्य दुष्प्रभाव:** Tremors, rapid heartbeat, weight changes\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Atorvastatin",
    category: "Statin",
    uses: "High cholesterol, cardiovascular disease prevention",
    doses: "10mg-80mg",
    instructions: "Take at any time of day",
    sideEffects: "Muscle pain, joint pain, nausea",
    keywords: ["atorvastatin", "statin", "high cholesterol"],
    response: {
      en: "**Atorvastatin** (Statin)\n\n**Uses:** High cholesterol, cardiovascular disease prevention\n**Available Doses:** 10mg-80mg\n**How to Take:** Take at any time of day\n**Common Side Effects:** Muscle pain, joint pain, nausea\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Atorvastatin** (Statin)\n\n**उपयोग:** High cholesterol, cardiovascular disease prevention\n**उपलब्ध खुराक:** 10mg-80mg\n**सेवन विधि:** Take at any time of day\n**सामान्य दुष्प्रभाव:** Muscle pain, joint pain, nausea\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Losartan",
    category: "ARB",
    uses: "High blood pressure, diabetic kidney disease",
    doses: "25mg-100mg",
    instructions: "Take at the same time daily",
    sideEffects: "Dizziness, upper respiratory infection",
    keywords: ["losartan", "arb", "high blood pressure"],
    response: {
      en: "**Losartan** (ARB)\n\n**Uses:** High blood pressure, diabetic kidney disease\n**Available Doses:** 25mg-100mg\n**How to Take:** Take at the same time daily\n**Common Side Effects:** Dizziness, upper respiratory infection\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Losartan** (ARB)\n\n**उपयोग:** High blood pressure, diabetic kidney disease\n**उपलब्ध खुराक:** 25mg-100mg\n**सेवन विधि:** Take at the same time daily\n**सामान्य दुष्प्रभाव:** Dizziness, upper respiratory infection\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Acetaminophen",
    category: "Analgesic/Antipyretic",
    uses: "Pain relief, fever reduction",
    doses: "325mg-1000mg",
    instructions: "Do not exceed 3000mg/day. Avoid with liver disease.",
    sideEffects: "Rare at normal doses. Liver damage with overdose.",
    keywords: ["acetaminophen", "analgesic/antipyretic", "pain relief"],
    response: {
      en: "**Acetaminophen** (Analgesic/Antipyretic)\n\n**Uses:** Pain relief, fever reduction\n**Available Doses:** 325mg-1000mg\n**How to Take:** Do not exceed 3000mg/day. Avoid with liver disease.\n**Common Side Effects:** Rare at normal doses. Liver damage with overdose.\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Acetaminophen** (Analgesic/Antipyretic)\n\n**उपयोग:** Pain relief, fever reduction\n**उपलब्ध खुराक:** 325mg-1000mg\n**सेवन विधि:** Do not exceed 3000mg/day. Avoid with liver disease.\n**सामान्य दुष्प्रभाव:** Rare at normal doses. Liver damage with overdose.\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    uses: "Bacterial infections, respiratory infections",
    doses: "250mg-875mg",
    instructions: "Take every 8-12 hours. Complete full course.",
    sideEffects: "Diarrhea, rash, nausea",
    keywords: ["amoxicillin", "antibiotic", "bacterial infections"],
    response: {
      en: "**Amoxicillin** (Antibiotic)\n\n**Uses:** Bacterial infections, respiratory infections\n**Available Doses:** 250mg-875mg\n**How to Take:** Take every 8-12 hours. Complete full course.\n**Common Side Effects:** Diarrhea, rash, nausea\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Amoxicillin** (Antibiotic)\n\n**उपयोग:** Bacterial infections, respiratory infections\n**उपलब्ध खुराक:** 250mg-875mg\n**सेवन विधि:** Take every 8-12 hours. Complete full course.\n**सामान्य दुष्प्रभाव:** Diarrhea, rash, nausea\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Ciprofloxacin",
    category: "Antibiotic (Fluoroquinolone)",
    uses: "Urinary tract infections, bacterial infections",
    doses: "250mg-750mg",
    instructions: "Take with water. Avoid dairy products.",
    sideEffects: "Nausea, diarrhea, tendon pain",
    keywords: ["ciprofloxacin", "antibiotic (fluoroquinolone)", "urinary tract infections"],
    response: {
      en: "**Ciprofloxacin** (Antibiotic (Fluoroquinolone))\n\n**Uses:** Urinary tract infections, bacterial infections\n**Available Doses:** 250mg-750mg\n**How to Take:** Take with water. Avoid dairy products.\n**Common Side Effects:** Nausea, diarrhea, tendon pain\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Ciprofloxacin** (Antibiotic (Fluoroquinolone))\n\n**उपयोग:** Urinary tract infections, bacterial infections\n**उपलब्ध खुराक:** 250mg-750mg\n**सेवन विधि:** Take with water. Avoid dairy products.\n**सामान्य दुष्प्रभाव:** Nausea, diarrhea, tendon pain\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Ibuprofen",
    category: "NSAID",
    uses: "Pain, inflammation, fever",
    doses: "200mg-800mg",
    instructions: "Take with food. Do not exceed recommended dose.",
    sideEffects: "Stomach pain, ulcers, kidney problems",
    keywords: ["ibuprofen", "nsaid", "pain"],
    response: {
      en: "**Ibuprofen** (NSAID)\n\n**Uses:** Pain, inflammation, fever\n**Available Doses:** 200mg-800mg\n**How to Take:** Take with food. Do not exceed recommended dose.\n**Common Side Effects:** Stomach pain, ulcers, kidney problems\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Ibuprofen** (NSAID)\n\n**उपयोग:** Pain, inflammation, fever\n**उपलब्ध खुराक:** 200mg-800mg\n**सेवन विधि:** Take with food. Do not exceed recommended dose.\n**सामान्य दुष्प्रभाव:** Stomach pain, ulcers, kidney problems\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Pantoprazole",
    category: "Proton Pump Inhibitor",
    uses: "Acid reflux, GERD, esophagitis",
    doses: "20mg-40mg",
    instructions: "Take before meals",
    sideEffects: "Headache, diarrhea, stomach pain",
    keywords: ["pantoprazole", "proton pump inhibitor", "acid reflux"],
    response: {
      en: "**Pantoprazole** (Proton Pump Inhibitor)\n\n**Uses:** Acid reflux, GERD, esophagitis\n**Available Doses:** 20mg-40mg\n**How to Take:** Take before meals\n**Common Side Effects:** Headache, diarrhea, stomach pain\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Pantoprazole** (Proton Pump Inhibitor)\n\n**उपयोग:** Acid reflux, GERD, esophagitis\n**उपलब्ध खुराक:** 20mg-40mg\n**सेवन विधि:** Take before meals\n**सामान्य दुष्प्रभाव:** Headache, diarrhea, stomach pain\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Rosuvastatin",
    category: "Statin",
    uses: "High cholesterol, heart disease prevention",
    doses: "5mg-40mg",
    instructions: "Take at any time of day",
    sideEffects: "Muscle pain, headache, constipation",
    keywords: ["rosuvastatin", "statin", "high cholesterol"],
    response: {
      en: "**Rosuvastatin** (Statin)\n\n**Uses:** High cholesterol, heart disease prevention\n**Available Doses:** 5mg-40mg\n**How to Take:** Take at any time of day\n**Common Side Effects:** Muscle pain, headache, constipation\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Rosuvastatin** (Statin)\n\n**उपयोग:** High cholesterol, heart disease prevention\n**उपलब्ध खुराक:** 5mg-40mg\n**सेवन विधि:** Take at any time of day\n**सामान्य दुष्प्रभाव:** Muscle pain, headache, constipation\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Telmisartan",
    category: "ARB",
    uses: "High blood pressure, cardiovascular risk reduction",
    doses: "20mg-80mg",
    instructions: "Take at the same time daily",
    sideEffects: "Dizziness, back pain, sinus infection",
    keywords: ["telmisartan", "arb", "high blood pressure"],
    response: {
      en: "**Telmisartan** (ARB)\n\n**Uses:** High blood pressure, cardiovascular risk reduction\n**Available Doses:** 20mg-80mg\n**How to Take:** Take at the same time daily\n**Common Side Effects:** Dizziness, back pain, sinus infection\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Telmisartan** (ARB)\n\n**उपयोग:** High blood pressure, cardiovascular risk reduction\n**उपलब्ध खुराक:** 20mg-80mg\n**सेवन विधि:** Take at the same time daily\n**सामान्य दुष्प्रभाव:** Dizziness, back pain, sinus infection\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Azithromycin",
    category: "Antibiotic (Macrolide)",
    uses: "Respiratory infections, skin infections, STDs",
    doses: "250mg-500mg",
    instructions: "Take once daily. Complete full course.",
    sideEffects: "Diarrhea, nausea, stomach pain",
    keywords: ["azithromycin", "antibiotic (macrolide)", "respiratory infections"],
    response: {
      en: "**Azithromycin** (Antibiotic (Macrolide))\n\n**Uses:** Respiratory infections, skin infections, STDs\n**Available Doses:** 250mg-500mg\n**How to Take:** Take once daily. Complete full course.\n**Common Side Effects:** Diarrhea, nausea, stomach pain\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Azithromycin** (Antibiotic (Macrolide))\n\n**उपयोग:** Respiratory infections, skin infections, STDs\n**उपलब्ध खुराक:** 250mg-500mg\n**सेवन विधि:** Take once daily. Complete full course.\n**सामान्य दुष्प्रभाव:** Diarrhea, nausea, stomach pain\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
  {
    name: "Cetirizine",
    category: "Antihistamine",
    uses: "Allergies, urticaria, hay fever",
    doses: "5mg-10mg",
    instructions: "Take once daily. May cause drowsiness.",
    sideEffects: "Drowsiness, dry mouth, fatigue",
    keywords: ["cetirizine", "antihistamine", "allergies"],
    response: {
      en: "**Cetirizine** (Antihistamine)\n\n**Uses:** Allergies, urticaria, hay fever\n**Available Doses:** 5mg-10mg\n**How to Take:** Take once daily. May cause drowsiness.\n**Common Side Effects:** Drowsiness, dry mouth, fatigue\n\n⚠️ *Always take as prescribed. Consult your doctor before any changes.*",
      hi: "**Cetirizine** (Antihistamine)\n\n**उपयोग:** Allergies, urticaria, hay fever\n**उपलब्ध खुराक:** 5mg-10mg\n**सेवन विधि:** Take once daily. May cause drowsiness.\n**सामान्य दुष्प्रभाव:** Drowsiness, dry mouth, fatigue\n\n⚠️ *हमेशा डॉक्टर के पर्चे के अनुसार ही लें।*"
    }
  },
];

// ── Lab Test Knowledge (from MedOCR Dataset) ────────────────────────────
export const TRAINING_LAB_TESTS: LabTestKnowledge[] = [
  {
    name: "Hemoglobin",
    unit: "g/dL",
    normalRange: "13.5-17.5",
    description: "Measures oxygen-carrying protein in blood. Low = anemia.",
    keywords: ["hemoglobin", "hemoglobin", "lab", "test", "result", "report"],
    response: {
      en: "**Hemoglobin**\n\n**Unit:** g/dL\n**Normal Range:** 13.5-17.5\n\nMeasures oxygen-carrying protein in blood. Low = anemia.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Hemoglobin**\n\n**इकाई:** g/dL\n**सामान्य सीमा:** 13.5-17.5\n\nMeasures oxygen-carrying protein in blood. Low = anemia.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "WBC Count",
    unit: "10³/mm³",
    normalRange: "4-11",
    description: "White blood cell count. High = infection/inflammation.",
    keywords: ["wbc count", "wbccount", "lab", "test", "result", "report"],
    response: {
      en: "**WBC Count**\n\n**Unit:** 10³/mm³\n**Normal Range:** 4-11\n\nWhite blood cell count. High = infection/inflammation.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**WBC Count**\n\n**इकाई:** 10³/mm³\n**सामान्य सीमा:** 4-11\n\nWhite blood cell count. High = infection/inflammation.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Platelet Count",
    unit: "10³/mm³",
    normalRange: "150-450",
    description: "Blood clotting cells. Low = bleeding risk.",
    keywords: ["platelet count", "plateletcount", "lab", "test", "result", "report"],
    response: {
      en: "**Platelet Count**\n\n**Unit:** 10³/mm³\n**Normal Range:** 150-450\n\nBlood clotting cells. Low = bleeding risk.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Platelet Count**\n\n**इकाई:** 10³/mm³\n**सामान्य सीमा:** 150-450\n\nBlood clotting cells. Low = bleeding risk.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "RBC Count",
    unit: "Million/μL",
    normalRange: "4.5-5.5",
    description: "Red blood cell count.",
    keywords: ["rbc count", "rbccount", "lab", "test", "result", "report"],
    response: {
      en: "**RBC Count**\n\n**Unit:** Million/μL\n**Normal Range:** 4.5-5.5\n\nRed blood cell count.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**RBC Count**\n\n**इकाई:** Million/μL\n**सामान्य सीमा:** 4.5-5.5\n\nRed blood cell count.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Hematocrit",
    unit: "%",
    normalRange: "40-54",
    description: "Percentage of blood that is red blood cells.",
    keywords: ["hematocrit", "hematocrit", "lab", "test", "result", "report"],
    response: {
      en: "**Hematocrit**\n\n**Unit:** %\n**Normal Range:** 40-54\n\nPercentage of blood that is red blood cells.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Hematocrit**\n\n**इकाई:** %\n**सामान्य सीमा:** 40-54\n\nPercentage of blood that is red blood cells.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Blood Glucose (Fasting)",
    unit: "mg/dL",
    normalRange: "70-100",
    description: "Blood sugar level after fasting. High = diabetes risk.",
    keywords: ["blood glucose (fasting)", "bloodglucose(fasting)", "lab", "test", "result", "report"],
    response: {
      en: "**Blood Glucose (Fasting)**\n\n**Unit:** mg/dL\n**Normal Range:** 70-100\n\nBlood sugar level after fasting. High = diabetes risk.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Blood Glucose (Fasting)**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** 70-100\n\nBlood sugar level after fasting. High = diabetes risk.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "HbA1c",
    unit: "%",
    normalRange: "<5.7",
    description: "Average blood sugar over 3 months. 5.7-6.4 = prediabetes. >6.5 = diabetes.",
    keywords: ["hba1c", "hba1c", "lab", "test", "result", "report"],
    response: {
      en: "**HbA1c**\n\n**Unit:** %\n**Normal Range:** <5.7\n\nAverage blood sugar over 3 months. 5.7-6.4 = prediabetes. >6.5 = diabetes.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**HbA1c**\n\n**इकाई:** %\n**सामान्य सीमा:** <5.7\n\nAverage blood sugar over 3 months. 5.7-6.4 = prediabetes. >6.5 = diabetes.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "CRP (C-Reactive Protein)",
    unit: "mg/dL",
    normalRange: "<0.50",
    description: "Inflammation marker. High = infection/autoimmune.",
    keywords: ["crp (c-reactive protein)", "crp(c-reactiveprotein)", "lab", "test", "result", "report"],
    response: {
      en: "**CRP (C-Reactive Protein)**\n\n**Unit:** mg/dL\n**Normal Range:** <0.50\n\nInflammation marker. High = infection/autoimmune.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**CRP (C-Reactive Protein)**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** <0.50\n\nInflammation marker. High = infection/autoimmune.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "ESR",
    unit: "mm/hr",
    normalRange: "0-10",
    description: "Erythrocyte sedimentation rate. High = inflammation.",
    keywords: ["esr", "esr", "lab", "test", "result", "report"],
    response: {
      en: "**ESR**\n\n**Unit:** mm/hr\n**Normal Range:** 0-10\n\nErythrocyte sedimentation rate. High = inflammation.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**ESR**\n\n**इकाई:** mm/hr\n**सामान्य सीमा:** 0-10\n\nErythrocyte sedimentation rate. High = inflammation.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Creatinine",
    unit: "mg/dL",
    normalRange: "0.7-1.3",
    description: "Kidney function marker. High = kidney problem.",
    keywords: ["creatinine", "creatinine", "lab", "test", "result", "report"],
    response: {
      en: "**Creatinine**\n\n**Unit:** mg/dL\n**Normal Range:** 0.7-1.3\n\nKidney function marker. High = kidney problem.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Creatinine**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** 0.7-1.3\n\nKidney function marker. High = kidney problem.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Urea",
    unit: "mg/dL",
    normalRange: "15-40",
    description: "Kidney function and protein metabolism.",
    keywords: ["urea", "urea", "lab", "test", "result", "report"],
    response: {
      en: "**Urea**\n\n**Unit:** mg/dL\n**Normal Range:** 15-40\n\nKidney function and protein metabolism.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Urea**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** 15-40\n\nKidney function and protein metabolism.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Bilirubin (Total)",
    unit: "mg/dL",
    normalRange: "0.2-1.2",
    description: "Liver function. High = jaundice/liver disease.",
    keywords: ["bilirubin (total)", "bilirubin(total)", "lab", "test", "result", "report"],
    response: {
      en: "**Bilirubin (Total)**\n\n**Unit:** mg/dL\n**Normal Range:** 0.2-1.2\n\nLiver function. High = jaundice/liver disease.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Bilirubin (Total)**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** 0.2-1.2\n\nLiver function. High = jaundice/liver disease.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Cholesterol (Total)",
    unit: "mg/dL",
    normalRange: "<200",
    description: "Heart disease risk factor.",
    keywords: ["cholesterol (total)", "cholesterol(total)", "lab", "test", "result", "report"],
    response: {
      en: "**Cholesterol (Total)**\n\n**Unit:** mg/dL\n**Normal Range:** <200\n\nHeart disease risk factor.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Cholesterol (Total)**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** <200\n\nHeart disease risk factor.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "LDL Cholesterol",
    unit: "mg/dL",
    normalRange: "<100",
    description: "Bad cholesterol. High = heart disease risk.",
    keywords: ["ldl cholesterol", "ldlcholesterol", "lab", "test", "result", "report"],
    response: {
      en: "**LDL Cholesterol**\n\n**Unit:** mg/dL\n**Normal Range:** <100\n\nBad cholesterol. High = heart disease risk.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**LDL Cholesterol**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** <100\n\nBad cholesterol. High = heart disease risk.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "HDL Cholesterol",
    unit: "mg/dL",
    normalRange: ">40",
    description: "Good cholesterol. Low = heart disease risk.",
    keywords: ["hdl cholesterol", "hdlcholesterol", "lab", "test", "result", "report"],
    response: {
      en: "**HDL Cholesterol**\n\n**Unit:** mg/dL\n**Normal Range:** >40\n\nGood cholesterol. Low = heart disease risk.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**HDL Cholesterol**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** >40\n\nGood cholesterol. Low = heart disease risk.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Triglycerides",
    unit: "mg/dL",
    normalRange: "<150",
    description: "Blood fat levels. High = heart disease risk.",
    keywords: ["triglycerides", "triglycerides", "lab", "test", "result", "report"],
    response: {
      en: "**Triglycerides**\n\n**Unit:** mg/dL\n**Normal Range:** <150\n\nBlood fat levels. High = heart disease risk.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Triglycerides**\n\n**इकाई:** mg/dL\n**सामान्य सीमा:** <150\n\nBlood fat levels. High = heart disease risk.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "TSH",
    unit: "mIU/L",
    normalRange: "0.4-4.0",
    description: "Thyroid function. High = hypothyroidism.",
    keywords: ["tsh", "tsh", "lab", "test", "result", "report"],
    response: {
      en: "**TSH**\n\n**Unit:** mIU/L\n**Normal Range:** 0.4-4.0\n\nThyroid function. High = hypothyroidism.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**TSH**\n\n**इकाई:** mIU/L\n**सामान्य सीमा:** 0.4-4.0\n\nThyroid function. High = hypothyroidism.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Vitamin D",
    unit: "ng/mL",
    normalRange: "30-100",
    description: "Bone health. Low = deficiency, bone pain.",
    keywords: ["vitamin d", "vitamind", "lab", "test", "result", "report"],
    response: {
      en: "**Vitamin D**\n\n**Unit:** ng/mL\n**Normal Range:** 30-100\n\nBone health. Low = deficiency, bone pain.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Vitamin D**\n\n**इकाई:** ng/mL\n**सामान्य सीमा:** 30-100\n\nBone health. Low = deficiency, bone pain.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Vitamin B12",
    unit: "pg/mL",
    normalRange: "200-900",
    description: "Nerve function. Low = anemia, neuropathy.",
    keywords: ["vitamin b12", "vitaminb12", "lab", "test", "result", "report"],
    response: {
      en: "**Vitamin B12**\n\n**Unit:** pg/mL\n**Normal Range:** 200-900\n\nNerve function. Low = anemia, neuropathy.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Vitamin B12**\n\n**इकाई:** pg/mL\n**सामान्य सीमा:** 200-900\n\nNerve function. Low = anemia, neuropathy.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
  {
    name: "Iron",
    unit: "μg/dL",
    normalRange: "60-170",
    description: "Iron levels. Low = iron deficiency anemia.",
    keywords: ["iron", "iron", "lab", "test", "result", "report"],
    response: {
      en: "**Iron**\n\n**Unit:** μg/dL\n**Normal Range:** 60-170\n\nIron levels. Low = iron deficiency anemia.\n\n⚠️ *Lab values should be interpreted by your doctor in context of your overall health.*",
      hi: "**Iron**\n\n**इकाई:** μg/dL\n**सामान्य सीमा:** 60-170\n\nIron levels. Low = iron deficiency anemia.\n\n⚠️ *लैब मानों की व्याख्या आपके डॉक्टर द्वारा आपके समग्र स्वास्थ्य के संदर्भ में की जानी चाहिए।*"
    }
  },
];

// ── Doctor-Patient Conversation Patterns (from Indic Speech Dataset) ────
// Multi-language consultation patterns for common conditions
export const TRAINING_CONVERSATIONS: Record<string, Record<string, string>> = {
  // Fatigue & Headache consultation (all 10 Indian languages)
  "fatigue_headache": {
    en: "Patient reports fatigue for 2 weeks with frequent headaches, worse in evenings. Dizziness occasionally. Work stress high, poor sleep, skipped meals. Recommended: CBC blood test to check for anemia or vitamin deficiency. Advised regular meals, adequate hydration, and proper sleep.",
    hi: "रोगी 2 हफ्ते से थकान और बार-बार सिरदर्द की शिकायत। शाम को ज्यादा परेशानी। कभी-कभी चक्कर। काम का स्ट्रेस ज्यादा, नींद ठीक नहीं, खाना स्किप। सलाह: CBC ब्लड टेस्ट (एनीमिया/विटामिन कमी जांच), नियमित खाना, पानी ज्यादा पीना, पूरी नींद।",
    bn: "রোগী ২ সপ্তাহ ধরে ক্লান্তি ও ঘন ঘন মাথাব্যথার অভিযোগ। সন্ধ্যায় বেশি। মাঝে মাঝে ঘুরি। কাজের চাপ বেশি, ঘুম ঠিক নেই, খাওয়া ফেলে দিচ্ছে। পরামর্শ: CBC রক্ত পরীক্ষা, নিয়মিত খাবার, বেশি পানি, পর্যাপ্ত ঘুম।",
    ta: "நோயாளி 2 வாரமாக சோர்வு மற்றும் அடிக்கடி தலைவலி புகார். மாலை நேரத்தில் அதிகம். சில நேரம் மயக்கம். வேலை ஸ்ட்ரெஸ் அதிகம், தூக்கம் சரியில்லை, உணவு தவறியது. ஆலோசனை: CBC இரத்த பரிசோதனை, காலம் தவறாமல் உணவு, அதிக தண்ணீர், போதுமான தூக்கம்।",
    te: "రోగి 2 వారాలుగా అలసట మరియు తరచుగా తలనొప్పి ఫిర్యాదు. సాయంత్రం ఎక్కువ. కొన్నిసార్లు తిరగడం. పని ఒత్తిడి ఎక్కువ, నిద్ర సరిగ్గా లేదు, ఆహారం మానేశారు. సలహా: CBC రక్త పరీక్ష, క్రమం తప్పకుండా ఆహారం, ఎక్కువ నీరు, తగినంత నిద్ర।",
    mr: "रुग्णाला 2 आठवड्यांपासून थकवा आणि वारंवार डोकेदुखणाची तक्रार. संध्याकाळी जास्त. कधी कधी चक्कर येतात. कामाचा तणाव जास्त, झोप ठीक नाही, जेवण वगळले. सल्ला: CBC रक्त चाचणी (अॅनिमिया/व्हिटॅमिन कमतरता तपास), नियमित जेवण, जास्त पाणी, पुरेसी झोप।",
    gu: "દર્દીને 2 અઠવાડિયાથી થાક અને વારંવાર માથાનો દુખાવો. સાંજે વધુ. ક્યારેક ચક્કર. કામનો તાણ વધુ, ઊંઘ યોગ્ય નથી, ખોરાક છોડ્યો. સલાહ: CBC લોહી પરીક્ષા, નિયમિત ખોરાક, વધુ પાણી, પૂરતી ઊંઘ।",
    kn: "ರೋಗಿ 2 ವಾರಗಳಿಂದ ಆಯಾಸ ಮತ್ತು ಆಗಾಗ್ಗೆ ತಲೆನೋವು. ಸಂಜೆ ಹೆಚ್ಚು. ಕೆಲವೊಮ್ಮೆ ತಿರುಗುವಿಕೆ. ಕೆಲಸದ ಒತ್ತಡ ಹೆಚ್ಚು, ನಿದ್ರೆ ಸರಿಯಿಲ್ಲ, ಊಟ ಬಿಟ್ಟಿದ್ದಾರೆ. ಸಲಹೆ: CBC ರಕ್ತ ಪರೀಕ್ಷೆ, ನಿಯಮಿತ ಊಟ, ಹೆಚ್ಚು ನೀರು, ಸಾಕಷ್ಟು ನಿದ್ರೆ।",
    ml: "രോഗി 2 ആഴ്ചയായി ക്ഷീണവും ഇടയ്ക്കിടെ തലവേദനയും. വൈകുന്നേരം കൂടുതൽ. ചിലപ്പോൾ തലചുറ്റൽ. ജോലി സമ്മർദം കൂടുതൽ, ഉറക്കം ശരിയല്ല, ഭക്ഷണം ഒഴിവാക്കി. ഉപദേശം: CBC രക്ത പരിശോധന, കൃത്യമായ ഭക്ഷണം, കൂടുതൽ വെള്ളം, മതിയായ ഉറക്കം।",
    pa: "ਮਰੀਜ਼ ਨੂੰ 2 ਹਫ਼ਤੇ ਤੋਂ ਥਕਾਵਟ ਅਤੇ ਵਾਰ-ਵਾਰ ਸਿਰਦਰਦ। ਸ਼ਾਮ ਨੂੰ ਵੱਧ। ਕਦੇ-ਕਦੇ ਚੱਕਰ। ਕੰਮ ਦਾ ਤਣਾਵ ਵੱਧ, ਨੀਂਦ ਠੀਕ ਨਹੀਂ, ਖਾਣਾ ਛੱਡਿਆ। ਸਲਾਹ: CBC ਖੂਨ ਦੀ ਜਾਂਚ, ਨਿਯਮਤ ਖਾਣਾ, ਵੱਧ ਪਾਣੀ, ਪੂਰੀ ਨੀਂਦ।",
    or: "ରୋଗୀ 2 ସପ୍ତାହ ହେଲା ଥକାନ ଏବଂ ବାରମ୍ବାର ମୁଣ୍ଡବିନ୍ଦା। ସନ୍ଧ୍ୟାରେ ଅଧିକ। କେତେବେଳେ ଘୁରି। କାମର ଚାପ ଅଧିକ, ନିଦ୍ରା ଠିକ୍ ନାହିଁ, ଖାଦ୍ୟ ଛାଡ଼ିଛନ୍ତି। ପରାମର୍ଶ: CBC ରକ୍ତ ପରୀକ୍ଷା, ନିୟମିତ ଖାଦ୍ୟ, ଅଧିକ ପାଣି, ପର୍ଯ୍ୟାପ୍ତ ନିଦ୍ରା।",
  },
  // Fever consultation
  "fever": {
    en: "For fever management: Rest, hydrate (water, ORS), monitor temperature every 2-4 hours. Take paracetamol (500-650mg) if temp exceeds 100.4°F. Seek care if fever >103°F, lasts >3 days, or has severe headache/stiff neck/breathing difficulty.",
    hi: "बुखार प्रबंधन: आराम करें, पानी/ORS पिएं, हर 2-4 घंटे तापमान जांचें। 100.4°F से ज्यादा हो तो पैरासिटामोल (500-650mg) लें। तुरंत डॉक्टर से मिलें: बुखार >103°F, 3 दिन से ज्यादा, तेज सिरदर्द, गर्दन अकड़ना, सांस लेने में तकलीफ।",
  },
};

// ── Helper function to search training knowledge ────────────────────────
export function searchTrainingMedications(query: string): MedicationKnowledge | null {
  const lower = query.toLowerCase();
  let bestMatch: MedicationKnowledge | null = null;
  let bestScore = 0;
  
  for (const med of TRAINING_MEDICATIONS) {
    let score = 0;
    for (const kw of med.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (lower.includes(med.name.toLowerCase())) score += med.name.length * 2;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = med;
    }
  }
  return bestScore > 2 ? bestMatch : null;
}

export function searchTrainingLabTests(query: string): LabTestKnowledge | null {
  const lower = query.toLowerCase();
  let bestMatch: LabTestKnowledge | null = null;
  let bestScore = 0;
  
  for (const lab of TRAINING_LAB_TESTS) {
    let score = 0;
    for (const kw of lab.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = lab;
    }
  }
  return bestScore > 2 ? bestMatch : null;
}

export function getTrainingConversation(topic: string, language: string): string | null {
  const conv = TRAINING_CONVERSATIONS[topic];
  if (!conv) return null;
  return conv[language] || conv["en"] || null;
}
