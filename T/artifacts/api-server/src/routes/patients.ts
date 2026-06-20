import { Router } from "express";
import { connectMongoDB, demoNotifications, demoSessions, hasMongoDB } from "../lib/mongodb";
import { Session } from "../models/session";
import { Notification } from "../models/notification";
import { logger } from "../lib/logger";

const router = Router();

router.get("/patients/:patientId/sessions", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json(demoSessions.filter((session) => session.patientId === req.params.patientId).slice(0, 50));
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo patient sessions");
      res.json(demoSessions.filter((session) => session.patientId === req.params.patientId).slice(0, 50));
      return;
    }
    const sessions = await Session.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(sessions);
  } catch (err) {
    logger.error({ err }, "Failed to fetch patient sessions");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/patients/:patientId/stats", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      const sessions = demoSessions.filter((session) => session.patientId === req.params.patientId);
      if (sessions.length === 0) {
        res.json({ totalSessions: 0, avgClarity: 0, avgTremor: 0, avgBreathlessness: 0, riskDistribution: {}, streak: 0 });
        return;
      }
      const totalSessions = sessions.length;
      const avgClarity = Math.round(sessions.reduce((sum, session) => sum + session.clarity, 0) / totalSessions);
      const avgTremor = Math.round(sessions.reduce((sum, session) => sum + session.tremor, 0) / totalSessions);
      const avgBreathlessness = Number((sessions.reduce((sum, session) => sum + session.breathlessness, 0) / totalSessions).toFixed(1));
      const riskDistribution = sessions.reduce((acc: Record<string, number>, session) => {
        acc[session.risk] = (acc[session.risk] || 0) + 1;
        return acc;
      }, {});
      res.json({ totalSessions, avgClarity, avgTremor, avgBreathlessness, riskDistribution, streak: Math.min(14, totalSessions) });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo patient stats");
      const sessions = demoSessions.filter((session) => session.patientId === req.params.patientId);
      if (sessions.length === 0) {
        res.json({ totalSessions: 0, avgClarity: 0, avgTremor: 0, avgBreathlessness: 0, riskDistribution: {}, streak: 0 });
        return;
      }
      const totalSessions = sessions.length;
      const avgClarity = Math.round(sessions.reduce((sum, session) => sum + session.clarity, 0) / totalSessions);
      const avgTremor = Math.round(sessions.reduce((sum, session) => sum + session.tremor, 0) / totalSessions);
      const avgBreathlessness = Number((sessions.reduce((sum, session) => sum + session.breathlessness, 0) / totalSessions).toFixed(1));
      const riskDistribution = sessions.reduce((acc: Record<string, number>, session) => {
        acc[session.risk] = (acc[session.risk] || 0) + 1;
        return acc;
      }, {});
      res.json({ totalSessions, avgClarity, avgTremor, avgBreathlessness, riskDistribution, streak: Math.min(14, totalSessions) });
      return;
    }
    const sessions = await Session.find({ patientId: req.params.patientId }).sort({ createdAt: 1 });

    if (sessions.length === 0) {
      res.json({ totalSessions: 0, avgClarity: 0, avgTremor: 0, avgBreathlessness: 0, riskDistribution: {}, streak: 0 });
      return;
    }

    const totalSessions = sessions.length;
    const avgClarity = Math.round(sessions.reduce((s, x) => s + x.clarity, 0) / totalSessions);
    const avgTremor = Math.round(sessions.reduce((s, x) => s + x.tremor, 0) / totalSessions);
    const avgBreathlessness = Number((sessions.reduce((s, x) => s + x.breathlessness, 0) / totalSessions).toFixed(1));

    const riskDistribution = sessions.reduce((acc: Record<string, number>, s) => {
      acc[s.risk] = (acc[s.risk] || 0) + 1;
      return acc;
    }, {});

    // Calculate streak (consecutive days with sessions)
    const sessionDates = [...new Set(sessions.map((s) => new Date(s.capturedAt).toDateString()))];
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (sessionDates.includes(d.toDateString())) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ totalSessions, avgClarity, avgTremor, avgBreathlessness, riskDistribution, streak });
  } catch (err) {
    logger.error({ err }, "Failed to fetch patient stats");
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/patients/:patientId/notifications", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json(demoNotifications.filter((notification) => notification.patientId === req.params.patientId).slice(0, 20));
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo patient notifications");
      res.json(demoNotifications.filter((notification) => notification.patientId === req.params.patientId).slice(0, 20));
      return;
    }
    const notes = await Notification.find({ patientId: req.params.patientId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notes);
  } catch (err) {
    logger.error({ err }, "Failed to fetch patient notifications");
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
