// NAMASTE-ICD11 Mapping Service
// Provides bidirectional mapping between NAMASTE codes and WHO ICD-11

export interface NAMASTECODE {
  code: string;
  display: string;
  definition: string;
  system: "Ayurveda" | "Siddha" | "Unani";
  category: string;
  bodySystem: string;
}

export interface ICD11Code {
  code: string;
  display: string;
  system: "tm2" | "biomedicine";
  chapter: string;
}

export interface MappingResult {
  sourceCode: string;
  sourceDisplay: string;
  sourceSystem: string;
  targetCode: string;
  targetDisplay: string;
  targetSystem: string;
  equivalence: "equivalent" | "wider" | "narrower" | "related";
  confidence: number;
  method: "predefined" | "automatic";
}

// ── Predefined NAMASTE Codes ─────────────────────────────────────────────
export const NAMASTE_CODES: NAMASTECODE[] = [
  // Ayurveda
  {
    code: "NAM001",
    display: "Ama (Undigested food toxins)",
    definition: "Accumulation of undigested metabolic waste causing toxicity",
    system: "Ayurveda",
    category: "Metabolic Disorders",
    bodySystem: "Digestive",
  },
  {
    code: "NAM002",
    display: "Vata Prakopa (Vata aggravation)",
    definition: "Imbalance of Vata dosha causing movement disorders",
    system: "Ayurveda",
    category: "Dosha Imbalance",
    bodySystem: "Neurological",
  },
  {
    code: "NAM003",
    display: "Pitta Prakopa (Pitta aggravation)",
    definition: "Imbalance of Pitta dosha causing metabolic inflammation",
    system: "Ayurveda",
    category: "Dosha Imbalance",
    bodySystem: "Metabolic",
  },
  {
    code: "NAM004",
    display: "Kapha Prakopa (Kapha aggravation)",
    definition: "Imbalance of Kapha dosha causing congestion and lethargy",
    system: "Ayurveda",
    category: "Dosha Imbalance",
    bodySystem: "Respiratory",
  },
  {
    code: "NAM005",
    display: "Ajirna (Indigestion)",
    definition: "Impaired digestive capacity causing discomfort",
    system: "Ayurveda",
    category: "Digestive Disorders",
    bodySystem: "Digestive",
  },
  {
    code: "NAM006",
    display: "Shirahshula (Headache)",
    definition: "Pain in the head region, various types based on dosha",
    system: "Ayurveda",
    category: "Pain Disorders",
    bodySystem: "Neurological",
  },
  {
    code: "NAM007",
    display: "Sandhivata (Osteoarthritis)",
    definition: "Vata disorder affecting joints causing pain and stiffness",
    system: "Ayurveda",
    category: "Musculoskeletal",
    bodySystem: "Joint",
  },
  {
    code: "NAM008",
    display: "Prameha (Diabetes)",
    definition: "Metabolic disorder with sweet urine and excessive urination",
    system: "Ayurveda",
    category: "Metabolic Disorders",
    bodySystem: "Endocrine",
  },
  {
    code: "NAM009",
    display: "Kasa (Cough)",
    definition: "Respiratory condition with expectoration",
    system: "Ayurveda",
    category: "Respiratory Disorders",
    bodySystem: "Respiratory",
  },
  {
    code: "NAM010",
    display: "Shwasa (Asthma/Dyspnea)",
    definition: "Difficulty in breathing, may be chronic or acute",
    system: "Ayurveda",
    category: "Respiratory Disorders",
    bodySystem: "Respiratory",
  },
  // Siddha
  {
    code: "SID001",
    display: "Vatham Imbalance",
    definition: "Imbalance of Vatham humor in Siddha medicine",
    system: "Siddha",
    category: "Humoral Imbalance",
    bodySystem: "Neurological",
  },
  {
    code: "SID002",
    display: "Pitham Imbalance",
    definition: "Imbalance of Pitham humor in Siddha medicine",
    system: "Siddha",
    category: "Humoral Imbalance",
    bodySystem: "Metabolic",
  },
  {
    code: "SID003",
    display: "Kapham Imbalance",
    definition: "Imbalance of Kapham humor in Siddha medicine",
    system: "Siddha",
    category: "Humoral Imbalance",
    bodySystem: "Respiratory",
  },
  // Unani
  {
    code: "UNA001",
    display: "Su-i-Mizaj (Temperament disorder)",
    definition: "Imbalance in the four temperaments",
    system: "Unani",
    category: "Temperament Disorders",
    bodySystem: "Systemic",
  },
  {
    code: "UNA002",
    display: "Soo-i-Hazm (Dyspepsia)",
    definition: "Indigestion and gastric discomfort",
    system: "Unani",
    category: "Digestive Disorders",
    bodySystem: "Digestive",
  },
];

