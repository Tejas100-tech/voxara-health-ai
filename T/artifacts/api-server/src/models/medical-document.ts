import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalDocument extends Document {
  documentId: string;
  sessionId: string;
  patientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadUrl?: string;
  cloudinaryPublicId?: string;
  documentType: "prescription" | "lab_report" | "discharge_summary" | "imaging" | "other";
  ocrText: string;
  extractedData: {
    diagnoses: string[];
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
    labResults: Array<{
      testName: string;
      value: string;
      referenceRange: string;
      isAbnormal: boolean;
    }>;
    procedures: string[];
    physicianName?: string;
    facilityName?: string;
    documentDate?: string;
  };
  processingStatus: "pending" | "processing" | "completed" | "failed";
  chronologicalOrder: number;
  createdAt: Date;
}

const MedicalDocumentSchema = new Schema<IMedicalDocument>(
  {
    documentId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    patientId: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadUrl: { type: String },
    cloudinaryPublicId: { type: String },
    documentType: {
      type: String,
      enum: ["prescription", "lab_report", "discharge_summary", "imaging", "other"],
      default: "other",
    },
    ocrText: { type: String, default: "" },
    extractedData: {
      diagnoses: [String],
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
        },
      ],
      labResults: [
        {
          testName: String,
          value: String,
          referenceRange: String,
          isAbnormal: Boolean,
        },
      ],
      procedures: [String],
      physicianName: String,
      facilityName: String,
      documentDate: String,
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    chronologicalOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MedicalDocumentSchema.index({ sessionId: 1 });
MedicalDocumentSchema.index({ patientId: 1, createdAt: -1 });

export const MedicalDocument = mongoose.model<IMedicalDocument>(
  "MedicalDocument",
  MedicalDocumentSchema
);
