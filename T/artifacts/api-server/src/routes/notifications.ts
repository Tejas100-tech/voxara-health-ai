import { Router } from "express";
import { connectMongoDB, demoNotifications, hasMongoDB } from "../lib/mongodb";
import { Notification } from "../models/notification";
import { logger } from "../lib/logger";

const router = Router();

router.get("/notifications", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json(demoNotifications.slice(0, 50));
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, returning demo notifications");
      res.json(demoNotifications.slice(0, 50));
      return;
    }
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    logger.error({ err }, "Failed to fetch notifications");
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.get("/notifications/unread-count", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      res.json({ count: demoNotifications.filter((notification) => !notification.acknowledged).length });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, counting demo notifications");
      res.json({ count: demoNotifications.filter((notification) => !notification.acknowledged).length });
      return;
    }
    const count = await Notification.countDocuments({ acknowledged: false });
    res.json({ count });
  } catch (err) {
    logger.error({ err }, "Failed to count notifications");
    res.status(500).json({ error: "Failed to count" });
  }
});

router.patch("/notifications/:id/acknowledge", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      const notification = demoNotifications.find((item) => item._id === req.params.id);
      if (!notification) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }
      notification.acknowledged = true;
      res.json({ success: true, notification });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, acknowledging demo notification");
      const notification = demoNotifications.find((item) => item._id === req.params.id);
      if (!notification) {
        res.status(404).json({ error: "Notification not found" });
        return;
      }
      notification.acknowledged = true;
      res.json({ success: true, notification });
      return;
    }
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { acknowledged: true },
      { new: true }
    );
    if (!notification) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    res.json({ success: true, notification });
  } catch (err) {
    logger.error({ err }, "Failed to acknowledge notification");
    res.status(500).json({ error: "Failed to acknowledge" });
  }
});

router.patch("/notifications/acknowledge-all", async (req, res) => {
  try {
    if (!hasMongoDB()) {
      demoNotifications.forEach((notification) => {
        notification.acknowledged = true;
      });
      res.json({ success: true });
      return;
    }

    try {
      await connectMongoDB();
    } catch (err) {
      logger.error({ err }, "MongoDB unavailable, acknowledging all demo notifications");
      demoNotifications.forEach((notification) => {
        notification.acknowledged = true;
      });
      res.json({ success: true });
      return;
    }
    await Notification.updateMany({ acknowledged: false }, { acknowledged: true });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to acknowledge all");
    res.status(500).json({ error: "Failed to acknowledge all" });
  }
});

export default router;
