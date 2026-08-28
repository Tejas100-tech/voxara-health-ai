-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "ayush_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"session_id" varchar(128),
	"chief_complaint" varchar(512),
	"duration" varchar(128),
	"previous_ayush_treatment" varchar(256),
	"prakriti" jsonb,
	"vikriti" jsonb,
	"sara" jsonb,
	"samhanana" jsonb,
	"pramana" jsonb,
	"satmya" jsonb,
	"sattva" jsonb,
	"ahara_shakti" jsonb,
	"vyayama_shakti" jsonb,
	"vaya" jsonb,
	"ahara" jsonb,
	"vihara" jsonb,
	"agni" jsonb,
	"koshtha" jsonb,
	"nidra" jsonb,
	"assessment_status" varchar(32) DEFAULT 'in_progress' NOT NULL,
	"ai_brief" text,
	"practitioner_verified" boolean DEFAULT false NOT NULL,
	"practitioner_id" varchar(64),
	"practitioner_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ayush_assessments_assessment_id_unique" UNIQUE("assessment_id")
);
--> statement-breakpoint
CREATE TABLE "ayush_chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"language" varchar(16) DEFAULT 'en' NOT NULL,
	"mode" varchar(32) DEFAULT 'pre_consultation' NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"extracted_data" jsonb DEFAULT '{}'::jsonb,
	"assessment_progress" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ayush_chat_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "ayush_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"assessment_id" varchar(128),
	"file_name" varchar(512) NOT NULL,
	"file_type" varchar(128),
	"document_type" varchar(64) DEFAULT 'other' NOT NULL,
	"ocr_text" text,
	"extracted_data" jsonb DEFAULT '{}'::jsonb,
	"processing_status" varchar(32) DEFAULT 'processing' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ayush_documents_document_id_unique" UNIQUE("document_id")
);
--> statement-breakpoint
CREATE TABLE "ayush_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"entry_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"date" varchar(32) NOT NULL,
	"type" varchar(32) NOT NULL,
	"category" varchar(64) NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" text,
	"document_id" varchar(128),
	"assessment_id" varchar(128),
	CONSTRAINT "ayush_timeline_entry_id_unique" UNIQUE("entry_id")
);
--> statement-breakpoint
CREATE TABLE "clinical_histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"history_id" varchar(128) NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"chief_complaint" varchar(256) NOT NULL,
	"hpi" jsonb DEFAULT '{}'::jsonb,
	"past_medical_history" jsonb DEFAULT '[]'::jsonb,
	"past_surgical_history" jsonb DEFAULT '[]'::jsonb,
	"drug_history" jsonb DEFAULT '[]'::jsonb,
	"allergy_history" jsonb DEFAULT '[]'::jsonb,
	"family_history" jsonb DEFAULT '[]'::jsonb,
	"personal_history" jsonb DEFAULT '{}'::jsonb,
	"review_of_systems" jsonb DEFAULT '{}'::jsonb,
	"prior_investigations" jsonb DEFAULT '[]'::jsonb,
	"ai_summary" text DEFAULT '' NOT NULL,
	"red_flags" jsonb DEFAULT '[]'::jsonb,
	"completeness_score" integer DEFAULT 0 NOT NULL,
	"physician_reviewed" boolean DEFAULT false NOT NULL,
	"physician_edits" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clinical_histories_history_id_unique" UNIQUE("history_id")
);
--> statement-breakpoint
CREATE TABLE "intake_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"abha_id" varchar(32),
	"language" varchar(16) DEFAULT 'en' NOT NULL,
	"mode" varchar(32) DEFAULT 'allopathic' NOT NULL,
	"step" varchar(32) DEFAULT 'converse' NOT NULL,
	"consent_granted" boolean DEFAULT false NOT NULL,
	"chief_complaint" varchar(128),
	"history_answers" jsonb DEFAULT '{}'::jsonb,
	"red_flags" jsonb DEFAULT '[]'::jsonb,
	"summary_generated" boolean DEFAULT false NOT NULL,
	"summary_content" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "intake_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "medical_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" varchar(128) NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"file_name" varchar(512) NOT NULL,
	"file_type" varchar(128),
	"document_type" varchar(64) DEFAULT 'other' NOT NULL,
	"ocr_text" text,
	"extracted_data" jsonb DEFAULT '{}'::jsonb,
	"processing_status" varchar(32) DEFAULT 'pending' NOT NULL,
	"chronological_order" integer DEFAULT 0 NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "medical_documents_document_id_unique" UNIQUE("document_id")
);
--> statement-breakpoint
CREATE TABLE "practitioner_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"assessment_id" varchar(128),
	"practitioner_id" varchar(64) NOT NULL,
	"action" varchar(32) NOT NULL,
	"original_value" jsonb,
	"final_value" jsonb,
	"reviewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "practitioner_reviews_review_id_unique" UNIQUE("review_id")
);
--> statement-breakpoint
CREATE TABLE "sos_alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"alert_id" varchar(128) NOT NULL,
	"patient_id" varchar(64) NOT NULL,
	"patient_name" varchar(256) NOT NULL,
	"latitude" real,
	"longitude" real,
	"location_accuracy" real,
	"location_label" text,
	"status" varchar(32) DEFAULT 'active' NOT NULL,
	"message" text,
	"triggered_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"acknowledged_by" varchar(256),
	CONSTRAINT "sos_alerts_alert_id_unique" UNIQUE("alert_id")
);

*/