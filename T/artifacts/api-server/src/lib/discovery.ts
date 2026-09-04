import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { logger } from "./logger";

// ── Connected patients watching for new doctors ────────────────────────
interface DiscoveryClient {
  ws: WebSocket;
  id: string;
  city?: string;
  subscribedAt: number;
}

const clients = new Map<string, DiscoveryClient>();

let clientIdCounter = 0;

// ── Broadcast to all connected patients ────────────────────────────────
export function broadcastNewDoctor(doctor: Record<string, any>) {
  const payload = JSON.stringify({
    type: "doctor-added",
    doctor,
    timestamp: Date.now(),
  });

  let sent = 0;
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // If client is filtered by city, only send if doctor matches
      if (client.city && doctor.city && client.city.toLowerCase() !== doctor.city.toLowerCase()) {
        // Still send — client might want to see all cities
      }
      client.ws.send(payload);
      sent++;
    }
  });

  logger.info({ doctorId: doctor.doctorId, doctorName: doctor.name, sentTo: sent }, "Broadcast new doctor to patients");
}

export function broadcastDoctorStatus(doctorId: string, available: boolean) {
  const payload = JSON.stringify({
    type: "doctor-status-changed",
    doctorId,
    available,
    timestamp: Date.now(),
  });

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(payload);
    }
  });
}

// ── Attach to HTTP server ──────────────────────────────────────────────
export function attachDiscovery(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/discovery" });

  wss.on("connection", (ws: WebSocket) => {
    const clientId = `disc-${++clientIdCounter}`;
    const client: DiscoveryClient = {
      ws,
      id: clientId,
      subscribedAt: Date.now(),
    };
    clients.set(clientId, client);
    logger.info({ clientId, total: clients.size }, "Patient connected to discovery channel");

    // Acknowledge connection
    ws.send(JSON.stringify({
      type: "connected",
      clientId,
      message: "Connected to doctor discovery channel",
      timestamp: Date.now(),
    }));

    ws.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "subscribe") {
          client.city = msg.city;
          logger.debug({ clientId, city: msg.city }, "Discovery client updated city filter");
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on("close", () => {
      clients.delete(clientId);
      logger.info({ clientId, remaining: clients.size }, "Patient disconnected from discovery channel");
    });

    ws.on("error", (err) => {
      logger.error({ clientId, err }, "Discovery WebSocket error");
      clients.delete(clientId);
    });
  });

  logger.info("WebSocket discovery server attached at /ws/discovery");
}
