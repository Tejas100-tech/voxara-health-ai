import mongoose, { Schema, Document } from "mongoose";

export interface IIntakeSession extends Document {
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  language: string;
  mode: "allopathic" | "ayush";
  step: "identify" | "converse" | "scan" | "summarize" | "complete";
  consentGranted: boolean;
  consentTimestamp?: Date;
  chiefComplaint?: string;
  historyAnswers: Record<string, unknown>;
  redFlags: string[];
  summaryGenerated: boolean;
  summaryContent?: string;
  physicianNotified: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
}

const IntakeSessionSchema = new Schema<IIntakeSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    patientId: { type: String, required: true, default: "PT-001" },
    patientName: { type: String, required: true },
    abhaId: { type: String },
    language: { type: String, default: "en" },
    mode: { type: String, enum: ["allopathic", "ayush"], default: "allopathic" },
    step: {
      type: String,
      enum: ["identify", "converse", "scan", "summarize", "complete"],
      default: "identify",
    },
    consentGranted: { type: Boolean, default: false },
    consentTimestamp: { type: Date },
    chiefComplaint: { type: String },
    historyAnswers: { type: Schema.Types.Mixed, default: {} },
    redFlags: [{ type: String }],
    summaryGenerated: { type: Boolean, default: false },
    summaryContent: { type: String },
    physicianNotified: { type: Boolean, default: false },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

IntakeSessionSchema.index({ patientId: 1, createdAt: -1 });
IntakeSessionSchema.index({ step: 1 });

export const IntakeSession = mongoose.model<IIntakeSession>(
  "IntakeSession",
  IntakeSessionSchema
);
