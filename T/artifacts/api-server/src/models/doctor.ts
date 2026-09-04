import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  available: boolean;
  email?: string;
  phone?: string;
  bio?: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  clinic: string;
  experience: number; // years
  consultationFee: number; // in INR
  consultationTypes: string[]; // ["in-person", "video", "chat"]
  rating: number; // 1-5
  totalPatients: number;
  languages: string[];
  availableSlots: string[]; // e.g. ["09:00-10:00", "14:00-15:00"]
  image?: string;
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
    city: { type: String, required: true, default: "Mumbai" },
    region: { type: String, required: true, default: "Maharashtra" },
    lat: { type: Number, default: 19.076 },
    lng: { type: Number, default: 72.8777 },
    clinic: { type: String, default: "" },
    experience: { type: Number, default: 5 },
    consultationFee: { type: Number, default: 500 },
    consultationTypes: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    totalPatients: { type: Number, default: 0 },
    languages: [{ type: String }],
    availableSlots: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
