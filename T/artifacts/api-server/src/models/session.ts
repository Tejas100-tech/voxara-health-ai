import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  patientId: string;
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
  audioUrl?: string;
  audioPublicId?: string;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true, default: "PT-001" },
    capturedAt: { type: String, required: true },
    duration: { type: Number, required: true },
    clarity: { type: Number, required: true },
    tremor: { type: Number, required: true },
    breathlessness: { type: Number, required: true },
    pitchConsistency: { type: Number, required: true },
    speechRate: { type: Number, required: true },
    confidence: { type: Number, required: true },
    noiseFloor: { type: Number, required: true },
    risk: { type: String, enum: ["Low", "Moderate", "Elevated"], required: true },
    transcript: { type: String, required: true },
    waveform: [{ type: Number }],
    audioUrl: { type: String },
    audioPublicId: { type: String },
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>("Session", SessionSchema);
