import mongoose, { Schema } from "mongoose";

// Flexible store for documents uploaded to an intake session
// (routes/documents.ts). Each upload becomes its own record so the list for a
// session can be rebuilt after a restart. strict: false keeps OCR output and
// nested extractedEntities intact; `id: false` lets our real `id` be indexed.
const UploadedDocumentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true, index: true },
  },
  { strict: false, id: false }
);

UploadedDocumentSchema.index({ sessionId: 1, uploadedAt: 1 });

const UploadedDocument = mongoose.model("UploadedDocument", UploadedDocumentSchema);
export default UploadedDocument;
