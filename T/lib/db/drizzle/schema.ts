import { pgTable, unique, serial, varchar, jsonb, text, boolean, timestamp, integer, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const ayushAssessments = pgTable("ayush_assessments", {
	id: serial().primaryKey().notNull(),
	assessmentId: varchar("assessment_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	patientName: varchar("patient_name", { length: 256 }).notNull(),
	sessionId: varchar("session_id", { length: 128 }),
	chiefComplaint: varchar("chief_complaint", { length: 512 }),
	duration: varchar({ length: 128 }),
	previousAyushTreatment: varchar("previous_ayush_treatment", { length: 256 }),
	prakriti: jsonb(),
	vikriti: jsonb(),
	sara: jsonb(),
	samhanana: jsonb(),
	pramana: jsonb(),
	satmya: jsonb(),
	sattva: jsonb(),
	aharaShakti: jsonb("ahara_shakti"),
	vyayamaShakti: jsonb("vyayama_shakti"),
	vaya: jsonb(),
	ahara: jsonb(),
	vihara: jsonb(),
	agni: jsonb(),
	koshtha: jsonb(),
	nidra: jsonb(),
	assessmentStatus: varchar("assessment_status", { length: 32 }).default('in_progress').notNull(),
	aiBrief: text("ai_brief"),
	practitionerVerified: boolean("practitioner_verified").default(false).notNull(),
	practitionerId: varchar("practitioner_id", { length: 64 }),
	practitionerVerifiedAt: timestamp("practitioner_verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("ayush_assessments_assessment_id_unique").on(table.assessmentId),
]);

export const ayushChatSessions = pgTable("ayush_chat_sessions", {
	id: serial().primaryKey().notNull(),
	sessionId: varchar("session_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	patientName: varchar("patient_name", { length: 256 }).notNull(),
	language: varchar({ length: 16 }).default('en').notNull(),
	mode: varchar({ length: 32 }).default('pre_consultation').notNull(),
	messages: jsonb().default([]),
	extractedData: jsonb("extracted_data").default({}),
	assessmentProgress: integer("assessment_progress").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("ayush_chat_sessions_session_id_unique").on(table.sessionId),
]);

export const ayushDocuments = pgTable("ayush_documents", {
	id: serial().primaryKey().notNull(),
	documentId: varchar("document_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	assessmentId: varchar("assessment_id", { length: 128 }),
	fileName: varchar("file_name", { length: 512 }).notNull(),
	fileType: varchar("file_type", { length: 128 }),
	documentType: varchar("document_type", { length: 64 }).default('other').notNull(),
	ocrText: text("ocr_text"),
	extractedData: jsonb("extracted_data").default({}),
	processingStatus: varchar("processing_status", { length: 32 }).default('processing').notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("ayush_documents_document_id_unique").on(table.documentId),
]);

export const ayushTimeline = pgTable("ayush_timeline", {
	id: serial().primaryKey().notNull(),
	entryId: varchar("entry_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	date: varchar({ length: 32 }).notNull(),
	type: varchar({ length: 32 }).notNull(),
	category: varchar({ length: 64 }).notNull(),
	title: varchar({ length: 512 }).notNull(),
	description: text(),
	documentId: varchar("document_id", { length: 128 }),
	assessmentId: varchar("assessment_id", { length: 128 }),
}, (table) => [
	unique("ayush_timeline_entry_id_unique").on(table.entryId),
]);

export const clinicalHistories = pgTable("clinical_histories", {
	id: serial().primaryKey().notNull(),
	historyId: varchar("history_id", { length: 128 }).notNull(),
	sessionId: varchar("session_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	patientName: varchar("patient_name", { length: 256 }).notNull(),
	chiefComplaint: varchar("chief_complaint", { length: 256 }).notNull(),
	hpi: jsonb().default({}),
	pastMedicalHistory: jsonb("past_medical_history").default([]),
	pastSurgicalHistory: jsonb("past_surgical_history").default([]),
	drugHistory: jsonb("drug_history").default([]),
	allergyHistory: jsonb("allergy_history").default([]),
	familyHistory: jsonb("family_history").default([]),
	personalHistory: jsonb("personal_history").default({}),
	reviewOfSystems: jsonb("review_of_systems").default({}),
	priorInvestigations: jsonb("prior_investigations").default([]),
	aiSummary: text("ai_summary").default(').notNull(),
	redFlags: jsonb("red_flags").default([]),
	completenessScore: integer("completeness_score").default(0).notNull(),
	physicianReviewed: boolean("physician_reviewed").default(false).notNull(),
	physicianEdits: jsonb("physician_edits"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("clinical_histories_history_id_unique").on(table.historyId),
]);

export const intakeSessions = pgTable("intake_sessions", {
	id: serial().primaryKey().notNull(),
	sessionId: varchar("session_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	patientName: varchar("patient_name", { length: 256 }).notNull(),
	abhaId: varchar("abha_id", { length: 32 }),
	language: varchar({ length: 16 }).default('en').notNull(),
	mode: varchar({ length: 32 }).default('allopathic').notNull(),
	step: varchar({ length: 32 }).default('converse').notNull(),
	consentGranted: boolean("consent_granted").default(false).notNull(),
	chiefComplaint: varchar("chief_complaint", { length: 128 }),
	historyAnswers: jsonb("history_answers").default({}),
	redFlags: jsonb("red_flags").default([]),
	summaryGenerated: boolean("summary_generated").default(false).notNull(),
	summaryContent: text("summary_content"),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
}, (table) => [
	unique("intake_sessions_session_id_unique").on(table.sessionId),
]);

export const medicalDocuments = pgTable("medical_documents", {
	id: serial().primaryKey().notNull(),
	documentId: varchar("document_id", { length: 128 }).notNull(),
	sessionId: varchar("session_id", { length: 128 }).notNull(),
	fileName: varchar("file_name", { length: 512 }).notNull(),
	fileType: varchar("file_type", { length: 128 }),
	documentType: varchar("document_type", { length: 64 }).default('other').notNull(),
	ocrText: text("ocr_text"),
	extractedData: jsonb("extracted_data").default({}),
	processingStatus: varchar("processing_status", { length: 32 }).default('pending').notNull(),
	chronologicalOrder: integer("chronological_order").default(0).notNull(),
	uploadedAt: timestamp("uploaded_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("medical_documents_document_id_unique").on(table.documentId),
]);

export const practitionerReviews = pgTable("practitioner_reviews", {
	id: serial().primaryKey().notNull(),
	reviewId: varchar("review_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	assessmentId: varchar("assessment_id", { length: 128 }),
	practitionerId: varchar("practitioner_id", { length: 64 }).notNull(),
	action: varchar({ length: 32 }).notNull(),
	originalValue: jsonb("original_value"),
	finalValue: jsonb("final_value"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("practitioner_reviews_review_id_unique").on(table.reviewId),
]);

export const sosAlerts = pgTable("sos_alerts", {
	id: serial().primaryKey().notNull(),
	alertId: varchar("alert_id", { length: 128 }).notNull(),
	patientId: varchar("patient_id", { length: 64 }).notNull(),
	patientName: varchar("patient_name", { length: 256 }).notNull(),
	latitude: real(),
	longitude: real(),
	locationAccuracy: real("location_accuracy"),
	locationLabel: text("location_label"),
	status: varchar({ length: 32 }).default('active').notNull(),
	message: text(),
	triggeredAt: timestamp("triggered_at", { mode: 'string' }).defaultNow().notNull(),
	acknowledgedAt: timestamp("acknowledged_at", { mode: 'string' }),
	acknowledgedBy: varchar("acknowledged_by", { length: 256 }),
}, (table) => [
	unique("sos_alerts_alert_id_unique").on(table.alertId),
]);
