// ── Comprehensive Medicine Database ───────────────────────────────────────
// Based on common Indian medicines and extended from project's medicine_database.json
// Can be enhanced with Kaggle dataset: drowsyng/medicines-dataset

export interface MedicineEntry {
  brandNames: string[];
  genericName: string;
  category: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  precautions: string[];
}

export const MEDICINE_DATABASE: Record<string, MedicineEntry> = {
  // ── Pain & Fever ──────────────────────────────────────────────────────
  paracetamol: {
    brandNames: ["Crocin", "Dolo 650", "Pandol", "Calpol", "Tylenol", "Aceta", "Ace", "Napa Extend", "Feprin", "Pyrimon"],
    genericName: "Paracetamol (Acetaminophen)",
    category: "Analgesic/Antipyretic",
    uses: ["Fever", "Headache", "Body ache", "Toothache", "Post-surgical pain", "Menstrual cramps"],
    dosage: "500-650mg every 4-6 hours (max 4g/day for adults). Children: 10-15mg/kg per dose.",
    sideEffects: ["Rare: Liver damage (overdose)", "Allergic reactions (rash, swelling - rare)"],
    contraindications: ["Severe liver disease", "Known hypersensitivity"],
    precautions: ["Don't exceed 4g/day", "Avoid alcohol", "Safe in pregnancy (usual doses)"],
  },
  ibuprofen: {
    brandNames: ["Brufen", "Combiflam", "Ibugesic", "Moov", "Ibufen", "Brustan"],
    genericName: "Ibuprofen",
    category: "NSAID (Anti-inflammatory)",
    uses: ["Pain relief", "Fever", "Inflammation", "Joint pain", "Period pain", "Sports injuries", "Dental pain"],
    dosage: "200-400mg every 6-8 hours with food (max 1200mg OTC, higher with Rx).",
    sideEffects: ["Stomach upset/ulcers", "Nausea", "Dizziness", "Kidney issues (long-term)", "Increased bleeding risk"],
    contraindications: ["Stomach ulcers", "Kidney disease", "Heart failure", "Third trimester pregnancy", "Aspirin allergy"],
    precautions: ["Always take with food", "Don't combine with other NSAIDs", "Avoid in pregnancy"],
  },
  combiflam: {
    brandNames: ["Combiflam"],
    genericName: "Ibuprofen 400mg + Paracetamol 325mg",
    category: "Analgesic/Anti-inflammatory combo",
    uses: ["Severe pain with inflammation", "Toothache", "Period pain", "Back pain", "Joint pain"],
    dosage: "1 tablet every 8 hours with food",
    sideEffects: ["Stomach upset", "Nausea", "Dizziness"],
    contraindications: ["Same as Ibuprofen + Paracetamol", "Don't take with other NSAIDs"],
    precautions: ["Take with food", "Not for long-term use without supervision"],
  },

  // ── Antibiotics ───────────────────────────────────────────────────────
  azithromycin: {
    brandNames: ["Azee", "Azithral", "Azithrocin", "Azyth", "Az", "Zithromax", "Z-Pak"],
    genericName: "Azithromycin",
    category: "Macrolide Antibiotic",
    uses: ["Respiratory infections", "Throat infections", "Ear infections", "Skin infections", "STDs (Chlamydia)", "Traveler's diarrhea"],
    dosage: "500mg day 1, then 250mg daily for 4 days. Or 500mg weekly for 3 weeks.",
    sideEffects: ["Diarrhea", "Nausea", "Abdominal pain", "Headache", "QT prolongation (rare)"],
    contraindications: ["Severe liver disease", "Known macrolide allergy", "On certain heart medications"],
    precautions: ["Complete full course", "Don't take with antacids", "Inform doctor of heart conditions"],
  },
  amoxicillin: {
    brandNames: ["Amoxil", "Amoxicillin", "Mox", "Novamox", "Amoxy"],
    genericName: "Amoxicillin",
    category: "Penicillin Antibiotic",
    uses: ["Throat infections", "Ear infections", "UTI", "Pneumonia", "Dental infections", "H. pylori"],
    dosage: "250-500mg every 8 hours, or 875mg every 12 hours",
    sideEffects: ["Diarrhea", "Rash", "Nausea", "Allergic reactions"],
    contraindications: ["Penicillin allergy", "History of antibiotic-associated colitis"],
    precautions: ["Complete full course", "Take with food if stomach upset", "Inform of penicillin allergy"],
  },
  metronidazole: {
    brandNames: ["Metrogyl", "Flagyl", "Metrogyl DG", "Filmet", "Flamyd", "Amodis", "Metronid"],
    genericName: "Metronidazole",
    category: "Antiprotozoal/Antibiotic",
    uses: ["Bacterial vaginosis", "Amoebiasis", "Giardiasis", "Dental infections", "H. pylori", "Surgical prophylaxis"],
    dosage: "400-500mg every 8 hours for 5-7 days",
    sideEffects: ["Metallic taste", "Nausea", "Dark urine", "Peripheral neuropathy (high dose/prolonged)"],
    contraindications: ["First trimester pregnancy", "Alcohol use (disulfiram-like reaction)", "Severe liver disease"],
    precautions: ["Avoid alcohol during and 48h after treatment", "Don't exceed prescribed dose"],
  },
  ciprofloxacin: {
    brandNames: ["Ciplox", "Cipro", "Ciproflox", "Cifran", "Quinol"],
    genericName: "Ciprofloxacin",
    category: "Fluoroquinolone Antibiotic",
    uses: ["UTI", "Respiratory infections", "Gastrointestinal infections", "Bone/joint infections", "Skin infections"],
    dosage: "250-750mg every 12 hours",
    sideEffects: ["Tendon rupture (rare)", "Photosensitivity", "Nausea", "QT prolongation", "Joint problems in children"],
    contraindications: ["Children <18 (except specific cases)", "Tendon disorders", "Myasthenia gravis", "QT prolongation"],
    precautions: ["Avoid dairy/calcium within 2h", "Stay hydrated", "Avoid sun exposure", "Report tendon pain immediately"],
  },

  // ── Antihistamines ────────────────────────────────────────────────────
  cetirizine: {
    brandNames: ["Zyrtec", "Zynocet", "Alerid", "Cetiriz", "Cetisoft", "Levocet", "Alatrol", "Atrizin"],
    genericName: "Cetirizine / Levocetirizine",
    category: "Antihistamine",
    uses: ["Allergic rhinitis", "Urticaria (hives)", "Itching", "Sneezing", "Runny nose", "Allergic skin reactions"],
    dosage: "Cetirizine 10mg once daily. Levocetirizine 5mg once daily.",
    sideEffects: ["Drowsiness (mild)", "Dry mouth", "Headache", "Fatigue"],
    contraindications: ["Severe kidney disease (dose adjustment needed)", "Known hypersensitivity"],
    precautions: ["May cause drowsiness - avoid driving", "Safer alternatives: Loratadine, Fexofenadine (non-drowsy)"],
  },
  fexofenadine: {
    brandNames: ["Allegra", "Fenadin", "Axodin", "Dinafex", "Fexofed"],
    genericName: "Fexofenadine",
    category: "Non-sedating Antihistamine",
    uses: ["Allergic rhinitis", "Chronic urticaria", "Itching", "Seasonal allergies"],
    dosage: "120mg once daily (OTC) or 180mg once daily (Rx)",
    sideEffects: ["Headache", "Nausea", "Dysmenorrhea (rare)"],
    contraindications: ["Known hypersensitivity"],
    precautions: ["Non-drowsy - safe to drive", "Avoid fruit juices (reduce absorption)"],
  },

  // ── Gastrointestinal ──────────────────────────────────────────────────
  omeprazole: {
    brandNames: ["Omez", "Omezip", "Omicap", "Omezol", "Omez-20"],
    genericName: "Omeprazole",
    category: "Proton Pump Inhibitor (PPI)",
    uses: ["Acid reflux (GERD)", "Gastric ulcers", "H. pylori eradication", "Dyspepsia", "Esophagitis"],
    dosage: "20-40mg once daily, 30 min before breakfast",
    sideEffects: ["Headache", "Abdominal pain", "Diarrhea", "Long-term: B12 deficiency, bone fractures"],
    contraindications: ["Known hypersensitivity"],
    precautions: ["Take on empty stomach", "Don't crush enteric-coated capsules", "Long-term use requires monitoring"],
  },
  pantoprazole: {
    brandNames: ["Pantocid", "Pantodac", "Pantop", "Panzole", "Pan"],
    genericName: "Pantoprazole",
    category: "Proton Pump Inhibitor (PPI)",
    uses: ["GERD", "Erosive esophagitis", "Gastric ulcers", "Zollinger-Ellison syndrome"],
    dosage: "40mg once daily before breakfast",
    sideEffects: ["Headache", "Flatulence", "Nausea"],
    contraindications: ["Known hypersensitivity"],
    precautions: ["Fewer drug interactions than Omeprazole", "Take on empty stomach"],
  },
  domperidone: {
    brandNames: ["Domperone", "Motilium", "Domstal"],
    genericName: "Domperidone",
    category: "Prokinetic/Antiemetic",
    uses: ["Nausea", "Vomiting", "Bloating", "Gastroparesis", "Acid reflux"],
    dosage: "10mg three times daily before meals",
    sideEffects: ["Dry mouth", "Headache", "Rash", "QT prolongation (high dose)"],
    contraindications: ["Pituitary tumors", "Heart conditions", "Liver disease"],
    precautions: ["Don't exceed 80mg/day", "Take before meals", "Report irregular heartbeat"],
  },

  // ── Cardiovascular ────────────────────────────────────────────────────
  amlodipine: {
    brandNames: ["Amlodac", "Amlopin", "Amlong", "Stamlo", "Norvasc"],
    genericName: "Amlodipine",
    category: "Calcium Channel Blocker",
    uses: ["Hypertension", "Angina", "Coronary artery disease"],
    dosage: "2.5-10mg once daily",
    sideEffects: ["Ankle swelling", "Flushing", "Headache", "Dizziness", "Fatigue"],
    contraindications: ["Severe hypotension", "Cardiogenic shock"],
    precautions: ["Don't stop suddenly", "Monitor BP regularly", "Report ankle swelling"],
  },
  losartan: {
    brandNames: ["Losar", "Cozaar", "Losartan", "Lozap", "Lexum"],
    genericName: "Losartan",
    category: "ARB (Angiotensin Receptor Blocker)",
    uses: ["Hypertension", "Diabetic nephropathy", "Heart failure"],
    dosage: "25-100mg once or twice daily",
    sideEffects: ["Dizziness", "Upper respiratory infection", "Hyperkalemia"],
    contraindications: ["Pregnancy", "Severe kidney disease", "Bilateral renal artery stenosis"],
    precautions: ["Monitor kidney function", "Report dizziness", "Avoid potassium supplements"],
  },
  atorvastatin: {
    brandNames: ["Lipitor", "Atorva", "Storvas", "Atorec", "Tgvant"],
    genericName: "Atorvastatin",
    category: "Statin (Cholesterol-lowering)",
    uses: ["High cholesterol", "Cardiovascular risk reduction", "Post-MI/stroke prevention"],
    dosage: "10-80mg once daily (usually evening)",
    sideEffects: ["Muscle pain/weakness", "Liver enzyme elevation", "Headache", "GI upset"],
    contraindications: ["Active liver disease", "Pregnancy/breastfeeding", "Unexplained muscle pain"],
    precautions: ["Monitor LFT before starting", "Report muscle pain immediately", "Avoid grapefruit"],
  },
  aspirin: {
    brandNames: ["Disprin", "Ecosprin", "Bamycin", "Aspivent"],
    genericName: "Aspirin (low-dose)",
    category: "Antiplatelet",
    uses: ["Heart attack prevention", "Stroke prevention", "Post-stent (with clopidogrel)"],
    dosage: "75-150mg once daily",
    sideEffects: ["GI bleeding", "Tinnitus", "Easy bruising"],
    contraindications: ["Active bleeding", "Gastric ulcers", "Aspirin allergy", "Children <16 (Reye's syndrome)"],
    precautions: ["Stop 7 days before surgery", "Take with food", "Report unusual bleeding"],
  },

  // ── Respiratory ───────────────────────────────────────────────────────
  montelukast: {
    brandNames: ["Montair", "Montair LC", "Montecore", "Singulair", "M-Kast", "Lumona"],
    genericName: "Montelukast",
    category: "Leukotriene Receptor Antagonist",
    uses: ["Asthma prevention", "Allergic rhinitis", "Exercise-induced bronchospasm"],
    dosage: "10mg once daily (evening)",
    sideEffects: ["Headache", "Upper respiratory infection", "Mood changes (rare)"],
    contraindications: ["Known hypersensitivity"],
    precautions: ["Not a rescue inhaler", "Use with inhaled steroids", "Report mood changes"],
  },
  salbutamol: {
    brandNames: ["Ventolin", "Asthalin", "Salbutamol", "Broxol", "Asmalin"],
    genericName: "Salbutamol (Albuterol)",
    category: "Short-acting Beta-2 Agonist (SABA)",
    uses: ["Acute asthma", "Bronchospasm", "COPD", "Exercise-induced bronchospasm"],
    dosage: "1-2 puffs every 4-6 hours as needed",
    sideEffects: ["Tremor", "Palpitations", "Headache", "Throat irritation"],
    contraindications: ["Hypersensitivity to sympathomimetics"],
    precautions: ["Rescue inhaler only - not for regular use", "Shake before use", "Rinse mouth after steroid inhaler"],
  },
  budesonide: {
    brandNames: ["Budecort", "Pulmicort", "Budefloor", "Respules"],
    genericName: "Budesonide",
    category: "Inhaled Corticosteroid (ICS)",
    uses: ["Asthma maintenance", "COPD", "Allergic rhinitis (nasal spray)"],
    dosage: "100-400mcg twice daily (inhaler), 0.5-2mg (nebulization)",
    sideEffects: ["Oral thrush", "Hoarse voice", "Throat irritation"],
    contraindications: ["Active untreated infections"],
    precautions: ["Always rinse mouth after use", "Use spacer with MDI", "Don't use for acute attacks"],
  },

  // ── Diabetes ──────────────────────────────────────────────────────────
  metformin: {
    brandNames: ["Glycomet", "Gluconorm", "Diamet", "Met", "Glycomet GP"],
    genericName: "Metformin",
    category: "Biguanide (Antidiabetic)",
    uses: ["Type 2 Diabetes", "PCOS", "Prediabetes", "Obesity management"],
    dosage: "500-2000mg/day in divided doses with meals",
    sideEffects: ["GI upset", "Nausea", "Diarrhea", "Metallic taste", "B12 deficiency (long-term)"],
    contraindications: ["Severe kidney disease (eGFR <30)", "Metabolic acidosis", "Severe liver disease"],
    precautions: ["Take with food", "Monitor kidney function", "Stop before contrast dye/48h before surgery"],
  },
  glimepiride: {
    brandNames: ["Amaryl", "Glycomet GP", "Glimiprex", "Glime"],
    genericName: "Glimepiride",
    category: "Sulfonylurea (Antidiabetic)",
    uses: ["Type 2 Diabetes (add-on to Metformin)"],
    dosage: "1-4mg once daily with breakfast",
    sideEffects: ["Hypoglycemia", "Weight gain", "GI upset"],
    contraindications: ["Type 1 Diabetes", "Severe kidney/liver disease", "Sulfonamide allergy"],
    precautions: ["Carry glucose tablets", "Don't skip meals", "Monitor blood sugar regularly"],
  },

  // ── Thyroid ───────────────────────────────────────────────────────────
  levothyroxine: {
    brandNames: ["Eltroxin", "Thyronorm", "Thyrox", "Thyrocord"],
    genericName: "Levothyroxine",
    category: "Thyroid Hormone Replacement",
    uses: ["Hypothyroidism", "Thyroid cancer (post-surgery)", "Goiter"],
    dosage: "25-200mcg once daily (dose adjusted by TSH)",
    sideEffects: ["Overdose: palpitations, anxiety, tremor, weight loss"],
    contraindications: ["Untreated adrenal insufficiency", "Acute MI"],
    precautions: ["Empty stomach, 30-60 min before food", "Separate from calcium/iron/antacids by 4h", "Regular TSH monitoring"],
  },

  // ── Antifungals ───────────────────────────────────────────────────────
  fluconazole: {
    brandNames: ["Canazole", "Candinil", "Conaz", "Fluka", "Forcan"],
    genericName: "Fluconazole",
    category: "Azole Antifungal",
    uses: ["Vaginal candidiasis", "Oral thrush", "Skin fungal infections", "Systemic fungal infections"],
    dosage: "150mg single dose (vaginal) or 100-400mg daily (systemic)",
    sideEffects: ["Nausea", "Headache", "Abdominal pain", "Liver toxicity (high dose)"],
    contraindications: ["Severe liver disease", "QT prolongation", "Certain drug interactions"],
    precautions: ["Complete course for systemic infections", "Monitor liver function for prolonged use"],
  },
  ketoconazole: {
    brandNames: ["Nizoral", "Ketoral", "Ketozol", "Dancel", "Ketocon", "Nizoder"],
    genericName: "Ketoconazole",
    category: "Azole Antifungal",
    uses: ["Fungal skin infections", "Dandruff (shampoo)", "Tinea", "Seborrheic dermatitis"],
    dosage: "200-400mg daily (oral), topical as directed",
    sideEffects: ["GI upset", "Headache", "Liver toxicity (oral)", "Adrenal suppression"],
    contraindications: ["Liver disease", "Concurrent QT-prolonging drugs"],
    precautions: ["Oral form rarely used now - topical preferred", "Monitor LFT if oral use needed"],
  },

  // ── Muscle Relaxants ──────────────────────────────────────────────────
  baclofen: {
    brandNames: ["Baclofen", "Lioresal", "Bacaid", "Backtone", "Bacmax", "Baclon"],
    genericName: "Baclofen",
    category: "Muscle Relaxant",
    uses: ["Muscle spasticity", "Multiple sclerosis", "Spinal cord injury", "Chronic back pain"],
    dosage: "5-20mg three times daily",
    sideEffects: ["Drowsiness", "Dizziness", "Weakness", "Nausea"],
    contraindications: ["Stroke", "Epilepsy", "Renal impairment"],
    precautions: ["Don't stop suddenly (seizure risk)", "Avoid alcohol", "Don't drive"],
  },

  // ── Antiepileptics ────────────────────────────────────────────────────
  clonazepam: {
    brandNames: ["Rivotril", "Klonopin", "Denixil", "Disopan", "Leptic", "Zeficar"],
    genericName: "Clonazepam",
    category: "Benzodiazepine/Antiepileptic",
    uses: ["Epilepsy (adjunct)", "Panic disorder", "Seizures", "Myoclonus"],
    dosage: "0.5-2mg two to three times daily",
    sideEffects: ["Drowsiness", "Dizziness", "Cognitive impairment", "Dependence"],
    contraindications: ["Severe respiratory depression", "Acute narrow-angle glaucoma", "Sleep apnea"],
    precautions: ["HIGHLY addictive - short-term only for anxiety", "Don't stop suddenly", "Avoid alcohol", "Don't drive"],
  },

  // ── Vitamins & Supplements ────────────────────────────────────────────
  "vitamin-b-complex": {
    brandNames: ["Becosules", "Neurobion", "Bicozin", "Becozinc"],
    genericName: "Vitamin B Complex + Zinc",
    category: "Nutritional Supplement",
    uses: ["B vitamin deficiency", "Mouth ulcers", "Fatigue", "Peripheral neuropathy", "Weak immunity"],
    dosage: "1 capsule daily",
    sideEffects: ["Bright yellow urine (normal - B2)", "GI upset (rare)"],
    contraindications: ["Known hypersensitivity"],
    precautions: ["Safe for long-term use", "Store in cool dry place"],
  },
};

