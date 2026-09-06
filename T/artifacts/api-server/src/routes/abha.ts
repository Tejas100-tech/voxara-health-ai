import { Router } from "express";
import { logger } from "../lib/logger";
import { verifyAbhaNumber, createDemoAbha, isValidAbhaNumber, normalizeAbhaNumber } from "../lib/abha";

const router = Router();

// ── ABHA verification (ABDM sandbox or simulated sandbox response) ─────────
// POST /api/abha/verify  { abhaNumber, name?, gender?, dateOfBirth?, mobile? }
router.post("/abha/verify", async (req, res) => {
  try {
    const { abhaNumber, name, gender, dateOfBirth, mobile } = req.body || {};
    if (!abhaNumber || typeof abhaNumber !== "string") {
      res.status(400).json({ verified: false, message: "abhaNumber is required" });
      return;
    }
    if (!isValidAbhaNumber(abhaNumber)) {
      res.status(400).json({
        verified: false,
        abhaNumber: normalizeAbhaNumber(abhaNumber),
        message: "ABHA number must be 14 digits (e.g. 91-2345-6789-0123). You can continue without ABHA.",
      });
      return;
    }

    const result = await verifyAbhaNumber({ abhaNumber, name, gender, dateOfBirth, mobile });
    res.json(result);
  } catch (err) {
    logger.error({ err }, "ABHA verification failed");
    res.status(500).json({ verified: false, message: "Failed to verify ABHA. Please try again." });
  }
});

// ── ABHA (demo) creation for kiosk onboarding ──────────────────────────────
// POST /api/abha/register  { name?, phone?, dob? }
router.post("/abha/register", async (req, res) => {
  try {
    const { name, phone, dob } = req.body || {};
    const result = await createDemoAbha({ name, phone, dob });
    res.json({ ...result, name });
  } catch (err) {
    logger.error({ err }, "ABHA registration failed");
    res.status(500).json({ success: false, message: "Failed to create ABHA. Please try again." });
  }
});

export default router;
