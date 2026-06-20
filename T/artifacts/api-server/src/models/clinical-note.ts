import mongoose, { Schema, Document } from "mongoose";

export interface IClinicalNote extends Document {
  patientId: string;
  patientName: string;
  clinicianId: string;
  clinicianName: string;
  content: string;
  sessionId?: string;
  noteType: "observation" | "medication" | "escalation" | "appointment" | "general";
  priority: "routine" | "urgent" | "critical";
  createdAt: Date;
}

const ClinicalNoteSchema = new Schema<IClinicalNote>(
  {
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    clinicianId: { type: String, required: true },
    clinicianName: { type: String, required: true },
    content: { type: String, required: true },
    sessionId: { type: String },
    noteType: {
      type: String,
      enum: ["observation", "medication", "escalation", "appointment", "general"],
      default: "observation",
    },
    priority: {
      type: String,
      enum: ["routine", "urgent", "critical"],
      default: "routine",
    },
  },
  { timestamps: true }
);

export const ClinicalNote = mongoose.model<IClinicalNote>("ClinicalNote", ClinicalNoteSchema);
