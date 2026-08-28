/**
 * MediKiosk Clinical Knowledge Service
 *
 * Uses free, publicly available medical data sources:
 * - RxNorm (NLM) — drug names, CUI codes, interactions
 * - OpenFDA — drug labels, adverse events, warnings
 * - WHO ICD-10 — disease classification codes
 * - Built-in lab reference ranges for common Indian OPD tests
 */

import { logger } from "./logger";

// ─── Lab Reference Ranges (Indian clinical standards) ────────────────────────

export interface LabReferenceRange {
  testName: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  criticalLow?: number;
  criticalHigh?: number;
  category: string;
}

export const LAB_REFERENCE_RANGES: LabReferenceRange[] = [
  // Haematology
  { testName: "Haemoglobin", unit: "g/dL", normalMin: 12, normalMax: 16, criticalLow: 7, criticalHigh: 20, category: "Haematology" },
  { testName: "Hemoglobin", unit: "g/dL", normalMin: 12, normalMax: 16, criticalLow: 7, criticalHigh: 20, category: "Haematology" },
  { testName: "WBC", unit: "/cmm", normalMin: 4000, normalMax: 11000, criticalLow: 1500, criticalHigh: 30000, category: "Haematology" },
  { testName: "White Blood Cell Count", unit: "/cmm", normalMin: 4000, normalMax: 11000, criticalLow: 1500, criticalHigh: 30000, category: "Haematology" },
  { testName: "Platelets", unit: "/cmm", normalMin: 150000, normalMax: 400000, criticalLow: 50000, criticalHigh: 800000, category: "Haematology" },
  { testName: "Platelet Count", unit: "/cmm", normalMin: 150000, normalMax: 400000, criticalLow: 50000, criticalHigh: 800000, category: "Haematology" },
  { testName: "RBC", unit: "million/cmm", normalMin: 4.5, normalMax: 5.5, criticalLow: 2.5, criticalHigh: 8, category: "Haematology" },
  { testName: "Haematocrit", unit: "%", normalMin: 36, normalMax: 46, criticalLow: 20, criticalHigh: 60, category: "Haematology" },
  { testName: "ESR", unit: "mm/hr", normalMin: 0, normalMax: 20, criticalHigh: 100, category: "Haematology" },
  { testName: "MCV", unit: "fL", normalMin: 80, normalMax: 100, category: "Haematology" },
  { testName: "MCH", unit: "pg", normalMin: 27, normalMax: 31, category: "Haematology" },
  { testName: "MCHC", unit: "g/dL", normalMin: 32, normalMax: 36, category: "Haematology" },

  // Blood Glucose
  { testName: "Fasting Blood Sugar", unit: "mg/dL", normalMin: 70, normalMax: 100, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "FBS", unit: "mg/dL", normalMin: 70, normalMax: 100, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "Random Blood Sugar", unit: "mg/dL", normalMin: 70, normalMax: 140, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "RBS", unit: "mg/dL", normalMin: 70, normalMax: 140, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "Post Prandial Blood Sugar", unit: "mg/dL", normalMin: 70, normalMax: 140, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "PPBS", unit: "mg/dL", normalMin: 70, normalMax: 140, criticalLow: 40, criticalHigh: 500, category: "Metabolic" },
  { testName: "HbA1c", unit: "%", normalMin: 4, normalMax: 5.7, criticalHigh: 12, category: "Metabolic" },
  { testName: "HbA1C", unit: "%", normalMin: 4, normalMax: 5.7, criticalHigh: 12, category: "Metabolic" },

  // Lipid Profile
  { testName: "Total Cholesterol", unit: "mg/dL", normalMin: 0, normalMax: 200, criticalHigh: 300, category: "Lipid" },
  { testName: "HDL Cholesterol", unit: "mg/dL", normalMin: 40, normalMax: 60, criticalLow: 20, category: "Lipid" },
  { testName: "LDL Cholesterol", unit: "mg/dL", normalMin: 0, normalMax: 100, criticalHigh: 190, category: "Lipid" },
  { testName: "VLDL", unit: "mg/dL", normalMin: 0, normalMax: 30, criticalHigh: 60, category: "Lipid" },
  { testName: "Triglycerides", unit: "mg/dL", normalMin: 0, normalMax: 150, criticalHigh: 500, category: "Lipid" },
  { testName: "Serum Cholesterol", unit: "mg/dL", normalMin: 0, normalMax: 200, criticalHigh: 300, category: "Lipid" },

  // Liver Function
  { testName: "SGOT", unit: "U/L", normalMin: 5, normalMax: 40, criticalHigh: 200, category: "Liver" },
  { testName: "SGPT", unit: "U/L", normalMin: 5, normalMax: 40, criticalHigh: 200, category: "Liver" },
  { testName: "ALT", unit: "U/L", normalMin: 5, normalMax: 40, criticalHigh: 200, category: "Liver" },
  { testName: "AST", unit: "U/L", normalMin: 5, normalMax: 40, criticalHigh: 200, category: "Liver" },
  { testName: "ALP", unit: "U/L", normalMin: 44, normalMax: 147, criticalHigh: 500, category: "Liver" },
  { testName: "Bilirubin Total", unit: "mg/dL", normalMin: 0.1, normalMax: 1.2, criticalHigh: 10, category: "Liver" },
  { testName: "Direct Bilirubin", unit: "mg/dL", normalMin: 0, normalMax: 0.3, criticalHigh: 5, category: "Liver" },
  { testName: "Albumin", unit: "g/dL", normalMin: 3.5, normalMax: 5.0, criticalLow: 2.0, category: "Liver" },
  { testName: "Total Protein", unit: "g/dL", normalMin: 6.0, normalMax: 8.3, criticalLow: 4.0, criticalHigh: 12, category: "Liver" },

  // Kidney Function
  { testName: "Serum Creatinine", unit: "mg/dL", normalMin: 0.6, normalMax: 1.2, criticalHigh: 8, category: "Kidney" },
  { testName: "Blood Urea Nitrogen", unit: "mg/dL", normalMin: 7, normalMax: 20, criticalHigh: 100, category: "Kidney" },
  { testName: "BUN", unit: "mg/dL", normalMin: 7, normalMax: 20, criticalHigh: 100, category: "Kidney" },
  { testName: "Urea", unit: "mg/dL", normalMin: 15, normalMax: 40, criticalHigh: 150, category: "Kidney" },
  { testName: "Serum Uric Acid", unit: "mg/dL", normalMin: 3.5, normalMax: 7.0, criticalHigh: 12, category: "Kidney" },
  { testName: "Sodium", unit: "mEq/L", normalMin: 136, normalMax: 145, criticalLow: 120, criticalHigh: 160, category: "Electrolytes" },
  { testName: "Potassium", unit: "mEq/L", normalMin: 3.5, normalMax: 5.0, criticalLow: 2.5, criticalHigh: 6.5, category: "Electrolytes" },
  { testName: "Chloride", unit: "mEq/L", normalMin: 96, normalMax: 106, criticalLow: 80, criticalHigh: 120, category: "Electrolytes" },
  { testName: "Calcium", unit: "mg/dL", normalMin: 8.5, normalMax: 10.5, criticalLow: 6.0, criticalHigh: 14, category: "Electrolytes" },
  { testName: "Phosphorus", unit: "mg/dL", normalMin: 2.5, normalMax: 4.5, criticalLow: 1.0, criticalHigh: 8, category: "Electrolytes" },

  // Thyroid
  { testName: "TSH", unit: "mIU/L", normalMin: 0.4, normalMax: 4.0, criticalHigh: 20, category: "Thyroid" },
  { testName: "Free T3", unit: "pg/mL", normalMin: 2.3, normalMax: 4.2, category: "Thyroid" },
  { testName: "Free T4", unit: "ng/dL", normalMin: 0.9, normalMax: 1.7, category: "Thyroid" },
  { testName: "T3", unit: "ng/dL", normalMin: 80, normalMax: 200, category: "Thyroid" },
  { testName: "T4", unit: "ug/dL", normalMin: 5.1, normalMax: 14.1, category: "Thyroid" },

  // Cardiac
  { testName: "Troponin I", unit: "ng/mL", normalMin: 0, normalMax: 0.04, criticalHigh: 1.0, category: "Cardiac" },
  { testName: "CK-MB", unit: "U/L", normalMin: 0, normalMax: 24, criticalHigh: 100, category: "Cardiac" },
  { testName: "BNP", unit: "pg/mL", normalMin: 0, normalMax: 100, criticalHigh: 1000, category: "Cardiac" },
  { testName: "CRP", unit: "mg/L", normalMin: 0, normalMax: 3, criticalHigh: 50, category: "Inflammation" },
  { testName: "hs-CRP", unit: "mg/L", normalMin: 0, normalMax: 1, criticalHigh: 10, category: "Inflammation" },

  // Urine
  { testName: "Urine Sugar", unit: "", normalMin: 0, normalMax: 0, criticalHigh: 4, category: "Urine" },
  { testName: "Urine Albumin", unit: "", normalMin: 0, normalMax: 0, criticalHigh: 3, category: "Urine" },
];

