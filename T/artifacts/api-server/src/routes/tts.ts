import { Router } from "express";
import { synthesizeSpeechSarvam, toSarvamTtsCode } from "../lib/sarvam-tts";

const router = Router();

// ── Cloud text-to-speech for the accessibility audio prompts ──────────────
// POST /api/tts  { text, language (app code, e.g. "hi"), pace? }
// → { audio: "<base64 mp3>", mimeType: "audio/mpeg" }
// 422 when the language has no Sarvam voice (client falls back to device TTS)
router.post("/tts", async (req, res) => {
  try {
    const text: unknown = req.body?.text;
    const language: unknown = req.body?.language || "en";
    const pace: unknown = req.body?.pace;

    if (typeof text !== "string" || !text.trim()) {
      res.status(400).json({ error: "text is required" });
      return;
    }
    if (text.length > 2000) {
      res.status(400).json({ error: "text is too long (max 2000 characters)" });
      return;
    }

    const langCode = toSarvamTtsCode(String(language));
    if (!langCode) {
      res.status(422).json({ error: `No cloud voice for language "${language}"` });
      return;
    }

    const paceNum = typeof pace === "number" && pace >= 0.5 && pace <= 2 ? pace : undefined;
    const result = await synthesizeSpeechSarvam(text.trim(), {
      languageCode: langCode,
      pace: paceNum,
    });

    res.json({ audio: result.audioBase64, mimeType: result.mimeType, languageCode: langCode });
  } catch (err: any) {
    res.status(502).json({ error: `Speech synthesis failed: ${err?.message || err}` });
  }
});

export default router;
