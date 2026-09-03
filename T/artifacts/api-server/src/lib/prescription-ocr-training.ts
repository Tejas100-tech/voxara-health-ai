import { logger } from "./logger";
import fs from "fs";
import path from "path";

// Medicine database loaded from training dataset
interface MedicineEntry {
  brandName: string;
  genericName: string;
  category: string;
  commonDosages: string[];
  aliases?: string[];
}

// Load medicine database from dataset
let medicineDatabase: Record<string, MedicineEntry> = {};

export function loadMedicineDatabase(): void {
  try {
    // Try to load from the dataset JSON
    const dbPath = path.join(process.cwd(), "..", "..", "prescription-dataset", "medicine_database.json");
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      medicineDatabase = JSON.parse(data);
      logger.info({ count: Object.keys(medicineDatabase).length }, "Medicine database loaded from dataset");
    } else {
      // Fallback to built-in database
      medicineDatabase = getBuiltInMedicineDatabase();
      logger.info({ count: Object.keys(medicineDatabase).length }, "Using built-in medicine database");
    }
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to load medicine database");
    medicineDatabase = getBuiltInMedicineDatabase();
  }
}

// Built-in medicine database (common Indian/Bangladeshi medicines)
function getBuiltInMedicineDatabase(): Record<string, MedicineEntry> {
  return {
    // Paracetamol variants
    Aceta: { brandName: "Aceta", genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg", "650mg"] },
    Ace: { brandName: "Ace", genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg"] },
    Paracetamol: { brandName: "Paracetamol", genericName: "Paracetamol", category: "Analgesic/Antipyretic", commonDosages: ["500mg", "650mg"] },
    
    // Antibiotics
    Azithrocin: { brandName: "Azithrocin", genericName: "Azithromycin", category: "Antibiotic", commonDosages: ["250mg", "500mg"] },
    Azyth: { brandName: "Azyth", genericName: "Azithromycin", category: "Antibiotic", commonDosages: ["250mg", "500mg"] },
    
    // Antihistamines
    Alatrol: { brandName: "Alatrol", genericName: "Cetirizine", category: "Antihistamine", commonDosages: ["10mg"] },
    Atrizin: { brandName: "Atrizin", genericName: "Cetirizine", category: "Antihistamine", commonDosages: ["10mg"] },
    Cetisoft: { brandName: "Cetisoft", genericName: "Cetirizine", category: "Antihistamine", commonDosages: ["10mg"] },
    Axodin: { brandName: "Axodin", genericName: "Fexofenadine", category: "Antihistamine", commonDosages: ["120mg", "180mg"] },
    Fenadin: { brandName: "Fenadin", genericName: "Fexofenadine", category: "Antihistamine", commonDosages: ["120mg"] },
    
    // Antifungals
    Canazole: { brandName: "Canazole", genericName: "Fluconazole", category: "Antifungal", commonDosages: ["150mg", "200mg"] },
    Conaz: { brandName: "Conaz", genericName: "Fluconazole", category: "Antifungal", commonDosages: ["150mg"] },
    
    // Muscle Relaxants
    Baclofen: { brandName: "Baclofen", genericName: "Baclofen", category: "Muscle Relaxant", commonDosages: ["10mg", "25mg"] },
    Baclon: { brandName: "Baclon", genericName: "Baclofen", category: "Muscle Relaxant", commonDosages: ["10mg"] },
    Bacmax: { brandName: "Bacmax", genericName: "Baclofen", category: "Muscle Relaxant", commonDosages: ["10mg"] },
    Beklo: { brandName: "Beklo", genericName: "Baclofen", category: "Muscle Relaxant", commonDosages: ["10mg"] },
    Bacaid: { brandName: "Bacaid", genericName: "Baclofen", category: "Muscle Relaxant", commonDosages: ["10mg"] },
    
    // Metronidazole
    Amodis: { brandName: "Amodis", genericName: "Metronidazole", category: "Antibiotic/Antiprotozoal", commonDosages: ["200mg", "400mg", "500mg"] },
    
    // Antacids
    Esoral: { brandName: "Esoral", genericName: "Esomeprazole", category: "Proton Pump Inhibitor", commonDosages: ["20mg", "40mg"] },
    Esonix: { brandName: "Esonix", genericName: "Esomeprazole", category: "Proton Pump Inhibitor", commonDosages: ["20mg"] },
    
    // Pain Relief
    Backtone: { brandName: "Backtone", genericName: "Diclofenac", category: "NSAID", commonDosages: ["50mg"] },
    Bicozin: { brandName: "Bicozin", genericName: "Diclofenac", category: "NSAID", commonDosages: ["50mg"] },
    
    // Antidiabetics
    Diflu: { brandName: "Diflu", genericName: "Glimepiride", category: "Antidiabetic", commonDosages: ["1mg", "2mg"] },
    Dinafex: { brandName: "Dinafex", genericName: "Glimepiride", category: "Antidiabetic", commonDosages: ["1mg", "2mg"] },
    
    // Others
    Denixil: { brandName: "Denixil", genericName: "Dexamethasone", category: "Corticosteroid", commonDosages: ["0.5mg", "4mg"] },
    Disopan: { brandName: "Disopan", genericName: "Diazepam", category: "Benzodiazepine", commonDosages: ["5mg", "10mg"] },
    Etizin: { brandName: "Etizin", genericName: "Etizolam", category: "Benzodiazepine", commonDosages: ["0.5mg", "1mg"] },
    Exium: { brandName: "Exium", genericName: "Esomeprazole", category: "Proton Pump Inhibitor", commonDosages: ["20mg", "40mg"] },
  };
}

/**
 * Match extracted text to known medicines
 */
export function matchMedicine(text: string): {
  matched: boolean;
  medicine?: MedicineEntry;
  confidence: number;
  suggestions: string[];
} {
  const normalizedText = text.trim().toLowerCase();
  
  // Exact match
  for (const [name, entry] of Object.entries(medicineDatabase)) {
    if (name.toLowerCase() === normalizedText) {
      return { matched: true, medicine: entry, confidence: 1.0, suggestions: [] };
    }
  }

  // Partial match / fuzzy matching
  const suggestions: { name: string; entry: MedicineEntry; score: number }[] = [];
  
  for (const [name, entry] of Object.entries(medicineDatabase)) {
    const lowerName = name.toLowerCase();
    
    // Check if input contains the medicine name
    if (normalizedText.includes(lowerName)) {
      suggestions.push({ name, entry, score: 0.9 });
    }
    // Check if medicine name contains the input
    else if (lowerName.includes(normalizedText)) {
      suggestions.push({ name, entry, score: 0.8 });
    }
    // Levenshtein-like similarity (simple version)
    else {
      const similarity = calculateSimilarity(normalizedText, lowerName);
      if (similarity > 0.6) {
        suggestions.push({ name, entry, score: similarity });
      }
    }
  }

  // Sort by score
  suggestions.sort((a, b) => b.score - a.score);

  if (suggestions.length > 0) {
    return {
      matched: suggestions[0].score > 0.8,
      medicine: suggestions[0].entry,
      confidence: suggestions[0].score,
      suggestions: suggestions.slice(0, 5).map(s => `${s.name} (${s.entry.genericName})`),
    };
  }

  return { matched: false, confidence: 0, suggestions: [] };
}

/**
 * Simple string similarity (Jaccard index)
 */
function calculateSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(""));
  const setB = new Set(b.split(""));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

/**
 * Extract medicine information from OCR text
 */
export function extractMedicinesFromText(ocrText: string): {
  medicines: {
    text: string;
    matched: boolean;
    medicine?: MedicineEntry;
    confidence: number;
  }[];
  unmatchedTerms: string[];
} {
  // Split text into words/tokens
  const words = ocrText.split(/[\s,;:\n]+/).filter((w) => w.length > 2);
  
  const medicines: {
    text: string;
    matched: boolean;
    medicine?: MedicineEntry;
    confidence: number;
  }[] = [];
  
  const unmatchedTerms: string[] = [];
  const matchedTerms = new Set<string>();

  for (const word of words) {
    if (matchedTerms.has(word.toLowerCase())) continue;
    
    const result = matchMedicine(word);
    if (result.matched || result.confidence > 0.7) {
      medicines.push({
        text: word,
        matched: result.matched,
        medicine: result.medicine,
        confidence: result.confidence,
      });
      matchedTerms.add(word.toLowerCase());
    } else if (!result.matched && word.length > 3) {
      unmatchedTerms.push(word);
    }
  }

  return { medicines, unmatchedTerms };
}

/**
 * Get all known medicine names (for autocomplete/suggestions)
 */
export function getAllMedicineNames(): string[] {
  return Object.keys(medicineDatabase);
}

/**
 * Get medicine by generic name
 */
export function getMedicinesByGeneric(genericName: string): MedicineEntry[] {
  const lowerGeneric = genericName.toLowerCase();
  return Object.values(medicineDatabase).filter(
    (entry) => entry.genericName.toLowerCase().includes(lowerGeneric)
  );
}

// Initialize on module load
loadMedicineDatabase();
