// ── Sarvam AI Text-to-Speech ──────────────────────────────────────────────
// Cloud TTS so audio prompts sound right on ANY device (no reliance on the
// device's installed voices). Sarvam covers the major Indian languages.

const SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech";

// Sarvam's supported language codes (BCP-47)
const SARVAM_TTS_LANGUAGES: readonly string[] = [
  "en-IN", "hi-IN", "bn-IN", "gu-IN", "kn-IN", "ml-IN",
  "mr-IN", "od-IN", "pa-IN", "ta-IN", "te-IN",
];

/** Map the app's language code to the closest Sarvam TTS code (or undefined). */
export function toSarvamTtsCode(appLang: string): string | undefined {
  const map: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    bn: "bn-IN",
    ta: "ta-IN",
    te: "te-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
    or: "od-IN",
  };
  const code = map[appLang];
  return code && SARVAM_TTS_LANGUAGES.includes(code) ? code : undefined;
}

export interface SarvamTtsResult {
  audioBase64: string;
  mimeType: string; // audio/mpeg
}

/**
 * Convert text into speech via Sarvam AI (bulbul:v3, MP3 output).
 * Throws on API errors so callers can fall back to device speech.
 */
export async function synthesizeSpeechSarvam(
  text: string,
  options: { languageCode: string; pace?: number; speaker?: string } = { languageCode: "hi-IN" }
): Promise<SarvamTtsResult> {
  const apiKey = process.env["SARVAM_API_KEY"];
  if (!apiKey) {
    throw new Error("Sarvam API key not configured (SARVAM_API_KEY)");
  }

  const response = await fetch(SARVAM_TTS_URL, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      language_code: options.languageCode,
      model: "bulbul:v3",
      speaker: options.speaker || "shubh",
      pace: options.pace ?? 0.92, // slightly slower for elderly/low-literacy clarity
      output_audio_codec: "mp3",
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sarvam TTS error (${response.status}): ${errorText.slice(0, 300)}`);
  }

  const data = (await response.json()) as any;
  const audioBase64: string | undefined = data?.audios?.[0];
  if (!audioBase64) {
    throw new Error("Sarvam TTS returned no audio");
  }

  return { audioBase64, mimeType: "audio/mpeg" };
}

export { SARVAM_TTS_LANGUAGES };