// ── ICD-11 TM2 Codes (Traditional Medicine Module 2) ────────────────────
export const ICD11_TM2_CODES: ICD11Code[] = [
  { code: "TM2.01", display: "Pattern of disharmony", system: "tm2", chapter: "26" },
  { code: "TM2.02", display: "Digestive disharmony", system: "tm2", chapter: "26" },
  { code: "TM2.03", display: "Pain pattern", system: "tm2", chapter: "26" },
  { code: "TM2.04", display: "Respiratory disharmony", system: "tm2", chapter: "26" },
  { code: "TM2.05", display: "Neurological disharmony", system: "tm2", chapter: "26" },
  { code: "TM2.06", display: "Metabolic disharmony", system: "tm2", chapter: "26" },
  { code: "TM2.07", display: "Musculoskeletal disharmony", system: "tm2", chapter: "26" },
];

// ── ICD-11 Biomedicine Codes ────────────────────────────────────────────
export const ICD11_BIO_CODES: ICD11Code[] = [
  { code: "K30", display: "Dyspepsia", system: "biomedicine", chapter: "13" },
  { code: "G44.2", display: "Tension-type headache", system: "biomedicine", chapter: "08" },
  { code: "M15", display: "Osteoarthritis, polyarthritis", system: "biomedicine", chapter: "15" },
  { code: "E11", display: "Type 2 diabetes mellitus", system: "biomedicine", chapter: "05" },
  { code: "R05", display: "Cough", system: "biomedicine", chapter: "18" },
  { code: "J45", display: "Asthma", system: "biomedicine", chapter: "10" },
  { code: "G43", display: "Migraine", system: "biomedicine", chapter: "08" },
  { code: "K21", display: "Gastro-oesophageal reflux disease", system: "biomedicine", chapter: "13" },
  { code: "M54", display: "Dorsalgia (Back pain)", system: "biomedicine", chapter: "15" },
  { code: "I10", display: "Essential (primary) hypertension", system: "biomedicine", chapter: "11" },
];

// ── Predefined Mappings ──────────────────────────────────────────────────
const PREDEFINED_MAPPINGS: Record<string, { tm2: string; bio: string; equivalence: "equivalent" | "wider" | "narrower" | "related" }> = {
  NAM001: { tm2: "TM2.02", bio: "K30", equivalence: "wider" },
  NAM002: { tm2: "TM2.05", bio: "G44.2", equivalence: "related" },
  NAM003: { tm2: "TM2.06", bio: "E11", equivalence: "related" },
  NAM004: { tm2: "TM2.04", bio: "J45", equivalence: "related" },
  NAM005: { tm2: "TM2.02", bio: "K30", equivalence: "equivalent" },
  NAM006: { tm2: "TM2.03", bio: "G44.2", equivalence: "equivalent" },
  NAM007: { tm2: "TM2.07", bio: "M15", equivalence: "equivalent" },
  NAM008: { tm2: "TM2.06", bio: "E11", equivalence: "equivalent" },
  NAM009: { tm2: "TM2.04", bio: "R05", equivalence: "equivalent" },
  NAM010: { tm2: "TM2.04", bio: "J45", equivalence: "equivalent" },
  SID001: { tm2: "TM2.05", bio: "G44.2", equivalence: "related" },
  SID002: { tm2: "TM2.06", bio: "E11", equivalence: "related" },
  SID003: { tm2: "TM2.04", bio: "J45", equivalence: "related" },
  UNA001: { tm2: "TM2.01", bio: "K30", equivalence: "related" },
  UNA002: { tm2: "TM2.02", bio: "K30", equivalence: "equivalent" },
};

