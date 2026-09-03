import { logger } from "./logger";

// Sarvam AI Speech-to-Text Configuration
const SARVAM_API_URL = "https://api.sarvam.ai/speech-to-text";

interface SarvamTranscriptionResult {
  transcript: string;
  languageCode: string | null;
  languageProbability?: number;
  timestamps?: {
    words: string[];
    start_time_seconds: number[];
    end_time_seconds: number[];
  };
}

/**
 * Transcribe audio using Sarvam AI's Speech-to-Text API
 * Supports 22+ Indian languages and English
 * Accepts various audio formats (WebM, OGG, WAV, MP3)
 */
export async function transcribeWithSarvam(
  audioBuffer: Buffer,
  options: {
    languageCode?: string;
    model?: "saaras:v3" | "saaras:v4";
    mode?: "transcribe" | "translate" | "verbatim" | "translit" | "codemix";
    withTimestamps?: boolean;
    mimeType?: string;
  } = {}
): Promise<SarvamTranscriptionResult> {
  const apiKey = process.env["SARVAM_API_KEY"];
  if (!apiKey) {
    throw new Error("Sarvam API key not configured (SARVAM_API_KEY)");
  }

  const formData = new FormData();

  // Detect MIME type from the buffer or use provided mimeType
  // Strip codecs parameter (e.g. 'audio/webm;codecs=opus' -> 'audio/webm')
  const rawMimeType = options.mimeType || "audio/webm";
  const mimeType = rawMimeType.split(";")[0].trim();
  const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("wav") ? "wav" : mimeType.includes("mp3") ? "mp3" : "webm";
  
  // Create a Blob from the buffer with correct MIME type
  const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
  formData.append("file", audioBlob, `audio.${ext}`);

  // Add optional parameters
  if (options.languageCode && options.languageCode !== "unknown") {
    formData.append("language_code", options.languageCode);
  }
  // Always use v4 for best accuracy
  formData.append("model", options.model || "saaras:v4");
  formData.append("mode", options.mode || "transcribe");
  
  if (options.withTimestamps) {
    formData.append("with_timestamps", "true");
  }

  try {
    const response = await fetch(SARVAM_API_URL, {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sarvam API error (${response.status}): ${errorText}`);
    }

    const data = await response.json() as any;

    return {
      transcript: data.transcript || "",
      languageCode: data.language_code,
      languageProbability: data.language_probability,
      timestamps: data.timestamps,
    };
  } catch (error: any) {
    logger.error({ error: error.message }, "Sarvam transcription failed");
    throw error;
  }
}

/**
 * Detect the language of audio using Sarvam AI
 */
export async function detectLanguage(
  audioBuffer: Buffer
): Promise<{ languageCode: string; probability: number }> {
  const result = await transcribeWithSarvam(audioBuffer, {
    languageCode: "unknown",
    model: "saaras:v4",
  });

  return {
    languageCode: result.languageCode || "en-IN",
    probability: result.languageProbability || 0.5,
  };
}

/**
 * Translate audio from Indian language to English
 */
export async function translateAudioToEnglish(
  audioBuffer: Buffer,
  sourceLanguage?: string
): Promise<string> {
  const result = await transcribeWithSarvam(audioBuffer, {
    languageCode: sourceLanguage,
    mode: "translate",
    model: "saaras:v3",
  });

  return result.transcript;
}

/**
 * Get supported Indian languages
 */
export function getSupportedLanguages(): { code: string; name: string }[] {
  return [
    { code: "hi-IN", name: "Hindi" },
    { code: "bn-IN", name: "Bengali" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "mr-IN", name: "Marathi" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "pa-IN", name: "Punjabi" },
    { code: "od-IN", name: "Odia" },
    { code: "as-IN", name: "Assamese" },
    { code: "ur-IN", name: "Urdu" },
    { code: "ne-IN", name: "Nepali" },
    { code: "sa-IN", name: "Sanskrit" },
    { code: "en-IN", name: "English" },
  ];
}

/**
 * Map UI language codes to Sarvam language codes
 */
export function mapLanguageCode(uiCode: string): string {
  const mapping: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    te: "te-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
    or: "od-IN",
    as: "as-IN",
    ur: "ur-IN",
    ne: "ne-IN",
    sa: "sa-IN",
  };

  return mapping[uiCode] || "en-IN";
}
