import { Router } from "express";
import { logger } from "../lib/logger";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const router = Router();

// ─── In-memory SOS alert store (fallback when PostgreSQL unavailable) ────────

interface SosAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  latitude: number | null;
  longitude: number | null;
  locationAccuracy: number | null;
  locationLabel: string | null;
  status: string;
  message: string | null;
  triggeredAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
}

const sosAlerts: Map<string, SosAlert> = new Map();

// SSE subscribers for real-time SOS alerts
const sseClients: Set<import("http").ServerResponse> = new Set();

function broadcastSosAlert(alert: SosAlert) {
  const data = JSON.stringify({ type: "sos_alert", alert });
  for (const client of sseClients) {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function hasPostgres(): Promise<boolean> {
  try {
    const mod = await import("@workspace/db");
    return Boolean(mod.db);
  } catch {
    return false;
  }
}

async function saveAlertToDb(alert: SosAlert): Promise<void> {
  try {
    const { db, sosAlertsTable } = await import("@workspace/db");
    await db.insert(sosAlertsTable).values({
      alertId: alert.alertId,
      patientId: alert.patientId,
      patientName: alert.patientName,
      latitude: alert.latitude,
      longitude: alert.longitude,
      locationAccuracy: alert.locationAccuracy,
      locationLabel: alert.locationLabel,
      status: alert.status,
      message: alert.message,
      triggeredAt: new Date(alert.triggeredAt),
    });
  } catch (err) {
    logger.error({ err }, "Failed to save SOS alert to PostgreSQL, using in-memory");
  }
}

async function getAlertsFromDb(): Promise<SosAlert[]> {
  try {
    const { db, sosAlertsTable } = await import("@workspace/db");
    const rows = await db
      .select()
      .from(sosAlertsTable)
      .orderBy(sosAlertsTable.triggeredAt);
    return rows.map((r) => ({
      alertId: r.alertId,
      patientId: r.patientId,
      patientName: r.patientName,
      latitude: r.latitude,
      longitude: r.longitude,
      locationAccuracy: r.locationAccuracy,
      locationLabel: r.locationLabel,
      status: r.status,
      message: r.message,
      triggeredAt: r.triggeredAt?.toISOString() || new Date().toISOString(),
      acknowledgedAt: r.acknowledgedAt?.toISOString() || null,
      acknowledgedBy: r.acknowledgedBy,
    }));
  } catch {
    return [];
  }
}

async function acknowledgeAlertInDb(alertId: string, by: string): Promise<void> {
  try {
    const { db, sosAlertsTable } = await import("@workspace/db");
    await db
      .update(sosAlertsTable)
      .set({
        status: "acknowledged",
        acknowledgedAt: new Date(),
        acknowledgedBy: by,
      })
      .where(eq(sosAlertsTable.alertId, alertId));
  } catch (err) {
    logger.error({ err }, "Failed to acknowledge SOS alert in PostgreSQL");
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/sos/trigger
 * Trigger an SOS emergency alert with the patient's geolocation
 */
router.post("/sos/trigger", async (req, res) => {
  try {
    const { patientId, patientName, latitude, longitude, accuracy, message } = req.body;

    if (!patientId || !patientName) {
      res.status(400).json({ error: "patientId and patientName are required" });
      return;
    }

    const alertId = `SOS-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    // Reverse-geocode label from coordinates
    let locationLabel: string | null = null;
    if (latitude != null && longitude != null) {
      locationLabel = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      // Try to get a readable address via reverse geocoding
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { headers: { "User-Agent": "MediKiosk-SOS/1.0" } },
        );
        if (geoRes.ok) {
          const geoData = (await geoRes.json()) as { display_name?: string };
          if (geoData.display_name) {
            locationLabel = geoData.display_name;
          }
        }
      } catch {
        // Geocoding is best-effort; fall back to coordinates
      }
    }

    const alert: SosAlert = {
      alertId,
      patientId,
      patientName,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      locationAccuracy: accuracy ?? null,
      locationLabel,
      status: "active",
      message: message || "Emergency SOS triggered by patient",
      triggeredAt: new Date().toISOString(),
      acknowledgedAt: null,
      acknowledgedBy: null,
    };

    // Persist
    sosAlerts.set(alertId, alert);
    await saveAlertToDb(alert);

    logger.warn({ alertId, patientId, latitude, longitude }, "🚨 SOS ALERT TRIGGERED");

    // Broadcast to all SSE clients in real-time
    broadcastSosAlert(alert);

    res.json({
      alertId,
      status: "active",
      message: "Emergency alert sent to hospital. Help is on the way.",
      location: { latitude, longitude, accuracy, label: locationLabel },
      triggeredAt: alert.triggeredAt,
    });
  } catch (err) {
    logger.error({ err }, "SOS alert trigger failed");
    res.status(500).json({ error: "Failed to trigger SOS alert" });
  }
});

/**
 * GET /api/sos/alerts
 * Get all SOS alerts (for hospital/clinician dashboard)
 */
router.get("/sos/alerts", async (_req, res) => {
  try {
    const pgAlerts = await getAlertsFromDb();
    const memAlerts = Array.from(sosAlerts.values());

    // Merge: prefer PostgreSQL if it has data, else use in-memory
    const alerts = pgAlerts.length > 0 ? pgAlerts : memAlerts;

    // Sort by most recent first
    alerts.sort(
      (a, b) =>
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
    );

    res.json(alerts);
  } catch (err) {
    logger.error({ err }, "Failed to fetch SOS alerts");
    // Fallback to in-memory
    const alerts = Array.from(sosAlerts.values()).sort(
      (a, b) =>
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
    );
    res.json(alerts);
  }
});

/**
 * GET /api/sos/alerts/active
 * Get only active (unacknowledged) SOS alerts
 */
router.get("/sos/alerts/active", async (_req, res) => {
  try {
    const all = Array.from(sosAlerts.values());
    const active = all.filter((a) => a.status === "active");
    active.sort(
      (a, b) =>
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime(),
    );
    res.json(active);
  } catch (err) {
    logger.error({ err }, "Failed to fetch active SOS alerts");
    res.status(500).json({ error: "Failed to fetch active alerts" });
  }
});

/**
 * POST /api/sos/alerts/:alertId/acknowledge
 * Acknowledge / dismiss an SOS alert
 */
router.post("/sos/alerts/:alertId/acknowledge", async (req, res) => {
  try {
    const { alertId } = req.params;
    const { acknowledgedBy } = req.body;

    const alert = sosAlerts.get(alertId);
    if (alert) {
      alert.status = "acknowledged";
      alert.acknowledgedAt = new Date().toISOString();
      alert.acknowledgedBy = acknowledgedBy || "Staff";
      sosAlerts.set(alertId, alert);
    }

    await acknowledgeAlertInDb(alertId, acknowledgedBy || "Staff");

    res.json({ alertId, status: "acknowledged" });
  } catch (err) {
    logger.error({ err }, "Failed to acknowledge SOS alert");
    res.status(500).json({ error: "Failed to acknowledge alert" });
  }
});

// ─── Real-time SSE Stream for SOS Alerts ───────────────────────────────────

/**
 * GET /api/sos/stream
 * Server-Sent Events stream for real-time SOS alert notifications
 */
router.get("/sos/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Send initial connection acknowledgment
  res.write(`data: ${JSON.stringify({ type: "connected", message: "SOS alert stream active" })}\n\n`);

  sseClients.add(res);
  logger.info({ clientCount: sseClients.size }, "SSE client connected for SOS alerts");

  req.on("close", () => {
    sseClients.delete(res);
    logger.info({ clientCount: sseClients.size }, "SSE client disconnected from SOS alerts");
  });
});

export default router;
