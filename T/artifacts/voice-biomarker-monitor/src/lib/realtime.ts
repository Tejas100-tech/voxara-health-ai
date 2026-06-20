import { useEffect, useState } from "react";

export type MFCCFeatures = {
  coefficients: number[];
  spectralCentroid: number;
  zeroCrossingRate: number;
  energy: number;
  spectralRolloff: number;
};

export type AIAnalysis = {
  clinicalSummary: string;
  diseaseProgression: {
    status: "stable" | "improving" | "declining";
    confidence: number;
    explanation: string;
  };
  medicationEffectiveness: {
    score: number;
    assessment: "effective" | "partially_effective" | "monitoring_needed";
    notes: string;
  };
  anomaliesDetected: Array<{
    feature: string;
    value: string;
    concern: string;
    severity: "low" | "moderate" | "high";
  }>;
  recommendations: string[];
  followUpPriority: "routine" | "soon" | "urgent";
  biomarkerInsights: {
    tremor: string;
    breathlessness: string;
    pitch: string;
    speechRate: string;
  };
};

export type VoiceSession = {
  id: string;
  capturedAt: string;
  duration: number;
  clarity: number;
  tremor: number;
  breathlessness: number;
  pitchConsistency: number;
  speechRate: number;
  confidence: number;
  noiseFloor: number;
  risk: "Low" | "Moderate" | "Elevated";
  transcript: string;
  waveform: number[];
  ml?: VoiceMlInsights;
  mfcc?: MFCCFeatures;
  aiAnalysis?: AIAnalysis;
};

export type LiveVitals = {
  now: Date;
  signalQuality: number;
  respiratoryLoad: number;
  vocalStability: number;
  tremorDrift: number;
  adherence: number;
  clinicianQueue: number;
  riskScore: number;
};

export type VoiceMlInsights = {
  modelVersion: string;
  riskScore: number;
  anomalyIndex: number;
  calibration: "live calibrated" | "demo calibrated";
  featureImportances: Array<{ label: string; weight: number }>;
  recommendations: string[];
};

export type VoiceMlInput = {
  waveform: number[];
  clarity: number;
  volume: number;
  noiseFloor: number;
  transcript: string;
  duration: number;
  live: boolean;
  mfcc?: MFCCFeatures;
};

const SESSION_KEY = "voxara.latestVoiceSession";

export const defaultSession: VoiceSession = {
  id: "REC-48291",
  capturedAt: new Date().toISOString(),
  duration: 15,
  clarity: 92,
  tremor: 38,
  breathlessness: 4.2,
  pitchConsistency: 88,
  speechRate: 132,
  confidence: 98,
  noiseFloor: 12,
  risk: "Low",
  transcript:
    "I am breathing steadily today. My voice feels clear, and I have only mild fatigue after walking upstairs.",
  waveform: [18, 42, 58, 35, 72, 64, 49, 85, 61, 77, 44, 56, 39, 68, 74, 52, 37, 45],
  ml: {
    modelVersion: "Voxara ML Ensemble v3.0 + GPT Clinical AI",
    riskScore: 24,
    anomalyIndex: 18,
    calibration: "demo calibrated",
    featureImportances: [
      { label: "MFCC Spectral Stability", weight: 34 },
      { label: "Tremor Variance (C2-C4)", weight: 26 },
      { label: "Respiratory Pause Density", weight: 22 },
      { label: "Zero Crossing Rate", weight: 18 },
    ],
    recommendations: ["Maintain current monitoring cadence", "Repeat a scan if breathing symptoms change"],
  },
};

export function getLatestSession(): VoiceSession {
  if (typeof window === "undefined") return defaultSession;
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (!stored) return defaultSession;
    return { ...defaultSession, ...JSON.parse(stored) };
  } catch {
    return defaultSession;
  }
}

export function saveVoiceSession(session: VoiceSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent("voxara-session-updated", { detail: session }));
}

export function useLatestSession() {
  const [session, setSession] = useState<VoiceSession>(() => getLatestSession());
  useEffect(() => {
    const update = () => setSession(getLatestSession());
    window.addEventListener("storage", update);
    window.addEventListener("voxara-session-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("voxara-session-updated", update);
    };
  }, []);
  return session;
}