// ─── ICD-10 Code Mapping for Common Chief Complaints ─────────────────────────

export interface IcdMapping {
  code: string;
  description: string;
  differentialDiagnoses: string[];
  urgencyLevel: "emergency" | "urgent" | "routine";
}

export const ICD10_MAPPINGS: Record<string, IcdMapping> = {
  chest_pain: {
    code: "R07.9",
    description: "Chest pain, unspecified",
    differentialDiagnoses: [
      "Acute Myocardial Infarction (I21.9)",
      "Unstable Angina (I20.0)",
      "Pulmonary Embolism (I26.9)",
      "Pneumothorax (J93.9)",
      "GERD (K21.0)",
      "Costochondritis (M94.4)",
      "Panic Disorder (F41.0)",
    ],
    urgencyLevel: "emergency",
  },
  breathlessness: {
    code: "R06.02",
    description: "Shortness of breath",
    differentialDiagnoses: [
      "Acute Asthma (J45.901)",
      "COPD Exacerbation (J44.1)",
      "Congestive Heart Failure (I50.9)",
      "Pneumonia (J18.9)",
      "Pulmonary Embolism (I26.9)",
      "Anemia (D64.9)",
      "Anxiety Disorder (F41.1)",
    ],
    urgencyLevel: "urgent",
  },
  headache: {
    code: "R51.9",
    description: "Headache, unspecified",
    differentialDiagnoses: [
      "Migraine without Aura (G43.009)",
      "Tension-type Headache (G44.209)",
      "Cluster Headache (G44.009)",
      "Subarachnoid Hemorrhage (I60.9)",
      "Meningitis (G03.9)",
      "Hypertensive Crisis (I16.9)",
      "Sinusitis (J01.90)",
    ],
    urgencyLevel: "urgent",
  },
  abdominal_pain: {
    code: "R10.9",
    description: "Abdominal pain, unspecified",
    differentialDiagnoses: [
      "Acute Appendicitis (K35.80)",
      "Cholecystitis (K81.0)",
      "Peptic Ulcer Disease (K27.9)",
      "Acute Pancreatitis (K85.9)",
      "Renal Colic (N23)",
      "Mesenteric Ischemia (K55.069)",
      "Bowel Obstruction (K56.699)",
    ],
    urgencyLevel: "urgent",
  },
  joint_pain: {
    code: "M25.50",
    description: "Pain in unspecified joint",
    differentialDiagnoses: [
      "Osteoarthritis (M19.90)",
      "Rheumatoid Arthritis (M06.9)",
      "Gout (M10.9)",
      "Septic Arthritis (M00.9)",
      "Psoriatic Arthritis (M07.3)",
      "Fibromyalgia (M79.7)",
    ],
    urgencyLevel: "routine",
  },
  fever: {
    code: "R50.9",
    description: "Fever, unspecified",
    differentialDiagnoses: [
      "Upper Respiratory Infection (J06.9)",
      "Urinary Tract Infection (N39.0)",
      "Pneumonia (J18.9)",
      "Malaria (B54)",
      "Dengue (A90)",
      "Typhoid Fever (A01.00)",
      "Tuberculosis (A16.9)",
    ],
    urgencyLevel: "urgent",
  },
  fatigue: {
    code: "R53.83",
    description: "Other fatigue",
    differentialDiagnoses: [
      "Hypothyroidism (E03.9)",
      "Anemia (D64.9)",
      "Diabetes Mellitus (E11.9)",
      "Depression (F32.9)",
      "Chronic Fatigue Syndrome (R53.82)",
      "Sleep Apnea (G47.33)",
    ],
    urgencyLevel: "routine",
  },
  cough: {
    code: "R05.9",
    description: "Cough, unspecified",
    differentialDiagnoses: [
      "Acute Bronchitis (J20.9)",
      "Pneumonia (J18.9)",
      "Asthma (J45.909)",
      "COPD (J44.1)",
      "GERD (K21.0)",
      "Post-nasal Drip (J00)",
      "Tuberculosis (A16.9)",
    ],
    urgencyLevel: "routine",
  },
  dizziness: {
    code: "R42",
    description: "Dizziness and giddiness",
    differentialDiagnoses: [
      "Benign Paroxysmal Positional Vertigo (H81.10)",
      "Vestibular Neuritis (H81.2)",
      "Orthostatic Hypotension (I95.1)",
      "Anemia (D64.9)",
      "Hypoglycemia (E16.2)",
      "Stroke (I63.9)",
    ],
    urgencyLevel: "urgent",
  },
  skin_issues: {
    code: "R21",
    description: "Rash and other nonspecific skin eruption",
    differentialDiagnoses: [
      "Allergic Dermatitis (L25.9)",
      "Eczema (L20.9)",
      "Psoriasis (L40.0)",
      "Urticaria (L50.9)",
      "Fungal Infection (B36.9)",
      "Drug Eruption (L27.0)",
    ],
    urgencyLevel: "routine",
  },
  mood_changes: {
    code: "R45.851",
    description: "Emotional lability",
    differentialDiagnoses: [
      "Major Depressive Disorder (F32.9)",
      "Generalized Anxiety Disorder (F41.1)",
      "Bipolar Disorder (F31.9)",
      "Hypothyroidism (E03.9)",
      "Medication Side Effect (T88.7)",
      "Sleep Disorder (G47.9)",
    ],
    urgencyLevel: "routine",
  },
  digestive_issues: {
    code: "K92.9",
    description: "Disease of digestive system, unspecified",
    differentialDiagnoses: [
      "GERD (K21.0)",
      "Irritable Bowel Syndrome (K58.9)",
      "Peptic Ulcer (K27.9)",
      "Gastritis (K29.70)",
      "Lactose Intolerance (E73.9)",
      "Celiac Disease (K90.0)",
    ],
    urgencyLevel: "routine",
  },
};

