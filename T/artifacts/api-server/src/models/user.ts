import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "patient" | "clinician";
  patientId: string;
  avatar?: string;
  conditions: string[];
  age?: number;
  dob?: string;
  phone?: string;
  clinicianName?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["patient", "clinician"], required: true },
    patientId: { type: String, required: true },
    avatar: { type: String },
    conditions: [{ type: String }],
    age: { type: Number },
    dob: { type: String },
    phone: { type: String },
    clinicianName: { type: String },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model<IUser>("User", UserSchema);

export async function seedUsers() {
  const hash = (pw: string) => bcrypt.hash(pw, 10);

  const users = [
    {
      email: "alex@voxara.ai",
      passwordHash: await hash("patient123"),
      name: "Alex Carter",
      role: "patient",
      patientId: "PT-001",
      conditions: ["Asthma", "Mild Depression"],
      age: 34,
      dob: "1990-03-12",
      phone: "+1 (555) 291-4820",
      clinicianName: "Dr. Priya Mehta",
    },
    {
      email: "sofia@voxara.ai",
      passwordHash: await hash("patient123"),
      name: "Sofia Reyes",
      role: "patient",
      patientId: "PT-002",
      conditions: ["Parkinson's (Early Stage)"],
      age: 62,
      dob: "1962-07-28",
      phone: "+1 (555) 838-3710",
      clinicianName: "Dr. James Osei",
    },
    {
      email: "doctor@voxara.ai",
      passwordHash: await hash("doctor123"),
      name: "Dr. Priya Mehta",
      role: "clinician",
      patientId: "CL-001",
      conditions: [],
    },
    {
      email: "james@voxara.ai",
      passwordHash: await hash("doctor123"),
      name: "Dr. James Osei",
      role: "clinician",
      patientId: "CL-002",
      conditions: [],
    },
  ];

  for (const u of users) {
    await User.findOneAndUpdate(
      { email: u.email },
      { $setOnInsert: u },
      { upsert: true, new: true }
    );
  }
}
