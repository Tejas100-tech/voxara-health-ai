import { Router } from "express";
import bcrypt from "bcryptjs";
import { connectMongoDB, demoUsers, hasMongoDB } from "../lib/mongodb";
import { User, seedUsers } from "../models/user";
import { Doctor } from "../models/doctor";
import { logger } from "../lib/logger";

const router = Router();

function demoLogin(email: string, password: string) {
  const user = demoUsers.find((u) => u.email === email.toLowerCase().trim() && u.password === password);
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (!hasMongoDB()) {
      const user = demoLogin(email, password);
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      res.json({ user, storage: "demo" });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, using demo auth fallback");
      const user = demoLogin(email, password);
      if (!user) {
        res.status(503).json({ error: "MongoDB authentication failed and this is not a demo account" });
        return;
      }
      res.json({ user, storage: "demo", warning: "MongoDB unavailable; using demo storage" });
      return;
    }

    await seedUsers();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    let doctorId: string | undefined;
    if (user.role === "clinician") {
      const doctorRecord = await Doctor.findOne({ email: user.email });
      doctorId = doctorRecord?.doctorId;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        patientId: user.patientId,
        conditions: user.conditions,
        age: user.age,
        dob: user.dob,
        phone: user.phone,
        clinicianName: user.clinicianName,
        doctorId,
      },
    });
  } catch (err) {
    logger.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, dob, phone, conditions, clinicianName, age, specialty } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "Name, email, password, and role are required" });
      return;
    }
    if (!["patient", "clinician"].includes(role)) {
      res.status(400).json({ error: "Role must be patient or clinician" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    if (!hasMongoDB()) {
      res.status(503).json({ error: "Registration requires a database connection. Please use a demo account." });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable during registration");
      res.status(503).json({ error: "Database unavailable. Please try again later." });
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const count = await User.countDocuments({ role });
    const prefix = role === "clinician" ? "CL" : "PT";
    const patientId = `${prefix}-${String(count + 100).padStart(3, "0")}`;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      patientId,
      conditions: Array.isArray(conditions) ? conditions : (conditions ? [conditions] : []),
      dob: dob || undefined,
      phone: phone || undefined,
      clinicianName: clinicianName || undefined,
      age: age ? Number(age) : undefined,
    });

    if (role === "clinician") {
      try {
        const doctorCount = await Doctor.countDocuments();
        const doctorId = `DR-${String(doctorCount + 1).padStart(3, "0")}`;
        await Doctor.create({
          doctorId,
          doctorName: name.trim(),
          doctorSpecialty: specialty || "General Practice",
          available: true,
          email: email.toLowerCase().trim(),
          phone: phone || undefined,
        });
      } catch (err) {
        logger.error({ err }, "Failed to auto-create Doctor record for clinician");
      }
    }

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        patientId: user.patientId,
        conditions: user.conditions,
        age: user.age,
        dob: user.dob,
        phone: user.phone,
        clinicianName: user.clinicianName,
      },
    });
  } catch (err) {
    logger.error({ err }, "Registration failed");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.get("/auth/users", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json(demoUsers.map(({ password: _password, ...user }) => user));
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo users");
      res.json(demoUsers.map(({ password: _password, ...user }) => user));
      return;
    }
    await seedUsers();
    const users = await User.find({}, { passwordHash: 0 });
    res.json(users);
  } catch (err) {
    logger.error({ err }, "Failed to fetch users");
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