// ─── Drug Interaction Database (Common Indian Medications) ───────────────────

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "major" | "moderate" | "minor";
  description: string;
  clinicalEffect: string;
  recommendation: string;
}

export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    drug1: "metformin", drug2: "contrast dye",
    severity: "major",
    description: "Metformin and iodinated contrast media",
    clinicalEffect: "Risk of lactic acidosis due to contrast-induced nephropathy",
    recommendation: "Stop metformin 48 hours before and after contrast procedure",
  },
  {
    drug1: "warfarin", drug2: "aspirin",
    severity: "major",
    description: "Warfarin + Aspirin combination",
    clinicalEffect: "Significantly increased risk of bleeding",
    recommendation: "Avoid combination unless specifically indicated; monitor INR closely",
  },
  {
    drug1: "lisinopril", drug2: "potassium",
    severity: "major",
    description: "ACE Inhibitor + Potassium supplement",
    clinicalEffect: "Risk of hyperkalemia",
    recommendation: "Monitor serum potassium regularly; avoid potassium supplements unless deficient",
  },
  {
    drug1: "amlodipine", drug2: "simvastatin",
    severity: "moderate",
    description: "Amlodipine increases simvastatin levels",
    clinicalEffect: "Increased risk of rhabdomyolysis",
    recommendation: "Limit simvastatin dose to 20mg/day when used with amlodipine",
  },
  {
    drug1: "metformin", drug2: "alcohol",
    severity: "major",
    description: "Metformin + Alcohol",
    clinicalEffect: "Increased risk of lactic acidosis and hypoglycemia",
    recommendation: "Limit alcohol intake; avoid binge drinking",
  },
  {
    drug1: "aspirin", drug2: "ibuprofen",
    severity: "moderate",
    description: "Aspirin + NSAID combination",
    clinicalEffect: "NSAID may reduce cardioprotective effect of aspirin; increased GI bleeding risk",
    recommendation: "Take aspirin 30 min before ibuprofen if both needed; consider paracetamol instead",
  },
  {
    drug1: "levothyroxine", drug2: "calcium",
    severity: "moderate",
    description: "Levothyroxine + Calcium supplements",
    clinicalEffect: "Calcium reduces absorption of levothyroxine",
    recommendation: "Take levothyroxine at least 4 hours before or after calcium",
  },
  {
    drug1: "levothyroxine", drug2: "iron",
    severity: "moderate",
    description: "Levothyroxine + Iron supplements",
    clinicalEffect: "Iron reduces absorption of levothyroxine",
    recommendation: "Take levothyroxine at least 4 hours before or after iron",
  },
  {
    drug1: "atorvastatin", drug2: "grapefruit",
    severity: "moderate",
    description: "Atorvastatin + Grapefruit juice",
    clinicalEffect: "Grapefruit increases statin levels, increasing side effect risk",
    recommendation: "Avoid grapefruit or limit to small amounts",
  },
  {
    drug1: "paracetamol", drug2: "alcohol",
    severity: "moderate",
    description: "Paracetamol + regular alcohol use",
    clinicalEffect: "Increased risk of hepatotoxicity",
    recommendation: "Avoid regular paracetamol with heavy alcohol use; consider alternatives",
  },
  {
    drug1: "metoprolol", drug2: "verapamil",
    severity: "major",
    description: "Beta-blocker + Calcium channel blocker combination",
    clinicalEffect: "Risk of severe bradycardia, heart block, and hypotension",
    recommendation: "Avoid combination; monitor heart rate and ECG if unavoidable",
  },
  {
    drug1: "clopidogrel", drug2: "omeprazole",
    severity: "moderate",
    description: "Clopidogrel + Proton pump inhibitor",
    clinicalEffect: "Omeprazole reduces effectiveness of clopidogrel",
    recommendation: "Use pantoprazole instead if PPI needed with clopidogrel",
  },
];

