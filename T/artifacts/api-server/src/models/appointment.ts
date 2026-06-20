import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  urgency: "emergency" | "urgent" | "routine";
  status: "scheduled" | "active" | "completed" | "cancelled";
  scheduledAt: Date;
  duration: number;
  reason: string;
  notes?: string;
  riskScore?: number;
  biomarkerTrigger?: string;
  callRoomId: string;
  joinedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorSpecialty: { type: String, required: true },
  urgency: { type: String, enum: ["emergency", "urgent", "routine"], required: true },
  status: { type: String, enum: ["scheduled", "active", "completed", "cancelled"], default: "scheduled" },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 20 },
  reason: { type: String, required: true },
  notes: { type: String },
  riskScore: { type: Number },
  biomarkerTrigger: { type: String },
  callRoomId: { type: String, required: true },
  joinedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