// ── Disease to Medicine Mapping ──────────────────────────────────────────
export const DISEASE_MEDICINE_MAP: Record<string, string[]> = {
  fever: ["paracetamol", "ibuprofen"],
  headache: ["paracetamol", "ibuprofen", "combiflam"],
  "body pain": ["paracetamol", "ibuprofen", "combiflam"],
  cold: ["cetirizine", "fexofenadine", "paracetamol"],
  cough: ["montelukast", "salbutamol", "budesonide"],
  asthma: ["salbutamol", "budesonide", "montelukast"],
  allergy: ["cetirizine", "fexofenadine", "montelukast"],
  acidity: ["omeprazole", "pantoprazole", "domperidone"],
  "acid reflux": ["omeprazole", "pantoprazole", "domperidone"],
  gastritis: ["omeprazole", "pantoprazole"],
  "stomach infection": ["metronidazole"],
  UTI: ["ciprofloxacin", "amoxicillin"],
  infection: ["azithromycin", "amoxicillin", "ciprofloxacin", "metronidazole"],
  diabetes: ["metformin", "glimepiride"],
  "high cholesterol": ["atorvastatin"],
  hypertension: ["amlodipine", "losartan"],
  "blood pressure": ["amlodipine", "losartan"],
  thyroid: ["levothyroxine"],
  "fungal infection": ["fluconazole", "ketoconazole"],
  epilepsy: ["clonazepam"],
  "muscle spasm": ["baclofen"],
  "joint pain": ["ibuprofen", "combiflam"],
  "period pain": ["ibuprofen", "combiflam", "paracetamol"],
  "heart attack prevention": ["aspirin", "atorvastatin"],
  drowsiness: ["cetirizine", "fexofenadine"],
  "skin infection": ["fluconazole", "ketoconazole"],
  dandruff: ["ketoconazole"],
  "vitamin deficiency": ["vitamin-b-complex"],
  fatigue: ["vitamin-b-complex", "paracetamol"],
  ulcers: ["omeprazole", "pantoprazole"],
  "motion sickness": ["domperidone"],
};