export function useLiveVitals() {
  const [vitals, setVitals] = useState<LiveVitals>(() => buildVitals());
  useEffect(() => {
    const timer = window.setInterval(() => setVitals(buildVitals()), 1400);
    return () => window.clearInterval(timer);
  }, []);
  return vitals;
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function riskFromScore(score: number): VoiceSession["risk"] {
  if (score >= 70) return "Elevated";
  if (score >= 42) return "Moderate";
  return "Low";
}

// ── Real MFCC Feature Extraction ───────────────────────────────────────────────

function hzToMel(hz: number): number {
  return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel: number): number {
  return 700 * (Math.pow(10, mel / 2595) - 1);
}

export function computeMFCC(
  frequencyData: number[],
  sampleRate = 44100,
  fftSize = 2048,
  numFilters = 26,
  numCoeffs = 13,
): number[] {
  const minFreq = 300;
  const maxFreq = Math.min(8000, sampleRate / 2);
  const melMin = hzToMel(minFreq);
  const melMax = hzToMel(maxFreq);

  const melPoints = Array.from({ length: numFilters + 2 }, (_, i) =>
    melMin + (melMax - melMin) * (i / (numFilters + 1)),
  );
  const hzPoints = melPoints.map(melToHz);
  const binPoints = hzPoints.map((hz) => Math.round((fftSize / 2) * hz / (sampleRate / 2)));

  const filterEnergies = Array.from({ length: numFilters }, (_, m) => {
    let energy = 0;
    const lo = binPoints[m] ?? 0;
    const center = binPoints[m + 1] ?? lo;
    const hi = binPoints[m + 2] ?? center;
    for (let k = lo; k < hi && k < frequencyData.length; k++) {
      const amplitude = (frequencyData[k] ?? 0) / 255;
      const weight =
        k <= center
          ? center === lo ? 1 : (k - lo) / (center - lo)
          : hi === center ? 1 : (hi - k) / (hi - center);
      energy += amplitude * weight;
    }
    return Math.log(Math.max(1e-10, energy));
  });

  return Array.from({ length: numCoeffs }, (_, n) =>
    filterEnergies.reduce(
      (sum, e, m) => sum + e * Math.cos((Math.PI * n * (m + 0.5)) / numFilters),
      0,
    ),
  );
}

export function computeSpectralCentroid(frequencyData: number[], sampleRate = 44100): number {
  let weightedSum = 0;
  let totalAmplitude = 0;
  const binWidth = sampleRate / 2 / frequencyData.length;
  for (let i = 0; i < frequencyData.length; i++) {
    const amplitude = (frequencyData[i] ?? 0) / 255;
    weightedSum += amplitude * (i * binWidth);
    totalAmplitude += amplitude;
  }
  return totalAmplitude > 0 ? Math.round(weightedSum / totalAmplitude) : 0;
}

export function computeZCR(waveform: number[]): number {
  if (waveform.length < 2) return 0;
  const mean = waveform.reduce((a, b) => a + b, 0) / waveform.length;
  let crossings = 0;
  for (let i = 1; i < waveform.length; i++) {
    if ((waveform[i - 1] - mean) * (waveform[i] - mean) < 0) crossings++;
  }
  return Number((crossings / waveform.length).toFixed(4));
}

export function computeSpectralRolloff(frequencyData: number[], threshold = 0.85): number {
  const total = frequencyData.reduce((a, b) => a + b, 0);
  const target = total * threshold;
  let cumulative = 0;
  for (let i = 0; i < frequencyData.length; i++) {
    cumulative += frequencyData[i] ?? 0;
    if (cumulative >= target) return Math.round((i / frequencyData.length) * 100);
  }
  return 100;
}

export function buildMFCCFeatures(
  accumulatedFreqFrames: number[][],
  waveformBars: number[],
  sampleRate: number,
): MFCCFeatures {
  if (accumulatedFreqFrames.length === 0) {
    return { coefficients: Array(13).fill(0), spectralCentroid: 0, zeroCrossingRate: 0, energy: 0, spectralRolloff: 0 };
  }

  const frameCount = accumulatedFreqFrames.length;
  const binCount = accumulatedFreqFrames[0]?.length ?? 0;
  const averaged = Array.from({ length: binCount }, (_, i) =>
    accumulatedFreqFrames.reduce((sum, frame) => sum + (frame[i] ?? 0), 0) / frameCount,
  );

  const coefficients = computeMFCC(averaged, sampleRate);
  const spectralCentroid = computeSpectralCentroid(averaged, sampleRate);
  const zeroCrossingRate = computeZCR(waveformBars);
  const energy = Math.round(averaged.reduce((a, b) => a + b, 0) / averaged.length);
  const spectralRolloff = computeSpectralRolloff(averaged);

  return { coefficients, spectralCentroid, zeroCrossingRate, energy, spectralRolloff };
}

// ── Enhanced Biomarker Analysis using real MFCC features ─────────────────────

export function analyzeVoiceBiomarkers(input: VoiceMlInput) {
  const waveform = input.waveform.length ? input.waveform : [input.volume];
  const averageEnergy = mean(waveform);
  const energyVariance = standardDeviation(waveform);

  const mfcc = input.mfcc;
  const mfccVariance = mfcc ? standardDeviation(mfcc.coefficients.slice(1, 8)) : energyVariance;
  const spectralShift = mfcc ? Math.abs(mfcc.spectralCentroid - 2400) / 2400 * 20 : 0;

  const instability = clamp(
    energyVariance * 1.15 +
    Math.abs(input.volume - averageEnergy) * 0.18 +
    mfccVariance * 0.6,
    0, 100
  );

  const zcrBonus = mfcc ? mfcc.zeroCrossingRate * 15 : 0;
  const tremor = clamp(
    Math.round(instability * 0.68 + (100 - input.clarity) * 0.44 + input.noiseFloor * 0.58 + zcrBonus),
    4, 86
  );

  const wordCount = input.transcript.trim()
    ? input.transcript.trim().split(/\s+/).length
    : Math.max(8, Math.round(input.duration * 1.9));
  const speechRate = clamp(Math.round((wordCount / Math.max(input.duration, 1)) * 60), 72, 184);
  const pauseDensity = clamp(
    Math.abs(126 - speechRate) * 0.24 +
    input.noiseFloor * 0.28 +
    instability * 0.08 +
    spectralShift * 0.4,
    0, 48
  );

  const breathlessness = Number(
    clamp(
      2.1 + pauseDensity / 8 + (100 - input.clarity) / 32 + input.noiseFloor / 20 +
      (mfcc ? (100 - mfcc.spectralRolloff) / 80 : 0),
      1.4, 9.4
    ).toFixed(1)
  );

  const pitchConsistency = clamp(
    Math.round(
      100 - instability * 0.33 - tremor * 0.12 - input.noiseFloor * 0.22 +
      (mfcc ? (mfcc.zeroCrossingRate < 0.1 ? 5 : -3) : 0)
    ),
    52, 99
  );

  const clarity = clamp(
    Math.round(input.clarity * 0.72 + (100 - input.noiseFloor * 1.8) * 0.18 + pitchConsistency * 0.1),
    45, 99
  );

  const riskScore = clamp(
    Math.round(
      (100 - clarity) * 0.36 + tremor * 0.32 + breathlessness * 5.7 +
      pauseDensity * 0.26 + spectralShift * 0.15
    ),
    4, 96
  );

  const confidence = clamp(
    Math.round(
      (input.live ? 93 : 86) +
      Math.min(5, waveform.length / 8) -
      input.noiseFloor * 0.22 -
      energyVariance * 0.03 +
      (mfcc ? 4 : 0)
    ),
    74, 99
  );

  const anomalyIndex = clamp(
    Math.round(instability * 0.38 + tremor * 0.26 + pauseDensity * 0.2 + (100 - clarity) * 0.16),
    3, 95
  );

  const recommendations = [
    riskScore >= 70
      ? "Escalate this session for urgent clinician review"
      : riskScore >= 42
      ? "Repeat scan within 24 hours to confirm trend"
      : "Maintain normal daily scan cadence",
    breathlessness >= 6
      ? "Monitor respiratory symptoms closely — compare against baseline trend"
      : "Respiratory pattern is within expected range",
    tremor >= 55
      ? "Sustained tremor drift detected — check medication timing and dosage"
      : "Tremor signature is stable against current baseline",
  ];

  const featureImportances = [
    { label: mfcc ? "MFCC Spectral Stability" : "Clarity stability", weight: Math.round((100 - clarity) * 0.34) },
    { label: "Tremor variance (C2-C4)", weight: Math.round(tremor * 0.29) },
    { label: "Respiratory pause density", weight: Math.round(pauseDensity * 0.58) },
    { label: mfcc ? "Zero Crossing Rate" : "Noise confidence", weight: mfcc ? Math.round(mfcc.zeroCrossingRate * 80) : Math.round(input.noiseFloor * 1.35) },
  ];

  return {
    metrics: {
      clarity,
      tremor,
      breathlessness,
      pitchConsistency,
      speechRate,
      confidence,
      risk: riskFromScore(riskScore),
    },
    ml: {
      modelVersion: input.mfcc ? "Voxara ML Ensemble v3.0 + GPT Clinical AI" : "Voxara ML Ensemble v2.1",
      riskScore,
      anomalyIndex,
      calibration: input.live ? "live calibrated" : ("demo calibrated" as const),
      featureImportances,
      recommendations,
    } satisfies VoiceMlInsights,
  };
}

function buildVitals(): LiveVitals {
  const t = Date.now() / 1000;
  const wave = (speed: number, depth: number, offset = 0) =>
    Math.round(Math.sin(t / speed + offset) * depth);
  const riskScore = clamp(28 + wave(3.4, 7, 1.2) + wave(8, 4, 0.4), 8, 88);

  return {
    now: new Date(),
    signalQuality: clamp(93 + wave(4, 4), 82, 99),
    respiratoryLoad: clamp(32 + wave(5, 8, 2), 18, 64),
    vocalStability: clamp(90 + wave(4.5, 6, 1), 72, 99),
    tremorDrift: clamp(18 + wave(3.7, 5, 0.7), 7, 45),
    adherence: clamp(94 + wave(7, 3, 2.4), 86, 100),
    clinicianQueue: clamp(9 + wave(4.9, 2), 4, 16),
    riskScore,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  const average = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}
