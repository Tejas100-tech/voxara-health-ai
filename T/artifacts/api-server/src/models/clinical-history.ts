import mongoose, { Schema, Document } from "mongoose";

export interface IClinicalHistory extends Document {
  historyId: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  abhaId?: string;
  chiefComplaint: string;
  hpi: {
    onset?: string;
    duration?: string;
    character?: string;
    radiation?: string;
    aggravatingFactors?: string[];
    relievingFactors?: string[];
    severity?: string;
    timing?: string;
    associatedSymptoms?: string[];
  };
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  drugHistory: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  allergyHistory: Array<{
    allergen: string;
    reaction: string;
    severity: string;
  }>;
  familyHistory: string[];
  personalHistory: {
    smoking?: string;
    alcohol?: string;
    occupation?: string;
    dietaryHabits?: string;
    exerciseHabits?: string;
    sleepPattern?: string;
  };
  reviewOfSystems: Record<string, string>;
  ayushHistory?: {
    prakriti?: string;
    vikriti?: string;
    sara?: string;
    samhanana?: string;
    pramana?: string;
    satmya?: string;
    sattva?: string;
    aharaShakti?: string;
    vyayamaShakti?: string;
    vaya?: string;
    agni?: string;
    koshtha?: string;
    aharaVihara?: string;
    nidana?: string;
    samprapti?: string;
  };
  priorInvestigations: Array<{
    testName: string;
    value: string;
    referenceRange: string;
    isAbnormal: boolean;
    date?: string;
    source?: string;
  }>;
  aiSummary: string;
  redFlags: string[];
  completenessScore: number;
  physicianReviewed: boolean;
  physicianEdits?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ClinicalHistorySchema = new Schema<IClinicalHistory>(
  {
    historyId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    abhaId: { type: String },
    chiefComplaint: { type: String, required: true },
    hpi: {
      onset: String,
      duration: String,
      character: String,
      radiation: String,
      aggravatingFactors: [String],
      relievingFactors: [String],
      severity: String,
      timing: String,
      associatedSymptoms: [String],
    },
    pastMedicalHistory: [String],
    pastSurgicalHistory: [String],
    drugHistory: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    allergyHistory: [
      {
        allergen: String,
        reaction: String,
        severity: String,
      },
    ],
    familyHistory: [String],
    personalHistory: {
      smoking: String,
      alcohol: String,
      occupation: String,
      dietaryHabits: String,
      exerciseHabits: String,
      sleepPattern: String,
    },
    reviewOfSystems: { type: Schema.Types.Mixed, default: {} },
    ayushHistory: {
      prakriti: String,
      vikriti: String,
      sara: String,
      samhanana: String,
      pramana: String,
      satmya: String,
      sattva: String,
      aharaShakti: String,
      vyayamaShakti: String,
      vaya: String,
      agni: String,
      koshtha: String,
      aharaVihara: String,
      nidana: String,
      samprapti: String,
    },
    priorInvestigations: [
      {
        testName: String,
        value: String,
        referenceRange: String,
        isAbnormal: Boolean,
        date: String,
        source: String,
      },
    ],
    aiSummary: { type: String, required: true },
    redFlags: [String],
    completenessScore: { type: Number, default: 0 },
    physicianReviewed: { type: Boolean, default: false },
    physicianEdits: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

ClinicalHistorySchema.index({ patientId: 1, createdAt: -1 });
ClinicalHistorySchema.index({ sessionId: 1 });

export const ClinicalHistory = mongoose.model<IClinicalHistory>(
  "ClinicalHistory",
  ClinicalHistorySchema
);
