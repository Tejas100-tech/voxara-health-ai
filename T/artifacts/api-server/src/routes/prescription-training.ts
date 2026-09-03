import { Router, Request, Response } from "express";
import { logger } from "../lib/logger";
import {
  matchMedicine,
  extractMedicinesFromText,
  getAllMedicineNames,
  getMedicinesByGeneric,
  loadMedicineDatabase,
} from "../lib/prescription-ocr-training";

const router = Router();

// Reload medicine database
router.post("/prescription/reload-database", (_req: Request, res: Response) => {
  try {
    loadMedicineDatabase();
    const names = getAllMedicineNames();
    const count = names.length;
    res.json({ success: true, message: "Medicine database reloaded with " + count + " medicines" });
  } catch (err) {
    logger.error("Failed to reload medicine database");
    res.status(500).json({ error: "Failed to reload database" });
  }
});

// Get all medicine names
router.get("/prescription/medicines", (_req: Request, res: Response) => {
  try {
    const names = getAllMedicineNames();
    res.json({ count: names.length, medicines: names });
  } catch (err) {
    logger.error("Failed to get medicines");
    res.status(500).json({ error: "Failed to get medicines" });
  }
});

// Match a medicine name
router.get("/prescription/match", (req: Request, res: Response) => {
  try {
    const q = String(req.query.q || "");
    if (!q) {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const result = matchMedicine(q);
    res.json({
      query: q,
      matched: result.matched,
      medicine: result.medicine,
      confidence: result.confidence,
      suggestions: result.suggestions,
    });
  } catch (err) {
    logger.error("Medicine matching failed");
    res.status(500).json({ error: "Matching failed" });
  }
});

// Extract medicines from OCR text
router.post("/prescription/extract", (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "text is required" });
      return;
    }

    const result = extractMedicinesFromText(text);
    res.json({
      inputText: text,
      medicines: result.medicines,
      unmatchedTerms: result.unmatchedTerms,
    });
  } catch (err) {
    logger.error("Medicine extraction failed");
    res.status(500).json({ error: "Extraction failed" });
  }
});

// Get medicines by generic name
router.get("/prescription/generic/:name", (req: Request, res: Response) => {
  try {
    const genericName = String(req.params.name || "");
    const medicines = getMedicinesByGeneric(genericName);
    res.json({
      genericName: genericName,
      count: medicines.length,
      medicines: medicines,
    });
  } catch (err) {
    logger.error("Failed to get medicines by generic");
    res.status(500).json({ error: "Failed to get medicines" });
  }
});

// Get training dataset info
router.get("/prescription/dataset-info", (_req: Request, res: Response) => {
  res.json({
    dataset: "Doctors Handwritten Prescription BD",
    source: "Kaggle",
    stats: {
      totalImages: 4680,
      trainingImages: 3120,
      validationImages: 780,
      testingImages: 780,
      uniqueMedicines: 78,
    },
    categories: [
      "Analgesic/Antipyretic",
      "Antibiotic",
      "Antihistamine",
      "Antifungal",
      "Muscle Relaxant",
      "Proton Pump Inhibitor",
      "NSAID",
      "Antidiabetic",
      "Corticosteroid",
      "Benzodiazepine",
    ],
    labels: ["IMAGE", "MEDICINE_NAME", "GENERIC_NAME"],
  });
});

export default router;