// ─── Drug Brand Name Mapping (Common Indian Brands) ─────────────────────────

export const INDIAN_DRUG_BRANDS: Record<string, { genericName: string; category: string; commonDosages: string[] }> = {
  "metformin": { genericName: "Metformin", category: "Antidiabetic", commonDosages: ["500mg", "850mg", "1000mg"] },
  "glycomet": { genericName: "Metformin", category: "Antidiabetic", commonDosages: ["500mg", "850mg", "1000mg"] },
  "gluconorm": { genericName: "Metformin", category: "Antidiabetic", commonDosages: ["500mg", "850mg"] },
  "amlodipine": { genericName: "Amlodipine", category: "Antihypertensive (CCB)", commonDosages: ["2.5mg", "5mg", "10mg"] },
  "amlo": { genericName: "Amlodipine", category: "Antihypertensive (CCB)", commonDosages: ["5mg", "10mg"] },
  "aten": { genericName: "Atenolol", category: "Antihypertensive (Beta-blocker)", commonDosages: ["25mg", "50mg", "100mg"] },
  "atenolol": { genericName: "Atenolol", category: "Antihypertensive (Beta-blocker)", commonDosages: ["25mg", "50mg", "100mg"] },
  "losartan": { genericName: "Losartan", category: "Antihypertensive (ARB)", commonDosages: ["25mg", "50mg", "100mg"] },
  "losartan-h": { genericName: "Losartan + Hydrochlorothiazide", category: "Antihypertensive", commonDosages: ["50/12.5mg", "100/12.5mg"] },
  "atorvastatin": { genericName: "Atorvastatin", category: "Statin (Lipid-lowering)", commonDosages: ["10mg", "20mg", "40mg"] },
  "atorva": { genericName: "Atorvastatin", category: "Statin (Lipid-lowering)", commonDosages: ["10mg", "20mg", "40mg"] },
  "rosuvastatin": { genericName: "Rosuvastatin", category: "Statin (Lipid-lowering)", commonDosages: ["5mg", "10mg", "20mg"] },
  "asp": { genericName: "Aspirin", category: "Antiplatelet", commonDosages: ["75mg", "150mg", "325mg"] },
  "ecosprin": { genericName: "Aspirin", category: "Antiplatelet", commonDosages: ["75mg", "150mg"] },
  "clopidogrel": { genericName: "Clopidogrel", category: "Antiplatelet", commonDosages: ["75mg"] },
  "plavix": { genericName: "Clopidogrel", category: "Antiplatelet", commonDosages: ["75mg"] },
  "omeprazole": { genericName: "Omeprazole", category: "Proton Pump Inhibitor", commonDosages: ["20mg", "40mg"] },
  "pantoprazole": { genericName: "Pantoprazole", category: "Proton Pump Inhibitor", commonDosages: ["20mg", "40mg"] },
  "pantop-d": { genericName: "Pantoprazole + Domperidone", category: "PPI + Prokinetic", commonDosages: ["40/30mg"] },
  "pan-d": { genericName: "Pantoprazole + Domperidone", category: "PPI + Prokinetic", commonDosages: ["40/30mg"] },
  "paracetamol": { genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg", "650mg", "1g"] },
  "crocin": { genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg", "650mg"] },
  "dolo": { genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg", "650mg"] },
  "ibuprofen": { genericName: "Ibuprofen", category: "NSAID", commonDosages: ["200mg", "400mg", "600mg"] },
  "brufen": { genericName: "Ibuprofen", category: "NSAID", commonDosages: ["200mg", "400mg", "600mg"] },
  "combiflam": { genericName: "Ibuprofen + Paracetamol", category: "NSAID + Analgesic", commonDosages: ["400/325mg"] },
  "azithromycin": { genericName: "Azithromycin", category: "Antibiotic (Macrolide)", commonDosages: ["250mg", "500mg"] },
  "azee": { genericName: "Azithromycin", category: "Antibiotic (Macrolide)", commonDosages: ["250mg", "500mg"] },
  "amoxicillin": { genericName: "Amoxicillin", category: "Antibiotic (Penicillin)", commonDosages: ["250mg", "500mg"] },
  "amoxicillin-clavulanate": { genericName: "Amoxicillin + Clavulanic Acid", category: "Antibiotic", commonDosages: ["625mg", "1g"] },
  "augmentin": { genericName: "Amoxicillin + Clavulanic Acid", category: "Antibiotic", commonDosages: ["625mg", "1g"] },
  "levocetirizine": { genericName: "Levocetirizine", category: "Antihistamine", commonDosages: ["5mg"] },
  "cetirizine": { genericName: "Cetirizine", category: "Antihistamine", commonDosages: ["10mg"] },
  "montelukast": { genericName: "Montelukast", category: "Leukotriene Antagonist", commonDosages: ["4mg", "5mg", "10mg"] },
  "montair": { genericName: "Montelukast", category: "Leukotriene Antagonist", commonDosages: ["4mg", "5mg", "10mg"] },
  "salbutamol": { genericName: "Salbutamol", category: "Bronchodilator (SABA)", commonDosages: ["2mg", "4mg", "inhaler"] },
  "combihale": { genericName: "Formoterol + Budesonide", category: "Combination Inhaler", commonDosages: ["6/200mcg", "6/400mcg"] },
  "seroflo": { genericName: "Salmeterol + Fluticasone", category: "Combination Inhaler", commonDosages: ["25/50mcg", "25/125mcg", "25/250mcg"] },
  "thyronorm": { genericName: "Levothyroxine", category: "Thyroid Hormone", commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg"] },
  "levothyroxine": { genericName: "Levothyroxine", category: "Thyroid Hormone", commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg"] },
  "insulin": { genericName: "Insulin", category: "Antidiabetic (Insulin)", commonDosages: ["10 IU", "20 IU", "40 IU", "100 IU"] },
  "glibenclamide": { genericName: "Glibenclamide", category: "Antidiabetic (Sulfonylurea)", commonDosages: ["2.5mg", "5mg"] },
  "glimepiride": { genericName: "Glimepiride", category: "Antidiabetic (Sulfonylurea)", commonDosages: ["1mg", "2mg", "4mg"] },
  "gluconorm-g": { genericName: "Glimepiride + Metformin", category: "Antidiabetic Combination", commonDosages: ["1/500mg", "2/500mg"] },
  "telmisartan": { genericName: "Telmisartan", category: "Antihypertensive (ARB)", commonDosages: ["20mg", "40mg", "80mg"] },
  "telma": { genericName: "Telmisartan", category: "Antihypertensive (ARB)", commonDosages: ["40mg", "80mg"] },
  "carvedilol": { genericName: "Carvedilol", category: "Antihypertensive (Beta-blocker)", commonDosages: ["3.125mg", "6.25mg", "12.5mg", "25mg"] },
  "olmesartan": { genericName: "Olmesartan", category: "Antihypertensive (ARB)", commonDosages: ["20mg", "40mg"] },
  "telmikind": { genericName: "Telmisartan", category: "Antihypertensive (ARB)", commonDosages: ["40mg", "80mg"] },
};

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Check for drug interactions given a list of medications
 */
export function checkDrugInteractions(medications: string[]): DrugInteraction[] {
  const found: DrugInteraction[] = [];
  const normalized = medications.map((m) => m.toLowerCase().trim());

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const med1 = normalized[i];
      const med2 = normalized[j];

      for (const interaction of DRUG_INTERACTIONS) {
        if (
          (med1.includes(interaction.drug1) && med2.includes(interaction.drug2)) ||
          (med1.includes(interaction.drug2) && med2.includes(interaction.drug1))
        ) {
          found.push(interaction);
        }
      }
    }
  }

  return found;
}

/**
 * Get ICD-10 mapping for a chief complaint
 */
export function getIcd10Mapping(complaintId: string): IcdMapping | null {
  return ICD10_MAPPINGS[complaintId] || null;
}

/**
 * Analyze a lab value against reference ranges
 */
export function analyzeLabValue(testName: string, value: number): {
  testName: string;
  value: number;
  status: "normal" | "borderline_high" | "borderline_low" | "high" | "low" | "critical_high" | "critical_low" | "unknown";
  referenceRange: string;
  category: string;
  clinicalNote: string;
} {
  // Find matching reference range (case-insensitive, partial match)
  const normalizedName = testName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const match = LAB_REFERENCE_RANGES.find((r) => {
    const refName = r.testName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return refName === normalizedName || refName.includes(normalizedName) || normalizedName.includes(refName);
  });

  if (!match) {
    return {
      testName,
      value,
      status: "unknown",
      referenceRange: "No reference range available",
      category: "Unknown",
      clinicalNote: "Reference range not available for this test.",
    };
  }

  let status: "normal" | "borderline_high" | "borderline_low" | "high" | "low" | "critical_high" | "critical_low" | "unknown" = "normal";
  let clinicalNote = "Value within normal range.";

  if (match.criticalHigh && value > match.criticalHigh) {
    status = "critical_high";
    clinicalNote = `⚠ CRITICAL: ${testName} is critically elevated (${value} ${match.unit}). Requires immediate attention.`;
  } else if (match.criticalLow && value < match.criticalLow) {
    status = "critical_low";
    clinicalNote = `⚠ CRITICAL: ${testName} is critically low (${value} ${match.unit}). Requires immediate attention.`;
  } else if (value > match.normalMax) {
    const margin = ((value - match.normalMax) / match.normalMax) * 100;
    if (margin > 50) {
      status = "high";
      clinicalNote = `${testName} is significantly elevated (${value} ${match.unit}, normal: ${match.normalMin}-${match.normalMax} ${match.unit}).`;
    } else {
      status = "borderline_high";
      clinicalNote = `${testName} is borderline high (${value} ${match.unit}, normal: ${match.normalMin}-${match.normalMax} ${match.unit}).`;
    }
  } else if (value < match.normalMin) {
    const margin = ((match.normalMin - value) / match.normalMin) * 100;
    if (margin > 30) {
      status = "low";
      clinicalNote = `${testName} is significantly low (${value} ${match.unit}, normal: ${match.normalMin}-${match.normalMax} ${match.unit}).`;
    } else {
      status = "borderline_low";
      clinicalNote = `${testName} is borderline low (${value} ${match.unit}, normal: ${match.normalMin}-${match.normalMax} ${match.unit}).`;
    }
  }

  return {
    testName,
    value,
    status,
    referenceRange: `${match.normalMin}-${match.normalMax} ${match.unit}`,
    category: match.category,
    clinicalNote,
  };
}

/**
 * Identify a drug by brand or generic name
 */
export function identifyDrug(input: string): { genericName: string; category: string; commonDosages: string[] } | null {
  const normalized = input.toLowerCase().trim().replace(/[^a-z0-9\-]/g, "");
  return INDIAN_DRUG_BRANDS[normalized] || null;
}

/**
 * Fetch drug information from RxNorm API (free, no key required)
 */
export async function lookupDrugRxNorm(drugName: string): Promise<{
  rxcui: string;
  name: string;
  tty: string;
}[]> {
  try {
    const encoded = encodeURIComponent(drugName);
    const res = await fetch(
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encoded}&search=2`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { idGroup?: { rxnormId?: string[] } };
    const ids = data.idGroup?.rxnormId || [];

    // Fetch names for the IDs
    const results: { rxcui: string; name: string; tty: string }[] = [];
    for (const id of ids.slice(0, 5)) {
      const nameRes = await fetch(
        `https://rxnav.nlm.nih.gov/REST/rxcui/${id}/properties.json`,
        { headers: { Accept: "application/json" } },
      );
      if (nameRes.ok) {
        const nameData = (await nameRes.json()) as { properties?: { name?: string; tty?: string } };
        results.push({
          rxcui: id,
          name: nameData.properties?.name || drugName,
          tty: nameData.properties?.tty || "Drug",
        });
      }
    }
    return results;
  } catch (err) {
    logger.warn({ err, drugName }, "RxNorm lookup failed");
    return [];
  }
}

/**
 * Look up drug interactions from RxNorm
 */
export async function lookupDrugInteractionsRxNorm(rxcui1: string, rxcui2: string): Promise<{
  severity: string;
  description: string;
}[]> {
  try {
    const res = await fetch(
      `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcui1}+${rxcui2}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      interactionTypeGroup?: Array<{
        interactionType?: Array<{
          interactionPair?: Array<{
            severity?: string;
            description?: string;
          }>;
        }>;
      }>;
    };

    const interactions: { severity: string; description: string }[] = [];
    for (const group of data.interactionTypeGroup || []) {
      for (const type of group.interactionType || []) {
        for (const pair of type.interactionPair || []) {
          interactions.push({
            severity: pair.severity || "unknown",
            description: pair.description || "",
          });
        }
      }
    }
    return interactions;
  } catch (err) {
    logger.warn({ err }, "RxNorm interaction lookup failed");
    return [];
  }
}
