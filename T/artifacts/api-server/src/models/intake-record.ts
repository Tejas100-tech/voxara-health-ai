import mongoose, { Schema } from "mongoose";

// Flexible store for voice-intake sessions (routes/clinical-intake.ts).
// The session payload is dynamic (answers[], documents[], mode, track, …), so
// we keep the schema open (strict: false) and only index the fields we query.
// `id: false` disables Mongoose's default virtual `id` so our real `id` field
// (e.g. "INT-XXXX") can be declared and indexed.
const IntakeRecordSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, index: true },
  },
  { strict: false, id: false }
);

IntakeRecordSchema.index({ createdAt: -1 });

const IntakeRecord = mongoose.model("IntakeRecord", IntakeRecordSchema);
export default IntakeRecord;
