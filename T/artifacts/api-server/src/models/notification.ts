import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  sessionId: string;
  patientId: string;
  patientName: string;
  kind: "Critical" | "Watch" | "Insight";
  title: string;
  body: string;
  metric: string;
  value: number | string;
  threshold: number | string;
  acknowledged: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    sessionId: { type: String, required: true },
    patientId: { type: String, required: true, default: "PT-001" },
    patientName: { type: String, required: true, default: "Alex Carter" },
    kind: { type: String, enum: ["Critical", "Watch", "Insight"], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    metric: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    threshold: { type: Schema.Types.Mixed, required: true },
    acknowledged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
