import {
  pgTable,
  text,
  varchar,
  serial,
  integer,
  boolean,
  jsonb,
  timestamp,
  real,
} from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// ─── MediKiosk Intake Sessions ──────────────────────────────────────────────

export const intakeSessionsTable = pgTable("intake_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  patientName: varchar("patient_name", { length: 256 }).notNull(),
  abhaId: varchar("abha_id", { length: 32 }),
  language: varchar("language", { length: 16 }).notNull().default("en"),
  mode: varchar("mode", { length: 32 }).notNull().default("allopathic"),
  step: varchar("step", { length: 32 }).notNull().default("converse"),
  consentGranted: boolean("consent_granted").notNull().default(false),
  chiefComplaint: varchar("chief_complaint", { length: 128 }),
  historyAnswers: jsonb("history_answers").$type<Record<string, unknown>>().default({}),
  redFlags: jsonb("red_flags").$type<string[]>().default([]),
  summaryGenerated: boolean("summary_generated").notNull().default(false),
  summaryContent: text("summary_content"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type InsertIntakeSession = InferInsertModel<typeof intakeSessionsTable>;
export type IntakeSession = InferSelectModel<typeof intakeSessionsTable>;

// ─── Clinical Histories ─────────────────────────────────────────────────────

export const clinicalHistoriesTable = pgTable("clinical_histories", {
  id: serial("id").primaryKey(),
  historyId: varchar("history_id", { length: 128 }).notNull().unique(),
  sessionId: varchar("session_id", { length: 128 }).notNull(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  patientName: varchar("patient_name", { length: 256 }).notNull(),
  chiefComplaint: varchar("chief_complaint", { length: 256 }).notNull(),
  hpi: jsonb("hpi").$type<Record<string, unknown>>().default({}),
  pastMedicalHistory: jsonb("past_medical_history").$type<string[]>().default([]),
  pastSurgicalHistory: jsonb("past_surgical_history").$type<string[]>().default([]),
  drugHistory: jsonb("drug_history").$type<unknown[]>().default([]),
  allergyHistory: jsonb("allergy_history").$type<unknown[]>().default([]),
  familyHistory: jsonb("family_history").$type<string[]>().default([]),
  personalHistory: jsonb("personal_history").$type<Record<string, string>>().default({}),
  reviewOfSystems: jsonb("review_of_systems").$type<Record<string, string>>().default({}),
  priorInvestigations: jsonb("prior_investigations").$type<unknown[]>().default([]),
  aiSummary: text("ai_summary").notNull().default(""),
  redFlags: jsonb("red_flags").$type<string[]>().default([]),
  completenessScore: integer("completeness_score").notNull().default(0),
  physicianReviewed: boolean("physician_reviewed").notNull().default(false),
  physicianEdits: jsonb("physician_edits").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type InsertClinicalHistory = InferInsertModel<typeof clinicalHistoriesTable>;
export type ClinicalHistory = InferSelectModel<typeof clinicalHistoriesTable>;

// ─── Medical Documents ──────────────────────────────────────────────────────

export const medicalDocumentsTable = pgTable("medical_documents", {
  id: serial("id").primaryKey(),
  documentId: varchar("document_id", { length: 128 }).notNull().unique(),
  sessionId: varchar("session_id", { length: 128 }).notNull(),
  fileName: varchar("file_name", { length: 512 }).notNull(),
  fileType: varchar("file_type", { length: 128 }),
  documentType: varchar("document_type", { length: 64 }).notNull().default("other"),
  ocrText: text("ocr_text"),
  extractedData: jsonb("extracted_data").$type<Record<string, unknown>>().default({}),
  processingStatus: varchar("processing_status", { length: 32 }).notNull().default("pending"),
  chronologicalOrder: integer("chronological_order").notNull().default(0),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export type InsertMedicalDocument = InferInsertModel<typeof medicalDocumentsTable>;
export type MedicalDocument = InferSelectModel<typeof medicalDocumentsTable>;

// ─── SOS Emergency Alerts ───────────────────────────────────────────────────

export const sosAlertsTable = pgTable("sos_alerts", {
  id: serial("id").primaryKey(),
  alertId: varchar("alert_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  patientName: varchar("patient_name", { length: 256 }).notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  locationAccuracy: real("location_accuracy"),
  locationLabel: text("location_label"),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  message: text("message"),
  triggeredAt: timestamp("triggered_at").notNull().defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: varchar("acknowledged_by", { length: 256 }),
});

export type InsertSosAlert = InferInsertModel<typeof sosAlertsTable>;
export type SosAlert = InferSelectModel<typeof sosAlertsTable>;

// ─── AYUSH Chat Sessions ─────────────────────────────────────────────────

export const ayushChatSessionsTable = pgTable("ayush_chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  patientName: varchar("patient_name", { length: 256 }).notNull(),
  language: varchar("language", { length: 16 }).notNull().default("en"),
  mode: varchar("mode", { length: 32 }).notNull().default("pre_consultation"),
  messages: jsonb("messages").$type<Array<{ id: string; role: string; content: string; timestamp: string; extractedEntities?: Record<string, unknown> }>>().default([]),
  extractedData: jsonb("extracted_data").$type<Record<string, unknown>>().default({}),
  assessmentProgress: integer("assessment_progress").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertAyushChatSession = InferInsertModel<typeof ayushChatSessionsTable>;
export type AyushChatSession = InferSelectModel<typeof ayushChatSessionsTable>;

// ─── AYUSH Assessments ───────────────────────────────────────────────────

export const ayushAssessmentsTable = pgTable("ayush_assessments", {
  id: serial("id").primaryKey(),
  assessmentId: varchar("assessment_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  patientName: varchar("patient_name", { length: 256 }).notNull(),
  sessionId: varchar("session_id", { length: 128 }),
  chiefComplaint: varchar("chief_complaint", { length: 512 }),
  duration: varchar("duration", { length: 128 }),
  previousAyushTreatment: varchar("previous_ayush_treatment", { length: 256 }),
  prakriti: jsonb("prakriti").$type<Record<string, string>>(),
  vikriti: jsonb("vikriti").$type<Record<string, string>>(),
  sara: jsonb("sara").$type<Record<string, string>>(),
  samhanana: jsonb("samhanana").$type<Record<string, string>>(),
  pramana: jsonb("pramana").$type<Record<string, string>>(),
  satmya: jsonb("satmya").$type<Record<string, string>>(),
  sattva: jsonb("sattva").$type<Record<string, string>>(),
  aharaShakti: jsonb("ahara_shakti").$type<Record<string, string>>(),
  vyayamaShakti: jsonb("vyayama_shakti").$type<Record<string, string>>(),
  vaya: jsonb("vaya").$type<Record<string, string>>(),
  ahara: jsonb("ahara").$type<Record<string, unknown>>(),
  vihara: jsonb("vihara").$type<Record<string, unknown>>(),
  agni: jsonb("agni").$type<Record<string, unknown>>(),
  koshtha: jsonb("koshtha").$type<Record<string, unknown>>(),
  nidra: jsonb("nidra").$type<Record<string, unknown>>(),
  assessmentStatus: varchar("assessment_status", { length: 32 }).notNull().default("in_progress"),
  aiBrief: text("ai_brief"),
  practitionerVerified: boolean("practitioner_verified").notNull().default(false),
  practitionerId: varchar("practitioner_id", { length: 64 }),
  practitionerVerifiedAt: timestamp("practitioner_verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type InsertAyushAssessment = InferInsertModel<typeof ayushAssessmentsTable>;
export type AyushAssessment = InferSelectModel<typeof ayushAssessmentsTable>;

// ─── AYUSH Documents ─────────────────────────────────────────────────────

export const ayushDocumentsTable = pgTable("ayush_documents", {
  id: serial("id").primaryKey(),
  documentId: varchar("document_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  assessmentId: varchar("assessment_id", { length: 128 }),
  fileName: varchar("file_name", { length: 512 }).notNull(),
  fileType: varchar("file_type", { length: 128 }),
  documentType: varchar("document_type", { length: 64 }).notNull().default("other"),
  ocrText: text("ocr_text"),
  extractedData: jsonb("extracted_data").$type<Record<string, unknown>>().default({}),
  processingStatus: varchar("processing_status", { length: 32 }).notNull().default("processing"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export type InsertAyushDocument = InferInsertModel<typeof ayushDocumentsTable>;
export type AyushDocument = InferSelectModel<typeof ayushDocumentsTable>;

// ─── AYUSH Timeline ──────────────────────────────────────────────────────

export const ayushTimelineTable = pgTable("ayush_timeline", {
  id: serial("id").primaryKey(),
  entryId: varchar("entry_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  date: varchar("date", { length: 32 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  description: text("description"),
  documentId: varchar("document_id", { length: 128 }),
  assessmentId: varchar("assessment_id", { length: 128 }),
});

export type InsertAyushTimeline = InferInsertModel<typeof ayushTimelineTable>;
export type AyushTimeline = InferSelectModel<typeof ayushTimelineTable>;

// ─── Practitioner Reviews ────────────────────────────────────────────────

export const practitionerReviewsTable = pgTable("practitioner_reviews", {
  id: serial("id").primaryKey(),
  reviewId: varchar("review_id", { length: 128 }).notNull().unique(),
  patientId: varchar("patient_id", { length: 64 }).notNull(),
  assessmentId: varchar("assessment_id", { length: 128 }),
  practitionerId: varchar("practitioner_id", { length: 64 }).notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  originalValue: jsonb("original_value").$type<Record<string, unknown>>(),
  finalValue: jsonb("final_value").$type<Record<string, unknown>>(),
  reviewedAt: timestamp("reviewed_at").notNull().defaultNow(),
});

export type InsertPractitionerReview = InferInsertModel<typeof practitionerReviewsTable>;
export type PractitionerReview = InferSelectModel<typeof practitionerReviewsTable>;