// ── Search Functions ─────────────────────────────────────────────────────
export function searchNAMASTE(query: string, system?: string, limit: number = 10): NAMASTECODE[] {
  const lowerQuery = query.toLowerCase();
  return NAMASTE_CODES.filter((code) => {
    const matchesQuery =
      code.display.toLowerCase().includes(lowerQuery) ||
      code.definition.toLowerCase().includes(lowerQuery) ||
      code.code.toLowerCase().includes(lowerQuery) ||
      code.category.toLowerCase().includes(lowerQuery) ||
      code.bodySystem.toLowerCase().includes(lowerQuery);

    const matchesSystem = !system || code.system.toLowerCase() === system.toLowerCase();

    return matchesQuery && matchesSystem;
  }).slice(0, limit);
}

export function searchICD11(query: string, system: string = "both", limit: number = 10): ICD11Code[] {
  const lowerQuery = query.toLowerCase();
  const codes = system === "tm2" ? ICD11_TM2_CODES : system === "biomedicine" ? ICD11_BIO_CODES : [...ICD11_TM2_CODES, ...ICD11_BIO_CODES];

  return codes.filter((code) => {
    return code.display.toLowerCase().includes(lowerQuery) || code.code.toLowerCase().includes(lowerQuery);
  }).slice(0, limit);
}

// ── Translation Function ─────────────────────────────────────────────────
export function translateCode(
  sourceSystem: string,
  sourceCode: string,
  target: string = "both"
): MappingResult[] {
  const results: MappingResult[] = [];

  // Check predefined mappings
  const mapping = PREDEFINED_MAPPINGS[sourceCode];
  if (mapping) {
    const namasteCode = NAMASTE_CODES.find((c) => c.code === sourceCode);
    if (target === "tm2" || target === "both") {
      const tm2Code = ICD11_TM2_CODES.find((c) => c.code === mapping.tm2);
      if (tm2Code) {
        results.push({
          sourceCode,
          sourceDisplay: namasteCode?.display || sourceCode,
          sourceSystem: sourceSystem,
          targetCode: mapping.tm2,
          targetDisplay: tm2Code.display,
          targetSystem: "http://id.who.int/icd/release/11/2023-01/tm2",
          equivalence: mapping.equivalence,
          confidence: 0.95,
          method: "predefined",
        });
      }
    }
    if (target === "biomedicine" || target === "both") {
      const bioCode = ICD11_BIO_CODES.find((c) => c.code === mapping.bio);
      if (bioCode) {
        results.push({
          sourceCode,
          sourceDisplay: namasteCode?.display || sourceCode,
          sourceSystem: sourceSystem,
          targetCode: mapping.bio,
          targetDisplay: bioCode.display,
          targetSystem: "http://id.who.int/icd/release/11/2023-01/mms",
          equivalence: mapping.equivalence,
          confidence: 0.85,
          method: "predefined",
        });
      }
    }
  }

  // If no predefined mapping, try automatic mapping
  if (results.length === 0) {
    const namasteCode = NAMASTE_CODES.find((c) => c.code === sourceCode);
    if (namasteCode) {
      const autoResults = automaticMapping(namasteCode, target);
      results.push(...autoResults);
    }
  }

  return results;
}

