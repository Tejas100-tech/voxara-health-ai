import mongoose, { Schema } from "mongoose";

// Flexible store for generated clinical summaries (routes/clinical-summary.ts),
// keyed by the intake session id. Summary payloads vary a lot between
// allopathic / AYUSH modes and include nested documents, so strict: false.
const SummaryRecordSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    patientId: { type: String, index: true },
  },
  { strict: false }
);

SummaryRecordSchema.index({ generatedAt: -1 });

const SummaryRecord = mongoose.model("SummaryRecord", SummaryRecordSchema);
export default SummaryRecord;