// ── Medicine Lookup Functions ────────────────────────────────────────────
export function findMedicine(query: string): MedicineEntry | null {
  const lower = query.toLowerCase();

  // Direct brand name match
  for (const [key, entry] of Object.entries(MEDICINE_DATABASE)) {
    if (entry.brandNames.some((b) => lower.includes(b.toLowerCase()))) {
      return entry;
    }
    if (lower.includes(key.toLowerCase())) {
      return entry;
    }
    if (lower.includes(entry.genericName.toLowerCase())) {
      return entry;
    }
  }

  return null;
}

export function getMedicinesForDisease(disease: string): MedicineEntry[] {
  const lower = disease.toLowerCase();
  const medicineKeys = DISEASE_MEDICINE_MAP[lower] || [];
  return medicineKeys
    .map((key) => MEDICINE_DATABASE[key])
    .filter(Boolean);
}

export function formatMedicineResponse(entry: MedicineEntry, language: string = "en"): string {
  if (language === "hi") {
    return `**${entry.brandNames.slice(0, 4).join(", ")}** (${entry.genericName})\n\n` +
      `📋 **श्रेणी**: ${entry.category}\n` +
      `💊 **उपयोग**: ${entry.uses.join(", ")}\n` +
      `💊 **खुराक**: ${entry.dosage}\n` +
      `⚠️ **साइड इफेक्ट्स**: ${entry.sideEffects.join(", ")}\n` +
      `🚫 **मतभेद**: ${entry.contraindications.join(", ")}\n` +
      `📝 **सावधानियां**: ${entry.precautions.join(", ")}\n\n` +
      `⚠️ *यह सामान्य जानकारी है। डॉक्टर की सलाह के बिना दवा न लें।*`;
  }

  return `**${entry.brandNames.slice(0, 4).join(", ")}** (${entry.genericName})\n\n` +
    `📋 **Category**: ${entry.category}\n` +
    `💊 **Uses**: ${entry.uses.join(", ")}\n` +
    `💊 **Dosage**: ${entry.dosage}\n` +
    `⚠️ **Side Effects**: ${entry.sideEffects.join(", ")}\n` +
    `🚫 **Contraindications**: ${entry.contraindications.join(", ")}\n` +
    `📝 **Precautions**: ${entry.precautions.join(", ")}\n\n` +
    `⚠️ *This is general information. Always consult a doctor before taking any medication.*`;
}
