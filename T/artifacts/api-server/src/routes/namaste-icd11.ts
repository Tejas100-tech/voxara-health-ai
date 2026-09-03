import { Router } from "express";
import { logger } from "../lib/logger";
import {
  searchNAMASTE,
  searchICD11,
  translateCode,
  generateConceptMap,
  generateCodeSystem,
  NAMASTE_CODES,
} from "../lib/namaste-icd11";

const router = Router();

// ── Health Check ─────────────────────────────────────────────────────────
router.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "NAMASTE-ICD11 Integration API",
    version: "1.0.0",
    endpoints: {
      namasteSearch: "/api/namaste/search",
      icd11Search: "/api/icd11/search",
      translate: "/api/translate",
      conceptmap: "/api/conceptmap",
      fhirMetadata: "/fhir/metadata",
    },
  });
});

// ── NAMASTE Search ───────────────────────────────────────────────────────
router.get("/namaste/search", (req, res) => {
  try {
    const { q, system, limit } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const results = searchNAMASTE(q, system as string, parseInt(limit as string) || 10);

    res.json({
      query: q,
      system: system || "all",
      count: results.length,
      results: results.map((code) => ({
        code: code.code,
        display: code.display,
        definition: code.definition,
        system: code.system,
        category: code.category,
        bodySystem: code.bodySystem,
        terminologyUri: `http://terminology.mohayush.gov.in/namaste`,
      })),
    });
  } catch (err) {
    logger.error({ err }, "NAMASTE search failed");
    res.status(500).json({ error: "Search failed" });
  }
});

// ── ICD-11 Search ────────────────────────────────────────────────────────
router.get("/icd11/search", (req, res) => {
  try {
    const { q, system, limit } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }

    const results = searchICD11(q, (system as string) || "both", parseInt(limit as string) || 10);

    res.json({
      query: q,
      system: system || "both",
      count: results.length,
      results: results.map((code) => ({
        code: code.code,
        display: code.display,
        system: code.system,
        chapter: code.chapter,
        terminologyUri:
          code.system === "tm2"
            ? "http://id.who.int/icd/release/11/2023-01/tm2"
            : "http://id.who.int/icd/release/11/2023-01/mms",
      })),
    });
  } catch (err) {
    logger.error({ err }, "ICD-11 search failed");
    res.status(500).json({ error: "Search failed" });
  }
});

// ── Code Translation ─────────────────────────────────────────────────────
router.get("/translate", (req, res) => {
  try {
    const { system, code, target } = req.query;

    if (!system || !code) {
      res.status(400).json({ error: "Parameters 'system' and 'code' are required" });
      return;
    }

    const results = translateCode(system as string, code as string, (target as string) || "both");

    res.json({
      source: {
        system: system,
        code: code,
      },
      target: target || "both",
      mappings: results,
      count: results.length,
    });
  } catch (err) {
    logger.error({ err }, "Translation failed");
    res.status(500).json({ error: "Translation failed" });
  }
});

// ── ConceptMap ───────────────────────────────────────────────────────────
router.get("/conceptmap", (_req, res) => {
  try {
    const conceptMap = generateConceptMap();
    res.json(conceptMap);
  } catch (err) {
    logger.error({ err }, "ConceptMap generation failed");
    res.status(500).json({ error: "ConceptMap generation failed" });
  }
});

// ── FHIR Metadata ───────────────────────────────────────────────────────
router.get("/fhir/metadata", (_req, res) => {
  res.json({
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toISOString(),
    kind: "instance",
    software: {
      name: "MediKiosk NAMASTE-ICD11 Service",
      version: "1.0.0",
    },
    rest: [
      {
        mode: "server",
        resource: [
          {
            type: "CodeSystem",
            interaction: [{ code: "read" }, { code: "search-type" }],
          },
          {
            type: "ConceptMap",
            interaction: [{ code: "read" }],
          },
          {
            type: "ValueSet",
            interaction: [{ code: "read" }, { code: "search-type" }],
          },
        ],
      },
    ],
  });
});

// ── FHIR CodeSystem ─────────────────────────────────────────────────────
router.get("/fhir/CodeSystem/namaste", (_req, res) => {
  try {
    const codeSystem = generateCodeSystem();
    res.json(codeSystem);
  } catch (err) {
    logger.error({ err }, "CodeSystem generation failed");
    res.status(500).json({ error: "CodeSystem generation failed" });
  }
});

// ── FHIR ConceptMap ──────────────────────────────────────────────────────
router.get("/fhir/ConceptMap", (_req, res) => {
  try {
    const conceptMap = generateConceptMap();
    res.json(conceptMap);
  } catch (err) {
    logger.error({ err }, "FHIR ConceptMap generation failed");
    res.status(500).json({ error: "ConceptMap generation failed" });
  }
});

// ── Get all NAMASTE codes (for dropdowns/selectors) ──────────────────────
router.get("/namaste/codes", (_req, res) => {
  res.json({
    count: NAMASTE_CODES.length,
    codes: NAMASTE_CODES,
  });
});

export default router;