// ── Automatic Mapping (Similarity-based) ─────────────────────────────────
function automaticMapping(namasteCode: NAMASTECODE, target: string): MappingResult[] {
  const results: MappingResult[] = [];

  // Keyword-based similarity
  const keywords = namasteCode.definition.toLowerCase().split(/\s+/);

  if (target === "tm2" || target === "both") {
    let bestMatch: ICD11Code | null = null;
    let bestScore = 0;

    for (const tm2Code of ICD11_TM2_CODES) {
      const tm2Words = tm2Code.display.toLowerCase().split(/\s+/);
      const overlap = keywords.filter((k) => tm2Words.some((tw) => tw.includes(k) || k.includes(tw))).length;
      const score = overlap / Math.max(keywords.length, tm2Words.length);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = tm2Code;
      }
    }

    if (bestMatch && bestScore > 0.3) {
      const equivalence = bestScore >= 0.8 ? "equivalent" : bestScore >= 0.6 ? "wider" : bestScore >= 0.4 ? "narrower" : "related";
      results.push({
        sourceCode: namasteCode.code,
        sourceDisplay: namasteCode.display,
        sourceSystem: `http://terminology.mohayush.gov.in/namaste`,
        targetCode: bestMatch.code,
        targetDisplay: bestMatch.display,
        targetSystem: "http://id.who.int/icd/release/11/2023-01/tm2",
        equivalence,
        confidence: Math.min(0.9, bestScore + 0.3),
        method: "automatic",
      });
    }
  }

  if (target === "biomedicine" || target === "both") {
    let bestMatch: ICD11Code | null = null;
    let bestScore = 0;

    for (const bioCode of ICD11_BIO_CODES) {
      const bioWords = bioCode.display.toLowerCase().split(/\s+/);
      const overlap = keywords.filter((k) => bioWords.some((bw) => bw.includes(k) || k.includes(bw))).length;
      const score = overlap / Math.max(keywords.length, bioWords.length);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = bioCode;
      }
    }

    if (bestMatch && bestScore > 0.3) {
      const equivalence = bestScore >= 0.8 ? "equivalent" : bestScore >= 0.6 ? "wider" : bestScore >= 0.4 ? "narrower" : "related";
      results.push({
        sourceCode: namasteCode.code,
        sourceDisplay: namasteCode.display,
        sourceSystem: `http://terminology.mohayush.gov.in/namaste`,
        targetCode: bestMatch.code,
        targetDisplay: bestMatch.display,
        targetSystem: "http://id.who.int/icd/release/11/2023-01/mms",
        equivalence,
        confidence: Math.min(0.8, bestScore + 0.2),
        method: "automatic",
      });
    }
  }

  return results;
}

// ── Generate FHIR ConceptMap ─────────────────────────────────────────────
export function generateConceptMap() {
  const mappings = Object.entries(PREDEFINED_MAPPINGS).map(([code, mapping]) => {
    const namasteCode = NAMASTE_CODES.find((c) => c.code === code);
    return {
      code,
      display: namasteCode?.display || code,
      target: [
        { code: mapping.tm2, system: "http://id.who.int/icd/release/11/2023-01/tm2", equivalence: mapping.equivalence },
        { code: mapping.bio, system: "http://id.who.int/icd/release/11/2023-01/mms", equivalence: mapping.equivalence },
      ],
    };
  });

  return {
    resourceType: "ConceptMap",
    id: "namaste-icd11-map",
    url: "http://terminology.mohayush.gov.in/ConceptMap/namaste-icd11",
    name: "NAMASTE to ICD-11 Mapping",
    status: "active",
    experimental: false,
    date: new Date().toISOString(),
    publisher: "Ministry of AYUSH",
    description: "Bidirectional mapping between NAMASTE codes and WHO ICD-11 TM2 & Biomedicine",
    sourceUri: "http://terminology.mohayush.gov.in/namaste",
    targetUri: "http://id.who.int/icd/release/11/2023-01",
    group: [
      {
        source: "http://terminology.mohayush.gov.in/namaste",
        target: "http://id.who.int/icd/release/11/2023-01/tm2",
        element: mappings.map((m) => ({
          code: m.code,
          display: m.display,
          target: m.target.filter((t) => t.system.includes("tm2")).map((t) => ({
            code: t.code,
            equivalence: t.equivalence,
          })),
        })),
      },
      {
        source: "http://terminology.mohayush.gov.in/namaste",
        target: "http://id.who.int/icd/release/11/2023-01/mms",
        element: mappings.map((m) => ({
          code: m.code,
          display: m.display,
          target: m.target.filter((t) => t.system.includes("mms")).map((t) => ({
            code: t.code,
            equivalence: t.equivalence,
          })),
        })),
      },
    ],
  };
}

// ── Generate FHIR CodeSystem ─────────────────────────────────────────────
export function generateCodeSystem() {
  return {
    resourceType: "CodeSystem",
    id: "namaste",
    url: "http://terminology.mohayush.gov.in/namaste",
    name: "NAMASTE",
    status: "active",
    experimental: false,
    date: new Date().toISOString(),
    publisher: "Ministry of AYUSH",
    description: "National AYUSH Morbidity & Standardized Terminologies Electronic codes",
    content: "complete",
    concept: NAMASTE_CODES.map((code) => ({
      code: code.code,
      display: code.display,
      definition: code.definition,
      property: [
        { code: "system", valueCode: code.system },
        { code: "category", valueString: code.category },
        { code: "bodySystem", valueString: code.bodySystem },
      ],
    })),
  };
}
