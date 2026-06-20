import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  available: boolean;
  email?: string;
  phone?: string;
  bio?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    doctorId: { type: String, required: true, unique: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    available: { type: Boolean, default: true },
    email: { type: String },
    phone: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
